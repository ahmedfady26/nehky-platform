/**
 * نظام احتساب النقاط بناءً على سرعة التفاعل مع المنشورات
 * Reaction Speed-Based Points System for ALL Users (Including Influencers)
 * 
 * المنطق:
 * - كلما كان التفاعل أسرع، كلما زادت النقاط
 * - يتم حساب الفرق الزمني بين نشر المحتوى والتفاعل معه
 * - يتم تطبيق معامل ضرب حسب سرعة التفاعل
 * - النقاط النهائية = النقاط الأساسية × معامل السرعة
 * - النظام يعمل مع جميع المستخدمين: العاديين وكبار المتابعين (المؤثرين)
 */

import { InteractionType, SpeedCategory } from '@prisma/client';

export interface ReactionSpeedConfig {
  basePoints: Record<InteractionType, number>;
  speedMultipliers: Record<SpeedCategory, number>;
  timeThresholds: {
    fastMinutes: number;     // خلال 15 دقيقة
    mediumMinutes: number;   // خلال ساعة
    slowMinutes: number;     // خلال 6 ساعات
  };
}

export const DEFAULT_REACTION_SPEED_CONFIG: ReactionSpeedConfig = {
  // النقاط الأساسية لكل نوع تفاعل
  basePoints: {
    LIKE: 1,
    COMMENT: 3,
    SHARE: 5,
    VIEW: 0.5,
    SAVE: 2,
  },
  
  // معاملات الضرب حسب سرعة التفاعل (حسب المتطلبات الجديدة)
  speedMultipliers: {
    FAST: 2.0,    // خلال 15 دقيقة: ×2.0
    MEDIUM: 1.5,  // خلال ساعة: ×1.5 
    SLOW: 1.2,    // خلال 6 ساعات: ×1.2
    // أكثر من 6 ساعات: ×1.0 (سيتم التعامل معه في المنطق)
  },
  
  // حدود الوقت لتصنيف السرعة (بالدقائق)
  timeThresholds: {
    fastMinutes: 15,     // خلال 15 دقيقة
    mediumMinutes: 60,   // خلال ساعة (60 دقيقة)
    slowMinutes: 360,    // خلال 6 ساعات (360 دقيقة)
  },
};

/**
 * تحديد فئة السرعة بناءً على الفرق الزمني
 * - خلال 15 دقيقة: FAST (×2.0)
 * - خلال ساعة: MEDIUM (×1.5) 
 * - خلال 6 ساعات: SLOW (×1.2)
 * - أكثر من 6 ساعات: معامل 1.0 (بدون تصنيف خاص)
 */
export function determineSpeedCategory(
  postCreatedAt: Date,
  interactionTime: Date,
  config: ReactionSpeedConfig = DEFAULT_REACTION_SPEED_CONFIG
): { speedCategory: SpeedCategory; multiplier: number } {
  const timeDiffMinutes = (interactionTime.getTime() - postCreatedAt.getTime()) / (1000 * 60);
  
  if (timeDiffMinutes <= config.timeThresholds.fastMinutes) {
    return { speedCategory: 'FAST', multiplier: 2.0 };
  } else if (timeDiffMinutes <= config.timeThresholds.mediumMinutes) {
    return { speedCategory: 'MEDIUM', multiplier: 1.5 };
  } else if (timeDiffMinutes <= config.timeThresholds.slowMinutes) {
    return { speedCategory: 'SLOW', multiplier: 1.2 };
  } else {
    // أكثر من 6 ساعات: ×1.0
    return { speedCategory: 'SLOW', multiplier: 1.0 };
  }
}

/**
 * حساب النقاط المعدلة بناءً على نوع التفاعل وسرعته
 */
export function calculateAdjustedPoints(
  interactionType: InteractionType,
  speedMultiplier: number,
  config: ReactionSpeedConfig = DEFAULT_REACTION_SPEED_CONFIG
): {
  basePoints: number;
  speedMultiplier: number;
  adjustedPoints: number;
} {
  const basePoints = config.basePoints[interactionType];
  const adjustedPoints = Math.round(basePoints * speedMultiplier);
  
  return {
    basePoints,
    speedMultiplier,
    adjustedPoints,
  };
}

/**
 * حساب النقاط الكاملة للتفاعل مع المنشور
 */
