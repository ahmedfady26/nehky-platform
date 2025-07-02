// 🎯 نظام التتبع المتقدم لسلوك المستخدم - Advanced User Behavior Tracking
// منصة نحكي - Nehky.com
// تم إنشاؤه في 1 يوليو 2025

import { PrismaClient, UserEngagementType, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 📱 تتبع التمرير والسلوك
// ===============================

export interface ScrollTrackingData {
  postId: string;
  userId: string;
  scrollDepth: number; // نسبة التمرير (0-100%)
  timeOnPost: number; // وقت قضاه المستخدم على المنشور (ثواني)
  isVisible: boolean; // هل المنشور مرئي حالياً
  viewportHeight: number; // ارتفاع الشاشة
  postHeight: number; // ارتفاع المنشور
  scrollSpeed: number; // سرعة التمرير (px/second)
  pauseTime: number; // وقت التوقف على المنشور
  sessionId: string; // معرف الجلسة
  timestamp: Date;
}

export interface VideoWatchingData {
  postId: string;
  userId: string;
  videoDuration: number; // مدة الفيديو الكاملة (ثواني)
  watchedDuration: number; // المدة المشاهدة (ثواني)
  watchedPercentage: number; // نسبة المشاهدة (0-100%)
  playCount: number; // عدد مرات التشغيل
  pauseCount: number; // عدد مرات الإيقاف
  seekCount: number; // عدد مرات التقديم/التأخير
  qualityChanges: number; // عدد تغييرات الجودة
  volumeChanges: number; // عدد تغييرات الصوت
  isCompleted: boolean; // هل أكمل المشاهدة
  exitPoint: number; // نقطة الخروج (ثانية)
  sessionId: string;
  timestamp: Date;
}

export interface InteractionTrackingData {
  postId: string;
  userId: string;
  interactionType: UserEngagementType; // LIKE, COMMENT, SHARE, VIEW
  interactionTime: Date; // وقت التفاعل
  timeToInteract: number; // الوقت من رؤية المنشور للتفاعل (ثواني)
  scrollPosition: number; // موقع التمرير عند التفاعل
  clickPosition: { x: number; y: number }; // موقع النقر
  deviceType: string; // نوع الجهاز
  sessionId: string;
  timestamp: Date;
}

// ===============================
// 🎯 دوال التتبع الأساسية
// ===============================

/**
 * تتبع سلوك التمرير للمستخدم
 */
export async function trackScrollBehavior(data: ScrollTrackingData): Promise<void> {
  try {
    // حفظ بيانات التمرير
    await prisma.userScrollTracking.create({
      data: {
        userId: data.userId,
        postId: data.postId,
        scrollDepth: data.scrollDepth,
        timeOnPost: data.timeOnPost,
        pauseTime: data.pauseTime,
        scrollSpeed: data.scrollSpeed,
        sessionId: data.sessionId,
        isVisible: data.isVisible,
        viewportData: JSON.stringify({
          height: data.viewportHeight,
          postHeight: data.postHeight
        }),
        timestamp: data.timestamp
      }
    });

    // تحديث نقاط الاهتمام بناءً على سلوك التمرير
    await updateInterestBasedOnScroll(data);

  } catch (error) {
    console.error('خطأ في تتبع التمرير:', error);
  }
}

/**
 * تتبع مشاهدة الفيديو المتقدم
 */
export async function trackVideoWatching(data: VideoWatchingData): Promise<void> {
  try {
    // حفظ بيانات مشاهدة الفيديو
    await prisma.userVideoTracking.create({
      data: {
        userId: data.userId,
        postId: data.postId,
        videoDuration: data.videoDuration,
        watchedDuration: data.watchedDuration,
        watchedPercentage: data.watchedPercentage,
        playCount: data.playCount,
        pauseCount: data.pauseCount,
        seekCount: data.seekCount,
        isCompleted: data.isCompleted,
        exitPoint: data.exitPoint,
        sessionId: data.sessionId,
        interactionData: JSON.stringify({
          qualityChanges: data.qualityChanges,
          volumeChanges: data.volumeChanges
        }),
        timestamp: data.timestamp
      }
    });

    // تحديث نقاط الاهتمام بناءً على مشاهدة الفيديو
    await updateInterestBasedOnVideo(data);

  } catch (error) {
    console.error('خطأ في تتبع الفيديو:', error);
  }
}

/**
 * تتبع التفاعل المتقدم
 */
export async function trackAdvancedInteraction(data: InteractionTrackingData): Promise<void> {
  try {
    // حفظ بيانات التفاعل
    await prisma.userInteractionTracking.create({
      data: {
        userId: data.userId,
        postId: data.postId,
        interactionType: data.interactionType,
        timeToInteract: data.timeToInteract,
        scrollPosition: data.scrollPosition,
        clickPosition: JSON.stringify(data.clickPosition),
        deviceType: data.deviceType,
        sessionId: data.sessionId,
        timestamp: data.timestamp
      }
    });

    // تحديث نقاط الاهتمام بناءً على التفاعل
    await updateInterestBasedOnInteraction(data);

  } catch (error) {
    console.error('خطأ في تتبع التفاعل:', error);
  }
}

// ===============================
// 🧠 تحليل الاهتمامات المتقدم
// ===============================

/**
 * تحديث الاهتمامات بناءً على سلوك التمرير
 */
async function updateInterestBasedOnScroll(data: ScrollTrackingData): Promise<void> {
  try {
    // جلب تصنيف المنشور
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
      include: { classification: true }
    });

    if (!post?.classification) return;

    // حساب نقاط الاهتمام بناءً على سلوك التمرير
    let interestScore = 0;

    // نقاط إضافية للتوقف الطويل
    if (data.pauseTime > 3) {
      interestScore += Math.min(data.pauseTime * 0.5, 5);
    }

    // نقاط إضافية للتمرير البطيء (يدل على الاهتمام)
    if (data.scrollSpeed < 100) {
      interestScore += 2;
    }

    // نقاط إضافية للوقت الطويل على المنشور
    if (data.timeOnPost > 5) {
      interestScore += Math.min(data.timeOnPost * 0.2, 3);
    }

    // خصم نقاط للتمرير السريع (عدم اهتمام)
    if (data.scrollSpeed > 500) {
      interestScore -= 1;
    }

    // تحديث نقاط الاهتمام
    if (interestScore > 0) {
      const categoryName = post.classification.primaryCategoryId || 'general';
      
      await prisma.userInterestScore.upsert({
        where: {
          userId_interestName: {
            userId: data.userId,
            interestName: categoryName
          }
        },
        update: {
          currentScore: { increment: interestScore },
          rawScore: { increment: interestScore },
          lastActivity: new Date(),
          totalInteractions: { increment: 1 }
        },
        create: {
          userId: data.userId,
          interestName: categoryName,
          category: categoryName,
          currentScore: interestScore,
          rawScore: interestScore,
          normalizedScore: Math.min(interestScore / 100, 1),
          weightedScore: interestScore,
          sources: ['scroll_tracking'],
          sourceWeights: JSON.stringify({ scroll_tracking: 1.0 }),
          primarySource: 'scroll_tracking',
          lastActivity: new Date()
        }
      });
    }

  } catch (error) {
    console.error('خطأ في تحديث الاهتمامات من التمرير:', error);
  }
}

