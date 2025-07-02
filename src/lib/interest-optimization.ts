// ⚡ نظام تحسين خوارزميات الاهتمامات - Enhanced Interest Algorithms
// منصة نحكي - Nehky.com
// تم إنشاؤها في 30 يونيو 2025

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 🕐 نظام تسوية النقاط الزمنية
// ===============================

export interface TimeDecayConfig {
  halfLifeDays: number; // كم يوم لتنخفض النقاط للنصف
  minRetentionRate: number; // أقل نسبة احتفاظ بالنقاط (0-1)
  maxAge: number; // أقصى عمر للاهتمام بالأيام
  boostRecent: boolean; // تعزيز الاهتمامات الحديثة
}

export const DEFAULT_TIME_DECAY_CONFIG: TimeDecayConfig = {
  halfLifeDays: 30, // النقاط تنخفض للنصف كل 30 يوم
  minRetentionRate: 0.1, // الاحتفاظ بـ 10% كحد أدنى
  maxAge: 365, // حذف الاهتمامات الأقدم من سنة
  boostRecent: true // تعزيز الاهتمامات الحديثة
};

/**
 * حساب معامل التسوية الزمنية
 */
export function calculateTimeDecayFactor(
  lastActivity: Date,
  config: TimeDecayConfig = DEFAULT_TIME_DECAY_CONFIG
): number {
  const now = new Date();
  const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
  
  // إذا تجاوز العمر الأقصى، إرجاع 0
  if (daysSinceActivity > config.maxAge) {
    return 0;
  }
  
  // حساب معامل التسوية باستخدام النصف العمر
  const decayFactor = Math.pow(0.5, daysSinceActivity / config.halfLifeDays);
  
  // تطبيق أقل نسبة احتفاظ
  const finalFactor = Math.max(decayFactor, config.minRetentionRate);
  
  // تعزيز الاهتمامات الحديثة (أقل من يوم)
  if (config.boostRecent && daysSinceActivity < 1) {
    return Math.min(finalFactor * 1.2, 1.0);
  }
  
  return finalFactor;
}

/**
 * تحديث نقاط الاهتمامات مع التسوية الزمنية
 */
export async function updateInterestScoresWithTimeDecay(
  userId?: string,
  config: TimeDecayConfig = DEFAULT_TIME_DECAY_CONFIG
): Promise<{ updated: number; archived: number; deleted: number }> {
  try {
    let whereCondition: any = {};
    if (userId) {
      whereCondition.userId = userId;
    }
    
    // جلب جميع الاهتمامات
    const interests = await prisma.userInterestScore.findMany({
      where: whereCondition,
      orderBy: { lastActivity: 'desc' }
    });
    
    let updated = 0;
    let archived = 0;
    let deleted = 0;
    
    for (const interest of interests) {
      const decayFactor = calculateTimeDecayFactor(interest.lastActivity, config);
      
      if (decayFactor === 0) {
        // حذف الاهتمامات المنتهية الصلاحية
        await prisma.userInterestScore.delete({
          where: { id: interest.id }
        });
        deleted++;
        continue;
      }
      
      // حساب النقاط الجديدة
      const newScore = interest.rawScore * decayFactor;
      const normalizedScore = Math.min(newScore / 100, 1.0);
      
      // تحديث النقاط
      await prisma.userInterestScore.update({
        where: { id: interest.id },
        data: {
          currentScore: newScore,
          normalizedScore,
          weightedScore: newScore,
          needsRecalculation: false,
          lastDecayApplied: new Date(),
        }
      });
      
      // أرشفة الاهتمامات الضعيفة جداً
      if (newScore < 5) {
        await prisma.userInterestScore.update({
          where: { id: interest.id },
          data: { isArchived: true }
        });
        archived++;
      } else {
        updated++;
      }
    }
    
    console.log(`تم تحديث ${updated} اهتمام، أرشفة ${archived} اهتمام، حذف ${deleted} اهتمام`);
    
    return { updated, archived, deleted };
    
  } catch (error) {
    console.error('خطأ في تحديث نقاط الاهتمامات:', error);
    throw error;
  }
}

// ===============================
// 🎯 نظام التجميع الذكي
// ===============================

export interface ContentClusteringConfig {
  similarityThreshold: number; // عتبة التشابه (0-1)
  maxClusterSize: number; // أقصى حجم للمجموعة
  keywordWeight: number; // وزن الكلمات المفتاحية
  categoryWeight: number; // وزن التصنيفات
  semanticWeight: number; // وزن التشابه الدلالي
}

