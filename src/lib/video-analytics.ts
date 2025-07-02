// 🎥 مكتبة تحليلات الفيديو المتقدمة - Advanced Video Analytics
// منصة نحكي - Nehky.com
// تم إنشاؤها في 30 يونيو 2025

import { PrismaClient, MediaType, DeviceType } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 📊 مؤشرات أداء الفيديو
// ===============================

export interface VideoMetrics {
  postId: string;
  totalViews: number;
  totalWatchTime: number; // بالثواني
  averageWatchTime: number;
  completionRate: number; // نسبة المشاهدة الكاملة
  retentionRate: number; // نسبة الاحتفاظ بالمشاهدين
  engagementRate: number; // معدل التفاعل
  dropOffPoints: number[]; // نقاط ترك المشاهدة
  peakViewingTime: number; // وقت الذروة بالثواني
  rewatchCount: number; // عدد المشاهدات المتكررة
}

export interface VideoViewSession {
  userId: string;
  postId: string;
  startTime: Date;
  endTime?: Date;
  watchDuration: number; // بالثواني
  isCompleted: boolean;
  dropOffTime?: number; // وقت ترك المشاهدة
  deviceType: DeviceType;
  qualitySettings?: string; // جودة الفيديو المختارة
  isRewatch: boolean; // هل هي مشاهدة متكررة
}

/**
 * تسجيل جلسة مشاهدة فيديو جديدة
 */
export async function trackVideoView(session: VideoViewSession): Promise<void> {
  try {
    // التحقق من أن المنشور فيديو
    const post = await prisma.post.findUnique({
      where: { id: session.postId },
      select: { id: true, mediaType: true, createdAt: true }
    });

    if (!post || post.mediaType !== 'VIDEO') {
      throw new Error('المنشور ليس فيديو أو غير موجود');
    }

    // حفظ جلسة المشاهدة
    await prisma.videoViewSession.create({
      data: {
        userId: session.userId,
        postId: session.postId,
        startTime: session.startTime,
        endTime: session.endTime,
        watchDuration: session.watchDuration,
        isCompleted: session.isCompleted,
        dropOffTime: session.dropOffTime,
        deviceType: session.deviceType,
        qualitySettings: session.qualitySettings,
        isRewatch: session.isRewatch,
      }
    });

    // تحديث إحصائيات الفيديو
    await updateVideoMetrics(session.postId);

    // إنشاء تفاعل VIEW إذا لم يكن موجوداً
    await createViewInteractionIfNeeded(session.userId, session.postId);

  } catch (error) {
    console.error('خطأ في تتبع مشاهدة الفيديو:', error);
    throw error;
  }
}

/**
 * حساب مؤشرات أداء الفيديو
 */
