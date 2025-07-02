/**
 * إدارة علاقات الأصدقاء المقربين
 * Best Friend Relations Management
 * 
 * هذا الملف يحتوي على دوال إدارة علاقات الأصدقاء المقربين
 * وتحديث قاعدة البيانات بالنقاط والإحصائيات
 */

import { prisma } from '../prisma';
import { 
  BestFriendRelation, 
  BestFriendStatus, 
  RelationshipStrength,
  BestFriendActivityLog,
  User 
} from '@prisma/client';
import { 
  calculateBestFriendPoints, 
  calculateRelationshipStrength,
  calculateProgressToNextLevel,
  analyzeRelationshipPerformance,
  PointsCalculationMetadata 
} from './points';

// تعريف أنواع البيانات
export interface BestFriendRelationWithUsers extends BestFriendRelation {
  user1: User;
  user2: User;
  activityLogs: BestFriendActivityLog[];
}

export interface RelationUpdateResult {
  relation: BestFriendRelation;
  pointsAdded: number;
  newLevel?: RelationshipStrength;
  levelChanged: boolean;
  achievements: string[];
}

/**
 * البحث عن علاقة صديق أفضل نشطة بين مستخدمين
 */
export async function findActiveBestFriendRelation(
  user1Id: string, 
  user2Id: string
): Promise<BestFriendRelation | null> {
  try {
    // البحث في كلا الاتجاهين (user1 -> user2 أو user2 -> user1)
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id, user2Id, status: BestFriendStatus.ACTIVE },
          { user1Id: user2Id, user2Id: user1Id, status: BestFriendStatus.ACTIVE }
        ]
      },
      include: {
        user1: true,
        user2: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10 // آخر 10 أنشطة
        }
      }
    });

    return relation;
  } catch (error) {
    console.error('خطأ في البحث عن علاقة الصديق الأفضل:', error);
    return null;
  }
}

/**
 * إنشاء علاقة صديق أفضل جديدة
 */
export async function createBestFriendRelation(
  user1Id: string,
  user2Id: string,
  nominatedBy: string,
  nominationWeek: string
): Promise<BestFriendRelation | null> {
  try {
    // التأكد من عدم وجود علاقة نشطة بالفعل
    const existingRelation = await findActiveBestFriendRelation(user1Id, user2Id);
    if (existingRelation) {
      throw new Error('توجد علاقة صديق أفضل نشطة بالفعل');
    }

    // حساب تاريخ البداية والنهاية (أسبوع من الآن)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const relation = await prisma.bestFriendRelation.create({
      data: {
        user1Id,
        user2Id,
        startDate,
        endDate,
        nominatedBy,
        nominationWeek,
        status: BestFriendStatus.PENDING,
        totalPoints: 0,
        user1Points: 0,
        user2Points: 0,
        mutualScore: 0,
        relationshipStrength: RelationshipStrength.WEAK,
        compatibilityScore: 0,
        interactionFrequency: 0,
        commonInterests: [],
        mutualFriends: 0,
        sharedContent: 0
      }
    });

    // تسجيل نشاط إنشاء العلاقة
    await logBestFriendActivity(
      relation.id,
      nominatedBy,
      'RELATION_CREATED',
      'تم إنشاء علاقة صديق أفضل جديدة',
      0,
      { user1Id, user2Id, nominationWeek }
    );

    return relation;
  } catch (error) {
    console.error('خطأ في إنشاء علاقة الصديق الأفضل:', error);
    return null;
  }
}

/**
 * تحديث نقاط علاقة الصديق الأفضل
 */
