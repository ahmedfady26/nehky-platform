import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetTokens } from '@/lib/temp-storage'
import { sendPasswordResetLink } from '@/lib/email-service'
import crypto from 'crypto'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// حماية من المحاولات المتكررة (rate limiting)
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 3
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 دقيقة

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }
  
  // إعادة تعيين إذا انتهت فترة المنع
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }
  
  // التحقق من عدد المحاولات
  if (record.attempts >= MAX_ATTEMPTS) {
    return false
  }
  
  record.attempts++
  record.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { method, identifier } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!method || !identifier) {
      return NextResponse.json({
        success: false,
        message: 'البيانات المطلوبة ناقصة'
      }, { status: 400 })
    }

    // التحقق من صحة طريقة الاسترداد
    if (!['email', 'phone'].includes(method)) {
      return NextResponse.json({
        success: false,
        message: 'طريقة الاسترداد غير صحيحة'
      }, { status: 400 })
    }

    // فحص الحماية من التكرار
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `${clientIp}-${identifier}`
    
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json({
        success: false,
        message: 'تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة لاحقاً'
      }, { status: 429 })
    }

    let user = null

    if (method === 'email') {
      // البحث بالإيميل الخارجي أو الداخلي أو إيميل الاسترداد
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { internalEmail: identifier },
            { recoveryEmail: identifier }
          ]
        }
      })
    } else if (method === 'phone') {
      // البحث برقم الهاتف
      user = await prisma.user.findFirst({
        where: { phone: identifier }
      })
    }

    // عدم إظهار معلومات حساسة - دائماً نرجع رسالة نجاح
    const successMessage = method === 'email' 
      ? 'إذا كان هذا الإيميل مسجلاً لدينا، ستتلقى رابطاً لاستعادة الحساب'
      : 'إذا كان هذا الرقم مسجلاً لدينا، ستتلقى رابطاً لاستعادة الحساب'

    // إنشاء رمز استعادة فريد إذا كان المستخدم موجود
    if (user) {
      // توليد رمز استعادة آمن
      const resetToken = crypto.randomBytes(32).toString('hex')
      
      // حفظ رمز الاسترداد مؤقتاً (15 دقيقة)
      resetTokens[resetToken] = {
        userId: user.id,
        expires: Date.now() + 15 * 60 * 1000, // 15 دقيقة
        used: false
      }

      if (method === 'email') {
        // تحديد الإيميل المناسب للإرسال
        let targetEmail = ''
        
        if (user.recoveryEmail) {
          // إرسال لإيميل الاسترداد إذا كان موجود
          targetEmail = user.recoveryEmail
        } else if (user.internalEmail) {
          // إرسال للإيميل الداخلي إذا لم يكن هناك إيميل استرداد
          targetEmail = user.internalEmail
        } else if (user.email) {
          // إرسال للإيميل الخارجي كخيار أخير
          targetEmail = user.email
        }

        if (targetEmail) {
          // إرسال رابط الاسترداد
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          await sendPasswordResetLink(targetEmail, user.username, resetToken, baseUrl)
        }
      } else if (method === 'phone') {
        // هنا يمكن إضافة خدمة إرسال SMS مع الرابط
        console.log(`SMS Reset Link for ${user.phone}: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: successMessage
    })

  } catch (error) {
    console.error('خطأ في استعادة الحساب:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
