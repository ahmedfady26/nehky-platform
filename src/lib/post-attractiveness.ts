// 📊 مكتبة تحليل جاذبية المنشورات - Post Attractiveness Analysis
// منصة نحكي - Nehky.com
// تم إنشاؤها في 27 يونيو 2025

import { PrismaClient, PostAttractiveness, UserEngagementType } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 🎯 تحليل جاذبية المنشور
// ===============================

export interface PostAttractivenessInput {
  postId: string;
  hasMedia?: boolean;
  hasHashtags?: boolean;
  postLength?: number;
  sentimentScore?: number;
  toxicityScore?: number;
}

/**
 * حساب نقاط الجاذبية الإجمالية للمنشور
 */
export async function calculatePostAttractiveness(input: PostAttractivenessInput): Promise<PostAttractiveness> {
  const post = await prisma.post.findUnique({
    where: { id: input.postId },
    include: {
      interactions: true,
      user: true,
      classification: true,
    },
  });

  if (!post) {
    throw new Error('المنشور غير موجود');
  }

  // حساب معدلات التفاعل
  const totalInteractions = post.likesCount + post.commentsCount + post.sharesCount;
  const engagementRate = post.viewsCount > 0 ? (totalInteractions / post.viewsCount) * 100 : 0;

  // حساب الجاذبية البصرية
  const visualAppeal = calculateVisualAppeal(input.hasMedia, post.mediaType, post.mediaUrl);

  // حساب جودة المحتوى
  const contentQuality = calculateContentQuality(
    input.postLength || post.content.length,
    input.sentimentScore,
    input.toxicityScore
  );

  // حساب القابلية للانتشار
  const virality = calculateVirality(post.sharesCount, post.commentsCount, post.createdAt);

  // حساب التفاعل الأولي (أول ساعة)
  const initialResponse = calculateInitialResponse(post.interactions, post.createdAt);

  // حساب مطابقة الجمهور
  const audienceMatch = await calculateAudienceMatch(post.userId, input.postId);

  // حساب توقيت النشر
  const postTiming = calculatePostTiming(post.createdAt);

  // حساب مطابقة الاتجاهات
  const trendAlignment = await calculateTrendAlignment(input.postId);

  // النقاط الإجمالية
  const overallScore = calculateOverallScore({
    visualAppeal,
    contentQuality,
    engagement: engagementRate,
    virality,
    audienceMatch,
    trendAlignment,
  });

  // توقعات الأداء
  const predictions = calculatePerformancePredictions(overallScore, post);

  // إنشاء أو تحديث سجل الجاذبية
  const attractiveness = await prisma.postAttractiveness.upsert({
    where: { postId: input.postId },
    update: {
      overallScore,
      visualAppeal,
      contentQuality,
      engagement: engagementRate,
      virality,
      initialResponse,
      audienceMatch,
      hasMedia: input.hasMedia || false,
      hasHashtags: input.hasHashtags || false,
      postLength: input.postLength || post.content.length,
      postTiming,
      sentimentScore: input.sentimentScore || 0,
      toxicityScore: input.toxicityScore || 0,
      trendAlignment,
      predictedViews: predictions.views,
      predictedLikes: predictions.likes,
      predictedShares: predictions.shares,
      confidenceLevel: predictions.confidence,
      lastCalculated: new Date(),
      needsRecalculation: false,
    },
    create: {
      postId: input.postId,
      overallScore,
      visualAppeal,
      contentQuality,
      engagement: engagementRate,
      virality,
      initialResponse,
      audienceMatch,
      hasMedia: input.hasMedia || false,
      hasHashtags: input.hasHashtags || false,
      postLength: input.postLength || post.content.length,
      postTiming,
      sentimentScore: input.sentimentScore || 0,
      toxicityScore: input.toxicityScore || 0,
      trendAlignment,
      predictedViews: predictions.views,
      predictedLikes: predictions.likes,
      predictedShares: predictions.shares,
      confidenceLevel: predictions.confidence,
    },
  });

  return attractiveness;
}

/**
 * حساب الجاذبية البصرية
 */
function calculateVisualAppeal(hasMedia?: boolean, mediaType?: string | null, mediaUrl?: string | null): number {
  let score = 20; // النقاط الأساسية للنص
  
  if (hasMedia && mediaUrl) {
    score += 30; // إضافة وسائط
    
    if (mediaType === 'VIDEO') {
      score += 20; // الفيديو أكثر جاذبية
    } else if (mediaType === 'IMAGE') {
      score += 15; // الصور جذابة
    }
  }
  
  return Math.min(score, 100);
}

/**
 * حساب جودة المحتوى
 */