export function calculateInteractionScore(
  postCreatedAt: Date,
  interactionTime: Date,
  interactionType: InteractionType,
  config: ReactionSpeedConfig = DEFAULT_REACTION_SPEED_CONFIG
): {
  speedCategory: SpeedCategory;
  basePoints: number;
  speedMultiplier: number;
  adjustedPoints: number;
  timeDiffMinutes: number;
} {
  const timeDiffMinutes = (interactionTime.getTime() - postCreatedAt.getTime()) / (1000 * 60);
  const { speedCategory, multiplier } = determineSpeedCategory(postCreatedAt, interactionTime, config);
  const { basePoints, adjustedPoints } = calculateAdjustedPoints(
    interactionType,
    multiplier,
    config
  );
  
  return {
    speedCategory,
    basePoints,
    speedMultiplier: multiplier,
    adjustedPoints,
    timeDiffMinutes: Math.round(timeDiffMinutes * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * حساب نقاط متعددة للتفاعلات المختلفة
 */
export function calculateBulkInteractionScores(
  interactions: Array<{
    postCreatedAt: Date;
    interactionTime: Date;
    interactionType: InteractionType;
  }>,
  config: ReactionSpeedConfig = DEFAULT_REACTION_SPEED_CONFIG
): Array<{
  speedCategory: SpeedCategory;
  basePoints: number;
  speedMultiplier: number;
  adjustedPoints: number;
  timeDiffMinutes: number;
}> {
  return interactions.map(interaction =>
    calculateInteractionScore(
      interaction.postCreatedAt,
      interaction.interactionTime,
      interaction.interactionType,
      config
    )
  );
}

/**
 * إحصائيات سرعة التفاعل للمستخدم
 */
export interface UserReactionSpeedStats {
  totalInteractions: number;
  fastInteractions: number;
  mediumInteractions: number;
  slowInteractions: number;
  totalPoints: number;
  averageSpeedMultiplier: number;
  fastPercentage: number;
  mediumPercentage: number;
  slowPercentage: number;
}

/**
 * حساب إحصائيات سرعة التفاعل للمستخدم
 */
export function calculateUserSpeedStats(
  interactions: Array<{
    speedCategory: SpeedCategory;
    adjustedPoints: number;
    speedMultiplier: number;
  }>
): UserReactionSpeedStats {
  const total = interactions.length;
  
  if (total === 0) {
    return {
      totalInteractions: 0,
      fastInteractions: 0,
      mediumInteractions: 0,
      slowInteractions: 0,
      totalPoints: 0,
      averageSpeedMultiplier: 1.0,
      fastPercentage: 0,
      mediumPercentage: 0,
      slowPercentage: 0,
    };
  }
  
  const fastCount = interactions.filter(i => i.speedCategory === 'FAST').length;
  const mediumCount = interactions.filter(i => i.speedCategory === 'MEDIUM').length;
  const slowCount = interactions.filter(i => i.speedCategory === 'SLOW').length;
  
  const totalPoints = interactions.reduce((sum, i) => sum + i.adjustedPoints, 0);
  const averageSpeedMultiplier = interactions.reduce((sum, i) => sum + i.speedMultiplier, 0) / total;
  
  return {
    totalInteractions: total,
    fastInteractions: fastCount,
    mediumInteractions: mediumCount,
    slowInteractions: slowCount,
    totalPoints,
    averageSpeedMultiplier: Math.round(averageSpeedMultiplier * 100) / 100,
    fastPercentage: Math.round((fastCount / total) * 100),
    mediumPercentage: Math.round((mediumCount / total) * 100),
    slowPercentage: Math.round((slowCount / total) * 100),
  };
}

/**
 * مثال على الاستخدام
 */
export function getExampleUsage() {
  const postCreatedAt = new Date('2025-01-15T10:00:00Z');
  const fastInteraction = new Date('2025-01-15T10:10:00Z'); // 10 دقائق لاحقاً - سريع
  const mediumInteraction = new Date('2025-01-15T10:30:00Z'); // 30 دقيقة لاحقاً - متوسط
  const slowInteraction = new Date('2025-01-15T12:00:00Z'); // ساعتان لاحقاً - بطيء (لكن أقل من 6 ساعات)
  const verySlowInteraction = new Date('2025-01-15T17:00:00Z'); // 7 ساعات لاحقاً - بطيء جداً
  
  console.log('Fast Like (10 min):', calculateInteractionScore(postCreatedAt, fastInteraction, 'LIKE'));
  console.log('Medium Comment (30 min):', calculateInteractionScore(postCreatedAt, mediumInteraction, 'COMMENT'));
  console.log('Slow Share (2 hours):', calculateInteractionScore(postCreatedAt, slowInteraction, 'SHARE'));
  console.log('Very Slow Save (7 hours):', calculateInteractionScore(postCreatedAt, verySlowInteraction, 'SAVE'));
}
