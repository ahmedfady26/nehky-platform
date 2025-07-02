// 🎯 نظام اقتراحات المتابعة الذكية - Smart Follow Suggestions
// منصة نحكي - Nehky.com
// تم إنشاؤها في 30 يونيو 2025

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 🧠 خوارزمية الاقتراحات الذكية
// ===============================

export interface FollowSuggestionConfig {
  interestWeightBest: number; // وزن تطابق الاهتمامات
  mutualFollowersWeight: number; // وزن المتابعين المشتركين
  activityLevelWeight: number; // وزن مستوى النشاط
  contentQualityWeight: number; // وزن جودة المحتوى
  geographicWeight: number; // وزن القرب الجغرافي
  temporalWeight: number; // وزن التوقيت المناسب
  maxSuggestions: number; // أقصى عدد اقتراحات
  excludeRecentUnfollowed: boolean; // تجنب من ألغى متابعتهم مؤخراً
}

export const DEFAULT_SUGGESTION_CONFIG: FollowSuggestionConfig = {
  interestWeightBest: 0.35,
  mutualFollowersWeight: 0.25,
  activityLevelWeight: 0.15,
  contentQualityWeight: 0.15,
  geographicWeight: 0.05,
  temporalWeight: 0.05,
  maxSuggestions: 20,
  excludeRecentUnfollowed: true
};

export interface SuggestedUser {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  followersCount: number;
  postsCount: number;
  score: number;
  reasons: string[];
  matchingInterests: string[];
  mutualFollowers: number;
  lastActiveAt: Date;
  connectionStrength: number;
}

/**
 * توليد اقتراحات متابعة ذكية للمستخدم
 */
export async function generateSmartFollowSuggestions(
  userId: string,
  config: FollowSuggestionConfig = DEFAULT_SUGGESTION_CONFIG
): Promise<SuggestedUser[]> {
  try {
    // الحصول على بيانات المستخدم
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error('المستخدم غير موجود');
    }

    // الحصول على المستخدمين المحتملين
    const candidates = await getCandidateUsers(userId, config);

    // حساب نقاط كل مرشح
    const scoredCandidates = await Promise.all(
      candidates.map(candidate => scoreCandidateUser(userProfile, candidate, config))
    );

    // ترتيب وتصفية النتائج
    const suggestions = scoredCandidates
      .filter(candidate => candidate.score > 0.3) // حد أدنى للنقاط
      .sort((a, b) => b.score - a.score)
      .slice(0, config.maxSuggestions);

    // تحديث إحصائيات الاقتراحات
    await updateSuggestionStats(userId, suggestions.length);

    return suggestions;

  } catch (error) {
    console.error('خطأ في توليد اقتراحات المتابعة:', error);
    return [];
  }
}

/**
 * الحصول على ملف المستخدم مع اهتماماته
 */
async function getUserProfile(userId: string): Promise<any> {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          classification: {
            include: { primaryCategory: true }
          }
        }
      },
      // المتابعين والمتابعات  
      following: {
        select: { followedId: true }
      },
      followers: {
        select: { followerId: true }
      },
      // الاهتمامات
      interestScores: {
        where: { 
          isArchived: false,
          currentScore: { gte: 30 }
        },
        orderBy: { currentScore: 'desc' },
        take: 10
      }
    }
  });
}

/**
 * الحصول على المستخدمين المرشحين
 */