function calculateContentQuality(length: number, sentiment?: number, toxicity?: number): number {
  let score = 50; // النقاط الأساسية
  
  // طول المحتوى المثالي (50-300 حرف)
  if (length >= 50 && length <= 300) {
    score += 20;
  } else if (length > 300 && length <= 500) {
    score += 10;
  } else if (length < 50) {
    score -= 10;
  } else if (length > 1000) {
    score -= 20;
  }
  
  // تحليل المشاعر (المحتوى الإيجابي أفضل)
  if (sentiment !== undefined) {
    if (sentiment > 0.3) {
      score += 15;
    } else if (sentiment < -0.3) {
      score -= 10;
    }
  }
  
  // مستوى السمية (أقل سمية = أفضل)
  if (toxicity !== undefined) {
    if (toxicity < 0.1) {
      score += 10;
    } else if (toxicity > 0.5) {
      score -= 20;
    }
  }
  
  return Math.max(0, Math.min(score, 100));
}

/**
 * حساب القابلية للانتشار
 */
function calculateVirality(shares: number, comments: number, createdAt: Date): number {
  const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  
  // معدل المشاركات بالساعة
  const shareRate = hoursOld > 0 ? shares / hoursOld : shares;
  
  // معدل التعليقات بالساعة
  const commentRate = hoursOld > 0 ? comments / hoursOld : comments;
  
  // نقاط الانتشار
  let score = 0;
  
  // المشاركات أهم للانتشار
  score += shareRate * 15;
  
  // التعليقات تدل على الاهتمام
  score += commentRate * 8;
  
  // مكافأة للمحتوى الجديد مع تفاعل سريع
  if (hoursOld < 6 && (shareRate > 1 || commentRate > 2)) {
    score *= 1.5;
  }
  
  return Math.min(score, 100);
}

/**
 * حساب التفاعل الأولي
 */
function calculateInitialResponse(interactions: any[], createdAt: Date): number {
  const firstHour = new Date(createdAt.getTime() + 60 * 60 * 1000);
  
  const earlyInteractions = interactions.filter(
    interaction => interaction.createdAt <= firstHour
  );
  
  return Math.min(earlyInteractions.length * 5, 100);
}

/**
 * حساب مطابقة الجمهور
 */
async function calculateAudienceMatch(userId: string, postId: string): Promise<number> {
  try {
    // جلب اهتمامات صاحب المنشور
    const userInterests = await prisma.userInterestScore.findMany({
      where: { userId },
      take: 10,
      orderBy: { currentScore: 'desc' },
    });
    
    if (userInterests.length === 0) {
      return 50; // متوسط إذا لم توجد اهتمامات
    }
    
    // حساب متوسط الاهتمامات
    const avgScore = userInterests.reduce((sum, interest) => sum + interest.currentScore, 0) / userInterests.length;
    
    return Math.min(avgScore, 100);
  } catch (error) {
    console.error('خطأ في حساب مطابقة الجمهور:', error);
    return 50;
  }
}

/**
 * حساب توقيت النشر
 */
