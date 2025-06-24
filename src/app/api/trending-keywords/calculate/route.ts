import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// تحديث حسابات الترند لجميع الكلمات
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 بدء تحديث حسابات الترند...')

    // جلب إعدادات خوارزمية الترند
    let config = await prisma.trendAlgorithmConfig.findFirst({
      where: { isActive: true }
    })

    // إنشاء إعدادات افتراضية إذا لم توجد
    if (!config) {
      config = await prisma.trendAlgorithmConfig.create({
        data: {
          dailyWeight: 0.5,
          weeklyWeight: 0.3,
          monthlyWeight: 0.2,
          velocityWeight: 0.4,
          minDailyUsage: 5,
          minUniqueUsers: 3,
          trendThreshold: 20.0,
          maxTrendingKeywords: 50,
          isActive: true
        }
      })
    }

    // حساب تواريخ الفترات
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // إعادة تعيين العدادات اليومية والأسبوعية والشهرية
    await resetUsageCounts(oneDayAgo, oneWeekAgo, oneMonthAgo)

    // جلب جميع الكلمات للتحديث
    const keywords = await prisma.trendingKeyword.findMany({
      include: {
        usageHistory: {
          where: {
            date: {
              gte: oneMonthAgo
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    })

    console.log(`📊 معالجة ${keywords.length} كلمة...`)

    const updatedKeywords = []

    // حساب الترند لكل كلمة
    for (const keyword of keywords) {
      const trendData = calculateAdvancedTrendScore(keyword, config, {
        oneDayAgo,
        oneWeekAgo,
        oneMonthAgo
      })

      // تحديث الكلمة
      const updatedKeyword = await prisma.trendingKeyword.update({
        where: { id: keyword.id },
        data: {
          dailyUsage: trendData.dailyUsage,
          weeklyUsage: trendData.weeklyUsage,
          monthlyUsage: trendData.monthlyUsage,
          trendScore: trendData.trendScore,
          velocityScore: trendData.velocityScore,
          isCurrentlyTrending: trendData.isCurrentlyTrending,
          lastCalculatedAt: now,
          nextCalculationAt: new Date(now.getTime() + config.calculationInterval * 60 * 1000)
        }
      })

      if (trendData.isCurrentlyTrending) {
        updatedKeywords.push(updatedKeyword)
      }
    }

    // ترقيم الترند (رقم 1 للأعلى)
    const sortedTrendingKeywords = updatedKeywords
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, config.maxTrendingKeywords)

    // تحديث ترقيم الترند
    for (let i = 0; i < sortedTrendingKeywords.length; i++) {
      await prisma.trendingKeyword.update({
        where: { id: sortedTrendingKeywords[i].id },
        data: { trendRank: i + 1 }
      })
    }

    // إزالة ترقيم الترند من الكلمات غير المؤهلة
    await prisma.trendingKeyword.updateMany({
      where: {
        id: {
          notIn: sortedTrendingKeywords.map(k => k.id)
        }
      },
      data: {
        trendRank: null,
        isCurrentlyTrending: false
      }
    })

    console.log(`✅ تم تحديث ${keywords.length} كلمة، ${sortedTrendingKeywords.length} منها ترند`)

    return NextResponse.json({
      success: true,
      data: {
        totalKeywords: keywords.length,
        trendingKeywords: sortedTrendingKeywords.length,
        topTrending: sortedTrendingKeywords.slice(0, 10).map(k => ({
          keyword: k.keyword,
          trendScore: k.trendScore,
          rank: k.trendRank,
          dailyUsage: k.dailyUsage
        }))
      },
      message: 'تم تحديث حسابات الترند بنجاح'
    })

  } catch (error) {
    console.error('Calculate trend error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في حساب الترند'
    }, { status: 500 })
  }
}

// دالة إعادة تعيين العدادات حسب الفترات الزمنية
async function resetUsageCounts(oneDayAgo: Date, oneWeekAgo: Date, oneMonthAgo: Date) {
  // إعادة حساب الاستخدام اليومي
  await prisma.$executeRaw`
    UPDATE trending_keywords 
    SET dailyUsage = (
      SELECT COALESCE(SUM(usageCount), 0) 
      FROM keyword_usage_history 
      WHERE keywordId = trending_keywords.id 
      AND date >= ${oneDayAgo}
    )
  `

  // إعادة حساب الاستخدام الأسبوعي
  await prisma.$executeRaw`
    UPDATE trending_keywords 
    SET weeklyUsage = (
      SELECT COALESCE(SUM(usageCount), 0) 
      FROM keyword_usage_history 
      WHERE keywordId = trending_keywords.id 
      AND date >= ${oneWeekAgo}
    )
  `

  // إعادة حساب الاستخدام الشهري
  await prisma.$executeRaw`
    UPDATE trending_keywords 
    SET monthlyUsage = (
      SELECT COALESCE(SUM(usageCount), 0) 
      FROM keyword_usage_history 
      WHERE keywordId = trending_keywords.id 
      AND date >= ${oneMonthAgo}
    )
  `
}

// خوارزمية حساب الترند المتقدمة
function calculateAdvancedTrendScore(
  keyword: any, 
  config: any, 
  timeframes: { oneDayAgo: Date; oneWeekAgo: Date; oneMonthAgo: Date }
): any {
  const { oneDayAgo, oneWeekAgo, oneMonthAgo } = timeframes

  // حساب الاستخدام في الفترات المختلفة
  const dailyUsage = keyword.usageHistory
    .filter((h: any) => h.date >= oneDayAgo)
    .reduce((sum: number, h: any) => sum + h.usageCount, 0)

  const weeklyUsage = keyword.usageHistory
    .filter((h: any) => h.date >= oneWeekAgo)
    .reduce((sum: number, h: any) => sum + h.usageCount, 0)

  const monthlyUsage = keyword.usageHistory
    .filter((h: any) => h.date >= oneMonthAgo)
    .reduce((sum: number, h: any) => sum + h.usageCount, 0)

  // حساب سرعة الانتشار (Velocity)
  const avgWeeklyUsage = weeklyUsage / 7
  const velocityScore = avgWeeklyUsage > 0 ? dailyUsage / avgWeeklyUsage : 0

  // حساب درجة الترند النهائية
  const trendScore = (
    dailyUsage * config.dailyWeight +
    weeklyUsage * config.weeklyWeight +
    monthlyUsage * config.monthlyWeight +
    velocityScore * config.velocityWeight
  )

  // تحديد ما إذا كانت الكلمة ترند حالياً
  const isCurrentlyTrending = 
    dailyUsage >= config.minDailyUsage &&
    trendScore >= config.trendThreshold

  return {
    dailyUsage,
    weeklyUsage,
    monthlyUsage,
    trendScore: Math.round(trendScore * 100) / 100, // تقريب لرقمين عشريين
    velocityScore: Math.round(velocityScore * 100) / 100,
    isCurrentlyTrending
  }
}
