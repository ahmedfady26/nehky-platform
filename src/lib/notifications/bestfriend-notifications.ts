/**
 * 🔔 نظام الإشعارات المتقدم للصديق الأفضل
 * 
 * يوفر إشعارات فورية ومخصصة لجميع أنشطة الصديق الأفضل
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// أنواع الإشعارات
export enum BestFriendNotificationType {
  PERMISSION_REQUEST = 'PERMISSION_REQUEST',
  PERMISSION_APPROVED = 'PERMISSION_APPROVED', 
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  BADGE_UPGRADED = 'BADGE_UPGRADED',
  NEW_PRIVILEGE = 'NEW_PRIVILEGE',
  FRIENDSHIP_MILESTONE = 'FRIENDSHIP_MILESTONE',
  WEEKLY_SUMMARY = 'WEEKLY_SUMMARY',
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED'
}

// واجهة الإشعار
export interface BestFriendNotification {
  id: string
  type: BestFriendNotificationType
  title: string
  message: string
  data?: any
  userId: string
  read: boolean
  createdAt: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

// قوالب الإشعارات
export const notificationTemplates = {
  [BestFriendNotificationType.PERMISSION_REQUEST]: {
    title: '🔐 طلب صلاحية جديد',
    getMessage: (data: any) => `${data.requesterName} يطلب صلاحية "${data.permissionType}" للوصول إلى ${data.targetContent}`,
    priority: 'HIGH' as const
  },
  
  [BestFriendNotificationType.PERMISSION_APPROVED]: {
    title: '✅ تمت الموافقة على الطلب',
    getMessage: (data: any) => `تمت الموافقة على طلبك للوصول إلى ${data.targetContent}. يمكنك الآن الاستفادة من هذه الصلاحية.`,
    priority: 'NORMAL' as const
  },
  
  [BestFriendNotificationType.PERMISSION_DENIED]: {
    title: '❌ تم رفض الطلب',
    getMessage: (data: any) => `تم رفض طلبك للوصول إلى ${data.targetContent}. يمكنك إعادة المحاولة لاحقاً.`,
    priority: 'LOW' as const
  },
  
  [BestFriendNotificationType.BADGE_UPGRADED]: {
    title: '🎉 ترقية شارة!',
    getMessage: (data: any) => `تهانينا! تمت ترقية شارتك إلى "${data.newBadge}" مع ${data.friendName}`,
    priority: 'HIGH' as const
  },
  
  [BestFriendNotificationType.NEW_PRIVILEGE]: {
    title: '✨ امتياز جديد!',
    getMessage: (data: any) => `حصلت على امتياز جديد: ${data.privilegeName} مع ${data.friendName}`,
    priority: 'NORMAL' as const
  },
  
  [BestFriendNotificationType.FRIENDSHIP_MILESTONE]: {
    title: '🏆 إنجاز جديد!',
    getMessage: (data: any) => `وصلت صداقتك مع ${data.friendName} إلى ${data.milestone} نقطة!`,
    priority: 'NORMAL' as const
  },
  
  [BestFriendNotificationType.WEEKLY_SUMMARY]: {
    title: '📊 ملخص الأسبوع',
    getMessage: (data: any) => `هذا الأسبوع: ${data.newFriends} أصدقاء جدد، ${data.totalPoints} نقطة، ${data.newBadges} شارة جديدة`,
    priority: 'LOW' as const
  },
  
  [BestFriendNotificationType.ACHIEVEMENT_UNLOCKED]: {
    title: '🎯 إنجاز مفتوح!',
    getMessage: (data: any) => `تهانينا! فتحت إنجاز "${data.achievementName}" - ${data.description}`,
    priority: 'HIGH' as const
  }
}

/**
 * إنشاء إشعار جديد
 */
export async function createBestFriendNotification(
  userId: string,
  type: BestFriendNotificationType,
  data?: any
): Promise<void> {
  try {
    const template = notificationTemplates[type]
    if (!template) {
      throw new Error(`Unknown notification type: ${type}`)
    }

    const notification = {
      type,
      title: template.title,
      message: template.getMessage(data || {}),
      data: JSON.stringify(data || {}),
      userId,
      priority: template.priority,
      read: false,
      createdAt: new Date()
    }

    // إنشاء الإشعار في قاعدة البيانات
    await prisma.notification.create({
      data: {
        userId,
        type: 'BESTFRIEND',
        title: notification.title,
        message: notification.message,
        dataJson: notification.data,
        priority: notification.priority as any,
        isRead: false
      }
    })

    // إرسال الإشعار الفوري (WebSocket)
    await sendRealTimeNotification(userId, notification)

  } catch (error) {
    console.error('Error creating best friend notification:', error)
    throw error
  }
}

/**
 * جلب إشعارات الصديق الأفضل للمستخدم
 */