export async function calculateVideoMetrics(postId: string): Promise<VideoMetrics> {
  try {
    // جلب جميع جلسات المشاهدة
    const sessions = await prisma.videoViewSession.findMany({
      where: { postId },
      orderBy: { startTime: 'asc' }
    });

    if (sessions.length === 0) {
      return {
        postId,
        totalViews: 0,
        totalWatchTime: 0,
        averageWatchTime: 0,
        completionRate: 0,
        retentionRate: 0,
        engagementRate: 0,
        dropOffPoints: [],
        peakViewingTime: 0,
        rewatchCount: 0,
      };
    }

    // حساب الإحصائيات الأساسية
    const totalViews = sessions.length;
    const totalWatchTime = sessions.reduce((sum, session) => sum + session.watchDuration, 0);
    const averageWatchTime = totalWatchTime / totalViews;
    const completedViews = sessions.filter(session => session.isCompleted).length;
    const completionRate = (completedViews / totalViews) * 100;
    const rewatchCount = sessions.filter(session => session.isRewatch).length;

    // حساب نقاط الانقطاع
    const dropOffPoints = sessions
      .filter(session => session.dropOffTime !== null)
      .map(session => session.dropOffTime!)
      .sort((a, b) => a - b);

    // تحديد وقت الذروة (الوقت الأكثر مشاهدة)
    const timeSegments: Record<number, number> = {};
    sessions.forEach(session => {
      const segments = Math.floor(session.watchDuration / 10); // كل 10 ثوان
      for (let i = 0; i <= segments; i++) {
        const time = i * 10;
        timeSegments[time] = (timeSegments[time] || 0) + 1;
      }
    });

    const peakViewingTime = Object.entries(timeSegments).reduce((peak, [time, count]) => {
      return count > timeSegments[peak] ? parseInt(time) : peak;
    }, 0);

    // حساب معدل الاحتفاظ (متوسط نسبة المشاهدة)
    const retentionRate = sessions.length > 0 ? 
      sessions.reduce((sum, session) => {
        const videoDuration = getVideoDuration(postId); // سيتم تنفيذها لاحقاً
        return sum + (session.watchDuration / videoDuration) * 100;
      }, 0) / sessions.length : 0;

    // حساب معدل التفاعل
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { likesCount: true, commentsCount: true, sharesCount: true, viewsCount: true }
    });

    const totalInteractions = (post?.likesCount || 0) + (post?.commentsCount || 0) + (post?.sharesCount || 0);
    const engagementRate = post?.viewsCount ? (totalInteractions / post.viewsCount) * 100 : 0;

    return {
      postId,
      totalViews,
      totalWatchTime,
      averageWatchTime,
      completionRate,
      retentionRate,
      engagementRate,
      dropOffPoints,
      peakViewingTime,
      rewatchCount,
    };

  } catch (error) {
    console.error('خطأ في حساب مؤشرات الفيديو:', error);
    throw error;
  }
}

/**
 * تحديث مؤشرات الفيديو في قاعدة البيانات
 */
async function updateVideoMetrics(postId: string): Promise<void> {
  try {
    const metrics = await calculateVideoMetrics(postId);
    
    await prisma.videoMetrics.upsert({
      where: { postId },
      update: {
        totalViews: metrics.totalViews,
        totalWatchTime: metrics.totalWatchTime,
        averageWatchTime: metrics.averageWatchTime,
        completionRate: metrics.completionRate,
        retentionRate: metrics.retentionRate,
        engagementRate: metrics.engagementRate,
        dropOffPoints: metrics.dropOffPoints,
        peakViewingTime: metrics.peakViewingTime,
        rewatchCount: metrics.rewatchCount,
        lastCalculated: new Date(),
      },
      create: {
        postId,
        totalViews: metrics.totalViews,
        totalWatchTime: metrics.totalWatchTime,
        averageWatchTime: metrics.averageWatchTime,
        completionRate: metrics.completionRate,
        retentionRate: metrics.retentionRate,
        engagementRate: metrics.engagementRate,
        dropOffPoints: metrics.dropOffPoints,
        peakViewingTime: metrics.peakViewingTime,
        rewatchCount: metrics.rewatchCount,
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث مؤشرات الفيديو:', error);
  }
}

/**
 * إنشاء تفاعل VIEW إذا لم يكن موجوداً
 */
async function createViewInteractionIfNeeded(userId: string, postId: string): Promise<void> {
  try {
    const existingView = await prisma.interaction.findFirst({
      where: {
        userId,
        postId,
        type: 'VIEW'
      }
    });

    if (!existingView) {
      await prisma.interaction.create({
        data: {
          userId,
          postId,
          type: 'VIEW'
        }
      });
      
      // تحديث عداد المشاهدات
      await prisma.post.update({
        where: { id: postId },
        data: { viewsCount: { increment: 1 } }
      });
    }

  } catch (error) {
    console.error('خطأ في إنشاء تفاعل المشاهدة:', error);
  }
}

/**
 * الحصول على مدة الفيديو (مؤقتاً - يحتاج تنفيذ حقيقي)
 */
function getVideoDuration(postId: string): number {
  // TODO: يجب الحصول على مدة الفيديو الفعلية من metadata
  return 60; // 60 ثانية كقيمة افتراضية
}

// ===============================
// 📈 دوال تحليل البيانات
// ===============================

/**
 * الحصول على أفضل الفيديوهات أداءً
 */
export async function getTopPerformingVideos(limit: number = 10): Promise<any[]> {
  return await prisma.videoMetrics.findMany({
    take: limit,
    orderBy: { engagementRate: 'desc' },
    include: {
      post: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePicture: true,
            }
          }
        }
      }
    }
  });
}

