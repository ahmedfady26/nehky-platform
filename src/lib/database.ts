// مكتبة مساعدة لإدارة قاعدة البيانات
import { prisma } from './prisma'
import type { User, Post, UserInterestProfile } from '@prisma/client'

// ========================================
// 🔍 دوال البحث والاستعلام
// ========================================

/**
 * البحث عن المستخدمين بالاسم أو اسم المستخدم
 */
export async function searchUsers(query: string, limit = 10) {
  return await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      bio: true,
      profilePicture: true,
      isVerified: true,
      followersCount: true,
    },
    take: limit,
  })
}

/**
 * البحث في المنشورات
 */
export async function searchPosts(query: string, limit = 20) {
  return await prisma.post.findMany({
    where: {
      content: { contains: query, mode: 'insensitive' },
      isDeleted: false,
      visibility: 'PUBLIC',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePicture: true,
          isVerified: true,
        },
      },
      hashtags: {
        include: { hashtag: true },
      },
      _count: {
        select: {
          interactions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// ========================================
// 📊 دوال الإحصائيات
// ========================================

/**
 * إحصائيات المستخدم
 */
export async function getUserStats(userId: string) {
  const [user, postsCount, interactionsCount, notificationsCount] = await Promise.all([
    prisma.user.findUnique({ 
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        followersCount: true,
        createdAt: true,
        lastSeenAt: true,
      }
    }),
    prisma.post.count({ where: { userId, isDeleted: false } }),
    prisma.interaction.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ])

  if (!user) return null

  return {
    user,
    stats: {
      posts: postsCount,
      interactions: interactionsCount,
      unreadNotifications: notificationsCount,
      followers: user.followersCount || 0,
      joinedDaysAgo: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    },
  }
}

/**
 * إحصائيات عامة للمنصة
 */
export async function getPlatformStats() {
  const [usersCount, postsCount, activeUsersToday] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.post.count({ where: { isDeleted: false } }),
    prisma.user.count({
      where: {
        lastSeenAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // آخر 24 ساعة
        },
      },
    }),
  ])

  return {
    totalUsers: usersCount,
    totalPosts: postsCount,
    activeUsersToday,
  }
}

// ========================================
// 🎯 دوال الاهتمامات الذكية
// ========================================

/**
 * الحصول على اهتمامات المستخدم مع التحليل
 */
export async function getUserInterests(userId: string) {
  const profile = await prisma.userInterestProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    },
  })

  if (!profile) return null

  const scores = await prisma.userInterestScore.findMany({
    where: { userId },
    orderBy: { currentScore: 'desc' },
    take: 10,
  })

  return {
    profile,
    topInterests: scores,
    analysis: {
      behaviorPattern: profile.behaviorPattern,
      engagementStyle: profile.engagementStyle,
      contentPreference: profile.contentPreference,
      diversity: profile.diversityScore,
      confidence: profile.overallConfidence,
    },
  }
}

/**
 * تحديث درجة اهتمام المستخدم
 */
export async function updateUserInterest(
  userId: string,
  interestName: string,
  scoreChange: number,
  source: string
) {
  // البحث عن الاهتمام الموجود
  const existingScore = await prisma.userInterestScore.findUnique({
    where: {
      userId_interestName: {
        userId,
        interestName,
      },
    },
  })

  if (existingScore) {
    // تحديث الدرجة الموجودة
    const newScore = Math.min(100, Math.max(0, existingScore.currentScore + scoreChange))
    
    return await prisma.userInterestScore.update({
      where: { id: existingScore.id },
      data: {
        currentScore: newScore,
        rawScore: newScore,
        totalInteractions: existingScore.totalInteractions + 1,
        recentInteractions: existingScore.recentInteractions + 1,
        lastActivity: new Date(),
      },
    })
  } else {
    // إنشاء اهتمام جديد
    return await prisma.userInterestScore.create({
      data: {
        userId,
        interestName,
        currentScore: Math.max(0, scoreChange),
        rawScore: Math.max(0, scoreChange),
        normalizedScore: Math.max(0, scoreChange) / 100,
        weightedScore: Math.max(0, scoreChange),
        category: 'عام',
        confidence: 0.5,
        sources: [source],
        sourceWeights: { [source]: 1.0 },
        primarySource: source,
        totalInteractions: 1,
        recentInteractions: 1,
        keywords: [interestName],
      },
    })
  }
}

