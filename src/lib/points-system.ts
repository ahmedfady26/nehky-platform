import { prisma } from './prisma'

// أنواع التفاعل والنقاط المرتبطة بها
export const INTERACTION_POINTS = {
  LIKE: 5,
  COMMENT: 10,
  POST: 20
} as const

export type InteractionType = keyof typeof INTERACTION_POINTS

// مدة صلاحية النقاط (14 يوم)
const POINTS_VALIDITY_DAYS = 14

// إضافة نقاط للمستخدم
export async function addPoints(
  userId: string,
  influencerId: string,
  type: InteractionType,
  activityRef?: {
    postId?: string
    commentId?: string
    likeId?: string
  }
) {
  try {
    // حساب تاريخ انتهاء الصلاحية (14 يوم من الآن)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + POINTS_VALIDITY_DAYS)

    const points = INTERACTION_POINTS[type]

    // إنشاء سجل النقاط
    const pointRecord = await prisma.point.create({
      data: {
        points,
        type,
        userId,
        influencerId,
        expiresAt,
        isValid: true,
        ...activityRef
      }
    })

    console.log(`✅ تم إضافة ${points} نقطة للمستخدم ${userId} مع المؤثر ${influencerId} (نوع: ${type})`)
    return pointRecord

  } catch (error) {
    console.error('خطأ في إضافة النقاط:', error)
    throw error
  }
}

