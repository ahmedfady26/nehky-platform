import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tempOTPs } from '@/lib/temp-storage'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json() // البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم

    if (!identifier) {
      return NextResponse.json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم'
      }, { status: 400 })
    }

    // البحث عن المستخدم
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { username: identifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // إنشاء OTP
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const otp = randomNum.toString()

    // حفظ OTP مؤقتاً
    tempOTPs[identifier] = {
      otp,
      userId: user.id,
      expires: Date.now() + 5 * 60 * 1000 // 5 دقائق
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رمز التحقق'
    })

  } catch (error) {
    console.error('خطأ في إرسال OTP:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