// ========================================
// 🏷️ دوال الهاشتاج والترندات
// ========================================

/**
 * الحصول على الهاشتاجات الشائعة
 */
export async function getTrendingHashtags(limit = 20) {
  return await prisma.hashtag.findMany({
    orderBy: [
      { trendScore: 'desc' },
      { usageCount: 'desc' },
    ],
    take: limit,
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })
}

/**
 * تحديث عدد استخدام الهاشتاج
 */
export async function updateHashtagUsage(hashtagName: string) {
  return await prisma.hashtag.upsert({
    where: { name: hashtagName },
    update: {
      usageCount: { increment: 1 },
      dailyUsage: { increment: 1 },
      lastUsedAt: new Date(),
    },
    create: {
      name: hashtagName,
      usageCount: 1,
      dailyUsage: 1,
    },
  })
}

// ========================================
// 🔔 دوال الإشعارات
// ========================================

/**
 * إنشاء إشعار جديد
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) {
  return await prisma.notification.create({
    data: {
      userId,
      type: type as any,
      title,
      message,
      dataJson: data ? JSON.stringify(data) : null,
    },
  })
}

/**
 * الحصول على إشعارات المستخدم
 */
export async function getUserNotifications(userId: string, limit = 50) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

/**
 * تحديد الإشعارات كمقروءة
 */
export async function markNotificationsAsRead(userId: string, notificationIds?: string[]) {
  const where = notificationIds
    ? { userId, id: { in: notificationIds } }
    : { userId, isRead: false }

  return await prisma.notification.updateMany({
    where,
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

// ========================================
// 🧹 دوال التنظيف والصيانة
// ========================================

/**
 * تنظيف البيانات القديمة
 */
export async function cleanupOldData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  // حذف الإشعارات القديمة المقروءة
  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      isRead: true,
      readAt: { lt: thirtyDaysAgo },
    },
  })

  // حذف جلسات انتهت صلاحيتها
  const deletedSessions = await prisma.loginSession.deleteMany({
    where: {
      loginTime: { lt: thirtyDaysAgo },
      isActive: false,
    },
  })

  return {
    deletedNotifications: deletedNotifications.count,
    deletedSessions: deletedSessions.count,
  }
}

/**
 * إعادة حساب الإحصائيات
 */
export async function recalculateStats() {
  // تحديث عدد المتابعين لكل مستخدم
  const users = await prisma.user.findMany({ select: { id: true } })
  
  for (const user of users) {
    const followersCount = await prisma.user.count({
      where: { 
        // هنا نحتاج جدول Follow للحصول على العدد الصحيح
        // سنضيفه لاحقاً
      },
    })
    
    await prisma.user.update({
      where: { id: user.id },
      data: { followersCount },
    })
  }
}

// ========================================
// 📈 دوال التحليلات
// ========================================

/**
 * تحليل نشاط المستخدم
 */
export async function analyzeUserActivity(userId: string, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  
  const [posts, interactions, sessions] = await Promise.all([
    prisma.post.count({
      where: { userId, createdAt: { gte: startDate } },
    }),
    prisma.interaction.count({
      where: { userId, createdAt: { gte: startDate } },
    }),
    prisma.loginSession.count({
      where: { userId, loginTime: { gte: startDate } },
    }),
  ])

  return {
    postsCreated: posts,
    interactions,
    loginSessions: sessions,
    activityScore: (posts * 10 + interactions * 2 + sessions * 1) / days,
  }
}

/**
 * تحليل أداء المنشور
 */
