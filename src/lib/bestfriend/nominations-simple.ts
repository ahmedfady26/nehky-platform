/**
 * 🎪 نظام إدارة الترشيحات والموافقات - مبسط
 * 
 * يحتوي على آليات أساسية لإنشاء وإدارة ترشيحات الأصدقاء المثاليين
 */

import { prisma } from '../prisma'
import { 
  BestFriendStatus, 
  BestFriendRelation,
  User 
} from '@prisma/client'
import { 
  generateBestFriendRecommendations,
  BestFriendRecommendation 
} from './recommendations'

// ================== أنواع البيانات ==================

export interface BestFriendNomination {
  id: string
  nominatorId: string
  nomineeId: string
  status: BestFriendStatus
  endDate: Date
  createdAt: Date
  compatibilityScore?: number
  recommendationReason?: string
}

export interface NominationLimits {
  maxActiveNominations: number
  maxDailyNominations: number
  cooldownPeriodHours: number
  rejectionCooldownDays: number
  responseTimeoutDays: number
  maxBestFriends: number
}

export interface NominationResponse {
  success: boolean
  message: string
  nominationId?: string
  newRelationId?: string
  errors?: string[]
}

// ================== الإعدادات الافتراضية ==================

export const DEFAULT_NOMINATION_LIMITS: NominationLimits = {
  maxActiveNominations: 3,      // حد أقصى 3 ترشيحات نشطة
  maxDailyNominations: 1,       // ترشيح واحد يومياً
  cooldownPeriodHours: 24,      // فترة انتظار 24 ساعة
  rejectionCooldownDays: 30,    // فترة راحة شهر بعد الرفض
  responseTimeoutDays: 7,       // مهلة 7 أيام للاستجابة
  maxBestFriends: 3            // حد أقصى 3 أصدقاء مؤكدين
}

// ================== دوال مساعدة ==================

