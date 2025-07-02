/**
 * نظام حساب النقاط لعلاقات الأصدقاء المقربين
 * Best Friend Points Calculation System
 * 
 * هذا الملف يحتوي على دوال حساب النقاط التبادلية بين الأصدقاء المقربين
 * بناءً على أنواع التفاعلات المختلفة والعوامل المضاعفة
 */

import { InteractionType, RelationshipStrength } from '@prisma/client';

// تعريف أنواع البيانات
export interface PointsCalculationMetadata {
  reactionSpeed?: number; // الوقت بالدقائق منذ النشر
  isReciprocal?: boolean; // هل هو تفاعل متبادل
  topicSimilarity?: number; // مدى تشابه الموضوع (0-1)
  consecutiveDays?: number; // عدد الأيام المتتالية للنشاط
  timeOfDay?: 'peak' | 'normal' | 'off-peak'; // وقت النشاط
  contentType?: 'text' | 'image' | 'video' | 'audio'; // نوع المحتوى
  isFirstInteraction?: boolean; // هل هو أول تفاعل اليوم
  callDuration?: number; // مدة المكالمة بالدقائق
}

export interface PointsCalculationResult {
  user1Points: number; // النقاط للمستخدم الأول
  user2Points: number; // النقاط للمستخدم الثاني
  mutualPoints: number; // النقاط المتبادلة
  bonusPoints: number; // النقاط الإضافية
  multiplier: number; // المضاعف المطبق
  breakdown: {
    basePoints: number;
    speedBonus: number;
    reciprocalBonus: number;
    topicBonus: number;
    consistencyBonus: number;
    timeBonus: number;
    contentBonus: number;
  };
}

// جدول النقاط الأساسية لكل نوع تفاعل
const BASE_POINTS: Record<InteractionType, number> = {
  LIKE: 1,
  COMMENT: 3,
  SHARE: 5,
  VIEW: 0.5,
  SAVE: 2,
};

// نقاط إضافية للمحتوى حسب النوع
const CONTENT_TYPE_MULTIPLIER: Record<string, number> = {
  text: 1.0,
  image: 1.1,
  video: 1.3,
  audio: 1.2,
};

// مضاعفات وقت النشاط
const TIME_OF_DAY_MULTIPLIER: Record<string, number> = {
  peak: 1.0, // ساعات الذروة (عادية)
  normal: 1.1, // أوقات عادية
  'off-peak': 1.2, // خارج الذروة (مكافأة للنشاط في وقت هادئ)
};

/**
 * حساب النقاط الأساسية للتفاعل
 */
export function calculateBasePoints(
  interactionType: InteractionType,
  metadata: PointsCalculationMetadata = {}
): number {
  const basePoints = BASE_POINTS[interactionType] || 0;
  
  // تطبيق مضاعف نوع المحتوى
  const contentMultiplier = metadata.contentType 
    ? CONTENT_TYPE_MULTIPLIER[metadata.contentType] || 1.0
    : 1.0;
  
  return basePoints * contentMultiplier;
}

/**
 * حساب مكافأة سرعة التفاعل
 * كلما كان التفاعل أسرع، كلما زادت المكافأة
 */
export function calculateSpeedBonus(reactionSpeed?: number): number {
  if (!reactionSpeed) return 0;
  
  // المكافآت تقل تدريجياً مع الوقت
  if (reactionSpeed <= 5) return 2.0; // خلال 5 دقائق - مكافأة عالية
  if (reactionSpeed <= 15) return 1.5; // خلال ربع ساعة
  if (reactionSpeed <= 60) return 1.0; // خلال ساعة
  if (reactionSpeed <= 180) return 0.5; // خلال 3 ساعات
  
  return 0; // بعد 3 ساعات لا توجد مكافأة سرعة
}

/**
 * حساب مكافأة التفاعل المتبادل
 * عندما يتفاعل كلا الطرفين مع بعضهما
 */
export function calculateReciprocalBonus(
  isReciprocal: boolean = false,
  consecutiveDays: number = 0
): number {
  if (!isReciprocal) return 0;
  
  let bonus = 1.0; // مكافأة أساسية للتفاعل المتبادل
  
  // مكافأة إضافية للاستمرارية
  if (consecutiveDays >= 3) bonus += 0.5;
  if (consecutiveDays >= 7) bonus += 1.0;
  if (consecutiveDays >= 14) bonus += 1.5;
  
  return bonus;
}