async function getCandidateUsers(
  userId: string, 
  config: FollowSuggestionConfig
): Promise<any[]> {
  // الحصول على المستخدمين المتابعين حالياً
  const currentFollowing = await prisma.userFollow.findMany({
    where: { followerId: userId },
    select: { followedId: true }
  });
  
  const followingIds = currentFollowing.map((f: any) => f.followedId);
  followingIds.push(userId); // استبعاد المستخدم نفسه

  // المستخدمين المستبعدين مؤخراً
  let excludedIds = followingIds;
  if (config.excludeRecentUnfollowed) {
    const recentUnfollowed = await getRecentUnfollowedUsers(userId);
    excludedIds = [...excludedIds, ...recentUnfollowed];
  }

  // البحث عن مرشحين
  return await prisma.user.findMany({
    where: {
      id: { notIn: excludedIds },
      isActive: true,
      lastActivity: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // نشط في آخر 30 يوم
      }
    },
    include: {
      posts: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          classification: {
            include: { primaryCategory: true }
          },
          attractiveness: true
        }
      },
      interestScores: {
        where: { 
          isArchived: false,
          currentScore: { gte: 30 }
        },
        orderBy: { currentScore: 'desc' },
        take: 10
      }
    },
    take: 200, // تحديد عدد المرشحين للمعالجة
    orderBy: { lastActivity: 'desc' }
  });
}

/**
 * حساب نقاط المرشح
 */
async function scoreCandidateUser(
  userProfile: any,
  candidate: any,
  config: FollowSuggestionConfig
): Promise<SuggestedUser> {
  let totalScore = 0;
  const reasons: string[] = [];
  let matchingInterests: string[] = [];

  // 1. تطابق الاهتمامات
  const interestScore = calculateInterestMatch(userProfile, candidate);
  totalScore += interestScore.score * config.interestWeightBest;
  matchingInterests = interestScore.matches;
  if (interestScore.score > 0.5) {
    reasons.push(`اهتمامات مشتركة: ${interestScore.matches.slice(0, 3).join(', ')}`);
  }

  // 2. المتابعين المشتركين
  const mutualFollowersData = await calculateMutualFollowers(userProfile.id, candidate.id);
  const mutualScore = Math.min(mutualFollowersData.count / 10, 1); // تطبيع على 10 متابعين مشتركين
  totalScore += mutualScore * config.mutualFollowersWeight;
  if (mutualFollowersData.count > 0) {
    reasons.push(`${mutualFollowersData.count} متابع مشترك`);
  }

  // 3. مستوى النشاط
  const activityScore = calculateActivityLevel(candidate);
  totalScore += activityScore * config.activityLevelWeight;
  if (activityScore > 0.7) {
    reasons.push('مستخدم نشط');
  }

  // 4. جودة المحتوى
  const qualityScore = calculateContentQuality(candidate);
  totalScore += qualityScore * config.contentQualityWeight;
  if (qualityScore > 0.6) {
    reasons.push('محتوى عالي الجودة');
  }

  // 5. القرب الجغرافي (اختياري)
  const geoScore = calculateGeographicProximity(userProfile, candidate);
  totalScore += geoScore * config.geographicWeight;
  if (geoScore > 0.5) {
    reasons.push('قريب جغرافياً');
  }

  // 6. التوقيت المناسب
  const temporalScore = calculateTemporalRelevance(candidate);
  totalScore += temporalScore * config.temporalWeight;

  // تطبيع النقاط النهائية
  const finalScore = Math.min(totalScore, 1.0);

  // حساب قوة الارتباط
  const connectionStrength = calculateConnectionStrength(
    interestScore.score,
    mutualScore,
    activityScore
  );

  return {
    id: candidate.id,
    username: candidate.username,
    fullName: candidate.fullName,
    profilePicture: candidate.profilePicture,
    bio: candidate.bio,
    isVerified: candidate.isVerified,
    followersCount: candidate.followersCount,
    postsCount: candidate.posts?.length || 0,
    score: Math.round(finalScore * 100) / 100,
    reasons,
    matchingInterests,
    mutualFollowers: mutualFollowersData.count,
    lastActiveAt: candidate.lastActivity,
    connectionStrength
  };
}

/**
 * حساب تطابق الاهتمامات
 */
