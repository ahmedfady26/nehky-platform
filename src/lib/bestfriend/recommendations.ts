/**
 * 🎯 نظام الترشيح الذكي للأصدقاء المثاليين
 * 
 * يحتوي على خوارزميات متقدمة لتحليل التوافق بين المستخدمين
 * وإنشاء ترشيحات ذكية بناءً على التفاعلات والنقاط المتبادلة
 */

import { prisma } from '../prisma'
import { 
  BestFriendStatus, 
  RelationshipStrength,
  User,
  BestFriendRelation,
  InteractionType 
} from '@prisma/client'
import { 
  calculateRelationshipStrength,
  analyzeRelationshipPerformance 
} from './points'

// ================== أنواع البيانات ==================

export interface UserCompatibilityAnalysis {
  userId: string
  targetUserId: string
  compatibilityScore: number
  mutualPoints: number
  interactionFrequency: number
  interactionDiversity: number
  timingConsistency: number
  relationshipDuration: number
  strengthLevel: RelationshipStrength
  recommendationPriority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_RECOMMENDED'
  reasonsForRecommendation: string[]
  potentialConcerns: string[]
}

export interface BestFriendRecommendation {
  forUserId: string
  recommendedUserId: string
  compatibilityScore: number
  estimatedStrength: RelationshipStrength
  recommendationReason: string
  expectedMutualBenefit: number
  confidence: number
  validUntil: Date
}

export interface RecommendationFilters {
  minCompatibilityScore?: number
  excludeRecentlyRejected?: boolean
  excludeCurrentBestFriends?: boolean
  maxRecommendationsPerUser?: number
  requireMutualInteraction?: boolean
}

// ================== دوال التحليل الأساسية ==================

/**
 * 🧮 حساب النقاط المتبادلة من التفاعلات
 */
function calculateMutualPointsFromInteractions(
  interactions: any[],
  userId: string,
  targetUserId: string
): number {
  let totalPoints = 0
  
  for (const interaction of interactions) {
    // تحديد إذا كان التفاعل متبادل
    const isUserInteraction = interaction.userId === userId && interaction.post?.userId === targetUserId
    const isTargetInteraction = interaction.userId === targetUserId && interaction.post?.userId === userId
    
    if (isUserInteraction || isTargetInteraction) {
      // استخدام نظام النقاط الأساسي
      switch (interaction.type) {
        case 'LIKE':
          totalPoints += 1
          break
        case 'COMMENT':
          totalPoints += 3
          break
        case 'SHARE':
          totalPoints += 5
          break
        case 'VIEW':
          totalPoints += 0.5
          break
        case 'SAVE':
          totalPoints += 2
          break
        default:
          totalPoints += 1
      }
    }
  }
  
  return totalPoints
}

/**
 * 🔍 تحليل التوافق بين مستخدمين
 */
