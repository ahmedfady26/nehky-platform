/**
 * 🎁 نظام الامتيازات والمميزات الخاصة للأصدقاء المؤكدين
 * 
 * يدير المميزات البصرية والوظيفية للأصدقاء المثاليين مثل:
 * - الشارات والهوية البصرية
 * - الأولوية في التعليقات
 * - المميزات الخاصة حسب قوة العلاقة
 */

import { prisma } from '../prisma'
import { BestFriendStatus, RelationshipStrength } from '@prisma/client'

// ================== أنواع البيانات ==================

export interface BestFriendBadge {
  userId: string
  friendId: string
  badgeType: BadgeType
  relationshipStrength: RelationshipStrength
  totalPoints: number
  displayName: string
  color: string
  icon: string
  description: string
}

export interface BestFriendPrivileges {
  userId: string
  friendId: string
  hasSpecialBadge: boolean
  canPostOnProfile: boolean
  hasCommentPriority: boolean
  hasSpecialColor: boolean
  canViewPrivateStories: boolean
  relationshipLevel: string
  privileges: string[]
  restrictions: string[]
}

export interface PrivilegeResponse {
  success: boolean
  message: string
  privileges?: BestFriendPrivileges
  badge?: BestFriendBadge
  errors?: string[]
}

// ================== أنواع الشارات ==================

export enum BadgeType {
  BEST_FRIEND = 'BEST_FRIEND',           // الصديق الأفضل
  STRONG_BOND = 'STRONG_BOND',           // رباط قوي
  SUPER_FRIEND = 'SUPER_FRIEND',         // صديق مميز
  LOYAL_COMPANION = 'LOYAL_COMPANION'    // رفيق مخلص
}

// ================== إعدادات المميزات ==================

export const PRIVILEGE_SETTINGS = {
  badges: {
    [BadgeType.BEST_FRIEND]: {
      color: '#22c55e',        // أخضر
      icon: '💚',
      displayName: 'الصديق الأفضل',
      description: 'صديق مقرب ومميز',
      minPoints: 0
    },
    [BadgeType.STRONG_BOND]: {
      color: '#3b82f6',        // أزرق
      icon: '🤝',
      displayName: 'رباط قوي',
      description: 'علاقة صداقة قوية',
      minPoints: 50
    },
    [BadgeType.SUPER_FRIEND]: {
      color: '#f59e0b',        // ذهبي
      icon: '⭐',
      displayName: 'صديق مميز',
      description: 'صديق بمستوى متقدم',
      minPoints: 100
    },
    [BadgeType.LOYAL_COMPANION]: {
      color: '#8b5cf6',        // بنفسجي
      icon: '👑',
      displayName: 'رفيق مخلص',
      description: 'أعلى مستوى صداقة',
      minPoints: 200
    }
  },
  
  privileges: {
    [RelationshipStrength.WEAK]: {
      canPostOnProfile: false,
      hasCommentPriority: false,
      hasSpecialColor: false,
      canViewPrivateStories: false,
      privileges: ['إرسال طلبات صداقة خاصة'],
      restrictions: ['لا يمكن النشر', 'تعليقات محدودة']
    },
    [RelationshipStrength.MODERATE]: {
      canPostOnProfile: true,
      hasCommentPriority: true,
      hasSpecialColor: true,
      canViewPrivateStories: false,
      privileges: ['النشر المحدود', 'أولوية التعليقات', 'لون مميز'],
      restrictions: ['لا يمكن مشاهدة القصص الخاصة']
    },
    [RelationshipStrength.STRONG]: {
      canPostOnProfile: true,
      hasCommentPriority: true,
      hasSpecialColor: true,
      canViewPrivateStories: true,
      privileges: ['جميع المميزات الأساسية', 'مشاهدة القصص الخاصة'],
      restrictions: ['قيود قليلة']
    },
    [RelationshipStrength.VERY_STRONG]: {
      canPostOnProfile: true,
      hasCommentPriority: true,
      hasSpecialColor: true,
      canViewPrivateStories: true,
      privileges: ['جميع المميزات المتقدمة', 'أولوية عالية', 'وصول كامل'],
      restrictions: ['لا توجد قيود']
    }
  }
} as const

