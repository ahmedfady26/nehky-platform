// نظام مراقبة الأداء والإشعارات
// src/lib/monitoring.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PerformanceMetrics {
  systemName: string;
  executionTime: number;
  successRate: number;
  errorCount: number;
  lastExecution: Date;
  status: 'HEALTHY' | 'WARNING' | 'ERROR';
}

/**
 * مراقبة أداء نظام تحليلات الفيديو
 */
export async function monitorVideoAnalytics(): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  let errorCount = 0;
  let successCount = 0;
  
  try {
    // اختبار عينة من الفيديوهات
    const sampleVideos = await prisma.post.findMany({
      where: { mediaType: 'VIDEO' },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    
    for (const video of sampleVideos) {
      try {
        // محاولة حساب التحليلات
        await prisma.videoViewSession.count({
          where: { postId: video.id }
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }
    
    const executionTime = Date.now() - startTime;
    const successRate = sampleVideos.length > 0 ? (successCount / sampleVideos.length) * 100 : 0;
    
    return {
      systemName: 'Video Analytics',
      executionTime,
      successRate,
      errorCount,
      lastExecution: new Date(),
      status: successRate > 90 ? 'HEALTHY' : successRate > 70 ? 'WARNING' : 'ERROR'
    };
    
  } catch (error) {
    return {
      systemName: 'Video Analytics',
      executionTime: Date.now() - startTime,
      successRate: 0,
      errorCount: 1,
      lastExecution: new Date(),
      status: 'ERROR'
    };
  }
}

/**
 * مراقبة أداء نظام الاهتمامات
 */
export async function monitorInterestSystem(): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  try {
    // فحص حالة درجات الاهتمامات
    const totalInterests = await prisma.userInterestScore.count();
    const archivedInterests = await prisma.userInterestScore.count({
      where: { isArchived: true }
    });
    const needsRecalculation = await prisma.userInterestScore.count({
      where: { needsRecalculation: true }
    });
    
    const executionTime = Date.now() - startTime;
    const healthyRatio = totalInterests > 0 ? ((totalInterests - archivedInterests) / totalInterests) * 100 : 100;
    const recalculationRatio = totalInterests > 0 ? (needsRecalculation / totalInterests) * 100 : 0;
    
    let status: 'HEALTHY' | 'WARNING' | 'ERROR' = 'HEALTHY';
    if (recalculationRatio > 50) status = 'WARNING';
    if (healthyRatio < 50) status = 'ERROR';
    
    return {
      systemName: 'Interest System',
      executionTime,
      successRate: healthyRatio,
      errorCount: recalculationRatio > 30 ? 1 : 0,
      lastExecution: new Date(),
      status
    };
    
  } catch (error) {
    return {
      systemName: 'Interest System',
      executionTime: Date.now() - startTime,
      successRate: 0,
      errorCount: 1,
      lastExecution: new Date(),
      status: 'ERROR'
    };
  }
}

/**
 * مراقبة أداء نظام اقتراحات المتابعة
 */
export async function monitorFollowSuggestions(): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  try {
    // فحص عينة من المستخدمين النشطين
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // فحص العلاقات
    const followRelations = await prisma.userFollow.count();
    
    const executionTime = Date.now() - startTime;
    const engagementRatio = activeUsers > 0 ? (followRelations / activeUsers) * 100 : 0;
    
    return {
      systemName: 'Follow Suggestions',
      executionTime,
      successRate: Math.min(engagementRatio, 100),
      errorCount: 0,
      lastExecution: new Date(),
      status: activeUsers > 0 ? 'HEALTHY' : 'WARNING'
    };
    
  } catch (error) {
    return {
      systemName: 'Follow Suggestions',
      executionTime: Date.now() - startTime,
      successRate: 0,
      errorCount: 1,
      lastExecution: new Date(),
      status: 'ERROR'
    };
  }
}

/**
 * تشغيل فحص شامل لجميع الأنظمة
 */
export async function runSystemHealthCheck(): Promise<PerformanceMetrics[]> {
  console.log('🔍 بدء فحص صحة الأنظمة...');
  
  const metrics = await Promise.all([
    monitorVideoAnalytics(),
    monitorInterestSystem(),
    monitorFollowSuggestions()
  ]);
  
  // طباعة التقرير
  console.log('\n📊 تقرير صحة الأنظمة:');
  metrics.forEach(metric => {
    const statusIcon = metric.status === 'HEALTHY' ? '✅' : 
                      metric.status === 'WARNING' ? '⚠️' : '❌';
    
    console.log(`${statusIcon} ${metric.systemName}:
      - الحالة: ${metric.status}
      - معدل النجاح: ${metric.successRate.toFixed(1)}%
      - وقت التنفيذ: ${metric.executionTime}ms
      - عدد الأخطاء: ${metric.errorCount}`);
  });
  
  return metrics;
}

/**
 * إرسال تنبيهات عند وجود مشاكل
 */
export async function sendHealthAlerts(metrics: PerformanceMetrics[]) {
  const criticalIssues = metrics.filter(m => m.status === 'ERROR');
  const warnings = metrics.filter(m => m.status === 'WARNING');
  
  if (criticalIssues.length > 0) {
    console.log('🚨 تنبيه: مشاكل حرجة في الأنظمة:');
    criticalIssues.forEach(issue => {
      console.log(`❌ ${issue.systemName}: معدل نجاح ${issue.successRate}%`);
    });
    
    // هنا يمكن إضافة إرسال إيميل أو إشعار Slack
    // await sendCriticalAlert(criticalIssues);
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ تحذيرات الأنظمة:');
    warnings.forEach(warning => {
      console.log(`⚠️ ${warning.systemName}: يحتاج مراجعة`);
    });
  }
}

/**
 * مهمة دورية لمراقبة الأنظمة
 */
export async function startHealthMonitoring() {
  console.log('🔍 بدء مراقبة صحة الأنظمة...');
  
  // فحص كل 30 دقيقة
  setInterval(async () => {
    try {
      const metrics = await runSystemHealthCheck();
      await sendHealthAlerts(metrics);
    } catch (error) {
      console.error('خطأ في مراقبة الأنظمة:', error);
    }
  }, 30 * 60 * 1000);
  
  // فحص فوري عند البدء
  const initialMetrics = await runSystemHealthCheck();
  await sendHealthAlerts(initialMetrics);
  
  console.log('✅ تم تفعيل مراقبة الأنظمة');
}