function getCurrentWeek(): string {
  const now = new Date()
  const year = now.getFullYear()
  const week = Math.ceil(((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

async function logActivity(userId: string, activityType: string, description: string, metadata?: any) {
  try {
    console.log(`[${new Date().toISOString()}] User ${userId}: ${activityType} - ${description}`, metadata)
  } catch (error) {
    console.error('خطأ في تسجيل النشاط:', error)
  }
}

// ================== دوال الترشيح ==================

/**
 * 🎯 إنشاء ترشيح جديد لأفضل صديق
 */
export async function createBestFriendNomination(
  nominatorId: string,
  nomineeId: string,
  limits: NominationLimits = DEFAULT_NOMINATION_LIMITS
): Promise<NominationResponse> {
  try {
    // فحص القيود الأساسية
    const limitCheck = await checkNominationLimits(nominatorId, nomineeId, limits)
    if (!limitCheck.canNominate) {
      return {
        success: false,
        message: limitCheck.reason || 'لا يمكن إرسال الترشيح في الوقت الحالي',
        errors: limitCheck.errors
      }
    }

    // حساب التوافق والحصول على تفاصيل الترشيح
    const recommendations = await generateBestFriendRecommendations(nominatorId, {
      maxRecommendationsPerUser: 10
    })
    
    const targetRecommendation = recommendations.find(r => r.recommendedUserId === nomineeId)
    
    // حساب تاريخ انتهاء الصلاحية
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + limits.responseTimeoutDays)

    // حساب أسبوع الترشيح
    const nominationWeek = getCurrentWeek()

    // إنشاء سجل الترشيح في قاعدة البيانات
    const nomination = await prisma.bestFriendRelation.create({
      data: {
        user1Id: nominatorId,
        user2Id: nomineeId,
        status: BestFriendStatus.PENDING,
        startDate: new Date(),
        endDate,
        nominatedBy: nominatorId,
        nominationWeek,
        compatibilityScore: targetRecommendation?.compatibilityScore || 0,
        isAutoNominated: false
      }
    })

    // تسجيل النشاط
    await logActivity(nominatorId, 'NOMINATION_SENT', `أرسل ترشيح صداقة إلى المستخدم ${nomineeId}`)
    await logActivity(nomineeId, 'NOMINATION_RECEIVED', `استلم ترشيح صداقة من المستخدم ${nominatorId}`)

    return {
      success: true,
      message: 'تم إرسال ترشيح الصداقة بنجاح! في انتظار الموافقة.',
      nominationId: nomination.id
    }

  } catch (error) {
    console.error('❌ خطأ في إنشاء الترشيح:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال الترشيح',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * ✅❌ معالجة استجابة المستخدم للترشيح (موافقة أو رفض)
 */
export async function processBestFriendResponse(
  nominationId: string,
  respondentId: string,
  response: 'ACCEPT' | 'REJECT',
  responseMessage?: string
): Promise<NominationResponse> {
  try {
    // البحث عن الترشيح
    const nomination = await prisma.bestFriendRelation.findFirst({
      where: {
        id: nominationId,
        user2Id: respondentId, // المستلم هو المجيب
        status: BestFriendStatus.PENDING
      },
      include: {
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } }
      }
    })

    if (!nomination) {
      return {
        success: false,
        message: 'لم يتم العثور على الترشيح أو أنه منتهي الصلاحية'
      }
    }

    // فحص انتهاء الصلاحية
    if (nomination.endDate && nomination.endDate < new Date()) {
      await handleExpiredNomination(nomination.id)
      return {
        success: false,
        message: 'انتهت صلاحية هذا الترشيح'
      }
    }

    if (response === 'ACCEPT') {
      // قبول الترشيح وإنشاء علاقة صداقة
      const updatedRelation = await prisma.bestFriendRelation.update({
        where: { id: nominationId },
        data: {
          status: BestFriendStatus.ACTIVE,
          startDate: new Date(),
          decidedAt: new Date(),
          approvedBy: respondentId
        }
      })

      // تسجيل الأنشطة
      await logActivity(nomination.user1Id, 'NOMINATION_ACCEPTED', `تم قبول ترشيح الصداقة من ${nomination.user2.username}`)
      await logActivity(nomination.user2Id, 'NOMINATION_ACCEPTED', `قبل ترشيح الصداقة من ${nomination.user1.username}`)

      return {
        success: true,
        message: 'تم قبول الترشيح بنجاح! أصبحتما أفضل أصدقاء.',
        nominationId: nomination.id,
        newRelationId: updatedRelation.id
      }

    } else if (response === 'REJECT') {
      // رفض الترشيح
      await prisma.bestFriendRelation.update({
        where: { id: nominationId },
        data: {
          status: BestFriendStatus.REJECTED,
          decidedAt: new Date()
        }
      })

      // تسجيل الأنشطة
      await logActivity(nomination.user1Id, 'NOMINATION_REJECTED', `تم رفض ترشيح الصداقة من ${nomination.user2.username}`)
      await logActivity(nomination.user2Id, 'NOMINATION_REJECTED', `رفض ترشيح الصداقة من ${nomination.user1.username}`)

      return {
        success: true,
        message: 'تم رفض الترشيح.',
        nominationId: nomination.id
      }
    }

    return {
      success: false,
      message: 'استجابة غير صالحة'
    }

  } catch (error) {
    console.error('❌ خطأ في معالجة الاستجابة:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء معالجة الاستجابة',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * ⚖️ فحص قيود الترشيح للمستخدم
 */
export async function checkNominationLimits(
  nominatorId: string,
  nomineeId: string,
  limits: NominationLimits = DEFAULT_NOMINATION_LIMITS
): Promise<{
  canNominate: boolean
  reason?: string
  errors?: string[]
}> {
  const errors: string[] = []

  try {
    // فحص 1: عدم ترشيح النفس
    if (nominatorId === nomineeId) {
      return {
        canNominate: false,
        reason: 'لا يمكن ترشيح نفسك كأفضل صديق',
        errors: ['SELF_NOMINATION']
      }
    }

    // فحص 2: وجود علاقة نشطة بالفعل
    const existingRelation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { 
            user1Id: nominatorId, 
            user2Id: nomineeId,
            status: { in: [BestFriendStatus.ACTIVE, BestFriendStatus.PENDING] }
          },
          { 
            user1Id: nomineeId, 
            user2Id: nominatorId,
            status: { in: [BestFriendStatus.ACTIVE, BestFriendStatus.PENDING] }
          }
        ]
      }
    })

    if (existingRelation) {
      if (existingRelation.status === BestFriendStatus.ACTIVE) {
        errors.push('ALREADY_BEST_FRIENDS')
        return {
          canNominate: false,
          reason: 'أنتما بالفعل أفضل أصدقاء',
          errors
        }
      } else if (existingRelation.status === BestFriendStatus.PENDING) {
        errors.push('PENDING_NOMINATION')
        return {
          canNominate: false,
          reason: 'يوجد ترشيح معلق بالفعل بينكما',
          errors
        }
      }
    }

    // فحص 3: فترة الراحة بعد الرفض
    const recentRejection = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: nominatorId, user2Id: nomineeId },
          { user1Id: nomineeId, user2Id: nominatorId }
        ],
        status: BestFriendStatus.REJECTED,
        updatedAt: {
          gte: new Date(Date.now() - (limits.rejectionCooldownDays * 24 * 60 * 60 * 1000))
        }
      }
    })

    if (recentRejection) {
      errors.push('REJECTION_COOLDOWN')
      return {
        canNominate: false,
        reason: `يجب الانتظار ${limits.rejectionCooldownDays} يوم بعد الرفض السابق`,
        errors
      }
    }

    // فحص 4: الحد اليومي للترشيحات
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayNominations = await prisma.bestFriendRelation.count({
      where: {
        user1Id: nominatorId,
        createdAt: { gte: todayStart }
      }
    })

    if (todayNominations >= limits.maxDailyNominations) {
      errors.push('DAILY_LIMIT_EXCEEDED')
      return {
        canNominate: false,
        reason: `تم تجاوز الحد اليومي للترشيحات (${limits.maxDailyNominations} يومياً)`,
        errors
      }
    }

    // فحص 5: الحد الأقصى للترشيحات النشطة
    const activeNominations = await prisma.bestFriendRelation.count({
      where: {
        user1Id: nominatorId,
        status: BestFriendStatus.PENDING
      }
    })

    if (activeNominations >= limits.maxActiveNominations) {
      errors.push('ACTIVE_NOMINATIONS_LIMIT')
      return {
        canNominate: false,
        reason: `الحد الأقصى للترشيحات المعلقة هو ${limits.maxActiveNominations}`,
        errors
      }
    }

    // فحص 6: الحد الأقصى للأصدقاء المؤكدين
    const currentBestFriends = await prisma.bestFriendRelation.count({
      where: {
        OR: [
          { user1Id: nominatorId, status: BestFriendStatus.ACTIVE },
          { user2Id: nominatorId, status: BestFriendStatus.ACTIVE }
        ]
      }
    })

    if (currentBestFriends >= limits.maxBestFriends) {
      errors.push('MAX_BEST_FRIENDS_LIMIT')
      return {
        canNominate: false,
        reason: `الحد الأقصى للأصدقاء المؤكدين هو ${limits.maxBestFriends}`,
        errors
      }
    }

    return { canNominate: true }

  } catch (error) {
    console.error('❌ خطأ في فحص قيود الترشيح:', error)
    return {
      canNominate: false,
      reason: 'حدث خطأ أثناء فحص القيود',
      errors: ['SYSTEM_ERROR']
    }
  }
}

