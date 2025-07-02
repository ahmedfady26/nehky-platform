/**
 * نظام تسجيل أنشطة الأصدقاء المقربين
 * Best Friend Activities System
 * 
 * هذا الملف يحتوي على دوال تسجيل وإدارة أنشطة الأصدقاء المقربين
 * ومعالجة التفاعلات وحساب النقاط تلقائياً
 */

import { InteractionType } from '@prisma/client';
import { 
  calculateBestFriendPoints,
  PointsCalculationMetadata
} from './points';
import {
  findActiveBestFriendRelation,
  updateBestFriendRelationPoints,
  logBestFriendActivity
} from './relations';

// تعريف أنواع الأنشطة
export type BestFriendActivityType = 
  | 'LIKE_POST'
  | 'COMMENT_POST'
  | 'SHARE_POST'
  | 'VIEW_VIDEO'
  | 'SAVE_POST'
  | 'REPLY_COMMENT'
  | 'MENTION'
  | 'TAG'
  | 'DIRECT_MESSAGE'
  | 'VIDEO_CALL'
  | 'VOICE_CALL'
  | 'STORY_VIEW'
  | 'STORY_REACT'
  | 'PROFILE_VISIT'
  | 'MUTUAL_ACTIVITY'
  | 'DAILY_STREAK'
  | 'WEEKLY_MILESTONE'
  | 'LEVEL_UP'
  | 'ACHIEVEMENT_UNLOCKED';

// واجهة بيانات النشاط
export interface BestFriendActivityData {
  user1Id: string;
  user2Id: string;
  activityType: BestFriendActivityType;
  interactionType?: InteractionType;
  postId?: string;
  commentId?: string;
  messageId?: string;
  metadata?: PointsCalculationMetadata;
  customPoints?: number; // للأنشطة الخاصة
}

// نتيجة معالجة النشاط
export interface ActivityProcessingResult {
  success: boolean;
  pointsAwarded: number;
  relationUpdated: boolean;
  achievements: string[];
  errorMessage?: string;
}

/**
 * الدالة الرئيسية لمعالجة نشاط الصديق الأفضل
 */
export async function processBestFriendActivity(
  activityData: BestFriendActivityData
): Promise<ActivityProcessingResult> {
  try {
    const { user1Id, user2Id, activityType, interactionType, metadata = {} } = activityData;

    // البحث عن علاقة صديق أفضل نشطة
    const relation = await findActiveBestFriendRelation(user1Id, user2Id);
    
    if (!relation) {
      return {
        success: false,
        pointsAwarded: 0,
        relationUpdated: false,
        achievements: [],
        errorMessage: 'لا توجد علاقة صديق أفضل نشطة'
      };
    }

    // حساب النقاط بناء على نوع النشاط
    const pointsCalculation = await calculateActivityPoints(
      activityType,
      interactionType,
      relation.id,
      metadata,
      activityData.customPoints
    );

    if (pointsCalculation.totalPoints <= 0) {
      return {
        success: true,
        pointsAwarded: 0,
        relationUpdated: false,
        achievements: [],
        errorMessage: 'لا توجد نقاط لهذا النشاط'
      };
    }

    // تحديث نقاط العلاقة
    const updateResult = await updateBestFriendRelationPoints(
      relation.id,
      user1Id,
      pointsCalculation.totalPoints,
      activityType,
      generateActivityDescription(activityType, activityData),
      {
        ...metadata,
        pointsBreakdown: pointsCalculation.breakdown,
        postId: activityData.postId,
        commentId: activityData.commentId,
        messageId: activityData.messageId
      }
    );

    if (!updateResult) {
      return {
        success: false,
        pointsAwarded: 0,
        relationUpdated: false,
        achievements: [],
        errorMessage: 'فشل في تحديث نقاط العلاقة'
      };
    }

    // معالجة الإنجازات الخاصة
    const specialAchievements = await processSpecialAchievements(
      relation.id,
      activityType,
      updateResult.relation
    );

    return {
      success: true,
      pointsAwarded: pointsCalculation.totalPoints,
      relationUpdated: true,
      achievements: [...updateResult.achievements, ...specialAchievements]
    };

  } catch (error) {
    console.error('خطأ في معالجة نشاط الصديق الأفضل:', error);
    return {
      success: false,
      pointsAwarded: 0,
      relationUpdated: false,
      achievements: [],
      errorMessage: error instanceof Error ? error.message : 'خطأ غير معروف'
    };
  }
}

