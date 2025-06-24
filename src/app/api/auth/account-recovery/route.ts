import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tempOTPs } from '@/lib/temp-storage';
import { sendAccountRecoveryEmail, sendOTPViaSMS } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!phone) {
      return NextResponse.json({
        success: false,
        message: 'رقم الهاتف مطلوب'
      }, { status: 400 })
    }

    // البحث عن المستخدم برقم الهاتف
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        username: true,
        phone: true,
        recoveryEmail: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'لا يوجد حساب مرتبط بهذا الرقم'
      }, { status: 404 })
    }

    // إنشاء OTP للتحقق من الهوية
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const otp = randomNum.toString()
    
    // حفظ OTP مؤقتاً
    tempOTPs[phone] = {
      otp,
      userId: user.id,
      expires: Date.now() + 10 * 60 * 1000, // 10 دقائق
      action: 'account_recovery' // نوع العملية
    }

    // إرسال OTP عبر SMS
    const otpSent = await sendOTPViaSMS(phone, otp)
    if (!otpSent) {
      return NextResponse.json({
        success: false,
        message: 'فشل في إرسال رمز التحقق'
      }, { status: 500 })
    }

    // معالجة إيميل الاسترداد بعناية
    let recoveryEmailSent = false
    let recoveryEmailError = null
    
    if (user.recoveryEmail && user.recoveryEmail.trim()) {
      try {
        recoveryEmailSent = await sendAccountRecoveryEmail(
          user.recoveryEmail,
          user.username,
          phone
        )
        if (!recoveryEmailSent) {
          recoveryEmailError = 'فشل في إرسال إيميل الاسترداد'
        }
      } catch (error) {
        console.error('خطأ في إرسال إيميل الاسترداد:', error)
        recoveryEmailError = 'حدث خطأ في إرسال إيميل الاسترداد'
        recoveryEmailSent = false
      }
    }

    // تحضير الرسالة النهائية
    let finalMessage = 'تم إرسال رمز التحقق إلى رقم هاتفك'
    
    if (user.recoveryEmail && user.recoveryEmail.trim()) {
      if (recoveryEmailSent) {
        finalMessage += '. كما تم إرسال معلومات الحساب إلى إيميل الاسترداد المسجل'
      } else {
        finalMessage += '. تعذر إرسال إيميل الاسترداد، لكن يمكنك المتابعة باستخدام رمز التحقق'
      }
    } else {
      finalMessage += '. لا يوجد إيميل استرداد مسجل لهذا الحساب'
    }

    return NextResponse.json({
      success: true,
      message: finalMessage,
      data: {
        otpSent: true,
        hasRecoveryEmail: !!(user.recoveryEmail && user.recoveryEmail.trim()),
        recoveryEmailSent,
        recoveryEmailError,
        maskedRecoveryEmail: (user.recoveryEmail && user.recoveryEmail.trim()) ? 
          user.recoveryEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
        // معلومات إضافية للمطور (يمكن إزالتها في الإنتاج)
        debug: {
          userId: user.id,
          username: user.username,
          hasRecoveryEmail: !!(user.recoveryEmail && user.recoveryEmail.trim()),
          recoveryEmailLength: user.recoveryEmail ? user.recoveryEmail.length : 0
        }
      }
    })

  } catch (error) {
    console.error('خطأ في استعادة الحساب:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
