import { NextRequest, NextResponse } from 'next/server'
import { resetTokens } from '@/lib/temp-storage'
import { prisma } from '@/lib/prisma'

// إجبار التشغيل الديناميكي لهذا الـ route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'رمز الاسترداد مطلوب'
      }, { status: 400 })
    }

    // التحقق من وجود الرمز
    const tokenData = resetTokens[token]
    if (!tokenData) {
      return NextResponse.json({
        success: false,
        message: 'رمز الاسترداد غير صحيح أو منتهي الصلاحية'
      }, { status: 400 })
    }

    // التحقق من انتهاء صلاحية الرمز
    if (Date.now() > tokenData.expires) {
      delete resetTokens[token]
      return NextResponse.json({
        success: false,
        message: 'رمز الاسترداد منتهي الصلاحية'
      }, { status: 400 })
    }

    // التحقق من أن الرمز لم يُستخدم من قبل
    if (tokenData.used) {
      return NextResponse.json({
        success: false,
        message: 'رمز الاسترداد تم استخدامه من قبل'
      }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      select: { id: true, username: true, fullName: true }
    })

    if (!user) {
      delete resetTokens[token]
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'رمز الاسترداد صحيح',
      user: {
        username: user.username,
        fullName: user.fullName
      }
    })

  } catch (error) {
    console.error('خطأ في التحقق من رمز الاسترداد:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