/**
 * تحديث الاهتمامات بناءً على مشاهدة الفيديو
 */
async function updateInterestBasedOnVideo(data: VideoWatchingData): Promise<void> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
      include: { classification: true }
    });

    if (!post?.classification) return;

    let interestScore = 0;

    // نقاط بناءً على نسبة المشاهدة
    interestScore += data.watchedPercentage * 0.1;

    // نقاط إضافية للمشاهدة الكاملة
    if (data.isCompleted) {
      interestScore += 5;
    }

    // نقاط إضافية للمشاهدة المتكررة
    if (data.playCount > 1) {
      interestScore += data.playCount * 0.5;
    }

    // نقاط للتفاعل مع عناصر التحكم
    if (data.seekCount > 0) {
      interestScore += 1; // المراجعة تدل على الاهتمام
    }

    const categoryName = post.classification.primaryCategoryId || 'general';
    
    await prisma.userInterestScore.upsert({
      where: {
        userId_interestName: {
          userId: data.userId,
          interestName: categoryName
        }
      },
      update: {
        currentScore: { increment: interestScore },
        rawScore: { increment: interestScore },
        lastActivity: new Date(),
        totalInteractions: { increment: 1 }
      },
      create: {
        userId: data.userId,
        interestName: categoryName,
        category: categoryName,
        currentScore: interestScore,
        rawScore: interestScore,
        normalizedScore: Math.min(interestScore / 100, 1),
        weightedScore: interestScore,
        sources: ['video_tracking'],
        sourceWeights: JSON.stringify({ video_tracking: 1.0 }),
        primarySource: 'video_tracking',
        lastActivity: new Date()
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الاهتمامات من الفيديو:', error);
  }
}

/**
 * تحديث الاهتمامات بناءً على التفاعل
 */
async function updateInterestBasedOnInteraction(data: InteractionTrackingData): Promise<void> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
      include: { classification: true }
    });

    if (!post?.classification) return;

    let interestScore = 0;

    // نقاط مختلفة لكل نوع تفاعل
    switch (data.interactionType) {
      case 'LIKE':
        interestScore = 3;
        break;
      case 'COMMENT':
        interestScore = 5;
        break;
      case 'SHARE':
        interestScore = 7;
        break;
      default:
        interestScore = 1;
        break;
    }

    // نقاط إضافية للتفاعل السريع (يدل على اهتمام قوي)
    if (data.timeToInteract < 5) {
      interestScore += 2;
    }

    const categoryName = post.classification.primaryCategoryId || 'general';
    
    await prisma.userInterestScore.upsert({
      where: {
        userId_interestName: {
          userId: data.userId,
          interestName: categoryName
        }
      },
      update: {
        currentScore: { increment: interestScore },
        rawScore: { increment: interestScore },
        lastActivity: new Date(),
        totalInteractions: { increment: 1 }
      },
      create: {
        userId: data.userId,
        interestName: categoryName,
        category: categoryName,
        currentScore: interestScore,
        rawScore: interestScore,
        normalizedScore: Math.min(interestScore / 100, 1),
        weightedScore: interestScore,
        sources: ['interaction_tracking'],
        sourceWeights: JSON.stringify({ interaction_tracking: 1.0 }),
        primarySource: 'interaction_tracking',
        lastActivity: new Date()
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الاهتمامات من التفاعل:', error);
  }
}

// ===============================
// 📊 دوال التحليل والإحصائيات
// ===============================

/**
 * تحليل أنماط التمرير للمستخدم
 */
export async function analyzeUserScrollPatterns(userId: string): Promise<any> {
  try {
    const scrollData = await prisma.userScrollTracking.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const analysis = {
      averageTimeOnPost: scrollData.reduce((sum, item) => sum + item.timeOnPost, 0) / scrollData.length,
      averageScrollSpeed: scrollData.reduce((sum, item) => sum + item.scrollSpeed, 0) / scrollData.length,
      averagePauseTime: scrollData.reduce((sum, item) => sum + item.pauseTime, 0) / scrollData.length,
      engagementRate: scrollData.filter(item => item.timeOnPost > 5).length / scrollData.length,
      totalInteractions: scrollData.length
    };

    return analysis;

  } catch (error) {
    console.error('خطأ في تحليل أنماط التمرير:', error);
    return null;
  }
}

/**
 * تحليل أنماط مشاهدة الفيديو للمستخدم
 */
export async function analyzeUserVideoPatterns(userId: string): Promise<any> {
  try {
    const videoData = await prisma.userVideoTracking.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    const analysis = {
      averageWatchPercentage: videoData.reduce((sum, item) => sum + item.watchedPercentage, 0) / videoData.length,
      completionRate: videoData.filter(item => item.isCompleted).length / videoData.length,
      averagePlayCount: videoData.reduce((sum, item) => sum + item.playCount, 0) / videoData.length,
      engagementIndicator: videoData.reduce((sum, item) => sum + item.seekCount + item.pauseCount, 0) / videoData.length
    };

    return analysis;

  } catch (error) {
    console.error('خطأ في تحليل أنماط الفيديو:', error);
    return null;
  }
}

/**
 * إنشاء ملف المستخدم الذكي
 */
export async function generateSmartUserProfile(userId: string): Promise<any> {
  try {
    const [scrollPatterns, videoPatterns, interests] = await Promise.all([
      analyzeUserScrollPatterns(userId),
      analyzeUserVideoPatterns(userId),
      prisma.userInterestScore.findMany({
        where: { userId },
        orderBy: { currentScore: 'desc' },
        take: 10
      })
    ]);

    const smartProfile = {
      userId,
      scrollBehavior: scrollPatterns,
      videoBehavior: videoPatterns,
      topInterests: interests,
      profileType: determineUserType(scrollPatterns, videoPatterns),
      lastUpdated: new Date()
    };

    return smartProfile;

  } catch (error) {
    console.error('خطأ في إنشاء الملف الذكي:', error);
    return null;
  }
}

/**
 * تحديد نوع المستخدم بناءً على سلوكه
 */
function determineUserType(scrollPatterns: any, videoPatterns: any): string {
  if (!scrollPatterns || !videoPatterns) return 'unknown';

  const isSlowScroller = scrollPatterns.averageScrollSpeed < 200;
  const isHighEngagement = scrollPatterns.engagementRate > 0.6;
  const isVideoLover = videoPatterns.averageWatchPercentage > 70;
  const isCompletionist = videoPatterns.completionRate > 0.8;

  if (isVideoLover && isCompletionist) return 'video_enthusiast';
  if (isSlowScroller && isHighEngagement) return 'content_explorer';
  if (scrollPatterns.averageScrollSpeed > 500) return 'quick_browser';
  if (isHighEngagement) return 'engaged_user';
  
  return 'casual_user';
}

export default {
  trackScrollBehavior,
  trackVideoWatching,
  trackAdvancedInteraction,
  analyzeUserScrollPatterns,
  analyzeUserVideoPatterns,
  generateSmartUserProfile
};
