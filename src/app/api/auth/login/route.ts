import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password, rememberMe } = body

    // التحقق من وجود المدخلات المطلوبة
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم/البريد الإلكتروني/رقم الهاتف وكلمة المرور' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم بـ username أو email أو phone أو البريد الداخلي
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone: identifier },
          { internalEmail: identifier } // دعم البريد الداخلي
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // إنشاء JWT token مع مدة انتهاء صلاحية حسب rememberMe
    const expiresIn = rememberMe ? '365d' : '7d' // 365 يوماً (سنة كاملة) إذا اختار "تذكرني"، وإلا 7 أيام
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'nehky-secret-key',
      { expiresIn }
    )

    // إرجاع بيانات المستخدم مع التوكن
    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        verified: user.verified,
        followersCount: user.followersCount,
        followingCount: user.followingCount
      },
      token
    })

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