export async function getBestFriendNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<BestFriendNotification[]> {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        type: 'BESTFRIEND'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    return notifications.map(notification => ({
      id: notification.id,
      type: notification.dataJson ? JSON.parse(notification.dataJson).type : BestFriendNotificationType.WEEKLY_SUMMARY,
      title: notification.title,
      message: notification.message,
      data: notification.dataJson ? JSON.parse(notification.dataJson) : null,
      userId: notification.userId,
      read: notification.isRead,
      createdAt: notification.createdAt,
      priority: notification.priority as any || 'MEDIUM'
    }))

  } catch (error) {
    console.error('Error fetching best friend notifications:', error)
    throw error
  }
}

/**
 * تمييز الإشعارات كمقروءة
 */
export async function markNotificationsAsRead(
  userId: string,
  notificationIds: string[]
): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    throw error
  }
}

/**
 * عدد الإشعارات غير المقروءة
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: {
        userId,
        type: 'BESTFRIEND',
        isRead: false
      }
    })
  } catch (error) {
    console.error('Error getting unread notifications count:', error)
    return 0
  }
}

/**
 * إرسال إشعار فوري عبر WebSocket
 */
async function sendRealTimeNotification(
  userId: string,
  notification: any
): Promise<void> {
  try {
    // هنا يمكن دمج WebSocket أو Server-Sent Events
    // للآن نسجل الإشعار فقط
    console.log(`📡 Real-time notification sent to user ${userId}:`, notification)
    
    // في التطبيق الحقيقي، يمكن استخدام:
    // - Socket.io
    // - WebSocket native
    // - Server-Sent Events
    // - Push notifications
    
  } catch (error) {
    console.error('Error sending real-time notification:', error)
  }
}

/**
 * إنشاء إشعارات تلقائية بناءً على الأحداث
 */
export class BestFriendNotificationService {
  
  // عند طلب صلاحية
  static async onPermissionRequested(
    requesterId: string,
    approverId: string,
    permissionType: string,
    targetContent: string
  ) {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { fullName: true }
    })

    await createBestFriendNotification(
      approverId,
      BestFriendNotificationType.PERMISSION_REQUEST,
      {
        requesterName: requester?.fullName,
        permissionType,
        targetContent,
        requesterId
      }
    )
  }

  // عند الموافقة على الصلاحية
  static async onPermissionApproved(
    requesterId: string,
    targetContent: string
  ) {
    await createBestFriendNotification(
      requesterId,
      BestFriendNotificationType.PERMISSION_APPROVED,
      { targetContent }
    )
  }

  // عند رفض الصلاحية
  static async onPermissionDenied(
    requesterId: string,
    targetContent: string
  ) {
    await createBestFriendNotification(
      requesterId,
      BestFriendNotificationType.PERMISSION_DENIED,
      { targetContent }
    )
  }

  // عند ترقية الشارة
  static async onBadgeUpgraded(
    userId: string,
    friendId: string,
    newBadge: string
  ) {
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { fullName: true }
    })

    await createBestFriendNotification(
      userId,
      BestFriendNotificationType.BADGE_UPGRADED,
      {
        newBadge,
        friendName: friend?.fullName
      }
    )
  }

  // عند الحصول على امتياز جديد
  static async onNewPrivilege(
    userId: string,
    friendId: string,
    privilegeName: string
  ) {
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { fullName: true }
    })

    await createBestFriendNotification(
      userId,
      BestFriendNotificationType.NEW_PRIVILEGE,
      {
        privilegeName,
        friendName: friend?.fullName
      }
    )
  }

  // عند الوصول لمعلم في الصداقة
  static async onFriendshipMilestone(
    userId: string,
    friendId: string,
    milestone: number
  ) {
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { fullName: true }
    })

    await createBestFriendNotification(
      userId,
      BestFriendNotificationType.FRIENDSHIP_MILESTONE,
      {
        friendName: friend?.fullName,
        milestone
      }
    )
  }

  // ملخص أسبوعي
  static async sendWeeklySummary(userId: string) {
    // حساب إحصائيات الأسبوع
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const newFriends = await prisma.bestFriendRelation.count({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        createdAt: { gte: weekAgo }
      }
    })

    const totalPoints = await prisma.bestFriendRelation.aggregate({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      _sum: {
        totalPoints: true
      }
    })

    await createBestFriendNotification(
      userId,
      BestFriendNotificationType.WEEKLY_SUMMARY,
      {
        newFriends,
        totalPoints: totalPoints._sum.totalPoints || 0,
        newBadges: 1 // يمكن حسابها بشكل أكثر تفصيلاً
      }
    )
  }

  // عند فتح إنجاز جديد
  static async onAchievementUnlocked(
    userId: string,
    achievementName: string,
    description: string
  ) {
    await createBestFriendNotification(
      userId,
      BestFriendNotificationType.ACHIEVEMENT_UNLOCKED,
      {
        achievementName,
        description
      }
    )
  }
}

export default BestFriendNotificationService
