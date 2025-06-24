import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// جلب تعليقات منشور
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const postId = params.id

    // التحقق من وجود المنشور
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, allowComments: true }
    })

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    // جلب التعليقات
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
        _count: {
          select: {
            points: true
          }
        }
      }
    })

    // حساب العدد الإجمالي
    const total = await prisma.comment.count({
      where: { postId: postId }
    })

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// إضافة تعليق
export async function POST(
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

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'محتوى التعليق مطلوب'
      }, { status: 400 })
    }

    // التحقق من وجود المنشور وإعدادات التعليقات
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        allowComments: true, 
        authorId: true,
        publishedForId: true 
      }
    })

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    if (!post.allowComments) {
      return NextResponse.json({
        success: false,
        message: 'التعليقات معطلة لهذا المنشور'
      }, { status: 403 })
    }

    // إنشاء التعليق
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        authorId: userId
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
        }
      }
    })

    // إضافة النقاط إذا كان المنشور لمؤثر
    if (post.publishedForId) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14) // 14 يوم من الآن

      await prisma.point.create({
        data: {
          points: 10,
          type: 'COMMENT',
          userId: userId,
          influencerId: post.publishedForId,
          postId: postId,
          commentId: comment.id,
          expiresAt: expiresAt,
          isValid: true
        }
      })
    }

    // تحديث عداد التعليقات
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: comment,
      message: 'تم إضافة التعليق بنجاح'
    })

  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