// الحصول على النقاط الصالحة للمستخدم مع مؤثر معين
export async function getValidPoints(userId: string, influencerId: string) {
  try {
    const now = new Date()

    // جلب النقاط الصالحة (غير منتهية الصلاحية)
    const validPoints = await prisma.point.findMany({
      where: {
        userId,
        influencerId,
        isValid: true,
        expiresAt: {
          gt: now // أكبر من الوقت الحالي
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // حساب إجمالي النقاط
    const totalPoints = validPoints.reduce((sum, point) => sum + point.points, 0)

    return {
      points: validPoints,
      totalPoints,
      count: validPoints.length
    }

  } catch (error) {
    console.error('خطأ في جلب النقاط الصالحة:', error)
    throw error
  }
}

// الحصول على أفضل 3 متابعين لمؤثر معين (خلال آخر 14 يوم)
export async function getTopFollowersForInfluencer(influencerId: string) {
  try {
    const now = new Date()

    // جلب المستخدمين مع إجمالي نقاطهم الصالحة
    const topFollowers = await prisma.$queryRaw<Array<{
      userId: string
      totalPoints: bigint
      username: string
      fullName: string
    }>>`
      SELECT 
        u.id as userId,
        u.username,
        u.fullName,
        COALESCE(SUM(p.points), 0) as totalPoints
      FROM users u
      LEFT JOIN points p ON u.id = p.userId 
        AND p.influencerId = ${influencerId}
        AND p.isValid = true
        AND p.expiresAt > ${now}
      GROUP BY u.id, u.username, u.fullName
      HAVING totalPoints > 0
      ORDER BY totalPoints DESC
      LIMIT 3
    `

    return topFollowers.map((follower, index) => ({
      ...follower,
      rank: index + 1,
      totalPoints: Number(follower.totalPoints)
    }))

  } catch (error) {
    console.error('خطأ في جلب أفضل المتابعين:', error)
    throw error
  }
}

// تنظيف النقاط المنتهية الصلاحية
export async function cleanupExpiredPoints() {
  try {
    const now = new Date()

    // تحديث النقاط المنتهية الصلاحية
    const updatedPoints = await prisma.point.updateMany({
      where: {
        isValid: true,
        expiresAt: {
          lt: now // أقل من الوقت الحالي
        }
      },
      data: {
        isValid: false
      }
    })

    console.log(`🧹 تم تنظيف ${updatedPoints.count} نقطة منتهية الصلاحية`)
    return updatedPoints.count

  } catch (error) {
    console.error('خطأ في تنظيف النقاط المنتهية:', error)
    throw error
  }
}

// الحصول على جميع نقاط المستخدم مع جميع المؤثرين
export async function getUserPointsByInfluencer(userId: string) {
  try {
    const now = new Date()

    const pointsByInfluencer = await prisma.$queryRaw<Array<{
      influencerId: string
      influencerUsername: string
      influencerFullName: string
      totalPoints: bigint
      pointsCount: bigint
    }>>`
      SELECT 
        i.id as influencerId,
        i.username as influencerUsername,
        i.fullName as influencerFullName,
        COALESCE(SUM(p.points), 0) as totalPoints,
        COUNT(p.id) as pointsCount
      FROM users i
      LEFT JOIN points p ON i.id = p.influencerId 
        AND p.userId = ${userId}
        AND p.isValid = true
        AND p.expiresAt > ${now}
      WHERE i.role = 'INFLUENCER'
      GROUP BY i.id, i.username, i.fullName
      HAVING totalPoints > 0
      ORDER BY totalPoints DESC
    `

    return pointsByInfluencer.map(item => ({
      ...item,
      totalPoints: Number(item.totalPoints),
      pointsCount: Number(item.pointsCount)
    }))

  } catch (error) {
    console.error('خطأ في جلب نقاط المستخدم حسب المؤثرين:', error)
    throw error
  }
}

// حفظ ترشيحات كبار المتابعين اليومية
export async function saveDailyTopFollowerNominations() {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 ساعة من الآن
    const nominationDate = new Date().toDateString() // تاريخ اليوم فقط

    // جلب جميع المؤثرين
    const influencers = await prisma.user.findMany({
      where: {
        role: 'INFLUENCER'
      },
      select: {
        id: true,
        username: true,
        fullName: true
      }
    })

    let totalNominations = 0

    // معالجة كل مؤثر على حدة
    for (const influencer of influencers) {
      const topFollowers = await getTopFollowersForInfluencer(influencer.id)

      // حفظ الترشيحات للمؤثر الحالي
      for (const follower of topFollowers) {
        try {
          // التحقق من عدم وجود ترشيح لنفس اليوم
          const existingNomination = await prisma.dailyTopFollowerNomination.findFirst({
            where: {
              userId: follower.userId,
              influencerId: influencer.id,
              nominationDate: {
                gte: new Date(nominationDate),
                lt: new Date(new Date(nominationDate).getTime() + 24 * 60 * 60 * 1000)
              }
            }
          })

          if (!existingNomination) {
            await prisma.dailyTopFollowerNomination.create({
              data: {
                userId: follower.userId,
                influencerId: influencer.id,
                totalPoints: follower.totalPoints,
                rank: follower.rank,
                isActive: true,
                expiresAt
              }
            })
            totalNominations++
          }
        } catch (error) {
          console.error(`خطأ في حفظ ترشيح للمستخدم ${follower.userId} مع المؤثر ${influencer.id}:`, error)
        }
      }
    }

    console.log(`🏆 تم حفظ ${totalNominations} ترشيح جديد لكبار المتابعين`)
    return totalNominations

  } catch (error) {
    console.error('خطأ في حفظ الترشيحات اليومية:', error)
    throw error
  }
}

// الحصول على ترشيحات المستخدم اليومية النشطة
export async function getUserDailyNominations(userId: string) {
  try {
    const now = new Date()

    const nominations = await prisma.dailyTopFollowerNomination.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: now
        }
      },
      include: {
        influencer: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        rank: 'asc'
      }
    })

    return nominations

  } catch (error) {
    console.error('خطأ في جلب ترشيحات المستخدم اليومية:', error)
    throw error
  }
}

// تنظيف الترشيحات اليومية المنتهية الصلاحية
export async function cleanupExpiredNominations() {
  try {
    const now = new Date()

    const updatedNominations = await prisma.dailyTopFollowerNomination.updateMany({
      where: {
        isActive: true,
        expiresAt: {
          lt: now
        }
      },
      data: {
        isActive: false
      }
    })

    console.log(`🧹 تم تنظيف ${updatedNominations.count} ترشيح منتهي الصلاحية`)
    return updatedNominations.count

  } catch (error) {
    console.error('خطأ في تنظيف الترشيحات المنتهية:', error)
    throw error
  }
}
