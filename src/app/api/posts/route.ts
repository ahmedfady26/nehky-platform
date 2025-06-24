import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { extractAndUpdateKeywords } from '@/lib/trending-keywords'
import { extractKeywordsFromText, saveKeywordOccurrencesToDb } from '@/lib/keyword-extraction'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status') || 'PUBLISHED'
    const hashtag = searchParams.get('hashtag')
    const authorId = searchParams.get('authorId')
    const search = searchParams.get('search') // البحث في المحتوى
    const visibility = searchParams.get('visibility') || 'PUBLIC'
    const sortBy = searchParams.get('sortBy') || 'createdAt' // createdAt, likesCount, commentsCount
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // بناء شروط البحث
    const where: any = {
      status: status,
      visibility: visibility
    }

    // تصفية حسب الهاشتاج
    if (hashtag) {
      where.hashtags = {
        contains: hashtag
      }
    }

    // تصفية حسب المؤلف
    if (authorId) {
      where.authorId = authorId
    }

    // البحث في المحتوى
    if (search) {
      where.content = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // ترتيب النتائج
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // جلب المنشورات مع معلومات المؤلف والإحصائيات المحدثة
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            verified: true,
            role: true
          }
        },
        publishedFor: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            verified: true
          }
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true
              }
            }
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
            views: true
          }
        }
      }
    })

    // حساب العدد الإجمالي مع نفس الشروط
    const total = await prisma.post.count({ where })

    // معالجة البيانات لتحويل JSON strings إلى arrays
    const processedPosts = posts.map(post => ({
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
      videos: post.videos ? JSON.parse(post.videos) : [],
      attachments: post.attachments ? JSON.parse(post.attachments) : [],
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : [],
      hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
      keywords: post.keywords ? JSON.parse(post.keywords) : [],
      tags: post.tags ? JSON.parse(post.tags) : []
    }))

    return NextResponse.json({
      success: true,
      data: processedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح بالوصول'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    const { 
      content, 
      images, 
      videos, 
      attachments,
      mediaUrls,
      hashtags, 
      keywords,
      tags,
      publishedForId,
      visibility = 'PUBLIC',
      allowComments = true,
      allowLikes = true,
      allowShares = true,
      location
    } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'محتوى المنشور مطلوب'
      }, { status: 400 })
    }

    // معالجة الهاشتاج من المحتوى
    const hashtagRegex = /#[\u0600-\u06FFa-zA-Z0-9_]+/g
    const extractedHashtags = content.match(hashtagRegex) || []
    const combinedHashtags = (hashtags || []).concat(extractedHashtags)
    const allHashtags = Array.from(new Set(combinedHashtags))

    // معالجة الوسائط
    const processedImages = images && images.length > 0 ? JSON.stringify(images) : null
    const processedVideos = videos && videos.length > 0 ? JSON.stringify(videos) : null
    const processedAttachments = attachments && attachments.length > 0 ? JSON.stringify(attachments) : null
    const processedMediaUrls = mediaUrls && mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : null

    // إنشاء المنشور
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        images: processedImages,
        videos: processedVideos,
        attachments: processedAttachments,
        mediaUrls: processedMediaUrls,
        hashtags: allHashtags.length > 0 ? JSON.stringify(allHashtags) : null,
        keywords: keywords ? JSON.stringify(keywords) : null,
        tags: tags ? JSON.stringify(tags) : null,
        authorId: userId,
        publishedForId: publishedForId || null,
        status: 'PUBLISHED',
        visibility: visibility,
        allowComments: allowComments,
        allowLikes: allowLikes,
        allowShares: allowShares,
        location: location || null,
        publishedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        userAgent: request.headers.get('user-agent') || ''
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            verified: true,
            role: true
          }
        },
        publishedFor: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            verified: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
            views: true
          }
        }
      }
    })

    // استخراج وتحديث الكلمات الشائعة تلقائياً
    try {
      await extractAndUpdateKeywords(content, post.id, userId)
      
      // استخراج وحفظ تكرارات الكلمات
      const extractedKeywords = extractKeywordsFromText(content)
      if (extractedKeywords.length > 0) {
        await saveKeywordOccurrencesToDb(extractedKeywords, post.id, userId, 'AUTO_POST_CREATION')
      }
    } catch (error) {
      console.error('Error extracting keywords:', error)
      // لا نوقف العملية إذا فشل استخراج الكلمات
    }

    // إضافة نقاط إذا كان منشور باسم مؤثر
    if (publishedForId) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14) // 14 يوم من الآن

      await prisma.point.create({
        data: {
          points: 20,
          type: 'POST',
          userId: userId,
          influencerId: publishedForId,
          postId: post.id,
          expiresAt: expiresAt,
          isValid: true
        }
      })
    }

    // استخراج وتحديث الكلمات الشائعة تلقائياً
    try {
      await extractAndUpdateKeywords(content, post.id, userId)
      
      // استخراج وحفظ تكرارات الكلمات
      const extractedKeywords = extractKeywordsFromText(content)
      if (extractedKeywords.length > 0) {
        await saveKeywordOccurrencesToDb(extractedKeywords, post.id, userId, 'AUTO_POST_CREATION')
      }
    } catch (error) {
      console.error('Error extracting keywords:', error)
      // لا نوقف العملية إذا فشل استخراج الكلمات
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: 'تم إنشاء المنشور بنجاح'
    })

  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
