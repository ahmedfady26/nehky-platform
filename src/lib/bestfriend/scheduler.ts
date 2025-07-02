/**
 * ⏰ نظام جدولة الترشيحات الدورية
 * 
 * يحتوي على آليات إدارة دورات الترشيح الأسبوعية، حساب المواعيد،
 * تشغيل الترشيحات التلقائية، وتتبع جداول الترشيحات
 */

import { prisma } from '../prisma'
import { BestFriendStatus } from '@prisma/client'
import { 
  generateBestFriendRecommendations, 
  scheduleBestFriendRecommendations 
} from './recommendations'
import { 
  createBestFriendNomination, 
  handleExpiredNominations,
  DEFAULT_NOMINATION_LIMITS 
} from './nominations'

// ================== أنواع البيانات ==================

export interface RecommendationCycle {
  id: string
  weekNumber: string
  startDate: Date
  endDate: Date
  isActive: boolean
  totalUsers: number
  processedUsers: number
  totalRecommendations: number
  successfulNominations: number
  errors: string[]
  completedAt?: Date
}

export interface CycleSchedule {
  currentCycle: RecommendationCycle | null
  nextCycleDate: Date
  isScheduleActive: boolean
  cyclesCompleted: number
  lastCycleSuccess: boolean
}

export interface WeeklyStats {
  week: string
  activeNominations: number
  acceptedNominations: number
  rejectedNominations: number
  expiredNominations: number
  averageResponseTime: number // بالساعات
  topCompatibilityScore: number
}

// ================== إعدادات الجدولة ==================

export const SCHEDULE_CONFIG = {
  cycleDurationDays: 14,        // دورة كل أسبوعين
  cycleStartHour: 9,           // بداية الدورة الساعة 9 صباحاً
  maxUsersPerBatch: 50,        // معالجة 50 مستخدم في كل دفعة
  batchDelayMs: 1000,          // تأخير ثانية واحدة بين الدفعات
  maxRetriesPerUser: 3,        // عدد المحاولات القصوى لكل مستخدم
  enableAutoNominations: true  // تفعيل الترشيحات التلقائية
}

// ================== دوال الجدولة الأساسية ==================

/**
 * 📅 الحصول على دورة الترشيح الحالية
 */
export async function getBestFriendRecommendationCycle(): Promise<CycleSchedule> {
  try {
    const currentWeek = getCurrentWeek()
    
    // البحث عن الدورة الحالية
    const currentCycle = await findOrCreateCurrentCycle(currentWeek)
    
    // حساب موعد الدورة التالية
    const nextCycleDate = calculateNextRecommendationDate()
    
    // احصائيات الدورات المكتملة
    const completedCycles = await prisma.bestFriendRelation.groupBy({
      by: ['nominationWeek'],
      where: {
        nominationWeek: { not: currentWeek }
      },
      _count: { nominationWeek: true }
    })
    
    // تحديد نجاح آخر دورة
    const lastCycleSuccess = await checkLastCycleSuccess()

    return {
      currentCycle,
      nextCycleDate,
      isScheduleActive: SCHEDULE_CONFIG.enableAutoNominations,
      cyclesCompleted: completedCycles.length,
      lastCycleSuccess
    }

  } catch (error) {
    console.error('❌ خطأ في جلب دورة الترشيح:', error)
    return {
      currentCycle: null,
      nextCycleDate: new Date(Date.now() + (SCHEDULE_CONFIG.cycleDurationDays * 24 * 60 * 60 * 1000)),
      isScheduleActive: false,
      cyclesCompleted: 0,
      lastCycleSuccess: false
    }
  }
}

/**
 * 📊 إنشاء أو جلب الدورة الحالية
 */
async function findOrCreateCurrentCycle(weekNumber: string): Promise<RecommendationCycle> {
  // محاولة العثور على الدورة الحالية من قاعدة البيانات
  const existingNominations = await prisma.bestFriendRelation.count({
    where: { nominationWeek: weekNumber }
  })

  // إنشاء دورة افتراضية
  const cycleStart = getWeekStartDate(weekNumber)
  const cycleEnd = new Date(cycleStart.getTime() + (SCHEDULE_CONFIG.cycleDurationDays * 24 * 60 * 60 * 1000))
  
  return {
    id: `cycle-${weekNumber}`,
    weekNumber,
    startDate: cycleStart,
    endDate: cycleEnd,
    isActive: cycleEnd > new Date(),
    totalUsers: 0,
    processedUsers: 0,
    totalRecommendations: existingNominations,
    successfulNominations: 0,
    errors: [],
    completedAt: existingNominations > 0 ? new Date() : undefined
  }
}