export async function analyzePostPerformance(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      interactions: {
        select: {
          type: true,
          createdAt: true,
        },
      },
      hashtags: {
        include: { hashtag: true },
      },
      userScores: {
        select: {
          points: true,
          interactionType: true,
        },
      },
    },
  })

  if (!post) return null

  const interactionsByType = post.interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalPoints = post.userScores.reduce((sum, score) => sum + score.points, 0)

  return {
    post,
    metrics: {
      totalInteractions: post.interactions.length,
      interactionsByType,
      totalPoints,
      averagePointsPerInteraction: totalPoints / (post.interactions.length || 1),
      hashtags: post.hashtags.map(h => h.hashtag.name),
    },
  }
}

// ========================================
// 🎯 دوال التوصيات
// ========================================

/**
 * توصيات المنشورات للمستخدم
 */
export async function getRecommendedPosts(userId: string, limit = 20) {
  // الحصول على اهتمامات المستخدم
  const interests = await prisma.userInterestScore.findMany({
    where: { userId },
    orderBy: { currentScore: 'desc' },
    take: 5,
  })

  const interestKeywords = interests.flatMap(i => i.keywords)

  // البحث عن منشورات متعلقة بالاهتمامات
  return await prisma.post.findMany({
    where: {
      OR: interestKeywords.map(keyword => ({
        content: { contains: keyword, mode: 'insensitive' },
      })),
      isDeleted: false,
      visibility: 'PUBLIC',
      userId: { not: userId }, // استبعاد منشورات المستخدم نفسه
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePicture: true,
          isVerified: true,
        },
      },
      hashtags: {
        include: { hashtag: true },
      },
    },
    orderBy: [
      { createdAt: 'desc' },
      { likesCount: 'desc' },
    ],
    take: limit,
  })
}

/**
 * توصيات المستخدمين للمتابعة
 */
export async function getRecommendedUsers(userId: string, limit = 10) {
  // الحصول على اهتمامات المستخدم
  const userInterests = await prisma.userInterestScore.findMany({
    where: { userId },
    select: { interestName: true, currentScore: true },
    orderBy: { currentScore: 'desc' },
    take: 3,
  })

  if (userInterests.length === 0) {
    // إذا لم توجد اهتمامات، عرض المستخدمين الأكثر نشاطاً
    return await prisma.user.findMany({
      where: {
        isActive: true,
        id: { not: userId },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        followersCount: true,
      },
      orderBy: { followersCount: 'desc' },
      take: limit,
    })
  }

  // البحث عن مستخدمين لديهم نفس الاهتمامات
  const topInterestNames = userInterests.map(i => i.interestName)
  
  return await prisma.user.findMany({
    where: {
      isActive: true,
      id: { not: userId },
      interestScores: {
        some: {
          interestName: { in: topInterestNames },
          currentScore: { gte: 50 },
        },
      },
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      bio: true,
      profilePicture: true,
      isVerified: true,
      followersCount: true,
    },
    take: limit,
  })
}

// ========================================
// 👥 دوال المتابعة والأصدقاء
// ========================================

/**
 * متابعة مستخدم
 */
export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error('لا يمكن للمستخدم متابعة نفسه')
  }

  // التحقق من وجود المتابعة مسبقاً
  const existingFollow = await prisma.user.findFirst({
    where: {
      id: followingId,
      // سنحتاج إضافة جدول للمتابعة لاحقاً
    }
  })

  // تحديث عدد المتابعين
  await prisma.user.update({
    where: { id: followingId },
    data: { followersCount: { increment: 1 } }
  })

  return { success: true, message: 'تم متابعة المستخدم بنجاح' }
}

/**
 * إلغاء متابعة مستخدم
 */
export async function unfollowUser(followerId: string, followingId: string) {
  // تحديث عدد المتابعين
  await prisma.user.update({
    where: { id: followingId },
    data: { followersCount: { decrement: 1 } }
  })

  return { success: true, message: 'تم إلغاء متابعة المستخدم بنجاح' }
}