export async function updateBestFriendRelationPoints(
  relationId: string,
  userId: string,
  pointsToAdd: number,
  activityType: string,
  activityDescription: string,
  metadata?: any
): Promise<RelationUpdateResult | null> {
  try {
    // الحصول على العلاقة الحالية
    const currentRelation = await prisma.bestFriendRelation.findUnique({
      where: { id: relationId },
      include: {
        user1: true,
        user2: true
      }
    });

    if (!currentRelation) {
      throw new Error('لم يتم العثور على العلاقة');
    }

    // تحديد أي مستخدم هو المتفاعل
    const isUser1 = currentRelation.user1Id === userId;
    const isUser2 = currentRelation.user2Id === userId;

    if (!isUser1 && !isUser2) {
      throw new Error('المستخدم ليس جزءاً من هذه العلاقة');
    }

    // حساب النقاط الجديدة
    const newUser1Points = isUser1 
      ? currentRelation.user1Points + pointsToAdd 
      : currentRelation.user1Points;
    
    const newUser2Points = isUser2 
      ? currentRelation.user2Points + pointsToAdd 
      : currentRelation.user2Points;

    const newTotalPoints = newUser1Points + newUser2Points;
    const newMutualScore = Math.min(newUser1Points, newUser2Points); // النقاط المتبادلة

    // حساب قوة العلاقة الجديدة
    const oldLevel = currentRelation.relationshipStrength;
    const newLevel = calculateRelationshipStrength(newTotalPoints);
    const levelChanged = oldLevel !== newLevel;

    // تحديث العلاقة في قاعدة البيانات
    const updatedRelation = await prisma.bestFriendRelation.update({
      where: { id: relationId },
      data: {
        user1Points: newUser1Points,
        user2Points: newUser2Points,
        totalPoints: newTotalPoints,
        mutualScore: newMutualScore,
        relationshipStrength: newLevel,
        lastInteraction: new Date(),
        // تحديث تكرار التفاعل
        interactionFrequency: await calculateInteractionFrequency(relationId),
      }
    });

    // تسجيل النشاط
    await logBestFriendActivity(
      relationId,
      userId,
      activityType,
      activityDescription,
      pointsToAdd,
      { 
        ...metadata,
        oldLevel,
        newLevel,
        levelChanged,
        totalPointsBefore: currentRelation.totalPoints,
        totalPointsAfter: newTotalPoints
      }
    );

    // تحديد الإنجازات المحققة
    const achievements = await checkAchievements(
      relationId,
      currentRelation,
      updatedRelation
    );

    return {
      relation: updatedRelation,
      pointsAdded: pointsToAdd,
      newLevel,
      levelChanged,
      achievements
    };

  } catch (error) {
    console.error('خطأ في تحديث نقاط العلاقة:', error);
    return null;
  }
}

/**
 * حساب تكرار التفاعل لعلاقة معينة
 */