/**
 * حساب مكافأة تشابه الموضوع
 * عندما يتفاعل الأصدقاء مع محتوى متشابه
 */
export function calculateTopicBonus(topicSimilarity?: number): number {
  if (!topicSimilarity || topicSimilarity < 0.5) return 0;
  
  // مكافأة تدريجية بناء على مدى التشابه
  return (topicSimilarity - 0.5) * 2; // 0 إلى 1 نقطة
}

/**
 * حساب مكافأة الاستمرارية
 * للنشاط المستمر عدة أيام متتالية
 */
export function calculateConsistencyBonus(consecutiveDays: number): number {
  if (consecutiveDays < 3) return 0;
  
  // مكافآت متدرجة للاستمرارية
  if (consecutiveDays >= 14) return 5.0; // أسبوعين
  if (consecutiveDays >= 7) return 3.0;  // أسبوع
  if (consecutiveDays >= 5) return 2.0;  // 5 أيام
  if (consecutiveDays >= 3) return 1.0;  // 3 أيام
  
  return 0;
}

/**
 * حساب مكافأة وقت النشاط
 */
export function calculateTimeBonus(
  timeOfDay?: 'peak' | 'normal' | 'off-peak',
  isFirstInteraction?: boolean
): number {
  let bonus = 0;
  
  // مكافأة وقت النشاط
  if (timeOfDay) {
    const multiplier = TIME_OF_DAY_MULTIPLIER[timeOfDay] || 1.0;
    bonus += (multiplier - 1.0) * 2; // تحويل المضاعف إلى نقاط
  }
  
  // مكافأة إضافية لأول تفاعل في اليوم
  if (isFirstInteraction) {
    bonus += 0.5;
  }
  
  return bonus;
}

/**
 * الدالة الرئيسية لحساب النقاط
 */
export function calculateBestFriendPoints(
  interactionType: InteractionType,
  user1Id: string,
  user2Id: string,
  metadata: PointsCalculationMetadata = {}
): PointsCalculationResult {
  // حساب النقاط الأساسية
  const basePoints = calculateBasePoints(interactionType, metadata);
  
  // حساب المكافآت المختلفة
  const speedBonus = calculateSpeedBonus(metadata.reactionSpeed);
  const reciprocalBonus = calculateReciprocalBonus(
    metadata.isReciprocal, 
    metadata.consecutiveDays
  );
  const topicBonus = calculateTopicBonus(metadata.topicSimilarity);
  const consistencyBonus = calculateConsistencyBonus(metadata.consecutiveDays || 0);
  const timeBonus = calculateTimeBonus(
    metadata.timeOfDay, 
    metadata.isFirstInteraction
  );
  
  // حساب إجمالي المكافآت
  const totalBonus = speedBonus + reciprocalBonus + topicBonus + 
                     consistencyBonus + timeBonus;
  
  // حساب المضاعف الإجمالي
  const multiplier = 1 + (totalBonus / basePoints);
  
  // حساب النقاط النهائية
  const finalPoints = basePoints + totalBonus;
  
  // توزيع النقاط
  // المستخدم المتفاعل يحصل على النقاط الكاملة
  // الطرف الآخر يحصل على نقاط أقل (لتشجيع التفاعل المتبادل)
  const user1Points = finalPoints; // المتفاعل
  const user2Points = metadata.isReciprocal ? finalPoints * 0.8 : finalPoints * 0.3;
  const mutualPoints = metadata.isReciprocal ? finalPoints * 0.5 : 0;
  
  return {
    user1Points,
    user2Points,
    mutualPoints,
    bonusPoints: totalBonus,
    multiplier,
    breakdown: {
      basePoints,
      speedBonus,
      reciprocalBonus,
      topicBonus,
      consistencyBonus,
      timeBonus,
      contentBonus: 0, // سيتم حسابه من basePoints
    },
  };
}

/**
 * حساب قوة العلاقة بناء على إجمالي النقاط
 */
export function calculateRelationshipStrength(totalPoints: number): RelationshipStrength {
  if (totalPoints >= 91) return RelationshipStrength.VERY_STRONG;
  if (totalPoints >= 61) return RelationshipStrength.STRONG;
  if (totalPoints >= 31) return RelationshipStrength.MODERATE;
  return RelationshipStrength.WEAK;
}

/**
 * حساب نسبة التقدم إلى المستوى التالي
 */