function calculateInterestMatch(userProfile: any, candidate: any): {
  score: number;
  matches: string[];
} {
  const userInterests = new Set(
    userProfile.interestScores?.map((i: any) => i.interestName) || []
  );
  
  const candidateInterests = new Set(
    candidate.interestScores?.map((i: any) => i.interestName) || []
  );

  if (userInterests.size === 0 || candidateInterests.size === 0) {
    return { score: 0, matches: [] };
  }

  const intersection = new Set(
    Array.from(userInterests).filter(interest => candidateInterests.has(interest))
  );
  
  const union = new Set([
    ...Array.from(userInterests),
    ...Array.from(candidateInterests)
  ]);

  const jaccardSimilarity = intersection.size / union.size;
  const matches = Array.from(intersection);

  // تعزيز النقاط للاهتمامات عالية القيمة
  let enhancedScore = jaccardSimilarity;
  if (intersection.size >= 3) {
    enhancedScore *= 1.2; // 20% مكافأة للاهتمامات المتعددة
  }

  return {
    score: Math.min(enhancedScore, 1.0),
    matches: matches as string[]
  };
}

/**
 * حساب المتابعين المشتركين
 */
async function calculateMutualFollowers(userId1: string, userId2: string): Promise<{
  count: number;
  followers: string[];
}> {
  try {
    // جلب متابعي المستخدم الأول
    const user1Followers = await prisma.userFollow.findMany({
      where: { followedId: userId1 },
      select: { followerId: true }
    });

    // جلب متابعي المستخدم الثاني
    const user2Followers = await prisma.userFollow.findMany({
      where: { followedId: userId2 },
      select: { followerId: true }
    });

    const followers1 = new Set(user1Followers.map((f: any) => f.followerId));
    const followers2 = new Set(user2Followers.map((f: any) => f.followerId));

    const mutualFollowers = Array.from(followers1).filter(id => followers2.has(id));

    return {
      count: mutualFollowers.length,
      followers: mutualFollowers as string[]
    };

  } catch (error) {
    console.error('خطأ في حساب المتابعين المشتركين:', error);
    return { count: 0, followers: [] };
  }
}

/**
 * حساب مستوى النشاط
 */
