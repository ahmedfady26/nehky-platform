import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// مشاركة منشور
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

    const { comment } = await request.json() // تعليق اختياري للمشاركة

    // التحقق من وجود المنشور
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        allowShares: true, 
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

    if (!post.allowShares) {
      return NextResponse.json({
        success: false,
        message: 'المشاركة معطلة لهذا المنشور'
      }, { status: 403 })
    }

    // التحقق من عدم المشاركة السابقة
    const existingShare = await prisma.share.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    })

    if (existingShare) {
      return NextResponse.json({
        success: false,
        message: 'تم مشاركة هذا المنشور مسبقاً'
      }, { status: 400 })
    }

    // إنشاء المشاركة
    await prisma.share.create({
      data: {
        userId: userId,
        postId: postId,
        comment: comment || null
      }
    })

    // تحديث عداد المشاركات
    await prisma.post.update({
      where: { id: postId },
      data: {
        sharesCount: {
          increment: 1
        }
      }
    })

    // جلب العدد المحدث
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        sharesCount: true,
        _count: {
          select: {
            shares: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        sharesCount: updatedPost?.sharesCount || 0
      },
      message: 'تم مشاركة المنشور بنجاح'
    })

  } catch (error) {
    console.error('Share post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// إلغاء مشاركة منشور
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

    // البحث عن المشاركة
    const existingShare = await prisma.share.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    })

    if (!existingShare) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على المشاركة'
      }, { status: 404 })
    }

    // حذف المشاركة
    await prisma.share.delete({
      where: { id: existingShare.id }
    })

    // تحديث عداد المشاركات
    await prisma.post.update({
      where: { id: postId },
      data: {
        sharesCount: {
          decrement: 1
        }
      }
    })

    // جلب العدد المحدث
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        sharesCount: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        sharesCount: updatedPost?.sharesCount || 0
      },
      message: 'تم إلغاء مشاركة المنشور'
    })

  } catch (error) {
    console.error('Unshare post error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