/**
 * تحليل أنماط مشاهدة المستخدم
 */
export async function getUserVideoWatchingPatterns(userId: string): Promise<any> {
  const sessions = await prisma.videoViewSession.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
    take: 100
  });

  const patterns = {
    totalWatchTime: 0,
    averageSessionDuration: 0,
    preferredDeviceType: 'mobile' as string,
    completionRate: 0,
    rewatchRate: 0,
    peakWatchingHours: [] as number[],
    favoriteContentTypes: [] as string[],
  };

  if (sessions.length === 0) return patterns;

  // حساب الإحصائيات
  patterns.totalWatchTime = sessions.reduce((sum, s) => sum + s.watchDuration, 0);
  patterns.averageSessionDuration = patterns.totalWatchTime / sessions.length;
  patterns.completionRate = (sessions.filter(s => s.isCompleted).length / sessions.length) * 100;
  patterns.rewatchRate = (sessions.filter(s => s.isRewatch).length / sessions.length) * 100;

  // تحديد الجهاز المفضل
  const deviceCounts = sessions.reduce((acc, session) => {
    acc[session.deviceType] = (acc[session.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  patterns.preferredDeviceType = Object.entries(deviceCounts).reduce((preferred, [device, count]) => {
    return count > (deviceCounts[preferred] || 0) ? device : preferred;
  }, 'mobile');

  // أوقات المشاهدة المفضلة
  const hourCounts = sessions.reduce((acc, session) => {
    const hour = session.startTime.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  patterns.peakWatchingHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  return patterns;
}

/**
 * اقتراح المحتوى بناءً على تحليلات الفيديو
 */
export async function suggestVideosBasedOnAnalytics(userId: string, limit: number = 10): Promise<any[]> {
  try {
    // الحصول على أنماط المشاهدة
    const patterns = await getUserVideoWatchingPatterns(userId);
    
    // العثور على فيديوهات مشابهة
    const suggestedVideos = await prisma.post.findMany({
      where: {
        mediaType: 'VIDEO',
        isDeleted: false,
        visibility: 'PUBLIC',
        userId: { not: userId }, // استبعاد فيديوهات المستخدم نفسه
      },
      take: limit,
      orderBy: [
        { viewsCount: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePicture: true,
          }
        },
        videoMetrics: true,
      }
    });

    // ترتيب الاقتراحات بناءً على التطابق مع أنماط المستخدم
    return suggestedVideos.sort((a, b) => {
      const scoreA = calculateVideoRelevanceScore(a, patterns);
      const scoreB = calculateVideoRelevanceScore(b, patterns);
      return scoreB - scoreA;
    });

  } catch (error) {
    console.error('خطأ في اقتراح الفيديوهات:', error);
    return [];
  }
}

/**
 * حساب نقاط الصلة للفيديو
 */
function calculateVideoRelevanceScore(video: any, userPatterns: any): number {
  let score = 0;

  // نقاط للأداء الجيد
  if (video.videoMetrics) {
    score += video.videoMetrics.engagementRate * 0.3;
    score += video.videoMetrics.completionRate * 0.2;
    score += video.videoMetrics.retentionRate * 0.2;
  }

  // نقاط للشعبية
  score += Math.log(video.viewsCount + 1) * 5;
  score += Math.log(video.likesCount + 1) * 3;

  // نقاط للحداثة
  const daysOld = (Date.now() - video.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 7) score += 10; // فيديو حديث
  else if (daysOld < 30) score += 5;

  return score;
}

export default prisma;
