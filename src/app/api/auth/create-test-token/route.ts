import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // البحث عن مستخدم اختباري موجود أو إنشاء واحد جديد
    let testUser = await prisma.user.findFirst({
      where: {
        username: {
          startsWith: 'test_user_'
        }
      }
    })

    if (!testUser) {
      // إنشاء مستخدم اختباري جديد
      const randomId = Math.random().toString(36).substring(7)
      testUser = await prisma.user.create({
        data: {
          username: `test_user_${randomId}`,
          email: `test_${randomId}@test.com`,
          phone: `+966500${randomId.substring(0, 6)}`,
          password: 'test123', // كلمة مرور بسيطة للاختبار
          firstName: 'مستخدم',
          secondName: 'اختباري',
          thirdName: 'تجريبي',
          lastName: 'نحكي',
          fullName: `مستخدم اختباري تجريبي نحكي`,
          birthDate: new Date('1990-01-01'),
          gender: 'male',
          role: 'USER',
          verified: false,
          followersCount: Math.floor(Math.random() * 100)
        }
      })
    }

    // إنشاء JWT token
    const token = jwt.sign(
      {
        userId: testUser.id,
        username: testUser.username,
        role: testUser.role
      },
      process.env.JWT_SECRET || 'fallback_secret_for_testing',
      {
        expiresIn: '1h'
      }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: testUser.id,
        username: testUser.username,
        fullName: testUser.fullName,
        role: testUser.role
      }
    })

  } catch (error) {
    console.error('خطأ في إنشاء token اختباري:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في إنشاء token الاختباري'
    }, { status: 500 })
  }
}