function calculatePostTiming(createdAt: Date): number {
  const hour = createdAt.getHours();
  const day = createdAt.getDay();
  
  let score = 50; // النقاط الأساسية
  
  // أوقات الذروة (8-11 صباحاً، 7-10 مساءً)
  if ((hour >= 8 && hour <= 11) || (hour >= 19 && hour <= 22)) {
    score += 30;
  }
  
  // أيام العمل أفضل للمحتوى المهني
  if (day >= 1 && day <= 5) {
    score += 10;
  }
  
  // عطلة نهاية الأسبوع للمحتوى الترفيهي
  if (day === 0 || day === 6) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

/**
 * حساب مطابقة الاتجاهات
 */
async function calculateTrendAlignment(postId: string): Promise<number> {
  try {
    // جلب الهاشتاغات المرتبطة بالمنشور
    const postHashtags = await prisma.postHashtag.findMany({
      where: { postId },
      include: { hashtag: true },
    });
    
    if (postHashtags.length === 0) {
      return 30; // نقاط أساسية للمنشورات بدون هاشتاغ
    }
    
    // التحقق من الاتجاهات الرائجة
    const trendingTopics = await prisma.trendingTopic.findMany({
      where: {
        isActive: true,
        type: 'HASHTAG',
      },
      take: 20,
      orderBy: { trendScore: 'desc' },
    });
    
    let alignmentScore = 30;
    
    for (const postHashtag of postHashtags) {
      const isTrending = trendingTopics.some(
        trend => trend.referenceId === postHashtag.hashtagId
      );
      
      if (isTrending) {
        alignmentScore += 20;
      }
    }
    
    return Math.min(alignmentScore, 100);
  } catch (error) {
    console.error('خطأ في حساب مطابقة الاتجاهات:', error);
    return 30;
  }
}

/**
 * حساب النقاط الإجمالية
 */
function calculateOverallScore(scores: {
  visualAppeal: number;
  contentQuality: number;
  engagement: number;
  virality: number;
  audienceMatch: number;
  trendAlignment: number;
}): number {
  // الأوزان لكل عامل
  const weights = {
    visualAppeal: 0.15,
    contentQuality: 0.25,
    engagement: 0.25,
    virality: 0.15,
    audienceMatch: 0.10,
    trendAlignment: 0.10,
  };
  
  const weightedScore = 
    scores.visualAppeal * weights.visualAppeal +
    scores.contentQuality * weights.contentQuality +
    scores.engagement * weights.engagement +
    scores.virality * weights.virality +
    scores.audienceMatch * weights.audienceMatch +
    scores.trendAlignment * weights.trendAlignment;
  
  return Math.round(weightedScore);
}

/**
 * حساب توقعات الأداء
 */
function calculatePerformancePredictions(overallScore: number, post: any): {
  views: number;
  likes: number;
  shares: number;
  confidence: number;
} {
  // معاملات التوقع بناءً على النقاط
  const multiplier = overallScore / 100;
  
  // التوقعات الأساسية
  const baseViews = 100;
  const baseLikes = 10;
  const baseShares = 2;
  
  // حساب التوقعات
  const predictedViews = Math.round(baseViews * multiplier * (1 + Math.random() * 0.5));
  const predictedLikes = Math.round(baseLikes * multiplier * (1 + Math.random() * 0.3));
  const predictedShares = Math.round(baseShares * multiplier * (1 + Math.random() * 0.2));
  
  // مستوى الثقة
  const confidence = Math.min(0.5 + (multiplier * 0.4), 0.9);
  
  return {
    views: Math.max(predictedViews, 1),
    likes: Math.max(predictedLikes, 0),
    shares: Math.max(predictedShares, 0),
    confidence: Math.round(confidence * 100) / 100,
  };
}

// ===============================
// 🔍 دوال الاستعلام والتحليل
// ===============================

/**
 * جلب تحليل جاذبية المنشور
 */
export async function getPostAttractiveness(postId: string): Promise<PostAttractiveness | null> {
  return await prisma.postAttractiveness.findUnique({
    where: { postId },
    include: {
      post: {
        select: {
          id: true,
          content: true,
          mediaType: true,
          createdAt: true,
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
          viewsCount: true,
        },
      },
    },
  });
}

/**
 * جلب أكثر المنشورات جاذبية
 */
export async function getMostAttractivePost(limit: number = 10) {
  return await prisma.postAttractiveness.findMany({
    take: limit,
    orderBy: { overallScore: 'desc' },
    include: {
      post: {
        select: {
          id: true,
          content: true,
          mediaType: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      },
    },
  });
}

/**
 * جلب المنشورات التي تحتاج إعادة حساب
 */
export async function getPostsNeedingRecalculation(limit: number = 100) {
  return await prisma.postAttractiveness.findMany({
    where: { needsRecalculation: true },
    take: limit,
    orderBy: { lastCalculated: 'asc' },
  });
}

/**
 * تحديث جميع المنشورات التي تحتاج إعادة حساب
 */
export async function recalculateAllPostsAttractiveness() {
  const posts = await getPostsNeedingRecalculation();
  
  const results = [];
  
  for (const post of posts) {
    try {
      const result = await calculatePostAttractiveness({ postId: post.postId });
      results.push({ postId: post.postId, success: true, result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      results.push({ postId: post.postId, success: false, error: errorMessage });
    }
  }
  
  return results;
}

/**
 * إحصائيات جاذبية المنشورات
 */
export async function getAttractivenessStatistics() {
  const stats = await prisma.postAttractiveness.aggregate({
    _avg: {
      overallScore: true,
      visualAppeal: true,
      contentQuality: true,
      engagement: true,
      virality: true,
    },
    _max: {
      overallScore: true,
    },
    _min: {
      overallScore: true,
    },
    _count: true,
  });
  
  const distribution = await prisma.postAttractiveness.groupBy({
    by: ['overallScore'],
    _count: true,
    orderBy: { overallScore: 'desc' },
  });
  
  return {
    averages: stats._avg,
    maxScore: stats._max.overallScore,
    minScore: stats._min.overallScore,
    totalPosts: stats._count,
    scoreDistribution: distribution,
  };
}

export default prisma;
