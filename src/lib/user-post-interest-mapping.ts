// 🎯 مكتبة ربط منشورات المستخدم بتحليل اهتماماته - User Post Interest Mapping
// منصة نحكي - Nehky.com
// تم إنشاؤها في 27 يونيو 2025

import { PrismaClient, UserPostInterestMapping, UserEngagementType } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 🔗 ربط المنشور بالاهتمامات
// ===============================

export interface CreateInterestMappingInput {
  userId: string;
  postId: string;
  viewTime?: number;
  interactionDelay?: number;
  engagementType?: UserEngagementType;
}

/**
 * إنشاء أو تحديث ربط منشور المستخدم بتحليل اهتماماته
 */
export async function createOrUpdatePostInterestMapping(input: CreateInterestMappingInput): Promise<UserPostInterestMapping> {
  // جلب المنشور مع التصنيف
  const post = await prisma.post.findUnique({
    where: { id: input.postId },
    include: {
      classification: {
        include: {
          primaryCategory: true,
          secondaryCategory: true,
        },
      },
      hashtags: {
        include: {
          hashtag: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error('المنشور غير موجود');
  }

  // جلب اهتمامات المستخدم
  const userInterests = await prisma.userInterestScore.findMany({
    where: { userId: input.userId },
    orderBy: { currentScore: 'desc' },
  });

  // تحليل المحتوى واستخراج الاهتمامات المرتبطة
  const relatedInterests = extractRelatedInterests(post, userInterests);
  
  // حساب درجات الاهتمام
  const interestScores = calculateInterestScores(relatedInterests, userInterests);
  
  // تحديد الفئة المطابقة
  const categoryMatch = post.classification?.primaryCategory?.name || null;
  
  // حساب نقاط التطابق
  const matchScore = calculateMatchScore(relatedInterests, userInterests, post);
  
  // حساب الصلة الشخصية
  const personalRelevance = calculatePersonalRelevance(input, userInterests, post);
  
  // حساب قابلية الاكتشاف
  const discoverabilityScore = calculateDiscoverabilityScore(post, userInterests);
  
  // حساب شدة التفاعل
  const engagementIntensity = calculateEngagementIntensity(input);
  
  // تحديد الاهتمامات المتأثرة
  const affectedInterests = identifyAffectedInterests(relatedInterests, input.engagementType);
  
  // حساب تغييرات أوزان الاهتمامات
  const interestWeightChanges = calculateInterestWeightChanges(affectedInterests, input.engagementType);
  
  // حساب تأثير على الملف الشخصي
  const profileImpactScore = calculateProfileImpactScore(relatedInterests, input.engagementType);

  // إنشاء أو تحديث الربط
  const mapping = await prisma.userPostInterestMapping.upsert({
    where: { 
      userId_postId: { 
        userId: input.userId, 
        postId: input.postId 
      } 
    },
    update: {
      relatedInterests,
      interestScores,
      categoryMatch,
      matchScore,
      personalRelevance,
      discoverabilityScore,
      viewTime: input.viewTime,
      interactionDelay: input.interactionDelay,
      engagementType: input.engagementType,
      engagementIntensity,
      affectedInterests,
      interestWeightChanges,
      profileImpactScore,
      confidence: Math.min(matchScore / 100, 1.0),
      needsUpdate: false,
      updatedAt: new Date(),
    },
    create: {
      userId: input.userId,
      postId: input.postId,
      relatedInterests,
      interestScores,
      categoryMatch,
      matchScore,
      personalRelevance,
      discoverabilityScore,
      viewTime: input.viewTime,
      interactionDelay: input.interactionDelay,
      engagementType: input.engagementType,
      engagementIntensity,
      affectedInterests,
      interestWeightChanges,
      profileImpactScore,
      confidence: Math.min(matchScore / 100, 1.0),
    },
  });

  // تحديث نقاط الاهتمامات بناءً على التفاعل
  await updateUserInterestScores(input.userId, affectedInterests, input.engagementType);

  return mapping;
}

/**
 * استخراج الاهتمامات المرتبطة بالمنشور
 */
function extractRelatedInterests(post: any, userInterests: any[]): string[] {
  const interests = new Set<string>();
  
  // من تصنيف المنشور
  if (post.classification?.primaryCategory?.name) {
    interests.add(post.classification.primaryCategory.name);
  }
  
  if (post.classification?.secondaryCategory?.name) {
    interests.add(post.classification.secondaryCategory.name);
  }
  
  // من الهاشتاغات
  post.hashtags?.forEach((postHashtag: any) => {
    interests.add(postHashtag.hashtag.name);
  });
  
  // من الكلمات المفتاحية في المحتوى
  const contentKeywords = extractKeywordsFromContent(post.content);
  contentKeywords.forEach(keyword => interests.add(keyword));
  
  // مطابقة مع اهتمامات المستخدم الحالية
  userInterests.forEach(userInterest => {
    if (post.content.toLowerCase().includes(userInterest.interestName.toLowerCase())) {
      interests.add(userInterest.interestName);
    }
  });
  
  return Array.from(interests);
}

/**
 * حساب درجات الاهتمام
 */
function calculateInterestScores(relatedInterests: string[], userInterests: any[]): Record<string, number> {
  const scores: Record<string, number> = {};
  
  relatedInterests.forEach(interest => {
    // البحث عن الاهتمام في قائمة المستخدم
    const userInterest = userInterests.find(ui => ui.interestName === interest);
    
    if (userInterest) {
      scores[interest] = userInterest.currentScore;
    } else {
      // اهتمام جديد - نقاط أساسية
      scores[interest] = 25;
    }
  });
  
  return scores;
}

/**
 * حساب نقاط التطابق
 */
function calculateMatchScore(relatedInterests: string[], userInterests: any[], post: any): number {
  if (relatedInterests.length === 0) {
    return 20; // نقاط أساسية للمحتوى غير المصنف
  }
  
  let totalScore = 0;
  let matchCount = 0;
  
  relatedInterests.forEach(interest => {
    const userInterest = userInterests.find(ui => ui.interestName === interest);
    
    if (userInterest) {
      totalScore += userInterest.currentScore;
      matchCount++;
    }
  });
  
  if (matchCount === 0) {
    return 30; // لا توجد مطابقات مع اهتمامات المستخدم
  }
  
  const avgScore = totalScore / matchCount;
  
  // مكافأة للمحتوى الحديث
  const hoursOld = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
  const freshnessBonus = hoursOld < 24 ? 10 : hoursOld < 48 ? 5 : 0;
  
  return Math.min(avgScore + freshnessBonus, 100);
}

/**
 * حساب الصلة الشخصية
 */
function calculatePersonalRelevance(input: CreateInterestMappingInput, userInterests: any[], post: any): number {
  let relevance = 30; // النقاط الأساسية
  
  // وقت المشاهدة
  if (input.viewTime) {
    if (input.viewTime > 30) { // أكثر من 30 ثانية
      relevance += 20;
    } else if (input.viewTime > 10) {
      relevance += 10;
    }
  }
  
  // نوع التفاعل
  switch (input.engagementType) {
    case 'FULL_ENGAGEMENT':
      relevance += 30;
      break;
    case 'SHARE':
      relevance += 25;
      break;
    case 'COMMENT':
      relevance += 20;
      break;
    case 'SAVE':
      relevance += 18;
      break;
    case 'LIKE':
      relevance += 15;
      break;
    case 'ACTIVE_VIEW':
      relevance += 10;
      break;
    case 'CLICK_PROFILE':
      relevance += 12;
      break;
    case 'CLICK_HASHTAG':
      relevance += 8;
      break;
  }
  
  // تأخير التفاعل (التفاعل السريع أكثر صلة)
  if (input.interactionDelay) {
    if (input.interactionDelay < 5) { // أقل من 5 ثوان
      relevance += 10;
    } else if (input.interactionDelay < 30) {
      relevance += 5;
    }
  }
  
  return Math.min(relevance, 100);
}

/**
 * حساب قابلية الاكتشاف
 */
function calculateDiscoverabilityScore(post: any, userInterests: any[]): number {
  let score = 40; // النقاط الأساسية
  
  // المحتوى مع وسائط أكثر قابلية للاكتشاف
  if (post.mediaUrl) {
    score += 15;
  }
  
  // الهاشتاغات تزيد قابلية الاكتشاف
  if (post.hashtags && post.hashtags.length > 0) {
    score += 10 + (post.hashtags.length * 2);
  }
  
  // المحتوى الشائع
  const totalInteractions = post.likesCount + post.commentsCount + post.sharesCount;
  if (totalInteractions > 50) {
    score += 20;
  } else if (totalInteractions > 10) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * حساب شدة التفاعل
 */
function calculateEngagementIntensity(input: CreateInterestMappingInput): number {
  let intensity = 0;
  
  switch (input.engagementType) {
    case 'FULL_ENGAGEMENT':
      intensity = 1.0;
      break;
    case 'SHARE':
      intensity = 0.9;
      break;
    case 'COMMENT':
      intensity = 0.8;
      break;
    case 'SAVE':
      intensity = 0.7;
      break;
    case 'LIKE':
      intensity = 0.6;
      break;
    case 'CLICK_PROFILE':
      intensity = 0.5;
      break;
    case 'ACTIVE_VIEW':
      intensity = 0.4;
      break;
    case 'CLICK_HASHTAG':
      intensity = 0.3;
      break;
    case 'PASSIVE_VIEW':
      intensity = 0.1;
      break;
    default:
      intensity = 0.2;
  }
  
  // تعديل بناءً على وقت المشاهدة
  if (input.viewTime) {
    const timeMultiplier = Math.min(input.viewTime / 60, 2); // أقصى ضعف للوقت
    intensity *= timeMultiplier;
  }
  
  return Math.min(intensity, 1.0);
}

/**
 * تحديد الاهتمامات المتأثرة
 */
function identifyAffectedInterests(relatedInterests: string[], engagementType?: UserEngagementType): string[] {
  if (!engagementType || engagementType === 'PASSIVE_VIEW') {
    return [];
  }
  
  // جميع الاهتمامات المرتبطة تتأثر بالتفاعلات النشطة
  return relatedInterests;
}

/**
 * حساب تغييرات أوزان الاهتمامات
 */
function calculateInterestWeightChanges(affectedInterests: string[], engagementType?: UserEngagementType): Record<string, number> {
  const changes: Record<string, number> = {};
  
  if (!engagementType || affectedInterests.length === 0) {
    return changes;
  }
  
  // مقدار التغيير بناءً على نوع التفاعل
  let changeAmount = 0;
  
  switch (engagementType) {
    case 'FULL_ENGAGEMENT':
      changeAmount = 5;
      break;
    case 'SHARE':
      changeAmount = 4;
      break;
    case 'COMMENT':
      changeAmount = 3;
      break;
    case 'SAVE':
      changeAmount = 3;
      break;
    case 'LIKE':
      changeAmount = 2;
      break;
    case 'CLICK_PROFILE':
      changeAmount = 2;
      break;
    case 'ACTIVE_VIEW':
      changeAmount = 1;
      break;
    case 'CLICK_HASHTAG':
      changeAmount = 1;
      break;
  }
  
  affectedInterests.forEach(interest => {
    changes[interest] = changeAmount;
  });
  
  return changes;
}

/**
 * حساب تأثير على الملف الشخصي
 */
function calculateProfileImpactScore(relatedInterests: string[], engagementType?: UserEngagementType): number {
  if (!engagementType || relatedInterests.length === 0) {
    return 0;
  }
  
  // النقاط الأساسية حسب نوع التفاعل
  let baseScore = 0;
  
  switch (engagementType) {
    case 'FULL_ENGAGEMENT':
      baseScore = 15;
      break;
    case 'SHARE':
      baseScore = 12;
      break;
    case 'COMMENT':
      baseScore = 10;
      break;
    case 'SAVE':
      baseScore = 8;
      break;
    case 'LIKE':
      baseScore = 5;
      break;
    case 'CLICK_PROFILE':
      baseScore = 4;
      break;
    case 'ACTIVE_VIEW':
      baseScore = 2;
      break;
    case 'CLICK_HASHTAG':
      baseScore = 1;
      break;
  }
  
  // مضاعف للاهتمامات المتعددة
  const interestMultiplier = Math.min(relatedInterests.length * 0.5, 3);
  
  return baseScore * (1 + interestMultiplier);
}

/**
 * استخراج كلمات مفتاحية من المحتوى
 */
function extractKeywordsFromContent(content: string): string[] {
  // قائمة كلمات أساسية (يمكن توسيعها)
  const keywords = [
    'تقنية', 'برمجة', 'ذكاء اصطناعي', 'رياضة', 'كرة قدم',
    'طبخ', 'سفر', 'تصوير', 'موسيقى', 'فن', 'أدب', 'سينما',
    'صحة', 'تعليم', 'عمل', 'تجارة', 'استثمار', 'سياسة'
  ];
  
  const foundKeywords: string[] = [];
  const lowerContent = content.toLowerCase();
  
  keywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });
  
  return foundKeywords;
}

/**
 * تحديث نقاط اهتمامات المستخدم
 */
async function updateUserInterestScores(userId: string, affectedInterests: string[], engagementType?: UserEngagementType) {
  if (!engagementType || affectedInterests.length === 0) {
    return;
  }
  
  for (const interest of affectedInterests) {
    // حساب مقدار الزيادة
    let scoreIncrease = 0;
    
    switch (engagementType) {
      case 'FULL_ENGAGEMENT':
        scoreIncrease = 5;
        break;
      case 'SHARE':
        scoreIncrease = 4;
        break;
      case 'COMMENT':
        scoreIncrease = 3;
        break;
      case 'SAVE':
        scoreIncrease = 3;
        break;
      case 'LIKE':
        scoreIncrease = 2;
        break;
      case 'CLICK_PROFILE':
        scoreIncrease = 2;
        break;
      case 'ACTIVE_VIEW':
        scoreIncrease = 1;
        break;
      case 'CLICK_HASHTAG':
        scoreIncrease = 1;
        break;
    }
    
    // تحديث أو إنشاء الاهتمام
    await prisma.userInterestScore.upsert({
      where: {
        userId_interestName: {
          userId,
          interestName: interest,
        },
      },
      update: {
        currentScore: {
          increment: scoreIncrease,
        },
        totalInteractions: {
          increment: 1,
        },
        recentInteractions: {
          increment: 1,
        },
        lastActivity: new Date(),
      },
      create: {
        userId,
        interestName: interest,
        currentScore: 25 + scoreIncrease,
        rawScore: 25 + scoreIncrease,
        normalizedScore: (25 + scoreIncrease) / 100,
        weightedScore: 25 + scoreIncrease,
        category: 'عام',
        totalInteractions: 1,
        recentInteractions: 1,
        primarySource: 'INTERACTION',
        sourceWeights: { INTERACTION: 1.0 },
        sources: ['INTERACTION'],
      },
    });
  }
}

// ===============================
// 🔍 دوال الاستعلام والتحليل
// ===============================

/**
 * جلب ربط منشورات المستخدم
 */
export async function getUserPostInterestMappings(userId: string, limit: number = 50) {
  return await prisma.userPostInterestMapping.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: {
          id: true,
          content: true,
          mediaType: true,
          createdAt: true,
          user: {
            select: {
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
 * جلب أفضل منشورات مطابقة لاهتمامات المستخدم
 */
export async function getBestMatchingPostsForUser(userId: string, limit: number = 20) {
  return await prisma.userPostInterestMapping.findMany({
    where: { userId },
    take: limit,
    orderBy: { matchScore: 'desc' },
    include: {
      post: {
        include: {
          user: {
            select: {
              username: true,
              fullName: true,
              profilePicture: true,
            },
          },
          classification: {
            include: {
              primaryCategory: true,
            },
          },
        },
      },
    },
  });
}

/**
 * تحليل تفاعل المستخدم مع اهتماماته
 */
export async function analyzeUserInteractionPatterns(userId: string) {
  const mappings = await prisma.userPostInterestMapping.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  
  const patterns = {
    totalInteractions: mappings.length,
    averageMatchScore: 0,
    averagePersonalRelevance: 0,
    averageEngagementIntensity: 0,
    topEngagementTypes: {} as Record<string, number>,
    interestDistribution: {} as Record<string, number>,
    recentTrends: [] as Array<{ interest: string; trend: 'rising' | 'stable' | 'declining' }>,
  };
  
  if (mappings.length === 0) {
    return patterns;
  }
  
  // حساب المتوسطات
  patterns.averageMatchScore = mappings.reduce((sum, m) => sum + m.matchScore, 0) / mappings.length;
  patterns.averagePersonalRelevance = mappings.reduce((sum, m) => sum + m.personalRelevance, 0) / mappings.length;
  patterns.averageEngagementIntensity = mappings.reduce((sum, m) => sum + m.engagementIntensity, 0) / mappings.length;
  
  // تحليل أنواع التفاعل
  mappings.forEach(mapping => {
    if (mapping.engagementType) {
      patterns.topEngagementTypes[mapping.engagementType] = 
        (patterns.topEngagementTypes[mapping.engagementType] || 0) + 1;
    }
    
    // توزيع الاهتمامات
    mapping.relatedInterests.forEach(interest => {
      patterns.interestDistribution[interest] = 
        (patterns.interestDistribution[interest] || 0) + 1;
    });
  });
  
  return patterns;
}

/**
 * اقتراح محتوى بناءً على تحليل الاهتمامات
 */
export async function suggestContentForUser(userId: string, limit: number = 10) {
  // جلب اهتمامات المستخدم الحالية
  const userInterests = await prisma.userInterestScore.findMany({
    where: { userId },
    take: 10,
    orderBy: { currentScore: 'desc' },
  });
  
  if (userInterests.length === 0) {
    // اقتراح محتوى شائع عام
    return await prisma.post.findMany({
      take: limit,
      orderBy: { viewsCount: 'desc' },
      where: { isDeleted: false },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });
  }
  
  // البحث عن منشورات مطابقة للاهتمامات
  const topInterests = userInterests.slice(0, 5).map(i => i.interestName);
  
  return await prisma.post.findMany({
    where: {
      isDeleted: false,
      classification: {
        OR: [
          {
            primaryCategory: {
              name: { in: topInterests },
            },
          },
          {
            aiKeywords: {
              hasSome: topInterests,
            },
          },
        ],
      },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          fullName: true,
          profilePicture: true,
        },
      },
      classification: {
        include: {
          primaryCategory: true,
        },
      },
    },
  });
}

export default prisma;