export function calculateProgressToNextLevel(totalPoints: number): {
  currentLevel: RelationshipStrength;
  nextLevel: RelationshipStrength | null;
  progressPercentage: number;
  pointsToNext: number;
} {
  const currentLevel = calculateRelationshipStrength(totalPoints);
  
  let nextLevel: RelationshipStrength | null = null;
  let pointsToNext = 0;
  let progressPercentage = 0;
  
  switch (currentLevel) {
    case RelationshipStrength.WEAK:
      nextLevel = RelationshipStrength.MODERATE;
      pointsToNext = 31 - totalPoints;
      progressPercentage = (totalPoints / 31) * 100;
      break;
    case RelationshipStrength.MODERATE:
      nextLevel = RelationshipStrength.STRONG;
      pointsToNext = 61 - totalPoints;
      progressPercentage = ((totalPoints - 30) / 31) * 100;
      break;
    case RelationshipStrength.STRONG:
      nextLevel = RelationshipStrength.VERY_STRONG;
      pointsToNext = 91 - totalPoints;
      progressPercentage = ((totalPoints - 60) / 31) * 100;
      break;
    case RelationshipStrength.VERY_STRONG:
      nextLevel = null;
      pointsToNext = 0;
      progressPercentage = 100;
      break;
  }
  
  return {
    currentLevel,
    nextLevel,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    pointsToNext: Math.max(0, pointsToNext),
  };
}

/**
 * تحليل أداء العلاقة
 */
export interface RelationshipAnalysis {
  averagePointsPerDay: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  mostActiveTime: string;
  reciprocityRate: number;
  consistencyScore: number;
  projectedLevelUp?: {
    daysToNext: number;
    requiredDailyPoints: number;
  };
}

/**
 * تحليل بيانات العلاقة لفهم الأداء والاتجاهات
 */
export function analyzeRelationshipPerformance(
  totalPoints: number,
  activityHistory: Array<{
    date: Date;
    points: number;
    isReciprocal: boolean;
    timeOfDay: number; // ساعة من 0-23
  }>
): RelationshipAnalysis {
  if (activityHistory.length === 0) {
    return {
      averagePointsPerDay: 0,
      trend: 'stable',
      mostActiveTime: '12:00',
      reciprocityRate: 0,
      consistencyScore: 0,
    };
  }
  
  // حساب متوسط النقاط اليومية
  const totalDays = Math.max(1, activityHistory.length);
  const averagePointsPerDay = totalPoints / totalDays;
  
  // تحليل الاتجاه (الأسبوع الأخير مقارنة بما قبله)
  const recentActivities = activityHistory.slice(-7);
  const previousActivities = activityHistory.slice(-14, -7);
  
  const recentAverage = recentActivities.reduce((sum, a) => sum + a.points, 0) / Math.max(1, recentActivities.length);
  const previousAverage = previousActivities.reduce((sum, a) => sum + a.points, 0) / Math.max(1, previousActivities.length);
  
  let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (recentAverage > previousAverage * 1.1) trend = 'increasing';
  else if (recentAverage < previousAverage * 0.9) trend = 'decreasing';
  
  // العثور على أكثر الأوقات نشاطاً
  const hourCounts = new Array(24).fill(0);
  activityHistory.forEach(activity => {
    hourCounts[activity.timeOfDay]++;
  });
  const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts));
  const mostActiveTime = `${mostActiveHour.toString().padStart(2, '0')}:00`;
  
  // حساب معدل التبادل
  const reciprocalActivities = activityHistory.filter(a => a.isReciprocal).length;
  const reciprocityRate = reciprocalActivities / activityHistory.length;
  
  // حساب درجة الاستمرارية (بناء على توزيع الأنشطة)
  const consistencyScore = Math.min(100, (activityHistory.length / 30) * 100); // 30 يوم كمرجع
  
  // توقع الوقت للوصول للمستوى التالي
  const progress = calculateProgressToNextLevel(totalPoints);
  let projectedLevelUp;
  
  if (progress.nextLevel && averagePointsPerDay > 0) {
    const daysToNext = Math.ceil(progress.pointsToNext / averagePointsPerDay);
    projectedLevelUp = {
      daysToNext,
      requiredDailyPoints: averagePointsPerDay,
    };
  }
  
  return {
    averagePointsPerDay,
    trend,
    mostActiveTime,
    reciprocityRate,
    consistencyScore,
    projectedLevelUp,
  };
}

// تصدير الثوابت للاستخدام في أماكن أخرى
export { BASE_POINTS, CONTENT_TYPE_MULTIPLIER, TIME_OF_DAY_MULTIPLIER };
