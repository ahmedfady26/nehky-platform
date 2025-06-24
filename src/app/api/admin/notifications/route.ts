import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API لإدارة الإشعارات الإدارية
 * POST /api/admin/notifications
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      adminId, 
      receiverUserIds, 
      title, 
      message, 
      type = 'INFO', 
      priority = 'NORMAL',
      category,
      actionUrl,
      actionLabel,
      expiresAt
    } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!adminId || !receiverUserIds || !title || !message) {
      return NextResponse.json(
        { error: 'معرف الإداري والمستقبلين والعنوان والرسالة مطلوبة', success: false },
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

    // التحقق من صحة معرفات المستقبلين
    const receiverIds = Array.isArray(receiverUserIds) ? receiverUserIds : [receiverUserIds];
    const users = await prisma.user.findMany({
      where: { id: { in: receiverIds } },
      select: { id: true, fullName: true }
    });

    if (users.length !== receiverIds.length) {
      return NextResponse.json(
        { error: 'بعض المستقبلين غير موجودين', success: false },
        { status: 404 }
      );
    }

    // الحصول على معلومات الطلب
    const userAgent = request.headers.get('user-agent') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = xForwardedFor 
      ? xForwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || 'unknown';

    // إنشاء الإشعارات لجميع المستقبلين
    const notifications = await prisma.$transaction(async (tx) => {
      const createdNotifications = [];

      for (const receiverId of receiverIds) {
        const notification = await tx.adminNotification.create({
          data: {
            adminId,
            receiverUserId: receiverId,
            title,
            message,
            type,
            priority,
            category,
            actionUrl,
            actionLabel,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            ipAddress,
            userAgent
          },
          include: {
            admin: {
              include: { user: true }
            },
            receiverUser: {
              select: { id: true, fullName: true, username: true }
            }
          }
        });

        createdNotifications.push(notification);
      }

      // تحديث آخر نشاط للإداري
      await tx.admin.update({
        where: { id: adminId },
        data: { lastActiveAt: new Date() }
      });

      return createdNotifications;
    });

    return NextResponse.json({
      success: true,
      message: `تم إرسال ${notifications.length} إشعار بنجاح`,
      notifications: notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        receiverName: notif.receiverUser.fullName,
        receiverUsername: notif.receiverUser.username,
        sentAt: notif.sentAt,
        status: notif.status
      })),
      stats: {
        totalSent: notifications.length,
        adminName: admin.user.fullName
      }
    });

  } catch (error) {
    console.error('خطأ في إرسال الإشعارات الإدارية:', error);
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
 * API لجلب الإشعارات الإدارية
 * GET /api/admin/notifications?adminId=xxx&receiverId=xxx&status=xxx&limit=10&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const receiverId = searchParams.get('receiverId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // بناء فلاتر البحث
    const where: any = {};
    if (adminId) where.adminId = adminId;
    if (receiverId) where.receiverUserId = receiverId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    // جلب الإشعارات
    const [notifications, totalCount] = await Promise.all([
      prisma.adminNotification.findMany({
        where,
        include: {
          admin: {
            include: { user: true }
          },
          receiverUser: {
            select: { id: true, fullName: true, username: true, avatar: true }
          }
        },
        orderBy: { sentAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.adminNotification.count({ where })
    ]);

    // جلب إحصائيات الإشعارات
    const [statusStats, typeStats, priorityStats] = await Promise.all([
      prisma.adminNotification.groupBy({
        by: ['status'],
        _count: { status: true },
        where: adminId ? { adminId } : undefined
      }),
      prisma.adminNotification.groupBy({
        by: ['type'],
        _count: { type: true },
        where: adminId ? { adminId } : undefined
      }),
      prisma.adminNotification.groupBy({
        by: ['priority'],
        _count: { priority: true },
        where: adminId ? { adminId } : undefined
      })
    ]);

    const formatStats = (stats: any[]) => 
      stats.reduce((acc, stat) => {
        acc[Object.values(stat)[0] as string] = stat._count[Object.keys(stat)[0]];
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      notifications: notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        category: notif.category,
        status: notif.status,
        isRead: notif.isRead,
        readAt: notif.readAt,
        sentAt: notif.sentAt,
        expiresAt: notif.expiresAt,
        actionUrl: notif.actionUrl,
        actionLabel: notif.actionLabel,
        admin: {
          id: notif.admin.id,
          name: notif.admin.user.fullName,
          role: notif.admin.role
        },
        receiver: {
          id: notif.receiverUser.id,
          name: notif.receiverUser.fullName,
          username: notif.receiverUser.username,
          avatar: notif.receiverUser.avatar
        }
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: {
        totalNotifications: totalCount,
        statusBreakdown: formatStats(statusStats),
        typeBreakdown: formatStats(typeStats),
        priorityBreakdown: formatStats(priorityStats)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الإشعارات الإدارية:', error);
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
 * API لتحديث حالة الإشعار (قراءة، أرشفة، إلخ)
 * PATCH /api/admin/notifications
 */
export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, status, isRead, isArchived } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'معرف الإشعار مطلوب', success: false },
        { status: 400 }
      );
    }

    // التحقق من وجود الإشعار
    const notification = await prisma.adminNotification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'الإشعار غير موجود', success: false },
        { status: 404 }
      );
    }

    // تحديث الإشعار
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) {
      updateData.isRead = isRead;
      if (isRead && !notification.readAt) {
        updateData.readAt = new Date();
      }
    }
    if (isArchived !== undefined) {
      updateData.isArchived = isArchived;
      if (isArchived && !notification.archivedAt) {
        updateData.archivedAt = new Date();
      }
    }

    const updatedNotification = await prisma.adminNotification.update({
      where: { id: notificationId },
      data: updateData,
      include: {
        admin: {
          include: { user: true }
        },
        receiverUser: {
          select: { id: true, fullName: true, username: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإشعار بنجاح',
      notification: {
        id: updatedNotification.id,
        status: updatedNotification.status,
        isRead: updatedNotification.isRead,
        isArchived: updatedNotification.isArchived,
        readAt: updatedNotification.readAt,
        archivedAt: updatedNotification.archivedAt
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
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
