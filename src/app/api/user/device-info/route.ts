import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UAParser } from 'ua-parser-js';

/**
 * API لتسجيل معلومات الجهاز عند تسجيل الدخول
 * POST /api/user/device-info
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب', success: false },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود', success: false },
        { status: 404 }
      );
    }

    // الحصول على معلومات الطلب
    const userAgent = request.headers.get('user-agent') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = xForwardedFor 
      ? xForwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || 'unknown';

    // تحليل User Agent - استخدام الطريقة الصحيحة للإصدار 2.x
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // تحديد نوع الجهاز
    const deviceType = result.device.type 
      ? (result.device.type === 'mobile' ? 'MOBILE' : 
         result.device.type === 'tablet' ? 'TABLET' : 'DESKTOP')
      : 'DESKTOP'; // افتراضي للكمبيوتر

    // التحقق من وجود جهاز مماثل مسجل مسبقاً
    const existingDevice = await prisma.userDevice.findFirst({
      where: {
        userId,
        deviceType,
        os: result.os.name || 'Unknown',
        browser: result.browser.name || 'Unknown',
        ipAddress
      }
    });

    let deviceRecord;

    if (existingDevice) {
      // تحديث آخر استخدام للجهاز الموجود
      deviceRecord = await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastUsedAt: new Date(),
          loginTime: new Date() // تحديث وقت آخر دخول
        }
      });
    } else {
      // إنشاء سجل جهاز جديد
      deviceRecord = await prisma.userDevice.create({
        data: {
          userId,
          deviceType,
          os: result.os.name || 'Unknown',
          browser: result.browser.name || 'Unknown',
          userAgent,
          ipAddress,
          isFirstTime: true,
          loginTime: new Date(),
          lastUsedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل معلومات الجهاز بنجاح',
      device: {
        id: deviceRecord.id,
        deviceType: deviceRecord.deviceType,
        os: deviceRecord.os,
        browser: deviceRecord.browser,
        isFirstTime: deviceRecord.isFirstTime
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل معلومات الجهاز:', error);
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

/**
 * API لجلب معلومات أجهزة المستخدم
 * GET /api/user/device-info?userId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب', success: false },
        { status: 400 }
      );
    }

    // جلب جميع أجهزة المستخدم
    const devices = await prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'desc' },
      take: 10 // آخر 10 أجهزة
    });

    // حساب إحصائيات الأجهزة
    const deviceStats = {
      totalDevices: devices.length,
      deviceTypes: {
        desktop: devices.filter(d => d.deviceType === 'DESKTOP').length,
        mobile: devices.filter(d => d.deviceType === 'MOBILE').length,
        tablet: devices.filter(d => d.deviceType === 'TABLET').length
      },
      browsers: {} as Record<string, number>,
      operatingSystems: {} as Record<string, number>,
      lastLoginDevice: devices[0] || null
    };

    // حساب توزيع المتصفحات
    devices.forEach(device => {
      const browser = device.browser || 'Unknown';
      deviceStats.browsers[browser] = (deviceStats.browsers[browser] || 0) + 1;
    });

    // حساب توزيع أنظمة التشغيل
    devices.forEach(device => {
      const os = device.os || 'Unknown';
      deviceStats.operatingSystems[os] = (deviceStats.operatingSystems[os] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      devices,
      stats: deviceStats
    });

  } catch (error) {
    console.error('خطأ في جلب معلومات الأجهزة:', error);
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
