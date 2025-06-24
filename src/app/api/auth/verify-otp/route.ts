import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { tempOTPs } from '@/lib/temp-storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, otp } = body

    if (!identifier || !otp) {
      return NextResponse.json({
        success: false,
        message: 'يرجى إدخال رمز التحقق'
      }, { status: 400 })
    }

    // التحقق من OTP
    const otpData = tempOTPs[identifier]

    if (!otpData) {
      return NextResponse.json({
        success: false,
        message: 'رمز التحقق غير صالح'
      }, { status: 400 })
    }

    if (Date.now() > otpData.expires) {
      delete tempOTPs[identifier]
      return NextResponse.json({
        success: false,
        message: 'انتهت صلاحية رمز التحقق'
      }, { status: 400 })
    }

    if (otpData.otp !== otp) {
      return NextResponse.json({
        success: false,
        message: 'رمز التحقق غير صحيح'
      }, { status: 400 })
    }

    // الحصول على بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: otpData.userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
        verified: true
      }
    })

    // إنشاء JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // حذف OTP
    delete tempOTPs[identifier]

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