// ================== دوال الامتيازات ==================

/**
 * 🎖️ الحصول على شارة الصديق الأفضل
 */
export async function getBestFriendBadge(
  userId: string,
  friendId: string
): Promise<BestFriendBadge | null> {
  try {
    // البحث عن العلاقة النشطة
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId, status: BestFriendStatus.ACTIVE },
          { user1Id: friendId, user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      },
      include: {
        user1: { select: { username: true, fullName: true } },
        user2: { select: { username: true, fullName: true } }
      }
    })

    if (!relation) {
      return null
    }

    // تحديد نوع الشارة حسب النقاط
    const totalPoints = relation.totalPoints
    let badgeType = BadgeType.BEST_FRIEND

    if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.LOYAL_COMPANION].minPoints) {
      badgeType = BadgeType.LOYAL_COMPANION
    } else if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.SUPER_FRIEND].minPoints) {
      badgeType = BadgeType.SUPER_FRIEND
    } else if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.STRONG_BOND].minPoints) {
      badgeType = BadgeType.STRONG_BOND
    }

    const badgeSettings = PRIVILEGE_SETTINGS.badges[badgeType]
    const friendUser = relation.user1Id === userId ? relation.user2 : relation.user1

    return {
      userId,
      friendId,
      badgeType,
      relationshipStrength: relation.relationshipStrength,
      totalPoints,
      displayName: badgeSettings.displayName,
      color: badgeSettings.color,
      icon: badgeSettings.icon,
      description: `${badgeSettings.description} - ${friendUser.fullName || friendUser.username}`
    }

  } catch (error) {
    console.error('❌ خطأ في جلب الشارة:', error)
    return null
  }
}

/**
 * 🎁 الحصول على امتيازات الصديق الأفضل
 */
export async function getBestFriendPrivileges(
  userId: string,
  friendId: string
): Promise<BestFriendPrivileges | null> {
  try {
    // البحث عن العلاقة النشطة
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId, status: BestFriendStatus.ACTIVE },
          { user1Id: friendId, user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      }
    })

    if (!relation) {
      return null
    }

    const privilegeSettings = PRIVILEGE_SETTINGS.privileges[relation.relationshipStrength]

    return {
      userId,
      friendId,
      hasSpecialBadge: true,
      canPostOnProfile: privilegeSettings.canPostOnProfile,
      hasCommentPriority: privilegeSettings.hasCommentPriority,
      hasSpecialColor: privilegeSettings.hasSpecialColor,
      canViewPrivateStories: privilegeSettings.canViewPrivateStories,
      relationshipLevel: relation.relationshipStrength,
      privileges: [...privilegeSettings.privileges] as string[],
      restrictions: [...privilegeSettings.restrictions] as string[]
    }

  } catch (error) {
    console.error('❌ خطأ في جلب الامتيازات:', error)
    return null
  }
}

/**
 * 👥 الحصول على جميع أصدقائي المؤكدين مع امتيازاتهم
 */
