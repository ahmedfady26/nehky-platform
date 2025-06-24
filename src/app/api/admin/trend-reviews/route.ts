import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API لإدارة سجلات مراجعة الترندات
 * POST /api/admin/trend-reviews
 */
export async function POST(request: NextRequest) {
  try {
    const { adminId, keywordId, actionTaken, notes, reason, duration } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!adminId || !keywordId || !actionTaken) {
      return NextResponse.json(
        { error: 'معرف الإداري ومعرف الكلمة ونوع الإجراء مطلوبة', success: false },
        { status: 400 }
      );
    }

    // التحقق من وجود الإداري
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: { user: true }
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'الإداري غير موجود أو غير نشط', success: false },
        { status: 403 }
      );
    }

    // التحقق من وجود الكلمة
    const keyword = await prisma.trendingKeyword.findUnique({
      where: { id: keywordId }
    });

    if (!keyword) {
      return NextResponse.json(
        { error: 'الكلمة الشائعة غير موجودة', success: false },
        { status: 404 }
      );
    }

    // الحصول على معلومات الطلب
    const userAgent = request.headers.get('user-agent') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = xForwardedFor 
      ? xForwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || 'unknown';

    // تحديد الحالة الجديدة بناءً على نوع الإجراء
    let newStatus = keyword.isCurrentlyTrending;
    switch (actionTaken) {
      case 'BLOCK':
        newStatus = false;
        break;
      case 'PIN':
        newStatus = true;
        break;
      case 'POSTPONE':
        newStatus = false;
        break;
      case 'APPROVE':
        newStatus = true;
        break;
      case 'REJECT':
        newStatus = false;
        break;
    }

    // بدء معاملة قاعدة البيانات
    const result = await prisma.$transaction(async (tx) => {
      // إنشاء سجل المراجعة
      const reviewLog = await tx.trendReviewLog.create({
        data: {
          adminId,
          keywordId,
          actionTaken,
          notes,
          reason,
          duration,
          previousStatus: keyword.isCurrentlyTrending.toString(),
          newStatus: newStatus.toString(),
          ipAddress,
          userAgent
        },
        include: {
          admin: {
            include: { user: true }
          },
          keyword: true
        }
      });

      // تحديث حالة الكلمة
      const updatedKeyword = await tx.trendingKeyword.update({
        where: { id: keywordId },
        data: {
          isCurrentlyTrending: newStatus,
          updatedAt: new Date()
        }
      });

      // تحديث آخر نشاط للإداري
      await tx.admin.update({
        where: { id: adminId },
        data: { lastActiveAt: new Date() }
      });

      return { reviewLog, updatedKeyword };
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل مراجعة الترند بنجاح',
      reviewLog: {
        id: result.reviewLog.id,
        actionTaken: result.reviewLog.actionTaken,
        adminName: result.reviewLog.admin.user.fullName,
        keywordText: result.reviewLog.keyword.keyword,
        timestamp: result.reviewLog.timestamp,
        notes: result.reviewLog.notes
      },
      updatedKeyword: {
        id: result.updatedKeyword.id,
        keyword: result.updatedKeyword.keyword,
        isCurrentlyTrending: result.updatedKeyword.isCurrentlyTrending
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل مراجعة الترند:', error);
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
 * API لجلب سجلات مراجعة الترندات
 * GET /api/admin/trend-reviews?adminId=xxx&limit=10&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const keywordId = searchParams.get('keywordId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const actionType = searchParams.get('actionType');

    // بناء فلاتر البحث
    const where: any = {};
    if (adminId) where.adminId = adminId;
    if (keywordId) where.keywordId = keywordId;
    if (actionType) where.actionTaken = actionType;

    // جلب السجلات
    const [reviewLogs, totalCount] = await Promise.all([
      prisma.trendReviewLog.findMany({
        where,
        include: {
          admin: {
            include: { user: true }
          },
          keyword: true
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.trendReviewLog.count({ where })
    ]);

    // جلب إحصائيات الإجراءات
    const actionStats = await prisma.trendReviewLog.groupBy({
      by: ['actionTaken'],
      _count: { actionTaken: true },
      where: adminId ? { adminId } : undefined
    });

    const formattedStats = actionStats.reduce((acc, stat) => {
      acc[stat.actionTaken] = stat._count.actionTaken;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      reviewLogs: reviewLogs.map(log => ({
        id: log.id,
        actionTaken: log.actionTaken,
        adminName: log.admin.user.fullName,
        adminRole: log.admin.role,
        keywordText: log.keyword.keyword,
        keywordType: log.keyword.type,
        previousStatus: log.previousStatus,
        newStatus: log.newStatus,
        notes: log.notes,
        reason: log.reason,
        duration: log.duration,
        timestamp: log.timestamp,
        createdAt: log.createdAt
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: {
        totalReviews: totalCount,
        actionBreakdown: formattedStats
      }
    });

  } catch (error) {
    console.error('خطأ في جلب سجلات مراجعة الترند:', error);
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