/**
 * حساب النقاط لنشاط معين
 */
async function calculateActivityPoints(
  activityType: BestFriendActivityType,
  interactionType?: InteractionType,
  relationId?: string,
  metadata: PointsCalculationMetadata = {},
  customPoints?: number
): Promise<{
  totalPoints: number;
  breakdown: any;
}> {
  // إذا كانت هناك نقاط مخصصة، استخدمها
  if (customPoints !== undefined) {
    return {
      totalPoints: customPoints,
      breakdown: { customPoints }
    };
  }

  // حساب النقاط بناء على نوع التفاعل
  if (interactionType) {
    const calculation = calculateBestFriendPoints(
      interactionType,
      '', // سيتم تمريرها في السياق
      '',
      metadata
    );
    
    return {
      totalPoints: calculation.user1Points,
      breakdown: calculation.breakdown
    };
  }

  // نقاط الأنشطة الخاصة
  const specialActivityPoints: Record<BestFriendActivityType, number> = {
    LIKE_POST: 1,
    COMMENT_POST: 3,
    SHARE_POST: 5,
    VIEW_VIDEO: 2,
    SAVE_POST: 2,
    REPLY_COMMENT: 2,
    MENTION: 3,
    TAG: 3,
    DIRECT_MESSAGE: 1,
    VIDEO_CALL: 10,
    VOICE_CALL: 8,
    STORY_VIEW: 1,
    STORY_REACT: 2,
    PROFILE_VISIT: 0.5,
    MUTUAL_ACTIVITY: 5,
    DAILY_STREAK: 5,
    WEEKLY_MILESTONE: 20,
    LEVEL_UP: 0, // لا يحصل على نقاط إضافية
    ACHIEVEMENT_UNLOCKED: 0
  };

  const basePoints = specialActivityPoints[activityType] || 0;

  // تطبيق العوامل المضاعفة من metadata
  let totalPoints = basePoints;
  
  if (metadata.reactionSpeed && metadata.reactionSpeed <= 60) {
    totalPoints *= 1.2; // مكافأة سرعة
  }
  
  if (metadata.isReciprocal) {
    totalPoints *= 1.3; // مكافأة التبادل
  }

  return {
    totalPoints: Math.round(totalPoints * 10) / 10, // تقريب لرقم عشري واحد
    breakdown: {
      basePoints,
      speedBonus: metadata.reactionSpeed ? totalPoints - basePoints : 0,
      reciprocalBonus: metadata.isReciprocal ? basePoints * 0.3 : 0
    }
  };
}

/**
 * إنشاء وصف للنشاط
 */
function generateActivityDescription(
  activityType: BestFriendActivityType,
  activityData: BestFriendActivityData
): string {
  const descriptions: Record<BestFriendActivityType, string> = {
    LIKE_POST: 'أعجب بمنشور',
    COMMENT_POST: 'علق على منشور',
    SHARE_POST: 'شارك منشور',
    VIEW_VIDEO: 'شاهد فيديو',
    SAVE_POST: 'حفظ منشور',
    REPLY_COMMENT: 'رد على تعليق',
    MENTION: 'ذكر في منشور',
    TAG: 'وسم في منشور',
    DIRECT_MESSAGE: 'أرسل رسالة مباشرة',
    VIDEO_CALL: 'بدأ مكالمة فيديو',
    VOICE_CALL: 'بدأ مكالمة صوتية',
    STORY_VIEW: 'شاهد قصة',
    STORY_REACT: 'تفاعل مع قصة',
    PROFILE_VISIT: 'زار الملف الشخصي',
    MUTUAL_ACTIVITY: 'نشاط متبادل',
    DAILY_STREAK: 'حقق سلسلة يومية',
    WEEKLY_MILESTONE: 'حقق إنجاز أسبوعي',
    LEVEL_UP: 'انتقل لمستوى أعلى',
    ACHIEVEMENT_UNLOCKED: 'فتح إنجاز جديد'
  };

  return descriptions[activityType] || 'نشاط غير معروف';
}

/**
 * معالجة الإنجازات الخاصة
 */
