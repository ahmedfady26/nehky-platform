import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API للحصول على إحصائيات الأجهزة للإدارة
 * GET /api/admin/device-analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7'; // آخر 7 أيام افتراضياً
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // حساب التاريخ المرجعي
    const daysBack = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // جلب بيانات الأجهزة
    const devices = await prisma.userDevice.findMany({
      where: {
        loginTime: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
            verified: true,
            followersCount: true
          }
        }
      },
      orderBy: { loginTime: 'desc' },
      take: limit,
      skip: offset
    });

    // حساب الإحصائيات العامة
    const totalDevices = await prisma.userDevice.count({
      where: {
        loginTime: {
          gte: startDate
        }
      }
    });

    // إحصائيات أنواع الأجهزة
    const deviceTypeStats = await prisma.userDevice.groupBy({
      by: ['deviceType'],
      _count: { deviceType: true },
      where: {
        loginTime: {
          gte: startDate
        }
      }
    });

    // إحصائيات أنظمة التشغيل
    const osStats = await prisma.userDevice.groupBy({
      by: ['os'],
      _count: { os: true },
      where: {
        loginTime: {
          gte: startDate
        }
      },
      orderBy: {
        _count: {
          os: 'desc'
        }
      }
    });

    // إحصائيات المتصفحات
    const browserStats = await prisma.userDevice.groupBy({
      by: ['browser'],
      _count: { browser: true },
      where: {
        loginTime: {
          gte: startDate
        }
      },
      orderBy: {
        _count: {
          browser: 'desc'
        }
      }
    });

    // إحصائيات البلدان (إذا متوفرة)
    const countryStats = await prisma.userDevice.groupBy({
      by: ['country'],
      _count: { country: true },
      where: {
        loginTime: {
          gte: startDate
        },
        country: {
          not: null
        }
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      }
    });

    // إحصائيات تسجيل الدخول اليومية
    const dailyLoginStats = await prisma.$queryRaw`
      SELECT 
        DATE(loginTime) as date,
        COUNT(*) as loginCount,
        COUNT(DISTINCT userId) as uniqueUsers
      FROM user_devices 
      WHERE loginTime >= ${startDate.toISOString()}
      GROUP BY DATE(loginTime)
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{
      date: string;
      loginCount: number;
      uniqueUsers: number;
    }>;

    // المستخدمون الأكثر نشاطاً (بعدد الأجهزة)
    const activeUsersStats = await prisma.userDevice.groupBy({
      by: ['userId'],
      _count: { userId: true },
      where: {
        loginTime: {
          gte: startDate
        }
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 10
    });

    // جلب تفاصيل المستخدمين الأكثر نشاطاً
    const activeUserIds = activeUsersStats.map(stat => stat.userId);
    const activeUsersDetails = await prisma.user.findMany({
      where: { id: { in: activeUserIds } },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        verified: true,
        followersCount: true
      }
    });

    // دمج بيانات المستخدمين مع إحصائياتهم
    const activeUsersWithStats = activeUsersStats.map(stat => {
      const userDetails = activeUsersDetails.find(user => user.id === stat.userId);
      return {
        user: userDetails,
        deviceCount: stat._count.userId
      };
    });

    // معدل الأجهزة الجديدة مقابل المتكررة
    const firstTimeDevices = await prisma.userDevice.count({
      where: {
        loginTime: {
          gte: startDate
        },
        isFirstTime: true
      }
    });

    const returningDevices = totalDevices - firstTimeDevices;

    return NextResponse.json({
      success: true,
      timeRange: `آخر ${daysBack} أيام`,
      period: {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      },
      overview: {
        totalLogins: totalDevices,
        firstTimeDevices,
        returningDevices,
        firstTimePercentage: totalDevices > 0 ? (firstTimeDevices / totalDevices * 100).toFixed(1) : '0'
      },
      deviceTypes: deviceTypeStats.reduce((acc, stat) => {
        acc[stat.deviceType] = stat._count.deviceType;
        return acc;
      }, {} as Record<string, number>),
      operatingSystems: osStats.map(stat => ({
        name: stat.os || 'غير محدد',
        count: stat._count.os,
        percentage: totalDevices > 0 ? (stat._count.os / totalDevices * 100).toFixed(1) : '0'
      })),
      browsers: browserStats.map(stat => ({
        name: stat.browser || 'غير محدد',
        count: stat._count.browser,
        percentage: totalDevices > 0 ? (stat._count.browser / totalDevices * 100).toFixed(1) : '0'
      })),
      countries: countryStats.map(stat => ({
        name: stat.country || 'غير محدد',
        count: stat._count.country,
        percentage: totalDevices > 0 ? (stat._count.country / totalDevices * 100).toFixed(1) : '0'
      })),
      dailyActivity: dailyLoginStats.map(stat => ({
        date: stat.date,
        loginCount: Number(stat.loginCount),
        uniqueUsers: Number(stat.uniqueUsers)
      })),
      activeUsers: activeUsersWithStats,
      recentDevices: devices.slice(0, 20).map(device => ({
        id: device.id,
        deviceType: device.deviceType,
        os: device.os,
        browser: device.browser,
        loginTime: device.loginTime,
        isFirstTime: device.isFirstTime,
        user: device.user
      })),
      pagination: {
        total: totalDevices,
        limit,
        offset,
        hasMore: offset + limit < totalDevices
      }
    });

  } catch (error) {
    console.error('خطأ في جلب إحصائيات الأجهزة:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في الخادم', 
        success: false,
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