/**
 * الحصول على قائمة المستخدمين الأكثر تفاعلاً
 */
export async function getMostActiveUsers(limit = 10) {
  return await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      username: true,
      fullName: true,
      bio: true,
      profilePicture: true,
      isVerified: true,
      followersCount: true,
      _count: {
        select: {
          posts: { where: { isDeleted: false } },
          interactions: true,
        }
      }
    },
    orderBy: [
      { followersCount: 'desc' },
      { lastSeenAt: 'desc' }
    ],
    take: limit,
  })
}

// ========================================
// 📱 دوال إدارة المحتوى المتقدمة
// ========================================

/**
 * إنشاء منشور جديد مع تحليل ذكي للمحتوى
 */
export async function createSmartPost(
  userId: string,
  content: string,
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS' = 'PUBLIC',
  hashtags?: string[],
  mediaUrls?: string[]
) {
  // استخراج الهاشتاج من المحتوى
  const extractedHashtags = content.match(/#[\w\u0600-\u06FF]+/g)?.map(tag => tag.slice(1)) || []
  const allHashtags = Array.from(new Set([...(hashtags || []), ...extractedHashtags]))

  // إنشاء المنشور
  const post = await prisma.post.create({
    data: {
      userId,
      content,
      visibility,
      mediaUrl: mediaUrls?.[0] || null, // استخدام أول رابط فقط
    },
  })

  // إضافة الهاشتاج
  for (const hashtagName of allHashtags) {
    await updateHashtagUsage(hashtagName)
    
    // ربط الهاشتاج بالمنشور
    const hashtag = await prisma.hashtag.findUnique({
      where: { name: hashtagName }
    })
    
    if (hashtag) {
      await prisma.postHashtag.create({
        data: {
          postId: post.id,
          hashtagId: hashtag.id,
        }
      })
    }
  }

  // تحليل المحتوى وتحديث اهتمامات المستخدم
  await analyzeContentAndUpdateInterests(userId, content, allHashtags)

  return post
}

/**
 * تحليل المحتوى وتحديث اهتمامات المستخدم
 */
async function analyzeContentAndUpdateInterests(
  userId: string,
  content: string,
  hashtags: string[]
) {
  // الحصول على الكلمات المفتاحية من قاعدة البيانات
  const keywords = await prisma.keyword.findMany({
    where: {
      OR: [
        { keyword: { in: hashtags } },
        ...content.split(' ').map(word => ({ keyword: { contains: word } }))
      ]
    }
  })

  // تحديث نقاط الاهتمام للمستخدم
  for (const keyword of keywords) {
    const scoreIncrease = 5 // نقاط أساسية لإنشاء محتوى
    await updateUserInterest(userId, keyword.keyword, scoreIncrease, 'content_creation')
  }
}

// ========================================
// 🎯 دوال التحليل المتقدمة
// ========================================

/**
 * تحليل شبكة التفاعل الاجتماعي
 */
export async function analyzeSocialNetwork(userId: string) {
  const [userInteractions, userPosts, similarUsers] = await Promise.all([
    // التفاعلات التي قام بها المستخدم
    prisma.interaction.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            user: {
              select: { id: true, username: true, fullName: true }
            }
          }
        }
      },
      take: 100
    }),
    
    // منشورات المستخدم والتفاعل معها
    prisma.post.findMany({
      where: { userId, isDeleted: false },
      include: {
        interactions: {
          include: {
            user: {
              select: { id: true, username: true, fullName: true }
            }
          }
        }
      },
      take: 50
    }),

    // مستخدمين مشابهين
    getRecommendedUsers(userId, 5)
  ])

  // تحليل شبكة التفاعل
  const interactionPartners = new Map<string, {
    userId: string,
    username: string,
    fullName: string,
    interactionCount: number,
    interactionTypes: string[]
  }>()

  // تحليل تفاعلات المستخدم مع الآخرين
  userInteractions.forEach(interaction => {
    const partnerId = interaction.post.user.id
    if (partnerId !== userId) {
      const existing = interactionPartners.get(partnerId) || {
        userId: partnerId,
        username: interaction.post.user.username,
        fullName: interaction.post.user.fullName,
        interactionCount: 0,
        interactionTypes: []
      }
      existing.interactionCount++
      if (!existing.interactionTypes.includes(interaction.type)) {
        existing.interactionTypes.push(interaction.type)
      }
      interactionPartners.set(partnerId, existing)
    }
  })

  // تحليل من يتفاعل مع منشورات المستخدم
  userPosts.forEach(post => {
    post.interactions.forEach(interaction => {
      const partnerId = interaction.user.id
      if (partnerId !== userId) {
        const existing = interactionPartners.get(partnerId) || {
          userId: partnerId,
          username: interaction.user.username,
          fullName: interaction.user.fullName,
          interactionCount: 0,
          interactionTypes: []
        }
        existing.interactionCount++
        if (!existing.interactionTypes.includes(interaction.type)) {
          existing.interactionTypes.push(interaction.type)
        }
        interactionPartners.set(partnerId, existing)
      }
    })
  })

  // ترتيب الشركاء حسب التفاعل
  const topPartners = Array.from(interactionPartners.values())
    .sort((a, b) => b.interactionCount - a.interactionCount)
    .slice(0, 10)

  return {
    totalInteractions: userInteractions.length,
    totalPosts: userPosts.length,
    topInteractionPartners: topPartners,
    similarUsers,
    networkHealth: {
      diversity: topPartners.length,
      engagement: topPartners.reduce((sum, p) => sum + p.interactionCount, 0),
      avgInteractionsPerPartner: topPartners.length > 0 
        ? topPartners.reduce((sum, p) => sum + p.interactionCount, 0) / topPartners.length 
        : 0
    }
  }
}