function calculateActivityLevel(candidate: any): number {
  const now = new Date();
  const lastActivity = new Date(candidate.lastActivity);
  const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

  // نقاط بناءً على حداثة النشاط
  let activityScore = 0;
  if (daysSinceActivity < 1) activityScore = 1.0;
  else if (daysSinceActivity < 3) activityScore = 0.9;
  else if (daysSinceActivity < 7) activityScore = 0.7;
  else if (daysSinceActivity < 14) activityScore = 0.5;
  else if (daysSinceActivity < 30) activityScore = 0.3;
  else activityScore = 0.1;

  // مكافآت للنشاط المتسق
  const recentPosts = candidate.posts?.filter((post: any) => {
    const postAge = (now.getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return postAge < 7;
  }) || [];

  if (recentPosts.length >= 3) {
    activityScore *= 1.2; // مكافأة للنشاط المتسق
  }

  return Math.min(activityScore, 1.0);
}

/**
 * حساب جودة المحتوى
 */
function calculateContentQuality(candidate: any): number {
  if (!candidate.posts || candidate.posts.length === 0) {
    return 0.2; // نقاط أساسية منخفضة
  }

  let totalQuality = 0;
  let evaluatedPosts = 0;

  candidate.posts.forEach((post: any) => {
    let postQuality = 0.5; // نقاط أساسية

    // جودة التفاعل
    const engagementRate = post.viewsCount > 0 ? 
      ((post.likesCount + post.commentsCount + post.sharesCount) / post.viewsCount) * 100 : 0;
    
    if (engagementRate > 10) postQuality += 0.3;
    else if (engagementRate > 5) postQuality += 0.2;
    else if (engagementRate > 2) postQuality += 0.1;

    // جودة المحتوى من تحليل الجاذبية
    if (post.attractiveness) {
      postQuality += (post.attractiveness.overallScore / 100) * 0.3;
    }

    // طول المحتوى (محتوى متوسط الطول أفضل)
    const contentLength = post.content.length;
    if (contentLength >= 50 && contentLength <= 500) {
      postQuality += 0.1;
    }

    totalQuality += Math.min(postQuality, 1.0);
    evaluatedPosts++;
  });

  return evaluatedPosts > 0 ? totalQuality / evaluatedPosts : 0.2;
}

/**
 * حساب القرب الجغرافي (مبسط)
 */
function calculateGeographicProximity(userProfile: any, candidate: any): number {
  // تنفيذ مبسط - يمكن تحسينه بالموقع الجغرافي الفعلي
  if (userProfile.country && candidate.country) {
    return userProfile.country === candidate.country ? 1.0 : 0.3;
  }
  return 0.5; // متوسط إذا لم تتوفر معلومات جغرافية
}

/**
 * حساب الصلة الزمنية
 */
function calculateTemporalRelevance(candidate: any): number {
  const now = new Date();
  const hour = now.getHours();
  const candidateLastActive = new Date(candidate.lastActivity);
  const candidateHour = candidateLastActive.getHours();

  // مكافأة للمستخدمين النشطين في نفس الأوقات
  const hourDifference = Math.abs(hour - candidateHour);
  if (hourDifference <= 2) {
    return 1.0;
  } else if (hourDifference <= 4) {
    return 0.7;
  } else {
    return 0.3;
  }
}

/**
 * حساب قوة الارتباط
 */
function calculateConnectionStrength(
  interestScore: number,
  mutualScore: number,
  activityScore: number
): number {
  // متوسط مرجح لعوامل الارتباط الرئيسية
  return (interestScore * 0.5 + mutualScore * 0.3 + activityScore * 0.2);
}

/**
 * الحصول على المستخدمين الذين ألغى متابعتهم مؤخراً
 */
async function getRecentUnfollowedUsers(userId: string): Promise<string[]> {
  try {
    // يحتاج إلى جدول لتتبع إلغاء المتابعة - سنضيفه لاحقاً
    // مؤقتاً نرجع قائمة فارغة
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * تحديث إحصائيات الاقتراحات
 */
async function updateSuggestionStats(userId: string, suggestionsCount: number): Promise<void> {
  try {
    // حفظ إحصائيات الاقتراحات لاحقاً
    console.log(`تم توليد ${suggestionsCount} اقتراح للمستخدم ${userId}`);
  } catch (error) {
    console.error('خطأ في تحديث إحصائيات الاقتراحات:', error);
  }
}

// ===============================
// 📊 دوال تحليل الأداء
// ===============================

/**
 * تحليل فعالية الاقتراحات
 */
export async function analyzeSuggestionEffectiveness(userId: string): Promise<SuggestionAnalytics> {
  try {
    // جلب آخر الاقتراحات والمتابعات الجديدة
    const recentFollows = await prisma.userFollow.findMany({
      where: {
        followerId: userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // آخر 7 أيام
        }
      }
    });

    // تحليل مدى تطابق المتابعات الجديدة مع الاقتراحات
    // يحتاج إلى جدول لحفظ الاقتراحات السابقة

    return {
      totalSuggestions: 0, // سيتم تنفيذه لاحقاً
      acceptedSuggestions: 0,
      acceptanceRate: 0,
      avgTimeToAccept: 0,
      topReasons: [],
      improvementAreas: []
    };

  } catch (error) {
    console.error('خطأ في تحليل فعالية الاقتراحات:', error);
    return {
      totalSuggestions: 0,
      acceptedSuggestions: 0,
      acceptanceRate: 0,
      avgTimeToAccept: 0,
      topReasons: [],
      improvementAreas: []
    };
  }
}

export interface SuggestionAnalytics {
  totalSuggestions: number;
  acceptedSuggestions: number;
  acceptanceRate: number;
  avgTimeToAccept: number;
  topReasons: string[];
  improvementAreas: string[];
}

export default prisma;