async function processSpecialAchievements(
  relationId: string,
  activityType: BestFriendActivityType,
  relation: any
): Promise<string[]> {
  const achievements: string[] = [];

  try {
    // إنجازات السلاسل اليومية
    if (await checkDailyStreak(relationId)) {
      achievements.push('DAILY_STREAK_7');
      
      // معالجة السلسلة اليومية كنشاط منفصل
      await processBestFriendActivity({
        user1Id: relation.user1Id,
        user2Id: relation.user2Id,
        activityType: 'DAILY_STREAK',
        customPoints: 5
      });
    }

    // إنجازات النشاط المكثف
    if (await checkIntensiveActivity(relationId)) {
      achievements.push('INTENSIVE_DAY');
    }

    // إنجازات التوازن
    if (checkBalancedPoints(relation)) {
      achievements.push('BALANCED_FRIENDSHIP');
    }

    // إنجازات السرعة
    if (activityType === 'LIKE_POST' || activityType === 'COMMENT_POST') {
      const quickResponses = await checkQuickResponses(relationId);
      if (quickResponses >= 5) {
        achievements.push('QUICK_RESPONDER');
      }
    }

    return achievements;
  } catch (error) {
    console.error('خطأ في معالجة الإنجازات الخاصة:', error);
    return achievements;
  }
}

/**
 * فحص السلسلة اليومية
 */