/**
 * 🧮 حساب موعد الدورة التالية
 */
export function calculateNextRecommendationDate(): Date {
  const now = new Date()
  const currentWeek = getCurrentWeek()
  const weekStart = getWeekStartDate(currentWeek)
  
  // حساب بداية الدورة التالية (بعد أسبوعين)
  const nextCycleStart = new Date(weekStart.getTime() + (SCHEDULE_CONFIG.cycleDurationDays * 24 * 60 * 60 * 1000))
  nextCycleStart.setHours(SCHEDULE_CONFIG.cycleStartHour, 0, 0, 0)
  
  return nextCycleStart
}

/**
 * 🚀 تشغيل دورة الترشيحات الأسبوعية
 */
export async function runWeeklyBestFriendRecommendations(): Promise<RecommendationCycle> {
  const currentWeek = getCurrentWeek()
  console.log(`🔄 بدء دورة الترشيحات للأسبوع ${currentWeek}`)

  const cycle: RecommendationCycle = {
    id: `cycle-${currentWeek}`,
    weekNumber: currentWeek,
    startDate: new Date(),
    endDate: calculateNextRecommendationDate(),
    isActive: true,
    totalUsers: 0,
    processedUsers: 0,
    totalRecommendations: 0,
    successfulNominations: 0,
    errors: []
  }

  try {
    // خطوة 1: معالجة الترشيحات المنتهية الصلاحية
    console.log('🗑️ معالجة الترشيحات المنتهية الصلاحية...')
    const expiredResult = await handleExpiredNominations()
    console.log(`✅ تم معالجة ${expiredResult.processedCount} ترشيح منتهي الصلاحية`)
    
    if (expiredResult.errors.length > 0) {
      cycle.errors.push(...expiredResult.errors)
    }

    // خطوة 2: جلب المستخدمين النشطين المؤهلين
    console.log('👥 جلب المستخدمين النشطين...')
    const activeUsers = await getEligibleUsersForRecommendations()
    cycle.totalUsers = activeUsers.length
    console.log(`📊 عدد المستخدمين المؤهلين: ${activeUsers.length}`)

    if (activeUsers.length === 0) {
      cycle.isActive = false
      cycle.completedAt = new Date()
      console.log('⚠️ لا يوجد مستخدمين مؤهلين للترشيح')
      return cycle
    }

    // خطوة 3: معالجة المستخدمين في دفعات
    console.log('⚡ بدء معالجة الترشيحات...')
    const batchSize = SCHEDULE_CONFIG.maxUsersPerBatch
    
    for (let i = 0; i < activeUsers.length; i += batchSize) {
      const batch = activeUsers.slice(i, i + batchSize)
      console.log(`📦 معالجة الدفعة ${Math.floor(i/batchSize) + 1} (${batch.length} مستخدم)`)
      
      const batchResults = await processBatchRecommendations(batch, currentWeek)
      
      cycle.processedUsers += batchResults.processedUsers
      cycle.totalRecommendations += batchResults.totalRecommendations
      cycle.successfulNominations += batchResults.successfulNominations
      cycle.errors.push(...batchResults.errors)
      
      // تأخير بين الدفعات لتجنب الحمل الزائد
      if (i + batchSize < activeUsers.length) {
        await new Promise(resolve => setTimeout(resolve, SCHEDULE_CONFIG.batchDelayMs))
      }
    }

    // خطوة 4: إنهاء الدورة
    cycle.isActive = false
    cycle.completedAt = new Date()
    
    console.log(`✅ اكتملت دورة الترشيحات للأسبوع ${currentWeek}`)
    console.log(`📊 الإحصائيات: ${cycle.processedUsers} مستخدم، ${cycle.successfulNominations} ترشيح ناجح`)
    
    if (cycle.errors.length > 0) {
      console.log(`⚠️ أخطاء: ${cycle.errors.length}`)
    }

    return cycle

  } catch (error) {
    console.error('❌ خطأ في تشغيل دورة الترشيحات:', error)
    cycle.errors.push(`خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    cycle.isActive = false
    cycle.completedAt = new Date()
    return cycle
  }
}

/**
 * 👥 جلب المستخدمين المؤهلين للترشيحات
 */
async function getEligibleUsersForRecommendations(): Promise<{ id: string; username: string }[]> {
  try {
    return await prisma.user.findMany({
      where: {
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)) // نشطين في آخر أسبوع
        }
      },
      select: { id: true, username: true },
      take: 500 // حد أقصى للمعالجة
    })
  } catch (error) {
    console.error('❌ خطأ في جلب المستخدمين المؤهلين:', error)
    return []
  }
}

/**
 * 📦 معالجة دفعة من المستخدمين للترشيحات
 */
async function processBatchRecommendations(
  users: { id: string; username: string }[],
  week: string
): Promise<{
  processedUsers: number
  totalRecommendations: number
  successfulNominations: number
  errors: string[]
}> {
  let processedUsers = 0
  let totalRecommendations = 0
  let successfulNominations = 0
  const errors: string[] = []

  for (const user of users) {
    try {
      // تحقق من عدم وجود ترشيحات هذا الأسبوع
      const existingNominations = await prisma.bestFriendRelation.count({
        where: {
          user1Id: user.id,
          nominationWeek: week
        }
      })

      if (existingNominations > 0) {
        continue // تخطي إذا كان لديه ترشيحات بالفعل
      }

      // إنشاء ترشيحات للمستخدم
      const recommendations = await generateBestFriendRecommendations(user.id, {
        maxRecommendationsPerUser: 1, // ترشيح واحد فقط لكل دورة
        excludeCurrentBestFriends: true,
        excludeRecentlyRejected: true
      })

      totalRecommendations += recommendations.length

      // إنشاء ترشيح للأفضل توافقاً
      if (recommendations.length > 0) {
        const bestRecommendation = recommendations[0]
        
        const nominationResult = await createBestFriendNomination(
          user.id,
          bestRecommendation.recommendedUserId,
          {
            ...DEFAULT_NOMINATION_LIMITS,
            maxActiveNominations: 5, // سماح أكبر للترشيحات التلقائية
          }
        )

        if (nominationResult.success) {
          successfulNominations++
        } else {
          errors.push(`فشل ترشيح ${user.username}: ${nominationResult.message}`)
        }
      }

      processedUsers++

    } catch (error) {
      errors.push(`خطأ في معالجة المستخدم ${user.username}: ${error}`)
    }
  }

  return {
    processedUsers,
    totalRecommendations,
    successfulNominations,
    errors
  }
}

/**
 * 📊 تتبع جدولة الترشيحات
 */
export async function trackRecommendationSchedule(): Promise<{
  nextCycleDate: Date
  timeUntilNextCycle: string
  currentCycleActive: boolean
  recommendationsThisWeek: number
  systemLoad: 'LOW' | 'MEDIUM' | 'HIGH'
}> {
  try {
    const nextCycle = calculateNextRecommendationDate()
    const now = new Date()
    const timeUntilNext = nextCycle.getTime() - now.getTime()
    
    // تحويل الوقت المتبقي إلى نص مقروء
    const days = Math.floor(timeUntilNext / (24 * 60 * 60 * 1000))
    const hours = Math.floor((timeUntilNext % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const timeUntilNextCycle = `${days} يوم و ${hours} ساعة`
    
    // تحقق من وجود دورة نشطة
    const currentWeek = getCurrentWeek()
    const currentCycleActive = now < nextCycle
    
    // إحصائيات هذا الأسبوع
    const recommendationsThisWeek = await prisma.bestFriendRelation.count({
      where: {
        nominationWeek: currentWeek,
        status: { in: [BestFriendStatus.PENDING, BestFriendStatus.ACTIVE] }
      }
    })
    
    // تقدير حمل النظام
    let systemLoad: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    if (recommendationsThisWeek > 100) systemLoad = 'HIGH'
    else if (recommendationsThisWeek > 50) systemLoad = 'MEDIUM'

    return {
      nextCycleDate: nextCycle,
      timeUntilNextCycle,
      currentCycleActive,
      recommendationsThisWeek,
      systemLoad
    }

  } catch (error) {
    console.error('❌ خطأ في تتبع الجدولة:', error)
    return {
      nextCycleDate: new Date(),
      timeUntilNextCycle: 'غير محدد',
      currentCycleActive: false,
      recommendationsThisWeek: 0,
      systemLoad: 'LOW'
    }
  }
}

/**
 * 📈 إحصائيات الأسابيع
 */
export async function getWeeklyRecommendationStats(weeks: number = 4): Promise<WeeklyStats[]> {
  try {
    const stats: WeeklyStats[] = []
    
    for (let i = 0; i < weeks; i++) {
      const weekDate = new Date()
      weekDate.setDate(weekDate.getDate() - (i * 7))
      const week = getWeekFromDate(weekDate)
      
      const [active, accepted, rejected, expired] = await Promise.all([
        prisma.bestFriendRelation.count({
          where: { nominationWeek: week, status: BestFriendStatus.PENDING }
        }),
        prisma.bestFriendRelation.count({
          where: { nominationWeek: week, status: BestFriendStatus.ACTIVE }
        }),
        prisma.bestFriendRelation.count({
          where: { nominationWeek: week, status: BestFriendStatus.REJECTED }
        }),
        prisma.bestFriendRelation.count({
          where: { nominationWeek: week, status: BestFriendStatus.EXPIRED }
        })
      ])
      
      // حساب متوسط وقت الاستجابة
      const responseData = await prisma.bestFriendRelation.findMany({
        where: {
          nominationWeek: week,
          decidedAt: { not: null }
        },
        select: {
          nominatedAt: true,
          decidedAt: true
        }
      })
      
      const averageResponseTime = responseData.length > 0
        ? responseData.reduce((sum, item) => {
            if (item.decidedAt) {
              return sum + (item.decidedAt.getTime() - item.nominatedAt.getTime())
            }
            return sum
          }, 0) / responseData.length / (1000 * 60 * 60) // تحويل إلى ساعات
        : 0
      
      // أعلى نقاط توافق
      const topCompatibility = await prisma.bestFriendRelation.findFirst({
        where: { nominationWeek: week },
        orderBy: { compatibilityScore: 'desc' },
        select: { compatibilityScore: true }
      })

      stats.push({
        week,
        activeNominations: active,
        acceptedNominations: accepted,
        rejectedNominations: rejected,
        expiredNominations: expired,
        averageResponseTime: Math.round(averageResponseTime * 10) / 10,
        topCompatibilityScore: topCompatibility?.compatibilityScore || 0
      })
    }
    
    return stats.reverse() // ترتيب زمني تصاعدي

  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات الأسابيع:', error)
    return []
  }
}

// ================== دوال مساعدة ==================

/**
 * 📅 الحصول على رقم الأسبوع الحالي
 */
function getCurrentWeek(): string {
  return getWeekFromDate(new Date())
}

/**
 * 📅 تحويل تاريخ إلى رقم أسبوع
 */
function getWeekFromDate(date: Date): string {
  const year = date.getFullYear()
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

/**
 * 📅 الحصول على تاريخ بداية الأسبوع
 */
function getWeekStartDate(weekString: string): Date {
  const [year, weekStr] = weekString.split('-W')
  const week = parseInt(weekStr)
  
  const firstDay = new Date(parseInt(year), 0, 1)
  const daysToAdd = (week - 1) * 7
  
  return new Date(firstDay.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
}

/**
 * ✅ فحص نجاح آخر دورة
 */
async function checkLastCycleSuccess(): Promise<boolean> {
  try {
    const lastWeek = getWeekFromDate(new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)))
    
    const lastWeekNominations = await prisma.bestFriendRelation.count({
      where: { nominationWeek: lastWeek }
    })
    
    return lastWeekNominations > 0
    
  } catch (error) {
    return false
  }
}

/**
 * 🔧 إعدادات الجدولة (يمكن تطويرها لاحقاً لتكون قابلة للتعديل)
 */
export function updateScheduleConfig(newConfig: Partial<typeof SCHEDULE_CONFIG>): typeof SCHEDULE_CONFIG {
  Object.assign(SCHEDULE_CONFIG, newConfig)
  return SCHEDULE_CONFIG
}
