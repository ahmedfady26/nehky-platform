// اختبار شامل للأنظمة الجديدة في منصة نحكي
// تحليل الفيديو + تحسين الاهتمامات + اقتراحات المتابعة الذكية

import { PrismaClient } from '@prisma/client'
import { 
  trackVideoView, 
  calculateVideoMetrics, 
  getTopPerformingVideos,
  getUserVideoWatchingPatterns,
  suggestVideosBasedOnAnalytics
} from './src/lib/video-analytics.js'
import { 
  updateInterestScoresWithTimeDecay,
  clusterSimilarContent,
  runPeriodicOptimizations
} from './src/lib/interest-optimization.js'
import { 
  generateSmartFollowSuggestions,
  analyzeSuggestionEffectiveness 
} from './src/lib/smart-follow-suggestions.js'

const prisma = new PrismaClient()

async function comprehensiveSystemTest() {
  console.log('🚀 بدء الاختبار الشامل للأنظمة الجديدة')
  
  try {
    // ========================================
    // 1. اختبار نظام تحليلات الفيديو
    // ========================================
    console.log('\n📊 اختبار نظام تحليلات الفيديو')
    
    // إنشاء مستخدم تجريبي
    const testUser = await prisma.user.upsert({
      where: { username: 'test_user_analytics' },
      update: {},
      create: {
        fullName: 'مستخدم تجريبي للتحليلات',
        username: 'test_user_analytics',
        nehkyEmail: 'test_user_analytics@nehky.com',
        phone: '+201234567890',
        passwordHash: 'hashed_password_here',
        lastActivity: new Date()
      }
    })
    
    // إنشاء منشور فيديو تجريبي
    const testVideoPost = await prisma.post.upsert({
      where: { id: 'test-video-post-1' },
      update: {},
      create: {
        id: 'test-video-post-1',
        userId: testUser.id,
        content: 'فيديو تجريبي لاختبار نظام التحليلات',
        mediaType: 'VIDEO',
        mediaUrl: 'https://example.com/test-video.mp4'
      }
    })
    
    // إنشاء جلسة مشاهدة تجريبية
    const viewSession = await prisma.videoViewSession.create({
      data: {
        userId: testUser.id,
        postId: testVideoPost.id,
        deviceType: 'DESKTOP',
        startTime: new Date(),
        endTime: new Date(),
        watchDuration: 90,
        isCompleted: true,
        qualitySettings: '720p'
      }
    })
    
    console.log('✅ تم إنشاء جلسة مشاهدة:', viewSession.id)
    
    // الحصول على تحليلات الفيديو مباشرة
    const analytics = await calculateVideoMetrics(testVideoPost.id)
    console.log('📈 تحليلات الفيديو:', {
      totalViews: analytics.totalViews,
      averageWatchTime: analytics.averageWatchTime,
      completionRate: analytics.completionRate,
      retentionRate: analytics.retentionRate
    })
    
    // ========================================
    // 2. اختبار نظام تحسين الاهتمامات
    // ========================================
    console.log('\n🎯 اختبار نظام تحسين الاهتمامات')
    
    // إنشاء درجة اهتمام تجريبية
    await prisma.userInterestScore.upsert({
      where: {
        userId_interestName: {
          userId: testUser.id,
          interestName: 'التكنولوجيا'
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        interestName: 'التكنولوجيا',
        currentScore: 85,
        rawScore: 90,
        normalizedScore: 0.85,
        weightedScore: 82,
        category: 'تقنية',
        confidence: 0.9,
        sources: ['interactions', 'posts', 'views'],
        sourceWeights: { interactions: 0.4, posts: 0.4, views: 0.2 },
        primarySource: 'interactions',
        totalInteractions: 45,
        recentInteractions: 12,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // منذ يومين
      }
    })
    
    // تطبيق التسوية الزمنية
    const decayResults = await updateInterestScoresWithTimeDecay(testUser.id)
    console.log('⏰ نتائج التسوية الزمنية:', decayResults)
    
    // تشغيل تحسينات دورية
    const optimizationResults = await runPeriodicOptimizations()
    console.log('📊 ملخص التحسينات:', optimizationResults)
    
    // ========================================
    // 3. اختبار نظام اقتراحات المتابعة الذكية
    // ========================================
    console.log('\n👥 اختبار نظام اقتراحات المتابعة الذكية')
    
    // إنشاء مستخدمين إضافيين للاقتراحات
    const potentialFollowUsers = await Promise.all([
      prisma.user.upsert({
        where: { username: 'tech_enthusiast' },
        update: {},
        create: {
          fullName: 'محبي التكنولوجيا',
          username: 'tech_enthusiast',
          nehkyEmail: 'tech_enthusiast@nehky.com',
          phone: '+201234567891',
          passwordHash: 'hashed_password',
          interests: ['التكنولوجيا', 'البرمجة', 'الذكاء الاصطناعي'],
          followersCount: 150,
          postsCount: 25,
          lastActivity: new Date()
        }
      }),
      prisma.user.upsert({
        where: { username: 'ai_researcher' },
        update: {},
        create: {
          fullName: 'باحث ذكاء اصطناعي',
          username: 'ai_researcher',
          nehkyEmail: 'ai_researcher@nehky.com',
          phone: '+201234567892',
          passwordHash: 'hashed_password',
          interests: ['الذكاء الاصطناعي', 'التعلم الآلي', 'البيانات'],
          followersCount: 300,
          postsCount: 40,
          lastActivity: new Date()
        }
      })
    ])
    
    // إضافة درجات اهتمام للمستخدمين الجدد
    for (const user of potentialFollowUsers) {
      await prisma.userInterestScore.upsert({
        where: {
          userId_interestName: {
            userId: user.id,
            interestName: 'التكنولوجيا'
          }
        },
        update: {},
        create: {
          userId: user.id,
          interestName: 'التكنولوجيا',
          currentScore: 80 + Math.random() * 15,
          rawScore: 85,
          normalizedScore: 0.8,
          weightedScore: 78,
          category: 'تقنية',
          confidence: 0.85,
          sources: ['posts', 'interactions'],
          sourceWeights: { posts: 0.6, interactions: 0.4 },
          primarySource: 'posts',
          totalInteractions: 30,
          recentInteractions: 8,
          lastActivity: new Date()
        }
      })
    }
    
    // الحصول على اقتراحات المتابعة
    const followSuggestions = await generateSmartFollowSuggestions(testUser.id)
    console.log('💡 اقتراحات المتابعة:', followSuggestions.map((s: any) => ({
      username: s.username,
      fullName: s.fullName,
      score: s.totalScore,
      reasons: s.reasons
    })))
    
    // تحليل فعالية الاقتراحات
    const suggestionAnalytics = await analyzeSuggestionEffectiveness(testUser.id)
    console.log('🎯 تحليل الاقتراحات:', suggestionAnalytics)
    
    // ========================================
    // 4. اختبار تكامل الأنظمة
    // ========================================
    console.log('\n🔗 اختبار تكامل الأنظمة')
    
    // محاكاة سيناريو متكامل: مشاهدة فيديو -> تحديث الاهتمامات -> اقتراحات جديدة
    console.log('1. مشاهدة فيديو جديد...')
    const newVideoSession = await prisma.videoViewSession.create({
      data: {
        userId: testUser.id,
        postId: testVideoPost.id,
        deviceType: 'MOBILE',
        startTime: new Date(),
        endTime: new Date(),
        watchDuration: 120,
        isCompleted: true,
        qualitySettings: '1080p'
      }
    })
    
    console.log('✅ تم إنشاء جلسة المشاهدة الثانية:', newVideoSession.id)
    
    console.log('2. تحديث درجة الاهتمام بناءً على المشاهدة...')
    // تحديث يدوي لدرجة الاهتمام
    await prisma.userInterestScore.update({
      where: {
        userId_interestName: {
          userId: testUser.id,
          interestName: 'التكنولوجيا'
        }
      },
      data: {
        currentScore: { increment: 5 },
        totalInteractions: { increment: 1 },
        recentInteractions: { increment: 1 },
        lastActivity: new Date()
      }
    })
    
    console.log('3. الحصول على اقتراحات محدثة...')
    const updatedSuggestions = await generateSmartFollowSuggestions(testUser.id)
    
    console.log('✅ السيناريو المتكامل اكتمل بنجاح!')
    console.log('📊 الإحصائيات النهائية:')
    console.log('- عدد جلسات المشاهدة:', 2)
    console.log('- اقتراحات المتابعة المحدثة:', updatedSuggestions.length)
    
    // ========================================
    // 5. تنظيف البيانات التجريبية
    // ========================================
    console.log('\n🧹 تنظيف البيانات التجريبية...')
    
    // حذف البيانات التجريبية (اختياري)
    // await prisma.videoViewSession.deleteMany({ where: { userId: testUser.id } })
    // await prisma.post.delete({ where: { id: testVideoPost.id } })
    // await prisma.userInterestScore.deleteMany({ where: { userId: testUser.id } })
    // await prisma.user.delete({ where: { id: testUser.id } })
    
    console.log('🎉 اكتمل الاختبار الشامل بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الاختبار
if (require.main === module) {
  comprehensiveSystemTest()
    .then(() => {
      console.log('✅ انتهى الاختبار')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ فشل الاختبار:', error)
      process.exit(1)
    })
}

export { comprehensiveSystemTest }
