import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, content } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!postId || !userId || !content?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'البيانات المطلوبة ناقصة'
      }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // التحقق من وجود المنشور
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'المنشور غير موجود'
      }, { status: 404 })
    }

    // إنشاء التعليق
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: userId
      },
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
    })

    // تحديث عدد التعليقات
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
      message: 'تم إضافة التعليق',
      data: {
        commentId: comment.id,
        comment: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          author: comment.author
        }
      }
    })

  } catch (error) {
    console.error('خطأ في إضافة التعليق:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
