import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // اختبار اتصال قاعدة البيانات
    const userCount = await prisma.user.count();
    
    // جلب آخر 3 مستخدمين
    const latestUsers = await prisma.user.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        createdAt: true,
        verified: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'قاعدة البيانات تعمل بشكل طبيعي',
      data: {
        totalUsers: userCount,
        latestUsers: latestUsers,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('خطأ في اختبار قاعدة البيانات:', error);
    
    return NextResponse.json({
      success: false,
      message: 'فشل في الاتصال بقاعدة البيانات',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
