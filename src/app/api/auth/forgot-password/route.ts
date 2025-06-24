import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tempOTPs } from '@/lib/temp-storage'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json()

    // التحقق من وجود المدخل
    if (!identifier) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone: identifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // إنشاء OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // حفظ OTP مؤقتاً
    tempOTPs[identifier] = {
      otp,
      userId: user.id,
      expires: Date.now() + 10 * 60 * 1000 // 10 دقائق
    }

    // هنا يمكن إرسال OTP عبر SMS أو Email حسب نوع المدخل
    console.log(`OTP لاستعادة كلمة المرور للمستخدم ${identifier}: ${otp}`)

    return NextResponse.json({
      message: 'تم إرسال رمز التحقق بنجاح',
      identifier: identifier
    })

  } catch (error) {
    console.error('خطأ في إرسال OTP لاستعادة كلمة المرور:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