/**
 * ⏰ معالجة الترشيحات المنتهية الصلاحية
 */
export async function handleExpiredNominations(): Promise<{
  processedCount: number
  errors: string[]
}> {
  try {
    const expiredNominations = await prisma.bestFriendRelation.findMany({
      where: {
        status: BestFriendStatus.PENDING,
        endDate: { lt: new Date() }
      }
    })

    const errors: string[] = []
    let processedCount = 0

    for (const nomination of expiredNominations) {
      try {
        await handleExpiredNomination(nomination.id)
        processedCount++
      } catch (error) {
        errors.push(`فشل في معالجة الترشيح ${nomination.id}: ${error}`)
      }
    }

    return { processedCount, errors }

  } catch (error) {
    console.error('❌ خطأ في معالجة الترشيحات المنتهية:', error)
    return {
      processedCount: 0,
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * ❌ معالجة ترشيح منتهي الصلاحية واحد
 */
async function handleExpiredNomination(nominationId: string): Promise<void> {
  await prisma.bestFriendRelation.update({
    where: { id: nominationId },
    data: {
      status: BestFriendStatus.EXPIRED,
      decidedAt: new Date()
    }
  })

  await logActivity('SYSTEM', 'NOMINATION_EXPIRED', `انتهت صلاحية الترشيح ${nominationId}`)
}

/**
 * 📊 الحصول على ترشيحات المستخدم النشطة
 */
export async function getUserActiveNominations(userId: string): Promise<{
  sent: BestFriendNomination[]
  received: BestFriendNomination[]
}> {
  try {
    const [sentNominations, receivedNominations] = await Promise.all([
      // الترشيحات المُرسلة
      prisma.bestFriendRelation.findMany({
        where: {
          user1Id: userId,
          status: BestFriendStatus.PENDING,
          endDate: { gt: new Date() }
        },
        include: {
          user2: {
            select: { 
              id: true, 
              username: true, 
              fullName: true, 
              profilePicture: true 
            }
          }
        }
      }),

      // الترشيحات المُستلمة
      prisma.bestFriendRelation.findMany({
        where: {
          user2Id: userId,
          status: BestFriendStatus.PENDING,
          endDate: { gt: new Date() }
        },
        include: {
          user1: {
            select: { 
              id: true, 
              username: true, 
              fullName: true, 
              profilePicture: true 
            }
          }
        }
      })
    ])

    const mapNomination = (nomination: any): BestFriendNomination => ({
      id: nomination.id,
      nominatorId: nomination.user1Id,
      nomineeId: nomination.user2Id,
      status: nomination.status,
      endDate: nomination.endDate,
      createdAt: nomination.createdAt,
      compatibilityScore: nomination.compatibilityScore,
      recommendationReason: 'توافق عالي في التفاعلات'
    })

    return {
      sent: sentNominations.map(mapNomination),
      received: receivedNominations.map(mapNomination)
    }

  } catch (error) {
    console.error('❌ خطأ في جلب الترشيحات:', error)
    return { sent: [], received: [] }
  }
}

/**
 * 📈 إحصائيات الترشيحات للمستخدم
 */
export async function getUserNominationStats(userId: string): Promise<{
  totalSent: number
  totalReceived: number
  acceptanceRate: number
  pendingCount: number
  expiredCount: number
  rejectedCount: number
}> {
  try {
    const [sentStats, receivedStats] = await Promise.all([
      prisma.bestFriendRelation.groupBy({
        by: ['status'],
        where: { user1Id: userId },
        _count: { status: true }
      }),
      prisma.bestFriendRelation.groupBy({
        by: ['status'],
        where: { user2Id: userId },
        _count: { status: true }
      })
    ])

    const getStat = (stats: any[], status: BestFriendStatus) => 
      stats.find(s => s.status === status)?._count?.status || 0

    const totalSent = sentStats.reduce((sum, stat) => sum + stat._count.status, 0)
    const totalReceived = receivedStats.reduce((sum, stat) => sum + stat._count.status, 0)
    
    const acceptedReceived = getStat(receivedStats, BestFriendStatus.ACTIVE)
    const acceptanceRate = totalReceived > 0 ? (acceptedReceived / totalReceived) * 100 : 0

    return {
      totalSent,
      totalReceived,
      acceptanceRate: Math.round(acceptanceRate * 100) / 100,
      pendingCount: getStat(sentStats, BestFriendStatus.PENDING) + getStat(receivedStats, BestFriendStatus.PENDING),
      expiredCount: getStat(sentStats, BestFriendStatus.EXPIRED) + getStat(receivedStats, BestFriendStatus.EXPIRED),
      rejectedCount: getStat(sentStats, BestFriendStatus.REJECTED) + getStat(receivedStats, BestFriendStatus.REJECTED)
    }

  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات الترشيحات:', error)
    return {
      totalSent: 0,
      totalReceived: 0,
      acceptanceRate: 0,
      pendingCount: 0,
      expiredCount: 0,
      rejectedCount: 0
    }
  }
}
