import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// إدارة الإعجاب (إضافة/إزالة)
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

    // التحقق من وجود المنشور
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        allowLikes: true, 
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

    if (!post.allowLikes) {
      return NextResponse.json({
        success: false,
        message: 'الإعجابات معطلة لهذا المنشور'
      }, { status: 403 })
    }

    // التحقق من وجود إعجاب سابق
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    })

    let message = ''
    let liked = false

    if (existingLike) {
      // إزالة الإعجاب
      await prisma.like.delete({
        where: { id: existingLike.id }
      })

      // تحديث العداد
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      })

      message = 'تم إلغاء الإعجاب'
      liked = false
    } else {
      // إضافة إعجاب جديد
      const newLike = await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      })

      // إضافة النقاط إذا كان المنشور لمؤثر
      if (post.publishedForId) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 14) // 14 يوم من الآن

        await prisma.point.create({
          data: {
            points: 5,
            type: 'LIKE',
            userId: userId,
            influencerId: post.publishedForId,
            postId: postId,
            likeId: newLike.id,
            expiresAt: expiresAt,
            isValid: true
          }
        })
      }

      // تحديث العداد
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      })

      message = 'تم الإعجاب بالمنشور'
      liked = true
    }

    // جلب العدد المحدث
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likesCount: true,
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        liked: liked,
        likesCount: updatedPost?.likesCount || 0
      },
      message: message
    })

  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
