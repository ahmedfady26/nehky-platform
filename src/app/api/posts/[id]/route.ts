import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// جلب منشور واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    // إنشاء مشاهدة للمنشور
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        const userId = decoded.userId

        // إضافة مشاهدة إذا لم تكن موجودة
        const existingView = await prisma.postView.findFirst({
          where: {
            userId: userId,
            postId: postId
          }
        })

        if (!existingView) {
          await prisma.postView.create({
            data: {
              userId: userId,
              postId: postId,
              viewType: 'VIEW',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
              userAgent: request.headers.get('user-agent') || '',
              referer: request.headers.get('referer') || ''
            }
          })
        }
      } catch (error) {
        // تجاهل أخطاء التوكن لعدم تعطيل جلب المنشور
      }
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
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
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true
              }
            },
            _count: {
              select: {
                points: true
              }
            }
          }
        },
        likes: {
          select: {
            userId: true,
            user: {
              select: {
                username: true,
                fullName: true
              }
            }
          }
        },
        shares: {
          select: {
            userId: true,
            user: {
              select: {
                username: true,
                fullName: true
              }
            }
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

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    // تحويل البيانات المحفوظة كـ JSON
    const processedPost = {
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
      videos: post.videos ? JSON.parse(post.videos) : [],
      attachments: post.attachments ? JSON.parse(post.attachments) : [],
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : [],
      hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
      keywords: post.keywords ? JSON.parse(post.keywords) : [],
      tags: post.tags ? JSON.parse(post.tags) : []
    }

    return NextResponse.json({
      success: true,
      data: processedPost
    })

  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// تحديث منشور
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const postId = params.id

    // التحقق من وجود المنشور وصلاحية التعديل
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        publishedFor: true
      }
    })

    if (!existingPost) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    // التحقق من الصلاحية (المؤلف أو كبير المتابعين)
    const canEdit = existingPost.authorId === userId || 
                   (existingPost.publishedForId && existingPost.authorId === userId)

    if (!canEdit) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا المنشور'
      }, { status: 403 })
    }

    const { 
      content, 
      images, 
      videos, 
      attachments,
      mediaUrls,
      hashtags, 
      keywords,
      tags,
      visibility,
      allowComments,
      allowLikes,
      allowShares,
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

    // تحديث المنشور
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content: content.trim(),
        images: processedImages,
        videos: processedVideos,
        attachments: processedAttachments,
        mediaUrls: processedMediaUrls,
        hashtags: allHashtags.length > 0 ? JSON.stringify(allHashtags) : null,
        keywords: keywords ? JSON.stringify(keywords) : null,
        tags: tags ? JSON.stringify(tags) : null,
        visibility: visibility || existingPost.visibility,
        allowComments: allowComments !== undefined ? allowComments : existingPost.allowComments,
        allowLikes: allowLikes !== undefined ? allowLikes : existingPost.allowLikes,
        allowShares: allowShares !== undefined ? allowShares : existingPost.allowShares,
        location: location !== undefined ? location : existingPost.location,
        updatedAt: new Date()
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

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'تم تحديث المنشور بنجاح'
    })

  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// حذف منشور
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const postId = params.id

    // التحقق من وجود المنشور وصلاحية الحذف
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true
      }
    })

    if (!existingPost) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    // التحقق من الصلاحية (المؤلف فقط)
    if (existingPost.authorId !== userId) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح لك بحذف هذا المنشور'
      }, { status: 403 })
    }

    // حذف المنشور (سيحذف تلقائياً الإعجابات والتعليقات والمشاهدات بسبب onDelete: Cascade)
    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنشور بنجاح'
    })

  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