async function calculateInteractionFrequency(relationId: string): Promise<number> {
  try {
    // الحصول على عدد الأنشطة في آخر 7 أيام
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityCount = await prisma.bestFriendActivityLog.count({
      where: {
        relationId,
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // تكرار التفاعل = عدد الأنشطة / 7 أيام
    return activityCount / 7;
  } catch (error) {
    console.error('خطأ في حساب تكرار التفاعل:', error);
    return 0;
  }
}

/**
 * فحص الإنجازات المحققة
 */
async function checkAchievements(
  relationId: string,
  oldRelation: BestFriendRelation,
  newRelation: BestFriendRelation
): Promise<string[]> {
  const achievements: string[] = [];

  try {
    // إنجاز الترقية في المستوى
    if (oldRelation.relationshipStrength !== newRelation.relationshipStrength) {
      achievements.push(`LEVEL_UP_${newRelation.relationshipStrength}`);
    }

    // إنجاز الوصول لنقاط معينة
    const pointsMilestones = [50, 100, 200, 500, 1000];
    for (const milestone of pointsMilestones) {
      if (oldRelation.totalPoints < milestone && newRelation.totalPoints >= milestone) {
        achievements.push(`POINTS_MILESTONE_${milestone}`);
      }
    }

    // إنجاز النشاط المستمر
    const recentActivities = await prisma.bestFriendActivityLog.count({
      where: {
        relationId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // آخر 7 أيام
        }
      }
    });

    if (recentActivities >= 20) {
      achievements.push('VERY_ACTIVE_WEEK');
    } else if (recentActivities >= 10) {
      achievements.push('ACTIVE_WEEK');
    }

    // إنجاز التوازن في النقاط
    const pointsDifference = Math.abs(newRelation.user1Points - newRelation.user2Points);
    const averagePoints = (newRelation.user1Points + newRelation.user2Points) / 2;
    const balanceRatio = pointsDifference / Math.max(averagePoints, 1);

    if (balanceRatio < 0.1 && newRelation.totalPoints > 50) {
      achievements.push('BALANCED_FRIENDSHIP');
    }

    return achievements;
  } catch (error) {
    console.error('خطأ في فحص الإنجازات:', error);
    return achievements;
  }
}

/**
 * تسجيل نشاط في سجل الأنشطة
 */
export async function logBestFriendActivity(
  relationId: string,
  userId: string,
  activityType: string,
  description: string,
  pointsAwarded: number = 0,
  metadata?: any
): Promise<BestFriendActivityLog | null> {
  try {
    const activity = await prisma.bestFriendActivityLog.create({
      data: {
        relationId,
        userId,
        activityType,
        description,
        pointsAwarded,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
      }
    });

    return activity;
  } catch (error) {
    console.error('خطأ في تسجيل النشاط:', error);
    return null;
  }
}

/**
 * الحصول على إحصائيات علاقة الصديق الأفضل
 */
export async function getBestFriendRelationStats(
  relationId: string
): Promise<{
  relation: BestFriendRelation;
  progress: ReturnType<typeof calculateProgressToNextLevel>;
  analysis: any;
  recentActivities: BestFriendActivityLog[];
} | null> {
  try {
    const relation = await prisma.bestFriendRelation.findUnique({
      where: { id: relationId },
      include: {
        user1: true,
        user2: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!relation) return null;

    // حساب التقدم
    const progress = calculateProgressToNextLevel(relation.totalPoints);

    // تحليل الأداء
    const activityHistory = relation.activityLogs.map(log => ({
      date: log.createdAt,
      points: log.pointsAwarded,
      isReciprocal: false, // سيتم تحسينه لاحقاً
      timeOfDay: log.createdAt.getHours()
    }));

    const analysis = analyzeRelationshipPerformance(
      relation.totalPoints,
      activityHistory
    );

    return {
      relation,
      progress,
      analysis,
      recentActivities: relation.activityLogs
    };

  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات العلاقة:', error);
    return null;
  }
}

/**
 * الحصول على جميع علاقات الصديق الأفضل لمستخدم معين
 */
export async function getUserBestFriendRelations(
  userId: string,
  status?: BestFriendStatus
): Promise<BestFriendRelation[]> {
  try {
    const relations = await prisma.bestFriendRelation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        ...(status && { status })
      },
      include: {
        user1: true,
        user2: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: {
        totalPoints: 'desc'
      }
    });

    return relations;
  } catch (error) {
    console.error('خطأ في الحصول على علاقات المستخدم:', error);
    return [];
  }
}

/**
 * تحديث حالة علاقة الصديق الأفضل
 */
export async function updateBestFriendRelationStatus(
  relationId: string,
  newStatus: BestFriendStatus,
  updatedBy: string,
  reason?: string
): Promise<BestFriendRelation | null> {
  try {
    const updatedRelation = await prisma.bestFriendRelation.update({
      where: { id: relationId },
      data: {
        status: newStatus,
        ...(newStatus === BestFriendStatus.ACTIVE && { decidedAt: new Date() }),
        ...(newStatus === BestFriendStatus.ACTIVE && { approvedBy: updatedBy })
      }
    });

    // تسجيل تغيير الحالة
    await logBestFriendActivity(
      relationId,
      updatedBy,
      'STATUS_CHANGED',
      `تم تغيير حالة العلاقة إلى ${newStatus}`,
      0,
      { newStatus, reason }
    );

    return updatedRelation;
  } catch (error) {
    console.error('خطأ في تحديث حالة العلاقة:', error);
    return null;
  }
}

/**
 * حذف أو إنهاء علاقة صديق أفضل
 */
export async function endBestFriendRelation(
  relationId: string,
  endedBy: string,
  reason?: string
): Promise<boolean> {
  try {
    // تحديث حالة العلاقة إلى منتهية
    await prisma.bestFriendRelation.update({
      where: { id: relationId },
      data: {
        status: BestFriendStatus.EXPIRED,
        endDate: new Date()
      }
    });

    // تسجيل إنهاء العلاقة
    await logBestFriendActivity(
      relationId,
      endedBy,
      'RELATION_ENDED',
      'تم إنهاء علاقة الصديق الأفضل',
      0,
      { reason, endedAt: new Date() }
    );

    return true;
  } catch (error) {
    console.error('خطأ في إنهاء العلاقة:', error);
    return false;
  }
}

/**
 * التحقق من انتهاء صلاحية العلاقات وتحديثها
 */
export async function checkAndUpdateExpiredRelations(): Promise<number> {
  try {
    const now = new Date();
    
    // العثور على العلاقات المنتهية الصلاحية
    const expiredRelations = await prisma.bestFriendRelation.findMany({
      where: {
        status: BestFriendStatus.ACTIVE,
        endDate: {
          lt: now
        }
      }
    });

    // تحديث حالتها إلى منتهية
    for (const relation of expiredRelations) {
      await updateBestFriendRelationStatus(
        relation.id,
        BestFriendStatus.EXPIRED,
        'SYSTEM',
        'انتهت مدة العلاقة'
      );
    }

    return expiredRelations.length;
  } catch (error) {
    console.error('خطأ في فحص العلاقات المنتهية:', error);
    return 0;
  }
}
