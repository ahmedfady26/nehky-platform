import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, isLike } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!postId || !userId || typeof isLike !== 'boolean') {
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

    if (isLike) {
      // إضافة إعجاب
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })

      if (existingLike) {
        return NextResponse.json({
          success: false,
          message: 'تم الإعجاب بالمنشور مسبقاً'
        }, { status: 400 })
      }

      const like = await prisma.like.create({
        data: {
          userId,
          postId
        }
      })

      // تحديث عدد الإعجابات
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'تم الإعجاب بالمنشور',
        data: {
          likeId: like.id
        }
      })

    } else {
      // إزالة إعجاب
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })

      if (!existingLike) {
        return NextResponse.json({
          success: false,
          message: 'لم يتم الإعجاب بالمنشور مسبقاً'
        }, { status: 400 })
      }

      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })

      // تحديث عدد الإعجابات
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'تم إلغاء الإعجاب'
      })
    }

  } catch (error) {
    console.error('خطأ في معالجة الإعجاب:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