/**
 * تحليل محتوى المنصة والاتجاهات
 */
export async function analyzePlatformTrends(days = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [recentPosts, recentHashtags, recentKeywords] = await Promise.all([
    prisma.post.findMany({
      where: {
        createdAt: { gte: startDate },
        isDeleted: false,
        visibility: 'PUBLIC'
      },
      include: {
        hashtags: { include: { hashtag: true } },
        interactions: true
      }
    }),

    prisma.hashtag.findMany({
      where: {
        lastUsedAt: { gte: startDate }
      },
      orderBy: { usageCount: 'desc' },
      take: 20
    }),

    prisma.keyword.findMany({
      where: {
        updatedAt: { gte: startDate }
      },
      orderBy: { usageCount: 'desc' },
      take: 30
    })
  ])

  // تحليل المحتوى الأكثر تفاعلاً
  const topPosts = recentPosts
    .sort((a, b) => b.interactions.length - a.interactions.length)
    .slice(0, 10)

  // تحليل الهاشتاج الشائعة
  const hashtagStats = recentHashtags.map(hashtag => ({
    name: hashtag.name,
    usage: hashtag.usageCount,
    trend: hashtag.trendScore || 0
  }))

  // تحليل الكلمات المفتاحية
  const keywordStats = recentKeywords.map(keyword => ({
    keyword: keyword.keyword,
    category: keyword.category,
    usage: keyword.usageCount,
    sentiment: keyword.sentiment
  }))

  return {
    period: `آخر ${days} أيام`,
    stats: {
      totalPosts: recentPosts.length,
      totalInteractions: recentPosts.reduce((sum, post) => sum + post.interactions.length, 0),
      avgInteractionsPerPost: recentPosts.length > 0 
        ? recentPosts.reduce((sum, post) => sum + post.interactions.length, 0) / recentPosts.length 
        : 0
    },
    topContent: topPosts.map(post => ({
      id: post.id,
      content: post.content.substring(0, 100) + '...',
      interactions: post.interactions.length,
      hashtags: post.hashtags.map(h => h.hashtag.name)
    })),
    trendingHashtags: hashtagStats,
    keywordTrends: keywordStats
  }
}