export const DEFAULT_CLUSTERING_CONFIG: ContentClusteringConfig = {
  similarityThreshold: 0.7,
  maxClusterSize: 10,
  keywordWeight: 0.4,
  categoryWeight: 0.3,
  semanticWeight: 0.3
};

/**
 * تجميع المحتوى المشابه
 */
export async function clusterSimilarContent(
  userId: string,
  config: ContentClusteringConfig = DEFAULT_CLUSTERING_CONFIG
): Promise<ContentCluster[]> {
  try {
    // جلب منشورات المستخدم مع التصنيفات
    const posts = await prisma.post.findMany({
      where: { userId, isDeleted: false },
      include: {
        classification: {
          include: {
            primaryCategory: true,
            secondaryCategory: true,
          }
        },
        hashtags: {
          include: { hashtag: true }
        },
        userInterestMappings: {
          where: { userId },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    if (posts.length < 2) {
      return [];
    }
    
    // حساب التشابه بين المنشورات
    const clusters: ContentCluster[] = [];
    const processed = new Set<string>();
    
    for (let i = 0; i < posts.length; i++) {
      if (processed.has(posts[i].id)) continue;
      
      const cluster: ContentCluster = {
        id: generateClusterId(),
        posts: [posts[i]],
        centerPost: posts[i],
        topic: extractMainTopic(posts[i]),
        keywords: extractKeywords(posts[i]),
        avgEngagement: calculateEngagement(posts[i]),
        similarity: 1.0
      };
      
      processed.add(posts[i].id);
      
      // البحث عن منشورات مشابهة
      for (let j = i + 1; j < posts.length && cluster.posts.length < config.maxClusterSize; j++) {
        if (processed.has(posts[j].id)) continue;
        
        const similarity = calculateContentSimilarity(posts[i], posts[j], config);
        
        if (similarity >= config.similarityThreshold) {
          cluster.posts.push(posts[j]);
          processed.add(posts[j].id);
          
          // تحديث معلومات المجموعة
          cluster.keywords = Array.from(new Set([...cluster.keywords, ...extractKeywords(posts[j])]));
          cluster.avgEngagement = (cluster.avgEngagement + calculateEngagement(posts[j])) / 2;
        }
      }
      
      if (cluster.posts.length >= 2) {
        clusters.push(cluster);
      }
    }
    
    return clusters.sort((a, b) => b.avgEngagement - a.avgEngagement);
    
  } catch (error) {
    console.error('خطأ في تجميع المحتوى:', error);
    return [];
  }
}

/**
 * حساب التشابه بين منشورين
 */
function calculateContentSimilarity(
  post1: any,
  post2: any,
  config: ContentClusteringConfig
): number {
  let totalSimilarity = 0;
  let weightSum = 0;
  
  // تشابه التصنيف
  if (post1.classification && post2.classification) {
    const categorySimilarity = calculateCategorySimilarity(
      post1.classification,
      post2.classification
    );
    totalSimilarity += categorySimilarity * config.categoryWeight;
    weightSum += config.categoryWeight;
  }
  
  // تشابه الكلمات المفتاحية
  const keywordSimilarity = calculateKeywordSimilarity(post1, post2);
  totalSimilarity += keywordSimilarity * config.keywordWeight;
  weightSum += config.keywordWeight;
  
  // تشابه دلالي (محتوى النص)
  const semanticSimilarity = calculateSemanticSimilarity(post1.content, post2.content);
  totalSimilarity += semanticSimilarity * config.semanticWeight;
  weightSum += config.semanticWeight;
  
  return weightSum > 0 ? totalSimilarity / weightSum : 0;
}

/**
 * حساب تشابه التصنيفات
 */
function calculateCategorySimilarity(classification1: any, classification2: any): number {
  let similarity = 0;
  
  // التصنيف الأساسي
  if (classification1.primaryCategory?.id === classification2.primaryCategory?.id) {
    similarity += 0.8;
  }
  
  // التصنيف الثانوي
  if (classification1.secondaryCategory?.id === classification2.secondaryCategory?.id) {
    similarity += 0.2;
  }
  
  return Math.min(similarity, 1.0);
}

/**
 * حساب تشابه الكلمات المفتاحية
 */
function calculateKeywordSimilarity(post1: any, post2: any): number {
  const keywords1 = new Set([
    ...(post1.classification?.aiKeywords || []),
    ...(post1.hashtags?.map((h: any) => h.hashtag.name) || [])
  ]);
  
  const keywords2 = new Set([
    ...(post2.classification?.aiKeywords || []),
    ...(post2.hashtags?.map((h: any) => h.hashtag.name) || [])
  ]);
  
  if (keywords1.size === 0 && keywords2.size === 0) return 0;
  
  const intersection = new Set(Array.from(keywords1).filter(k => keywords2.has(k)));
  const union = new Set([...Array.from(keywords1), ...Array.from(keywords2)]);
  
  return intersection.size / union.size; // Jaccard similarity
}

/**
 * حساب التشابه الدلالي (مبسط)
 */
function calculateSemanticSimilarity(content1: string, content2: string): number {
  // تنفيذ مبسط - يمكن تحسينه باستخدام NLP
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));
  
  const intersection = new Set(Array.from(words1).filter(w => words2.has(w)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);
  
  return intersection.size / union.size;
}

// ===============================
// 📊 واجهات البيانات
// ===============================

export interface ContentCluster {
  id: string;
  posts: any[];
  centerPost: any;
  topic: string;
  keywords: string[];
  avgEngagement: number;
  similarity: number;
}

// ===============================
// 🛠 دوال مساعدة
// ===============================

function generateClusterId(): string {
  return `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractMainTopic(post: any): string {
  if (post.classification?.primaryCategory?.name) {
    return post.classification.primaryCategory.name;
  }
  
  if (post.hashtags?.length > 0) {
    return post.hashtags[0].hashtag.name;
  }
  
  // استخراج موضوع من المحتوى
  const words = post.content.split(/\s+/);
  return words.slice(0, 3).join(' ') + '...';
}

function extractKeywords(post: any): string[] {
  const keywords = new Set<string>();
  
  // من التصنيف
  if (post.classification?.aiKeywords) {
    post.classification.aiKeywords.forEach((k: string) => keywords.add(k));
  }
  
  // من الهاشتاغات
  if (post.hashtags) {
    post.hashtags.forEach((h: any) => keywords.add(h.hashtag.name));
  }
  
  return Array.from(keywords);
}

function calculateEngagement(post: any): number {
  const totalInteractions = post.likesCount + post.commentsCount + post.sharesCount;
  return post.viewsCount > 0 ? (totalInteractions / post.viewsCount) * 100 : 0;
}

// ===============================
// 🔧 API للاستخدام العام
// ===============================

/**
 * تشغيل تحسينات دورية لجميع المستخدمين
 */
export async function runPeriodicOptimizations(): Promise<OptimizationResult> {
  const result: OptimizationResult = {
    timeDecayUpdates: { updated: 0, archived: 0, deleted: 0 },
    clustersCreated: 0,
    usersProcessed: 0,
    startTime: new Date(),
    endTime: new Date(),
    errors: []
  };
  
  try {
    console.log('🚀 بدء تشغيل التحسينات الدورية...');
    
    // تحديث التسوية الزمنية لجميع المستخدمين
    result.timeDecayUpdates = await updateInterestScoresWithTimeDecay();
    
    // معالجة المستخدمين النشطين لتجميع المحتوى
    const activeUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // آخر 30 يوم
        }
      },
      take: 100, // معالجة 100 مستخدم في المرة الواحدة
      orderBy: { lastActivity: 'desc' }
    });
    
    for (const user of activeUsers) {
      try {
        const clusters = await clusterSimilarContent(user.id);
        result.clustersCreated += clusters.length;
        result.usersProcessed++;
        
        // حفظ المجموعات في قاعدة البيانات (اختياري)
        // await saveContentClusters(user.id, clusters);
        
      } catch (error) {
        result.errors.push(`خطأ في معالجة المستخدم ${user.id}: ${error}`);
      }
    }
    
    result.endTime = new Date();
    
    console.log(`✅ تم الانتهاء من التحسينات:
      - تحديث ${result.timeDecayUpdates.updated} اهتمام
      - إنشاء ${result.clustersCreated} مجموعة محتوى
      - معالجة ${result.usersProcessed} مستخدم
      - الوقت المستغرق: ${result.endTime.getTime() - result.startTime.getTime()}ms`);
    
    return result;
    
  } catch (error) {
    result.errors.push(`خطأ عام: ${error}`);
    result.endTime = new Date();
    return result;
  }
}

export interface OptimizationResult {
  timeDecayUpdates: { updated: number; archived: number; deleted: number };
  clustersCreated: number;
  usersProcessed: number;
  startTime: Date;
  endTime: Date;
  errors: string[];
}

export default prisma;