export async function analyzeUserCompatibility(
  userId: string,
  targetUserId: string
): Promise<UserCompatibilityAnalysis> {
  try {
    // جلب بيانات التفاعل بين المستخدمين
    const interactions = await prisma.interaction.findMany({
      where: {
        OR: [
          { 
            AND: [
              { userId },
              { post: { userId: targetUserId } }
            ]
          },
          { 
            AND: [
              { userId: targetUserId },
              { post: { userId } }
            ]
          }
        ]
      },
      include: {
        post: {
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // آخر 1000 تفاعل
    })

    // حساب النقاط المتبادلة بناءً على التفاعلات
    const mutualPoints = calculateMutualPointsFromInteractions(interactions, userId, targetUserId)
    
    // تحليل تكرار التفاعل
    const interactionFrequency = calculateInteractionFrequency(interactions)
    
    // تحليل تنوع التفاعل
    const interactionDiversity = calculateInteractionDiversity(interactions)
    
    // تحليل ثبات التوقيت
    const timingConsistency = calculateTimingConsistency(interactions)
    
    // حساب مدة العلاقة
    const relationshipDuration = calculateRelationshipDuration(interactions)
    
    // تحديد قوة العلاقة
    const strengthLevel = calculateRelationshipStrength(mutualPoints)
    
    // حساب نقاط التوافق الإجمالية
    const compatibilityScore = calculateCompatibilityScore({
      mutualPoints,
      interactionFrequency,
      interactionDiversity,
      timingConsistency,
      relationshipDuration
    })
    
    // تحديد أولوية الترشيح
    const recommendationPriority = determineRecommendationPriority(compatibilityScore)
    
    // تحليل أسباب الترشيح والمخاوف المحتملة
    const analysisResults = generateRecommendationAnalysis({
      compatibilityScore,
      mutualPoints,
      interactionFrequency,
      interactionDiversity,
      strengthLevel
    })

    return {
      userId,
      targetUserId,
      compatibilityScore,
      mutualPoints,
      interactionFrequency,
      interactionDiversity,
      timingConsistency,
      relationshipDuration,
      strengthLevel,
      recommendationPriority,
      reasonsForRecommendation: analysisResults.reasons,
      potentialConcerns: analysisResults.concerns
    }
  } catch (error) {
    console.error('❌ خطأ في تحليل التوافق:', error)
    throw new Error('فشل في تحليل التوافق بين المستخدمين')
  }
}

/**
 * 📊 حساب تكرار التفاعل (معدل التفاعلات اليومية)
 */
function calculateInteractionFrequency(interactions: any[]): number {
  if (interactions.length === 0) return 0
  
  const firstInteraction = new Date(interactions[interactions.length - 1].createdAt)
  const lastInteraction = new Date(interactions[0].createdAt)
  const daysDifference = Math.max(1, Math.ceil((lastInteraction.getTime() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24)))
  
  return interactions.length / daysDifference
}

/**
 * 🎨 حساب تنوع التفاعل (عدد أنواع التفاعلات المختلفة)
 */
function calculateInteractionDiversity(interactions: any[]): number {
  if (interactions.length === 0) return 0
  
  const uniqueTypes = new Set(interactions.map(i => i.type))
  const diversityScore = (uniqueTypes.size / Object.keys(InteractionType).length) * 100
  
  return Math.min(100, diversityScore)
}

/**
 * ⏰ حساب ثبات التوقيت (انتظام التفاعل عبر أوقات مختلفة)
 */
function calculateTimingConsistency(interactions: any[]): number {
  if (interactions.length < 10) return 0
  
  const hourDistribution = new Array(24).fill(0)
  
  interactions.forEach(interaction => {
    const hour = new Date(interaction.createdAt).getHours()
    hourDistribution[hour]++
  })
  
  // حساب الانحراف المعياري للتوزيع الزمني
  const mean = interactions.length / 24
  const variance = hourDistribution.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / 24
  const standardDeviation = Math.sqrt(variance)
  
  // كلما قل الانحراف المعياري، زاد ثبات التوقيت
  return Math.max(0, 100 - (standardDeviation * 10))
}

/**
 * 📅 حساب مدة العلاقة (بالأيام)
 */
function calculateRelationshipDuration(interactions: any[]): number {
  if (interactions.length === 0) return 0
  
  const firstInteraction = new Date(interactions[interactions.length - 1].createdAt)
  const lastInteraction = new Date(interactions[0].createdAt)
  
  return Math.ceil((lastInteraction.getTime() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * 🧮 حساب نقاط التوافق الإجمالية
 */
function calculateCompatibilityScore(factors: {
  mutualPoints: number
  interactionFrequency: number
  interactionDiversity: number
  timingConsistency: number
  relationshipDuration: number
}): number {
  const {
    mutualPoints,
    interactionFrequency,
    interactionDiversity,
    timingConsistency,
    relationshipDuration
  } = factors

  // الأوزان النسبية لكل عامل
  const weights = {
    mutualPoints: 0.40,       // 40% - الأهم
    interactionFrequency: 0.25, // 25%
    interactionDiversity: 0.20, // 20%
    timingConsistency: 0.10,    // 10%
    relationshipDuration: 0.05  // 5%
  }

  // تطبيع النقاط لتكون من 0-100
  const normalizedMutualPoints = Math.min(100, (mutualPoints / 200) * 100)
  const normalizedFrequency = Math.min(100, interactionFrequency * 10)
  const normalizedDuration = Math.min(100, (relationshipDuration / 365) * 100)

  const score = 
    (normalizedMutualPoints * weights.mutualPoints) +
    (normalizedFrequency * weights.interactionFrequency) +
    (interactionDiversity * weights.interactionDiversity) +
    (timingConsistency * weights.timingConsistency) +
    (normalizedDuration * weights.relationshipDuration)

  return Math.round(score * 100) / 100 // تقريب لرقمين عشريين
}

/**
 * 🎯 تحديد أولوية الترشيح
 */
function determineRecommendationPriority(compatibilityScore: number): 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_RECOMMENDED' {
  if (compatibilityScore >= 90) return 'HIGH'
  if (compatibilityScore >= 80) return 'MEDIUM'
  if (compatibilityScore >= 70) return 'LOW'
  return 'NOT_RECOMMENDED'
}

/**
 * 📝 إنشاء تحليل أسباب الترشيح والمخاوف
 */
function generateRecommendationAnalysis(data: {
  compatibilityScore: number
  mutualPoints: number
  interactionFrequency: number
  interactionDiversity: number
  strengthLevel: RelationshipStrength
}): { reasons: string[], concerns: string[] } {
  const reasons: string[] = []
  const concerns: string[] = []

  // أسباب إيجابية للترشيح
  if (data.mutualPoints > 100) {
    reasons.push(`نقاط متبادلة عالية (${data.mutualPoints} نقطة)`)
  }
  if (data.interactionFrequency > 2) {
    reasons.push(`تفاعل يومي نشط (${data.interactionFrequency.toFixed(1)} تفاعل/يوم)`)
  }
  if (data.interactionDiversity > 70) {
    reasons.push(`تنوع عالي في التفاعلات (${data.interactionDiversity.toFixed(1)}%)`)
  }
  if (data.strengthLevel === 'VERY_STRONG') {
    reasons.push('علاقة قوية جداً تستحق التأكيد كأفضل صديق')
  }

  // مخاوف محتملة
  if (data.mutualPoints < 30) {
    concerns.push('تفاعل محدود قد يتطلب المزيد من الوقت')
  }
  if (data.interactionFrequency < 0.5) {
    concerns.push('تفاعل نادر قد يشير إلى عدم الاهتمام المتبادل')
  }
  if (data.interactionDiversity < 30) {
    concerns.push('تفاعل محدود النوع قد يقلل من قوة العلاقة')
  }

  return { reasons, concerns }
}

// ================== دوال الترشيح المتقدمة ==================

/**
 * 🚀 إنشاء قائمة ترشيحات للمستخدم
 */
export async function generateBestFriendRecommendations(
  userId: string,
  filters: RecommendationFilters = {}
): Promise<BestFriendRecommendation[]> {
  try {
    // الحصول على المستخدمين المؤهلين
    const eligibleUsers = await filterEligibleUsers(userId, filters)
    
    const recommendations: BestFriendRecommendation[] = []
    
    for (const targetUser of eligibleUsers) {
      // تحليل التوافق
      const compatibility = await analyzeUserCompatibility(userId, targetUser.id)
      
      // تخطي إذا كان التوافق منخفض
      if (compatibility.recommendationPriority === 'NOT_RECOMMENDED') {
        continue
      }
      
      // إنشاء ترشيح
      const recommendation: BestFriendRecommendation = {
        forUserId: userId,
        recommendedUserId: targetUser.id,
        compatibilityScore: compatibility.compatibilityScore,
        estimatedStrength: compatibility.strengthLevel,
        recommendationReason: compatibility.reasonsForRecommendation.join(' • '),
        expectedMutualBenefit: calculateMutualBenefit(compatibility),
        confidence: calculateRecommendationConfidence(compatibility),
        validUntil: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // صالح لأسبوع
      }
      
      recommendations.push(recommendation)
    }
    
    // ترتيب حسب نقاط التوافق
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    
    // تحديد العدد الأقصى
    const maxRecommendations = filters.maxRecommendationsPerUser || 3
    return recommendations.slice(0, maxRecommendations)
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء الترشيحات:', error)
    throw new Error('فشل في إنشاء ترشيحات الأصدقاء')
  }
}

/**
 * 🔍 تصفية المستخدمين المؤهلين للترشيح
 */
export async function filterEligibleUsers(
  userId: string,
  filters: RecommendationFilters
): Promise<User[]> {
  const whereConditions: any = {
    id: { not: userId }, // استبعاد المستخدم نفسه
    isActive: true,       // المستخدمين النشطين فقط
  }

  // استبعاد الأصدقاء الحاليين
  if (filters.excludeCurrentBestFriends !== false) {
    const currentBestFriends = await prisma.bestFriendRelation.findMany({
      where: {
        OR: [
          { user1Id: userId, status: BestFriendStatus.ACTIVE },
          { user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      },
      select: { user1Id: true, user2Id: true }
    })
    
    const friendIds = currentBestFriends.flatMap(rel => 
      rel.user1Id === userId ? [rel.user2Id] : [rel.user1Id]
    )
    
    if (friendIds.length > 0) {
      whereConditions.id = { 
        ...whereConditions.id,
        notIn: friendIds 
      }
    }
  }

  // استبعاد المرفوضين مؤخراً
  if (filters.excludeRecentlyRejected !== false) {
    const recentlyRejected = await prisma.bestFriendRelation.findMany({
      where: {
        OR: [
          { user1Id: userId, status: BestFriendStatus.REJECTED },
          { user2Id: userId, status: BestFriendStatus.REJECTED }
        ],
        updatedAt: {
          gte: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)) // آخر 30 يوم
        }
      },
      select: { user1Id: true, user2Id: true }
    })
    
    const rejectedIds = recentlyRejected.flatMap(rel => 
      rel.user1Id === userId ? [rel.user2Id] : [rel.user1Id]
    )
    
    if (rejectedIds.length > 0) {
      whereConditions.id = { 
        ...whereConditions.id,
        notIn: [...(whereConditions.id.notIn || []), ...rejectedIds]
      }
    }
  }

  return await prisma.user.findMany({
    where: whereConditions,
    take: 50, // حد أقصى للفحص
    orderBy: { lastActivity: 'desc' }
  })
}

/**
 * 💰 حساب الفائدة المتبادلة المتوقعة
 */
function calculateMutualBenefit(compatibility: UserCompatibilityAnalysis): number {
  const baseBenefit = compatibility.compatibilityScore
  const strengthBonus = compatibility.strengthLevel === 'VERY_STRONG' ? 20 : 
                       compatibility.strengthLevel === 'STRONG' ? 15 :
                       compatibility.strengthLevel === 'MODERATE' ? 10 : 5
  
  return Math.min(100, baseBenefit + strengthBonus)
}

/**
 * 🎯 حساب ثقة الترشيح
 */
function calculateRecommendationConfidence(compatibility: UserCompatibilityAnalysis): number {
  let confidence = compatibility.compatibilityScore
  
  // زيادة الثقة بناءً على عوامل إضافية
  if (compatibility.interactionFrequency > 1) confidence += 5
  if (compatibility.interactionDiversity > 50) confidence += 5
  if (compatibility.relationshipDuration > 30) confidence += 10
  
  return Math.min(100, confidence)
}

/**
 * 📊 حساب نقاط الترشيح لمستخدم محدد
 */
export async function calculateRecommendationScore(
  userId: string,
  targetUserId: string
): Promise<number> {
  const compatibility = await analyzeUserCompatibility(userId, targetUserId)
  return compatibility.compatibilityScore
}

/**
 * 🔄 جدولة الترشيحات الدورية (كل أسبوعين)
 */
export async function scheduleBestFriendRecommendations(): Promise<{
  processedUsers: number
  totalRecommendations: number
  errors: string[]
}> {
  try {
    const activeUsers = await prisma.user.findMany({
      where: { 
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)) // نشطين في آخر أسبوع
        }
      },
      select: { id: true }
    })

    let processedUsers = 0
    let totalRecommendations = 0
    const errors: string[] = []

    for (const user of activeUsers) {
      try {
        const recommendations = await generateBestFriendRecommendations(user.id, {
          maxRecommendationsPerUser: 2,
          excludeCurrentBestFriends: true,
          excludeRecentlyRejected: true
        })
        
        totalRecommendations += recommendations.length
        processedUsers++
        
        // يمكن هنا إرسال إشعارات للمستخدمين
        // await sendRecommendationNotifications(user.id, recommendations)
        
      } catch (error) {
        errors.push(`فشل في معالجة المستخدم ${user.id}: ${error}`)
      }
    }

    return {
      processedUsers,
      totalRecommendations,
      errors
    }
    
  } catch (error) {
    console.error('❌ خطأ في جدولة الترشيحات:', error)
    throw new Error('فشل في تشغيل دورة الترشيحات الدورية')
  }
}

// ================== دوال المساعدة ==================

/**
 * 📈 إحصائيات نظام الترشيح
 */
export async function getRecommendationSystemStats(): Promise<{
  totalActiveUsers: number
  avgCompatibilityScore: number
  mostActiveHours: number[]
  strengthDistribution: Record<RelationshipStrength, number>
}> {
  // يمكن تطوير هذه الدالة لإرجاع إحصائيات مفيدة
  return {
    totalActiveUsers: 0,
    avgCompatibilityScore: 0,
    mostActiveHours: [],
    strengthDistribution: {
      WEAK: 0,
      MODERATE: 0,
      STRONG: 0,
      VERY_STRONG: 0
    }
  }
}