async function checkDailyStreak(relationId: string): Promise<boolean> {
  try {
    const { prisma } = await import('../prisma');
    
    // فحص آخر 7 أيام
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActivities = await prisma.bestFriendActivityLog.groupBy({
      by: ['createdAt'],
      where: {
        relationId,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: true
    });

    // فحص إذا كان هناك نشاط في كل يوم من آخر 7 أيام
    const uniqueDays = new Set(
      dailyActivities.map(activity => 
        activity.createdAt.toDateString()
      )
    );

    return uniqueDays.size >= 7;
  } catch (error) {
    console.error('خطأ في فحص السلسلة اليومية:', error);
    return false;
  }
}

/**
 * فحص النشاط المكثف
 */
async function checkIntensiveActivity(relationId: string): Promise<boolean> {
  try {
    const { prisma } = await import('../prisma');
    
    // فحص آخر 24 ساعة
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const todayActivities = await prisma.bestFriendActivityLog.count({
      where: {
        relationId,
        createdAt: {
          gte: oneDayAgo
        }
      }
    });

    return todayActivities >= 15; // 15 نشاط أو أكثر في يوم واحد
  } catch (error) {
    console.error('خطأ في فحص النشاط المكثف:', error);
    return false;
  }
}

/**
 * فحص توازن النقاط
 */
function checkBalancedPoints(relation: any): boolean {
  const difference = Math.abs(relation.user1Points - relation.user2Points);
  const average = (relation.user1Points + relation.user2Points) / 2;
  
  // إذا كان الفرق أقل من 20% من المتوسط
  return difference < (average * 0.2) && relation.totalPoints > 50;
}

/**
 * فحص الاستجابات السريعة
 */
async function checkQuickResponses(relationId: string): Promise<number> {
  try {
    const { prisma } = await import('../prisma');
    
    // فحص آخر 7 أيام للاستجابات السريعة
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const quickActivities = await prisma.bestFriendActivityLog.findMany({
      where: {
        relationId,
        createdAt: {
          gte: sevenDaysAgo
        },
        metadata: {
          path: ['reactionSpeed'],
          lt: 60 // أقل من 60 دقيقة
        }
      }
    });

    return quickActivities.length;
  } catch (error) {
    console.error('خطأ في فحص الاستجابات السريعة:', error);
    return 0;
  }
}

/**
 * معالجة تفاعل مع منشور
 */
export async function handlePostInteraction(
  userId: string,
  postId: string,
  interactionType: InteractionType,
  postAuthorId: string,
  metadata: PointsCalculationMetadata = {}
): Promise<ActivityProcessingResult> {
  // تحديد نوع النشاط بناء على نوع التفاعل
  let activityType: BestFriendActivityType;
  
  switch (interactionType) {
    case InteractionType.LIKE:
      activityType = 'LIKE_POST';
      break;
    case InteractionType.COMMENT:
      activityType = 'COMMENT_POST';
      break;
    case InteractionType.SHARE:
      activityType = 'SHARE_POST';
      break;
    case InteractionType.VIEW:
      activityType = 'VIEW_VIDEO';
      break;
    case InteractionType.SAVE:
      activityType = 'SAVE_POST';
      break;
    default:
      activityType = 'LIKE_POST';
  }

  return await processBestFriendActivity({
    user1Id: userId,
    user2Id: postAuthorId,
    activityType,
    interactionType,
    postId,
    metadata
  });
}

/**
 * معالجة رسالة مباشرة
 */
export async function handleDirectMessage(
  senderId: string,
  receiverId: string,
  messageId: string,
  metadata: PointsCalculationMetadata = {}
): Promise<ActivityProcessingResult> {
  return await processBestFriendActivity({
    user1Id: senderId,
    user2Id: receiverId,
    activityType: 'DIRECT_MESSAGE',
    messageId,
    metadata
  });
}

/**
 * معالجة مكالمة صوتية أو فيديو
 */
export async function handleCall(
  callerId: string,
  receiverId: string,
  callType: 'video' | 'voice',
  duration: number, // بالدقائق
  metadata: PointsCalculationMetadata = {}
): Promise<ActivityProcessingResult> {
  // حساب نقاط إضافية بناء على مدة المكالمة
  const durationBonus = Math.min(duration / 10, 5); // حد أقصى 5 نقاط إضافية
  
  return await processBestFriendActivity({
    user1Id: callerId,
    user2Id: receiverId,
    activityType: callType === 'video' ? 'VIDEO_CALL' : 'VOICE_CALL',
    customPoints: (callType === 'video' ? 10 : 8) + durationBonus,
    metadata: {
      ...metadata,
      callDuration: duration
    }
  });
}

/**
 * معالجة زيارة الملف الشخصي
 */
export async function handleProfileVisit(
  visitorId: string,
  profileOwnerId: string,
  metadata: PointsCalculationMetadata = {}
): Promise<ActivityProcessingResult> {
  return await processBestFriendActivity({
    user1Id: visitorId,
    user2Id: profileOwnerId,
    activityType: 'PROFILE_VISIT',
    metadata
  });
}

/**
 * دالة مساعدة لمعالجة عدة أنشطة دفعة واحدة
 */
export async function processBatchActivities(
  activities: BestFriendActivityData[]
): Promise<ActivityProcessingResult[]> {
  const results: ActivityProcessingResult[] = [];
  
  for (const activity of activities) {
    const result = await processBestFriendActivity(activity);
    results.push(result);
    
    // تأخير قصير لتجنب إرهاق قاعدة البيانات
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * الحصول على إحصائيات الأنشطة لعلاقة معينة
 */
export async function getRelationActivityStats(
  relationId: string,
  days: number = 7
): Promise<{
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByDay: Record<string, number>;
  topActiveHours: number[];
  averagePointsPerDay: number;
}> {
  try {
    const { prisma } = await import('../prisma');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await prisma.bestFriendActivityLog.findMany({
      where: {
        relationId,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // تجميع الإحصائيات
    const activitiesByType: Record<string, number> = {};
    const activitiesByDay: Record<string, number> = {};
    const hourCounts = new Array(24).fill(0);
    let totalPoints = 0;

    for (const activity of activities) {
      // نوع النشاط
      activitiesByType[activity.activityType] = 
        (activitiesByType[activity.activityType] || 0) + 1;
      
      // اليوم
      const dayKey = activity.createdAt.toDateString();
      activitiesByDay[dayKey] = (activitiesByDay[dayKey] || 0) + 1;
      
      // الساعة
      hourCounts[activity.createdAt.getHours()]++;
      
      // النقاط
      totalPoints += activity.pointsAwarded;
    }

    // أكثر الساعات نشاطاً
    const topActiveHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    return {
      totalActivities: activities.length,
      activitiesByType,
      activitiesByDay,
      topActiveHours,
      averagePointsPerDay: totalPoints / Math.max(days, 1)
    };

  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات الأنشطة:', error);
    return {
      totalActivities: 0,
      activitiesByType: {},
      activitiesByDay: {},
      topActiveHours: [],
      averagePointsPerDay: 0
    };
  }
}
