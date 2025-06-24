import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// GET /api/keyword-occurrences - الحصول على تكرارات الكلمات مع فلترة متقدمة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // معاملات البحث والفلترة
    const keyword = searchParams.get('keyword')
    const type = searchParams.get('type') // HASHTAG, KEYWORD, MENTION
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')
    const trendingKeywordId = searchParams.get('trendingKeywordId')
    const sentiment = searchParams.get('sentiment')
    const language = searchParams.get('language')
    const category = searchParams.get('category')
    const authorRole = searchParams.get('authorRole')
    const authorVerified = searchParams.get('authorVerified')
    const recordedByAdminId = searchParams.get('recordedByAdminId') // فلتر الإداري المسجل
    const adminRole = searchParams.get('adminRole') // فلتر دور الإداري
    
    // معاملات التاريخ
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    
    // معاملات الترقيم
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    // ترتيب النتائج
    const sortBy = searchParams.get('sortBy') || 'occurredAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // بناء شروط البحث
    const where: any = {}
    
    if (keyword) {
      where.OR = [
        { keyword: { contains: keyword, mode: 'insensitive' } },
        { normalizedKeyword: { contains: keyword.toLowerCase(), mode: 'insensitive' } }
      ]
    }
    
    if (type) where.type = type
    if (postId) where.postId = postId
    if (userId) where.userId = userId
    if (trendingKeywordId) where.trendingKeywordId = trendingKeywordId
    if (sentiment) where.sentiment = sentiment
    if (language) where.language = language
    if (category) where.category = category
    if (authorRole) where.authorRole = authorRole
    if (authorVerified !== null) where.authorVerified = authorVerified === 'true'
    if (recordedByAdminId) where.recordedByAdminId = recordedByAdminId
    
    // فلترة حسب دور الإداري
    if (adminRole) {
      where.recordedByAdmin = {
        role: adminRole
      }
    }
    
    // فلترة بالتاريخ
    if (fromDate || toDate) {
      where.occurredAt = {}
      if (fromDate) where.occurredAt.gte = new Date(fromDate)
      if (toDate) where.occurredAt.lte = new Date(toDate)
    }
    
    // الحصول على التكرارات مع العلاقات
    const [occurrences, totalCount] = await Promise.all([
      prisma.keywordOccurrence.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          post: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              likesCount: true,
              commentsCount: true,
              sharesCount: true,
              viewsCount: true,
              visibility: true,
              status: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
              verified: true,
              followersCount: true
            }
          },
          trendingKeyword: {
            select: {
              id: true,
              keyword: true,
              category: true,
              trendScore: true,
              isCurrentlyTrending: true,
              trendRank: true
            }
          },
          recordedByAdmin: {
            select: {
              id: true,
              role: true,
              department: true,
              accessLevel: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  verified: true
                }
              }
            }
          }
        }
      }),
      prisma.keywordOccurrence.count({ where })
    ])
    
    // إحصائيات إضافية
    const stats = await prisma.keywordOccurrence.groupBy({
      by: ['type'],
      where,
      _count: {
        type: true
      }
    })
    
    // إحصائيات الكلمات الأكثر تكراراً
    const topKeywords = await prisma.keywordOccurrence.groupBy({
      by: ['normalizedKeyword', 'type'],
      where,
      _count: {
        normalizedKeyword: true
      },
      orderBy: {
        _count: {
          normalizedKeyword: 'desc'
        }
      },
      take: 10
    })
    
    // إحصائيات المستخدمين الأكثر نشاطاً
    const topUsers = await prisma.keywordOccurrence.groupBy({
      by: ['userId'],
      where,
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 5
    })
    
    // حساب معلومات الترقيم
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: occurrences,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },
      stats: {
        byType: stats.reduce((acc, stat) => {
          acc[stat.type] = stat._count.type
          return acc
        }, {} as Record<string, number>),
        topKeywords: topKeywords.map(tk => ({
          keyword: tk.normalizedKeyword,
          type: tk.type,
          count: tk._count.normalizedKeyword
        })),
        topUsers: topUsers.map(tu => ({
          userId: tu.userId,
          count: tu._count.userId
        }))
      },
      filters: {
        keyword,
        type,
        postId,
        userId,
        trendingKeywordId,
        sentiment,
        language,
        category,
        authorRole,
        authorVerified,
        recordedByAdminId,
        adminRole,
        fromDate,
        toDate,
        sortBy,
        sortOrder
      }
    })
    
  } catch (error) {
    console.error('خطأ في الحصول على تكرارات الكلمات:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'فشل في الحصول على تكرارات الكلمات',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

// POST /api/keyword-occurrences - إضافة تكرار كلمة جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      keyword,
      normalizedKeyword,
      type,
      position,
      context,
      postId,
      userId,
      trendingKeywordId,
      sentiment = 'NEUTRAL',
      language = 'AR',
      category,
      occurredAt,
      extractedBy = 'MANUAL',
      interactionData,
      recordedByAdminId // الإداري الذي قام بالتسجيل
    } = body
    
    // التحقق من الحقول المطلوبة
    if (!keyword || !normalizedKeyword || !type || !postId || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'البيانات المطلوبة ناقصة',
          required: ['keyword', 'normalizedKeyword', 'type', 'postId', 'userId']
        },
        { status: 400 }
      )
    }
    
    // التحقق من وجود المنشور والمستخدم
    const [post, user] = await Promise.all([
      prisma.post.findUnique({ 
        where: { id: postId },
        select: { 
          id: true, 
          status: true, 
          visibility: true, 
          authorId: true,
          createdAt: true,
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
          viewsCount: true
        }
      }),
      prisma.user.findUnique({ 
        where: { id: userId },
        select: { 
          id: true, 
          role: true, 
          verified: true, 
          followersCount: true 
        }
      })
    ])
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'المنشور غير موجود' },
        { status: 404 }
      )
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    // التحقق من صحة معرف الإداري إذا تم تمريره
    let adminData = null
    if (recordedByAdminId) {
      adminData = await prisma.admin.findUnique({
        where: { id: recordedByAdminId },
        select: { id: true, isActive: true, role: true }
      })
      
      if (!adminData || !adminData.isActive) {
        return NextResponse.json(
          { success: false, error: 'الإداري غير موجود أو غير نشط' },
          { status: 400 }
        )
      }
    }

    // إنشاء تكرار الكلمة
    const occurrence = await prisma.keywordOccurrence.create({
      data: {
        keyword,
        normalizedKeyword: normalizedKeyword.toLowerCase(),
        type,
        position,
        context,
        postId,
        userId,
        trendingKeywordId,
        sentiment,
        language,
        category,
        postStatus: post.status,
        postVisibility: post.visibility,
        authorRole: user.role,
        authorVerified: user.verified,
        authorFollowers: user.followersCount,
        extractedBy,
        recordedByAdminId, // إضافة معرف الإداري
        occurredAt: occurredAt ? new Date(occurredAt) : post.createdAt,
        isOriginalPost: true,
        interactionData: interactionData ? JSON.stringify(interactionData) : JSON.stringify({
          likes: post.likesCount,
          comments: post.commentsCount,
          shares: post.sharesCount,
          views: post.viewsCount
        })
      },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            createdAt: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        trendingKeyword: {
          select: {
            id: true,
            keyword: true,
            category: true,
            trendScore: true
          }
        },
        recordedByAdmin: {
          select: {
            id: true,
            role: true,
            department: true,
            user: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: occurrence,
      message: 'تم إضافة تكرار الكلمة بنجاح'
    })
    
  } catch (error) {
    console.error('خطأ في إضافة تكرار الكلمة:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'فشل في إضافة تكرار الكلمة',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
