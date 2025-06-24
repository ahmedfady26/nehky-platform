import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tempOTPs } from '@/lib/temp-storage'
import bcrypt from 'bcryptjs'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp, newPassword } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من طول كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // التحقق من أن كلمة المرور تحتوي على أحرف إنجليزية فقط
    const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]*$/
    if (!englishOnlyRegex.test(newPassword)) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون باللغة الإنجليزية فقط (أحرف، أرقام، ورموز إنجليزية)' },
        { status: 400 }
      )
    }

    // التحقق من OTP
    const storedOTP = tempOTPs[identifier]
    if (!storedOTP) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // التحقق من انتهاء صلاحية OTP
    if (Date.now() > storedOTP.expires) {
      delete tempOTPs[identifier]
      return NextResponse.json(
        { error: 'رمز التحقق منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // التحقق من صحة OTP
    if (storedOTP.otp !== otp) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // تحديث كلمة المرور في قاعدة البيانات
    await prisma.user.update({
      where: { id: storedOTP.userId },
      data: { password: hashedPassword }
    })

    // حذف OTP من التخزين المؤقت
    delete tempOTPs[identifier]

    return NextResponse.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('خطأ في إعادة تعيين كلمة المرور:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
