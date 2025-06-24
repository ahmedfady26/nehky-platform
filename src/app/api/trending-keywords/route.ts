import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

// جلب الكلمات الشائعة (Trending Keywords)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || 'all' // all, hashtag, keyword, mention
    const category = searchParams.get('category')
    const timeframe = searchParams.get('timeframe') || 'day' // day, week, month
    const currentlyTrending = searchParams.get('trending') === 'true'

    // بناء شروط البحث
    const where: any = {}

    if (type !== 'all') {
      where.type = type.toUpperCase()
    }

    if (category) {
      where.category = category
    }

    if (currentlyTrending) {
      where.isCurrentlyTrending = true
    }

    // تحديد ترتيب النتائج حسب الإطار الزمني
    let orderBy: any = { trendScore: 'desc' }
    
    if (timeframe === 'day') {
      orderBy = { dailyUsage: 'desc' }
    } else if (timeframe === 'week') {
      orderBy = { weeklyUsage: 'desc' }
    } else if (timeframe === 'month') {
      orderBy = { monthlyUsage: 'desc' }
    }

    // جلب الكلمات الشائعة
    const trendingKeywords = await prisma.trendingKeyword.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        usageHistory: {
          take: 7,
          orderBy: { date: 'desc' }
        }
      }
    })

    // معالجة البيانات لتحويل JSON strings
    const processedKeywords = trendingKeywords.map(keyword => ({
      ...keyword,
      relatedKeywords: keyword.relatedKeywords ? JSON.parse(keyword.relatedKeywords) : [],
      usageHistory: keyword.usageHistory.map(history => ({
        ...history,
        hourlyDistribution: history.hourlyDistribution ? JSON.parse(history.hourlyDistribution) : null,
        topInfluencers: history.topInfluencers ? JSON.parse(history.topInfluencers) : [],
        relatedPosts: history.relatedPosts ? JSON.parse(history.relatedPosts) : []
      }))
    }))

    return NextResponse.json({
      success: true,
      data: processedKeywords,
      meta: {
        timeframe,
        type,
        category,
        currentlyTrending,
        total: processedKeywords.length
      }
    })

  } catch (error) {
    console.error('Get trending keywords error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في جلب الكلمات الشائعة'
    }, { status: 500 })
  }
}

// تحديث أو إضافة كلمة شائعة (للاستخدام الداخلي)
export async function POST(request: NextRequest) {
  try {
    const { keyword, type = 'HASHTAG', postId, userId } = await request.json()

    if (!keyword?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'الكلمة مطلوبة'
      }, { status: 400 })
    }

    // تنظيف الكلمة
    const cleanKeyword = keyword.trim()
    const normalizedKeyword = cleanKeyword.toLowerCase().replace(/^#/, '')

    // البحث عن الكلمة أو إنشاؤها
    const existingKeyword = await prisma.trendingKeyword.findUnique({
      where: { keyword: cleanKeyword }
    })

    let trendingKeyword

    if (existingKeyword) {
      // تحديث الكلمة الموجودة
      trendingKeyword = await prisma.trendingKeyword.update({
        where: { id: existingKeyword.id },
        data: {
          totalUsage: { increment: 1 },
          dailyUsage: { increment: 1 },
          weeklyUsage: { increment: 1 },
          monthlyUsage: { increment: 1 },
          lastUsedAt: new Date(),
          // زيادة عدادات المنشورات إذا تم تمرير postId
          postsCount: postId ? { increment: 1 } : undefined
        }
      })
    } else {
      // إنشاء كلمة جديدة
      trendingKeyword = await prisma.trendingKeyword.create({
        data: {
          keyword: cleanKeyword,
          normalizedKeyword: normalizedKeyword,
          type: type,
          totalUsage: 1,
          dailyUsage: 1,
          weeklyUsage: 1,
          monthlyUsage: 1,
          postsCount: postId ? 1 : 0,
          lastUsedAt: new Date(),
          firstSeenAt: new Date(),
          origin: postId || null
        }
      })
    }

    // إضافة أو تحديث سجل الاستخدام اليومي
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingHistory = await prisma.keywordUsageHistory.findUnique({
      where: {
        keywordId_date: {
          keywordId: trendingKeyword.id,
          date: today
        }
      }
    })

    if (existingHistory) {
      await prisma.keywordUsageHistory.update({
        where: { id: existingHistory.id },
        data: {
          usageCount: { increment: 1 },
          postsCount: postId ? { increment: 1 } : undefined
        }
      })
    } else {
      await prisma.keywordUsageHistory.create({
        data: {
          keywordId: trendingKeyword.id,
          date: today,
          usageCount: 1,
          uniqueUsers: userId ? 1 : 0,
          postsCount: postId ? 1 : 0
        }
      })
    }

    // حساب درجة الترند (بسيط)
    const trendScore = calculateTrendScore(trendingKeyword)
    
    // تحديث درجة الترند
    await prisma.trendingKeyword.update({
      where: { id: trendingKeyword.id },
      data: {
        trendScore: trendScore,
        isCurrentlyTrending: trendScore >= 20, // عتبة افتراضية
        lastCalculatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: trendingKeyword,
      message: 'تم تحديث الكلمة الشائعة'
    })

  } catch (error) {
    console.error('Update trending keyword error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في تحديث الكلمة الشائعة'
    }, { status: 500 })
  }
}

// دالة حساب درجة الترند (يمكن تحسينها)
function calculateTrendScore(keyword: any): number {
  const dailyWeight = 0.5
  const weeklyWeight = 0.3
  const velocityWeight = 0.2

  // حساب سرعة الانتشار (velocity)
  const velocity = keyword.dailyUsage / Math.max(keyword.weeklyUsage / 7, 1)

  // حساب الدرجة النهائية
  const score = (
    keyword.dailyUsage * dailyWeight +
    keyword.weeklyUsage * weeklyWeight +
    velocity * velocityWeight
  )

  return Math.min(score, 100) // حد أقصى 100
}
