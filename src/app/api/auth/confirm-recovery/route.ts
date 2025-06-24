import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetTokens } from '@/lib/temp-storage'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!token || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'البيانات المطلوبة ناقصة'
      }, { status: 400 })
    }

    // التحقق من طول كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      }, { status: 400 })
    }

    // التحقق من أن كلمة المرور تحتوي على أحرف إنجليزية فقط
    const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]*$/
    if (!englishOnlyRegex.test(newPassword)) {
      return NextResponse.json({
        success: false,
        message: 'كلمة المرور يجب أن تكون باللغة الإنجليزية فقط (أحرف، أرقام، ورموز إنجليزية)'
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

    // العثور على المستخدم
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId }
    })

    if (!user) {
      delete resetTokens[token]
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // تحديث كلمة المرور
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    // تعيين الرمز كمستخدم لمنع إعادة الاستخدام
    resetTokens[token].used = true

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('خطأ في تأكيد استعادة الحساب:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