export async function getAllBestFriendsWithPrivileges(
  userId: string
): Promise<{
  friends: Array<{
    friendId: string
    friendName: string
    badge: BestFriendBadge | null
    privileges: BestFriendPrivileges | null
    relationshipDetails: any
  }>
  totalCount: number
}> {
  try {
    // الحصول على جميع العلاقات النشطة
    const relations = await prisma.bestFriendRelation.findMany({
      where: {
        OR: [
          { user1Id: userId, status: BestFriendStatus.ACTIVE },
          { user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      },
      include: {
        user1: { select: { id: true, username: true, fullName: true, profilePicture: true } },
        user2: { select: { id: true, username: true, fullName: true, profilePicture: true } }
      },
      orderBy: { totalPoints: 'desc' }
    })

    const friends = await Promise.all(relations.map(async (relation) => {
      const friendUser = relation.user1Id === userId ? relation.user2 : relation.user1
      const friendId = friendUser.id

      const [badge, privileges] = await Promise.all([
        getBestFriendBadge(userId, friendId),
        getBestFriendPrivileges(userId, friendId)
      ])

      return {
        friendId,
        friendName: friendUser.fullName || friendUser.username,
        badge,
        privileges,
        relationshipDetails: {
          totalPoints: relation.totalPoints,
          relationshipStrength: relation.relationshipStrength,
          startDate: relation.startDate,
          lastInteraction: relation.lastInteraction,
          postsUsed: relation.postsUsed,
          commentsUsed: relation.commentsUsed
        }
      }
    }))

    return {
      friends,
      totalCount: friends.length
    }

  } catch (error) {
    console.error('❌ خطأ في جلب الأصدقاء:', error)
    return { friends: [], totalCount: 0 }
  }
}

/**
 * 🏆 ترقية شارة الصديق (عند الوصول لنقاط كافية)
 */
export async function upgradeBadgeIfEligible(
  userId: string,
  friendId: string
): Promise<PrivilegeResponse> {
  try {
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId, status: BestFriendStatus.ACTIVE },
          { user1Id: friendId, user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      }
    })

    if (!relation) {
      return {
        success: false,
        message: 'لا توجد علاقة صديق أفضل نشطة'
      }
    }

    const currentBadge = await getBestFriendBadge(userId, friendId)
    if (!currentBadge) {
      return {
        success: false,
        message: 'تعذر جلب الشارة الحالية'
      }
    }

    // فحص إمكانية الترقية
    const totalPoints = relation.totalPoints
    let newBadgeType = currentBadge.badgeType

    if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.LOYAL_COMPANION].minPoints && 
        currentBadge.badgeType !== BadgeType.LOYAL_COMPANION) {
      newBadgeType = BadgeType.LOYAL_COMPANION
    } else if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.SUPER_FRIEND].minPoints && 
               ![BadgeType.LOYAL_COMPANION, BadgeType.SUPER_FRIEND].includes(currentBadge.badgeType)) {
      newBadgeType = BadgeType.SUPER_FRIEND
    } else if (totalPoints >= PRIVILEGE_SETTINGS.badges[BadgeType.STRONG_BOND].minPoints && 
               currentBadge.badgeType === BadgeType.BEST_FRIEND) {
      newBadgeType = BadgeType.STRONG_BOND
    }

    if (newBadgeType === currentBadge.badgeType) {
      return {
        success: true,
        message: 'الشارة في أعلى مستوى متاح',
        badge: currentBadge
      }
    }

    // تحديث قوة العلاقة إذا لزم الأمر
    let newRelationshipStrength = relation.relationshipStrength
    if (totalPoints >= 200) {
      newRelationshipStrength = RelationshipStrength.VERY_STRONG
    } else if (totalPoints >= 100) {
      newRelationshipStrength = RelationshipStrength.STRONG
    } else if (totalPoints >= 50) {
      newRelationshipStrength = RelationshipStrength.MODERATE
    }

    if (newRelationshipStrength !== relation.relationshipStrength) {
      await prisma.bestFriendRelation.update({
        where: { id: relation.id },
        data: { relationshipStrength: newRelationshipStrength }
      })
    }

    const upgradedBadge = await getBestFriendBadge(userId, friendId)
    const upgradedPrivileges = await getBestFriendPrivileges(userId, friendId)

    await logPrivilegeActivity(
      userId,
      'BADGE_UPGRADED',
      `تم ترقية شارة الصداقة مع ${friendId} إلى ${PRIVILEGE_SETTINGS.badges[newBadgeType].displayName}`,
      { 
        oldBadge: currentBadge.badgeType, 
        newBadge: newBadgeType, 
        totalPoints 
      }
    )

    return {
      success: true,
      message: `تم ترقية الشارة إلى ${PRIVILEGE_SETTINGS.badges[newBadgeType].displayName}!`,
      badge: upgradedBadge || undefined,
      privileges: upgradedPrivileges || undefined
    }

  } catch (error) {
    console.error('❌ خطأ في ترقية الشارة:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء ترقية الشارة',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * 🎨 الحصول على اللون المميز للصديق الأفضل
 */
export function getBestFriendColor(relationshipStrength: RelationshipStrength): string {
  const colorMap = {
    [RelationshipStrength.WEAK]: '#6b7280',        // رمادي
    [RelationshipStrength.MODERATE]: '#3b82f6',    // أزرق
    [RelationshipStrength.STRONG]: '#22c55e',      // أخضر
    [RelationshipStrength.VERY_STRONG]: '#f59e0b'  // ذهبي
  }
  
  return colorMap[relationshipStrength] || '#6b7280'
}

/**
 * 📊 إحصائيات الامتيازات للمستخدم
 */
export async function getUserPrivilegeStats(userId: string): Promise<{
  totalBestFriends: number
  badgeDistribution: Record<BadgeType, number>
  privilegesSummary: {
    canPostCount: number
    hasCommentPriorityCount: number
    hasSpecialColorCount: number
    canViewStoriesCount: number
  }
  relationshipLevels: Record<RelationshipStrength, number>
}> {
  try {
    const friends = await getAllBestFriendsWithPrivileges(userId)
    
    const badgeDistribution = {
      [BadgeType.BEST_FRIEND]: 0,
      [BadgeType.STRONG_BOND]: 0,
      [BadgeType.SUPER_FRIEND]: 0,
      [BadgeType.LOYAL_COMPANION]: 0
    }

    const relationshipLevels = {
      [RelationshipStrength.WEAK]: 0,
      [RelationshipStrength.MODERATE]: 0,
      [RelationshipStrength.STRONG]: 0,
      [RelationshipStrength.VERY_STRONG]: 0
    }

    let canPostCount = 0
    let hasCommentPriorityCount = 0
    let hasSpecialColorCount = 0
    let canViewStoriesCount = 0

    friends.friends.forEach(friend => {
      if (friend.badge) {
        badgeDistribution[friend.badge.badgeType]++
      }
      if (friend.privileges) {
        if (friend.privileges.canPostOnProfile) canPostCount++
        if (friend.privileges.hasCommentPriority) hasCommentPriorityCount++
        if (friend.privileges.hasSpecialColor) hasSpecialColorCount++
        if (friend.privileges.canViewPrivateStories) canViewStoriesCount++
      }
      if (friend.relationshipDetails?.relationshipStrength) {
        relationshipLevels[friend.relationshipDetails.relationshipStrength as RelationshipStrength]++
      }
    })

    return {
      totalBestFriends: friends.totalCount,
      badgeDistribution,
      privilegesSummary: {
        canPostCount,
        hasCommentPriorityCount,
        hasSpecialColorCount,
        canViewStoriesCount
      },
      relationshipLevels
    }

  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات الامتيازات:', error)
    return {
      totalBestFriends: 0,
      badgeDistribution: {
        [BadgeType.BEST_FRIEND]: 0,
        [BadgeType.STRONG_BOND]: 0,
        [BadgeType.SUPER_FRIEND]: 0,
        [BadgeType.LOYAL_COMPANION]: 0
      },
      privilegesSummary: {
        canPostCount: 0,
        hasCommentPriorityCount: 0,
        hasSpecialColorCount: 0,
        canViewStoriesCount: 0
      },
      relationshipLevels: {
        [RelationshipStrength.WEAK]: 0,
        [RelationshipStrength.MODERATE]: 0,
        [RelationshipStrength.STRONG]: 0,
        [RelationshipStrength.VERY_STRONG]: 0
      }
    }
  }
}

// ================== دوال مساعدة ==================

/**
 * تسجيل أنشطة الامتيازات
 */
async function logPrivilegeActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata?: any
): Promise<void> {
  try {
    console.log(`[${new Date().toISOString()}] Privilege ${userId}: ${activityType} - ${description}`, metadata)
    // يمكن إضافة تسجيل في قاعدة البيانات لاحقاً
  } catch (error) {
    console.error('خطأ في تسجيل نشاط الامتيازات:', error)
  }
}
