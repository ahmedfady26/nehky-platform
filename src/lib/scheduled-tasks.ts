// مهام دورية للأنظمة الجديدة
// src/lib/scheduled-tasks.ts

import { runPeriodicOptimizations } from './interest-optimization';
import { calculateVideoMetrics } from './video-analytics';
import { generateSmartFollowSuggestions } from './smart-follow-suggestions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * مهمة دورية لتحسين خوارزميات الاهتمامات
 * تعمل كل 6 ساعات
 */
export async function scheduleInterestOptimization() {
  console.log('🕐 بدء مهمة تحسين الاهتمامات الدورية...');
  
  try {
    const result = await runPeriodicOptimizations();
    
    console.log(`✅ انتهت مهمة تحسين الاهتمامات:
      - تحديث: ${result.timeDecayUpdates.updated} اهتمام
      - أرشفة: ${result.timeDecayUpdates.archived} اهتمام  
      - حذف: ${result.timeDecayUpdates.deleted} اهتمام
      - مجموعات: ${result.clustersCreated} مجموعة محتوى
      - مستخدمين: ${result.usersProcessed} مستخدم`);
      
    // حفظ السجل في قاعدة البيانات
    await prisma.systemLog.create({
      data: {
        type: 'INTEREST_OPTIMIZATION',
        status: 'SUCCESS',
        details: JSON.stringify(result),
        executedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('❌ خطأ في مهمة تحسين الاهتمامات:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    await prisma.systemLog.create({
      data: {
        type: 'INTEREST_OPTIMIZATION',
        status: 'ERROR',
        details: { error: errorMessage },
        executedAt: new Date()
      }
    });
  }
}

/**
 * مهمة دورية لتحديث تحليلات الفيديوهات
 * تعمل كل ساعة
 */
export async function scheduleVideoAnalyticsUpdate() {
  console.log('📊 بدء مهمة تحديث تحليلات الفيديو...');
  
  try {
    // جلب الفيديوهات النشطة (التي تم نشرها في آخر 7 أيام)
    const activeVideos = await prisma.post.findMany({
      where: {
        mediaType: 'VIDEO',
        isDeleted: false,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    let updatedCount = 0;
    
    for (const video of activeVideos) {
      try {
        const metrics = await calculateVideoMetrics(video.id);
        
        // تحديث أو إنشاء VideoMetrics
        await prisma.videoMetrics.upsert({
          where: { postId: video.id },
          update: {
            totalViews: metrics.totalViews,
            averageWatchTime: metrics.averageWatchTime,
            completionRate: metrics.completionRate,
            retentionRate: metrics.retentionRate,
            updatedAt: new Date()
          },
          create: {
            postId: video.id,
            totalViews: metrics.totalViews,
            averageWatchTime: metrics.averageWatchTime,
            completionRate: metrics.completionRate,
            retentionRate: metrics.retentionRate
          }
        });
        
        updatedCount++;
      } catch (error) {
        console.error(`خطأ في تحديث تحليلات الفيديو ${video.id}:`, error);
      }
    }
    
    console.log(`✅ تم تحديث تحليلات ${updatedCount} فيديو`);
    
  } catch (error) {
    console.error('❌ خطأ في مهمة تحليلات الفيديو:', error);
  }
}

/**
 * مهمة دورية لتجديد اقتراحات المتابعة
 * تعمل كل 12 ساعة
 */
export async function scheduleFollowSuggestionsRefresh() {
  console.log('👥 بدء مهمة تجديد اقتراحات المتابعة...');
  
  try {
    // جلب المستخدمين النشطين
    const activeUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // آخر 3 أيام
        }
      },
      orderBy: { lastActivity: 'desc' },
      take: 50 // معالجة 50 مستخدم في المرة الواحدة
    });
    
    let suggestionsGenerated = 0;
    
    for (const user of activeUsers) {
      try {
        const suggestions = await generateSmartFollowSuggestions(user.id);
        
        // حفظ الاقتراحات في cache أو قاعدة بيانات منفصلة
        // await cacheFollowSuggestions(user.id, suggestions);
        
        suggestionsGenerated += suggestions.length;
        
      } catch (error) {
        console.error(`خطأ في توليد اقتراحات للمستخدم ${user.id}:`, error);
      }
    }
    
    console.log(`✅ تم توليد ${suggestionsGenerated} اقتراح لـ ${activeUsers.length} مستخدم`);
    
  } catch (error) {
    console.error('❌ خطأ في مهمة اقتراحات المتابعة:', error);
  }
}

/**
 * مشغل المهام الدورية الرئيسي
 */
export async function startScheduledTasks() {
  console.log('🚀 بدء تشغيل المهام الدورية...');
  
  // مهمة تحسين الاهتمامات - كل 6 ساعات
  setInterval(scheduleInterestOptimization, 6 * 60 * 60 * 1000);
  
  // مهمة تحليلات الفيديو - كل ساعة
  setInterval(scheduleVideoAnalyticsUpdate, 60 * 60 * 1000);
  
  // مهمة اقتراحات المتابعة - كل 12 ساعة  
  setInterval(scheduleFollowSuggestionsRefresh, 12 * 60 * 60 * 1000);
  
  // تشغيل فوري للمهام عند البدء
  await scheduleInterestOptimization();
  await scheduleVideoAnalyticsUpdate();
  await scheduleFollowSuggestionsRefresh();
  
  console.log('✅ تم تفعيل جميع المهام الدورية');
}

/**
 * إيقاف المهام الدورية
 */
export function stopScheduledTasks() {
  // إيقاف جميع المؤقتات
  console.log('⏹️ تم إيقاف المهام الدورية');
}
