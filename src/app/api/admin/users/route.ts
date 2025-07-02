import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // آخر 20 مستخدم
      select: {
        id: true,
        fullName: true,
        username: true,
        nehkyEmail: true,
        externalEmail: true,
        phone: true,
        isInfluencer: true,
        createdAt: true
      }
    });

    const stats = {
      total: await prisma.user.count(),
      withPhone: await prisma.user.count({
        where: { 
          phone: { 
            not: '',
            contains: '+2'  // أرقام مكتملة تبدأ بكود البلد
          }
        }
      }),
      influencers: await prisma.user.count({
        where: { isInfluencer: true }
      }),
      recent: await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
          }
        }
      })
    };

    return NextResponse.json({
      success: true,
      users,
      stats
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدمين:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
