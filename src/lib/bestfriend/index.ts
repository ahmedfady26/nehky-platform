/**
 * 🌟 نظام الصديق الأفضل الكامل - Best Friend System
 * ملف الفهرس الرئيسي المحدث
 */

// تصدير دوال حساب النقاط
export {
  calculateBestFriendPoints,
  calculateRelationshipStrength,
  calculateProgressToNextLevel,
  analyzeRelationshipPerformance,
  calculateBasePoints,
  calculateSpeedBonus,
  calculateReciprocalBonus,
  calculateConsistencyBonus,
  calculateTimeBonus,
  calculateTopicBonus,
  BASE_POINTS,
  CONTENT_TYPE_MULTIPLIER,
  TIME_OF_DAY_MULTIPLIER,
  type PointsCalculationMetadata,
  type PointsCalculationResult,
  type RelationshipAnalysis
} from './points';

// تصدير دوال إدارة العلاقات
export {
  findActiveBestFriendRelation,
  createBestFriendRelation,
  updateBestFriendRelationPoints,
  getBestFriendRelationStats,
  getUserBestFriendRelations,
  endBestFriendRelation,
  updateBestFriendRelationStatus,
  type BestFriendRelationWithUsers,
  type RelationUpdateResult
} from './relations';

// تصدير دوال الأنشطة
export {
  processBestFriendActivity,
  handlePostInteraction,
  handleDirectMessage,
  handleCall,
  handleProfileVisit,
  processBatchActivities,
  getRelationActivityStats,
  type BestFriendActivityType,
  type BestFriendActivityData,
  type ActivityProcessingResult
} from './activities';

// تصدير نظام الترشيح الذكي
export {
  generateBestFriendRecommendations,
  analyzeUserCompatibility,
  calculateRecommendationScore,
  filterEligibleUsers,
  scheduleBestFriendRecommendations,
  getRecommendationSystemStats,
  type UserCompatibilityAnalysis,
  type BestFriendRecommendation,
  type RecommendationFilters
} from './recommendations';

// تصدير إدارة الترشيحات والموافقات
export {
  createBestFriendNomination,
  processBestFriendResponse,
  checkNominationLimits,
  handleExpiredNominations,
  getUserActiveNominations,
  getUserNominationStats,
  DEFAULT_NOMINATION_LIMITS,
  type BestFriendNomination,
  type NominationLimits,
  type NominationResponse
} from './nominations';

// تصدير نظام الجدولة الدورية
export {
  getBestFriendRecommendationCycle,
  calculateNextRecommendationDate,
  runWeeklyBestFriendRecommendations,
  trackRecommendationSchedule,
  getWeeklyRecommendationStats,
  updateScheduleConfig,
  SCHEDULE_CONFIG,
  type RecommendationCycle,
  type CycleSchedule,
  type WeeklyStats
} from './scheduler';

// دوال مساعدة شائعة
export class BestFriendService {
  /**
   * معالجة تفاعل مع منشور بشكل مبسط
   */
  static async processInteraction(
    userId: string,
    postAuthorId: string,
    interactionType: 'like' | 'comment' | 'share' | 'view' | 'save',
    metadata?: import('./points').PointsCalculationMetadata
  ) {
    const { handlePostInteraction } = await import('./activities');
    const { InteractionType } = await import('@prisma/client');
    
    const typeMapping = {
      like: InteractionType.LIKE,
      comment: InteractionType.COMMENT,
      share: InteractionType.SHARE,
      view: InteractionType.VIEW,
      save: InteractionType.SAVE
    };

    return await handlePostInteraction(
      userId,
      'unknown', // postId
      typeMapping[interactionType],
      postAuthorId,
      metadata || {}
    );
  }

  /**
   * الحصول على ملخص علاقة الصديق الأفضل
   */
  static async getRelationSummary(user1Id: string, user2Id: string) {
    const { findActiveBestFriendRelation, getBestFriendRelationStats } = 
      await import('./relations');
    
    const relation = await findActiveBestFriendRelation(user1Id, user2Id);
    if (!relation) return null;

    const stats = await getBestFriendRelationStats(relation.id);
    return stats;
  }

  /**
   * تحديث نقاط بسيط
   */
  static async addPoints(
    user1Id: string,
    user2Id: string,
    points: number,
    reason: string
  ) {
    const { findActiveBestFriendRelation, updateBestFriendRelationPoints } = 
      await import('./relations');
    
    const relation = await findActiveBestFriendRelation(user1Id, user2Id);
    if (!relation) return null;

    return await updateBestFriendRelationPoints(
      relation.id,
      user1Id,
      points,
      'MANUAL_POINTS',
      reason
    );
  }
}

// تصدير الخدمة الرئيسية
export default BestFriendService;
