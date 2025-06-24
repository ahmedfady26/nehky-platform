import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTrendingKeywordsTestData() {
  try {
    console.log('🚀 بدء إنشاء بيانات تجريبية للكلمات الشائعة...')

    // إنشاء إعدادات خوارزمية الترند
    const algorithmConfig = await prisma.trendAlgorithmConfig.create({
      data: {
        dailyWeight: 0.5,
        weeklyWeight: 0.3,
        monthlyWeight: 0.2,
        velocityWeight: 0.4,
        minDailyUsage: 3,
        minUniqueUsers: 2,
        trendThreshold: 15.0,
        maxTrendingKeywords: 50,
        historyRetentionDays: 90,
        calculationInterval: 30,
        minKeywordLength: 2,
        maxKeywordLength: 50,
        excludedWords: JSON.stringify(['في', 'من', 'إلى', 'على', 'the', 'is', 'are']),
        isActive: true,
        description: 'إعدادات افتراضية لخوارزمية الترند',
        version: '1.0'
      }
    })

    console.log('✅ تم إنشاء إعدادات خوارزمية الترند')

    // كلمات تجريبية متنوعة
    const testKeywords = [
      // هاشتاجات شائعة
      { keyword: '#تقنية', type: 'HASHTAG', category: 'تقنية', baseUsage: 50 },
      { keyword: '#برمجة', type: 'HASHTAG', category: 'تقنية', baseUsage: 35 },
      { keyword: '#ذكي_اصطناعي', type: 'HASHTAG', category: 'تقنية', baseUsage: 28 },
      { keyword: '#منصة_نحكي', type: 'HASHTAG', category: 'منصة', baseUsage: 45 },
      { keyword: '#رياضة', type: 'HASHTAG', category: 'رياضة', baseUsage: 32 },
      { keyword: '#كرة_القدم', type: 'HASHTAG', category: 'رياضة', baseUsage: 40 },
      { keyword: '#صحة', type: 'HASHTAG', category: 'صحة', baseUsage: 25 },
      { keyword: '#طبخ', type: 'HASHTAG', category: 'طبخ', baseUsage: 22 },
      { keyword: '#سفر', type: 'HASHTAG', category: 'سفر', baseUsage: 30 },
      { keyword: '#تعليم', type: 'HASHTAG', category: 'تعليم', baseUsage: 26 },

      // كلمات مفتاحية
      { keyword: 'الذكي', type: 'KEYWORD', category: 'تقنية', baseUsage: 20 },
      { keyword: 'تطوير', type: 'KEYWORD', category: 'تقنية', baseUsage: 18 },
      { keyword: 'مستقبل', type: 'KEYWORD', category: 'عام', baseUsage: 15 },
      { keyword: 'إبداع', type: 'KEYWORD', category: 'عام', baseUsage: 12 },
      { keyword: 'تحدي', type: 'KEYWORD', category: 'عام', baseUsage: 14 },
      { keyword: 'نجاح', type: 'KEYWORD', category: 'عام', baseUsage: 16 },

      // منشن
      { keyword: '@منصة_نحكي', type: 'MENTION', category: 'منصة', baseUsage: 8 },
      { keyword: '@admin', type: 'MENTION', category: 'منصة', baseUsage: 5 },

      // هاشتاجات إنجليزية
      { keyword: '#technology', type: 'HASHTAG', category: 'تقنية', baseUsage: 24 },
      { keyword: '#programming', type: 'HASHTAG', category: 'تقنية', baseUsage: 19 },
      { keyword: '#AI', type: 'HASHTAG', category: 'تقنية', baseUsage: 33 },
      { keyword: '#startup', type: 'HASHTAG', category: 'أعمال', baseUsage: 17 }
    ]

    // إنشاء الكلمات الشائعة
    for (const keywordData of testKeywords) {
      const normalizedKeyword = keywordData.keyword.toLowerCase().replace(/^[@#]/, '')
      
      // تحديد اللغة
      const language = /[\u0600-\u06FF]/.test(keywordData.keyword) ? 'AR' : 'EN'
      
      // حساب الاستخدام مع تباين عشوائي
      const randomFactor = 0.7 + Math.random() * 0.6 // 0.7 إلى 1.3
      const dailyUsage = Math.floor(keywordData.baseUsage * randomFactor)
      const weeklyUsage = dailyUsage * (5 + Math.floor(Math.random() * 3)) // 5-7 أيام
      const monthlyUsage = weeklyUsage * (3 + Math.floor(Math.random() * 2)) // 3-4 أسابيع
      const totalUsage = monthlyUsage + Math.floor(Math.random() * 100)

      // حساب سرعة الانتشار
      const velocityScore = dailyUsage / Math.max(weeklyUsage / 7, 1)
      
      // حساب درجة الترند
      const trendScore = (
        dailyUsage * algorithmConfig.dailyWeight +
        weeklyUsage * algorithmConfig.weeklyWeight +
        monthlyUsage * algorithmConfig.monthlyWeight +
        velocityScore * algorithmConfig.velocityWeight
      )

      const isCurrentlyTrending = 
        dailyUsage >= algorithmConfig.minDailyUsage &&
        trendScore >= algorithmConfig.trendThreshold

      // إنشاء الكلمة الشائعة
      const trendingKeyword = await prisma.trendingKeyword.create({
        data: {
          keyword: keywordData.keyword,
          normalizedKeyword: normalizedKeyword,
          type: keywordData.type,
          category: keywordData.category,
          language: language,
          totalUsage: totalUsage,
          dailyUsage: dailyUsage,
          weeklyUsage: weeklyUsage,
          monthlyUsage: monthlyUsage,
          trendScore: Math.round(trendScore * 100) / 100,
          velocityScore: Math.round(velocityScore * 100) / 100,
          isCurrentlyTrending: isCurrentlyTrending,
          peakUsage: dailyUsage + Math.floor(Math.random() * 10),
          peakDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          sentiment: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'][Math.floor(Math.random() * 3)],
          postsCount: Math.floor(dailyUsage * 0.7),
          commentsCount: Math.floor(dailyUsage * 0.3),
          likesCount: Math.floor(dailyUsage * 1.5),
          sharesCount: Math.floor(dailyUsage * 0.2),
          lastUsedAt: new Date(),
          firstSeenAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          lastCalculatedAt: new Date(),
          nextCalculationAt: new Date(Date.now() + algorithmConfig.calculationInterval * 60 * 1000)
        }
      })

      console.log(`✅ تم إنشاء كلمة شائعة: ${keywordData.keyword} (درجة الترند: ${trendScore.toFixed(1)})`)

      // إنشاء سجل استخدام تاريخي (آخر 7 أيام)
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const dayFactor = i === 0 ? 1 : 0.3 + Math.random() * 0.7 // اليوم الحالي أعلى
        const dayUsage = Math.floor(dailyUsage * dayFactor)
        const uniqueUsers = Math.max(1, Math.floor(dayUsage * 0.6))
        const postsCount = Math.floor(dayUsage * 0.8)
        
        // توزيع ساعات اليوم
        const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
          const isActiveHour = hour >= 8 && hour <= 23 // ساعات النشاط
          return isActiveHour ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2)
        })

        await prisma.keywordUsageHistory.create({
          data: {
            keywordId: trendingKeyword.id,
            date: date,
            usageCount: dayUsage,
            uniqueUsers: uniqueUsers,
            postsCount: postsCount,
            commentsCount: Math.floor(dayUsage * 0.3),
            totalLikes: Math.floor(dayUsage * 1.5),
            totalShares: Math.floor(dayUsage * 0.2),
            totalViews: Math.floor(dayUsage * 3),
            hourlyDistribution: JSON.stringify(hourlyDistribution),
            topInfluencers: JSON.stringify([]),
            relatedPosts: JSON.stringify([]),
            dailyTrendScore: Math.round(trendScore * dayFactor * 100) / 100
          }
        })
      }
    }

    // ترقيم الكلمات الشائعة حسب درجة الترند
    const trendingKeywords = await prisma.trendingKeyword.findMany({
      where: { isCurrentlyTrending: true },
      orderBy: { trendScore: 'desc' }
    })

    for (let i = 0; i < trendingKeywords.length; i++) {
      await prisma.trendingKeyword.update({
        where: { id: trendingKeywords[i].id },
        data: { 
          trendRank: i + 1,
          trendStartDate: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
        }
      })
    }

    console.log(`🎯 تم ترقيم ${trendingKeywords.length} كلمة شائعة`)

    console.log('\n🎉 تم إنشاء البيانات التجريبية للكلمات الشائعة بنجاح!')
    console.log(`📊 إجمالي الكلمات: ${testKeywords.length}`)
    console.log(`🔥 كلمات ترند: ${trendingKeywords.length}`)
    console.log('يمكنك الآن زيارة /test-trending-keywords لاختبار النظام')

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات التجريبية:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTrendingKeywordsTestData()
