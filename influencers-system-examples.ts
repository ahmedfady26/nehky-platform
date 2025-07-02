// 🚀 أمثلة برمجية لأنظمة المؤثرين وكبار المتابعين والأصدقاء المميزين
// منصة نحكي - Nehky.com

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================
// 🌟 نظام المؤثرين (Influencers)
// ===============================

/**
 * التحقق من أن المستخدم مؤثر
 */
async function checkInfluencerStatus(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      isInfluencer: true, 
      followersCount: true 
    }
  });
  
  return !!(user?.isInfluencer && user.followersCount >= 1000);
}

/**
 * ترقية مستخدم إلى مؤثر
 */
async function promoteToInfluencer(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      isInfluencer: true,
      role: 'INFLUENCER'
    }
  });
  
  console.log(`✅ تم ترقية المستخدم ${userId} إلى مؤثر`);
}

// ===============================
// 🏆 نظام كبير المتابعين (Top Followers)  
// ===============================

/**
 * حساب نقاط التفاعل للمستخدم مع منشورات مؤثر معين
 */
async function calculateUserScoreForInfluencer(
  userId: string, 
  influencerId: string, 
  days: number = 14
): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const scores = await prisma.userScore.aggregate({
    where: {
      userId: userId,
      post: {
        userId: influencerId
      },
      interactionTime: {
        gte: startDate
      }
    },
    _sum: {
      calculatedScore: true
    }
  });
  
  return scores._sum.calculatedScore || 0;
}

/**
 * العثور على أفضل 3 متفاعلين مع مؤثر
 */
async function findTopFollowersForInfluencer(influencerId: string): Promise<TopFollower[]> {
  // التحقق من أن المستخدم مؤثر
  const isInfluencer = await checkInfluencerStatus(influencerId);
  if (!isInfluencer) {
    throw new Error('المستخدم ليس مؤثراً');
  }
  
  const evaluationPeriod = 14; // days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - evaluationPeriod);
  
  // حساب النقاط لكل متفاعل
  const followerScores = await prisma.userScore.groupBy({
    by: ['userId'],
    where: {
      post: {
        userId: influencerId
      },
      interactionTime: {
        gte: startDate
      }
    },
    _sum: {
      calculatedScore: true
    },
    _max: {
      interactionTime: true
    },
    _count: {
      id: true
    }
  });
  
  // ترتيب وأخذ أفضل 3
  const sortedFollowers = followerScores
    .filter(f => f._sum.calculatedScore != null && f._sum.calculatedScore > 0)
    .sort((a, b) => {
      // الترتيب حسب النقاط أولاً
      const scoreA = a._sum.calculatedScore || 0;
      const scoreB = b._sum.calculatedScore || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      // في حالة التساوي، الأحدث تفاعلاً أولاً
      const timeA = a._max.interactionTime ? new Date(a._max.interactionTime).getTime() : 0;
      const timeB = b._max.interactionTime ? new Date(b._max.interactionTime).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 3);
  
  // جلب بيانات المستخدمين
  const topFollowers: TopFollower[] = [];
  
  for (let i = 0; i < sortedFollowers.length; i++) {
    const followerData = sortedFollowers[i];
    const user = await prisma.user.findUnique({
      where: { id: followerData.userId },
      select: { 
        id: true, 
        username: true, 
        fullName: true, 
        profilePicture: true 
      }
    });
    
    if (user) {
      topFollowers.push({
        rank: i + 1,
        user: user,
        score: followerData._sum.calculatedScore || 0,
        interactionCount: followerData._count.id,
        lastInteraction: followerData._max.interactionTime || new Date()
      });
    }
  }
  
  return topFollowers;
}

/**
 * ترشيح أفضل المتفاعلين كـ "كبار المتابعين"
 */
async function nominateTopFollowers(influencerId: string): Promise<string[]> {
  const topFollowers = await findTopFollowersForInfluencer(influencerId);
  const currentWeek = getCurrentWeekString(); // "2025-W27"
  const nominationIds: string[] = [];
  
  for (const follower of topFollowers) {
    // التحقق من عدم وجود ترشيح سابق في نفس الأسبوع
    const existingNomination = await prisma.nomination.findUnique({
      where: {
        influencerId_week: {
          influencerId: influencerId,
          week: currentWeek
        }
      }
    });
    
    if (!existingNomination) {
      const nomination = await prisma.nomination.create({
        data: {
          influencerId: influencerId,
          candidateUserId: follower.user.id,
          scoreSnapshot: follower.score,
          week: currentWeek,
          year: new Date().getFullYear(),
          weekNumber: getCurrentWeekNumber(),
          decisionDeadline: getDecisionDeadline() // 7 أيام من الآن
        }
      });
      
      nominationIds.push(nomination.id);
      console.log(`🏆 تم ترشيح ${follower.user.username} كـ كبير متابعين للمؤثر ${influencerId}`);
    }
  }
  
  return nominationIds;
}

/**
 * الرد على ترشيح كبير المتابعين
 */
async function respondToNomination(
  nominationId: string, 
  accept: boolean
): Promise<void> {
  const nomination = await prisma.nomination.update({
    where: { id: nominationId },
    data: {
      status: accept ? 'ACCEPTED' : 'REJECTED',
      respondedAt: new Date()
    },
    include: {
      influencer: { select: { username: true } },
      candidate: { select: { username: true } }
    }
  });
  
  const status = accept ? 'قبل' : 'رفض';
  console.log(`✅ ${nomination.candidate.username} ${status} ترشيح كبير المتابعين من ${nomination.influencer.username}`);
}

// ===============================
// 💝 نظام أفضل صديق (Best Friends)
// ===============================

/**
 * العثور على أفضل 3 أصدقاء لمستخدم عادي
 */
async function findBestFriendsForUser(userId: string): Promise<BestFriend[]> {
  // التحقق من أن المستخدم ليس مؤثراً
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isInfluencer: true, followersCount: true }
  });
  
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }
  
  if (user.isInfluencer || user.followersCount >= 1000) {
    throw new Error('هذا المستخدم مؤثر، يجب استخدام نظام كبير المتابعين');
  }
  
  const evaluationPeriod = 14; // days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - evaluationPeriod);
  
  // حساب النقاط لكل متفاعل (نفس خوارزمية كبير المتابعين)
  const friendScores = await prisma.userScore.groupBy({
    by: ['userId'],
    where: {
      post: {
        userId: userId // منشورات المستخدم العادي
      },
      interactionTime: {
        gte: startDate
      }
    },
    _sum: {
      calculatedScore: true
    },
    _max: {
      interactionTime: true
    },
    _count: {
      id: true
    }
  });
  
  // ترتيب وأخذ أفضل 3 (نفس منطق كبير المتابعين)
  const sortedFriends = friendScores
    .filter(f => f._sum.calculatedScore != null && f._sum.calculatedScore > 0)
    .sort((a, b) => {
      const scoreA = a._sum.calculatedScore || 0;
      const scoreB = b._sum.calculatedScore || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      const timeA = a._max.interactionTime ? new Date(a._max.interactionTime).getTime() : 0;
      const timeB = b._max.interactionTime ? new Date(b._max.interactionTime).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 3);
  
  // جلب بيانات المستخدمين
  const bestFriends: BestFriend[] = [];
  
  for (let i = 0; i < sortedFriends.length; i++) {
    const friendData = sortedFriends[i];
    const friendUser = await prisma.user.findUnique({
      where: { id: friendData.userId },
      select: { 
        id: true, 
        username: true, 
        fullName: true, 
        profilePicture: true 
      }
    });
    
    if (friendUser) {
      bestFriends.push({
        rank: i + 1,
        user: friendUser,
        score: friendData._sum.calculatedScore || 0,
        interactionCount: friendData._count.id,
        lastInteraction: friendData._max.interactionTime || new Date(),
        relationshipType: 'BEST_FRIEND'
      });
    }
  }
  
  return bestFriends;
}

/**
 * تحديث قائمة أفضل الأصدقاء (تلقائي - لا يحتاج موافقة)
 */
async function updateBestFriends(userId: string): Promise<void> {
  const bestFriends = await findBestFriendsForUser(userId);
  
  // ملاحظة: جدول best_friends غير موجود حالياً في schema.prisma
  // يمكن حفظ البيانات في cache أو إضافة الجدول لاحقاً
  
  // في حالة وجود جدول best_friends منفصل (مستقبلاً)
  // إزالة العلاقات القديمة
  // await prisma.bestFriend.deleteMany({
  //   where: { 
  //     userId: userId,
  //     isActive: true
  //   }
  // });
  
  // إضافة العلاقات الجديدة  
  // for (const friend of bestFriends) {
  //   await prisma.bestFriend.create({
  //     data: {
  //       userId: userId,
  //       friendId: friend.user.id,
  //       scoreSnapshot: friend.score,
  //       rank: friend.rank,
  //       evaluationPeriodStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  //       evaluationPeriodEnd: new Date(),
  //       isActive: true
  //     }
  //   });
  // }
  
  console.log(`💝 تم تحديث قائمة أفضل الأصدقاء للمستخدم ${userId}`);
  console.log('أفضل الأصدقاء:', bestFriends.map(f => f.user.username));
}

// ===============================
// 🔄 حساب النقاط (نظام موحد)
// ===============================

/**
 * حساب نقاط التفاعل حسب السرعة والنوع
 */
function calculateInteractionScore(
  interactionType: 'LIKE' | 'COMMENT' | 'SHARE',
  speedCategory: 'FAST' | 'MEDIUM' | 'SLOW'
): number {
  // النقاط الأساسية حسب السرعة
  const speedPoints = {
    FAST: 10,   // 0-5 دقائق
    MEDIUM: 5,  // 5-30 دقيقة
    SLOW: 2     // 30+ دقيقة
  };
  
  // مضاعف حسب نوع التفاعل
  const typeMultiplier = {
    SHARE: 3,    // مشاركة
    COMMENT: 2,  // تعليق
    LIKE: 1      // إعجاب
  };
  
  return speedPoints[speedCategory] * typeMultiplier[interactionType];
}

/**
 * تحديد فئة السرعة حسب وقت التفاعل
 */
function determineSpeedCategory(
  postCreatedAt: Date, 
  interactionTime: Date
): 'FAST' | 'MEDIUM' | 'SLOW' {
  const timeDiffMinutes = (interactionTime.getTime() - postCreatedAt.getTime()) / (1000 * 60);
  
  if (timeDiffMinutes <= 5) return 'FAST';
  if (timeDiffMinutes <= 30) return 'MEDIUM';
  return 'SLOW';
}

/**
 * حفظ نقاط التفاعل الجديدة
 */
async function saveInteractionScore(
  userId: string,
  postId: string,
  interactionId: string,
  interactionType: 'LIKE' | 'COMMENT' | 'SHARE'
): Promise<void> {
  // جلب وقت إنشاء المنشور
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { createdAt: true }
  });
  
  if (!post) return;
  
  const interactionTime = new Date();
  const speedCategory = determineSpeedCategory(post.createdAt, interactionTime);
  const calculatedScore = calculateInteractionScore(interactionType, speedCategory);
  
  // حفظ النقاط في الجدول
  await prisma.userScore.create({
    data: {
      userId: userId,
      postId: postId,
      interactionId: interactionId,
      interactionType: interactionType,
      points: calculatedScore,
      interactionTime: interactionTime,
      calculatedScore: calculatedScore,
      speedCategory: speedCategory
    }
  });
  
  console.log(`📊 تم حفظ ${calculatedScore} نقطة للمستخدم ${userId} (${interactionType}, ${speedCategory})`);
}

// ===============================
// 🛠️ دوال مساعدة
// ===============================

function getCurrentWeekString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const weekNumber = getCurrentWeekNumber();
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

function getDecisionDeadline(): Date {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7); // 7 أيام للرد
  return deadline;
}

// ===============================
// ✍️ نظام التواقيع (Signatures System)
// ===============================

/**
 * إرسال توقيع من مؤثر إلى كبير متابعين
 */
async function createSignature(
  influencerId: string,
  followerId: string,
  signatureText: string
): Promise<string> {
  // التحقق من أن المرسل مؤثر
  const isInfluencer = await checkInfluencerStatus(influencerId);
  if (!isInfluencer) {
    throw new Error('فقط المؤثرون يمكنهم إرسال التواقيع');
  }

  // التحقق من أن المستلم هو كبير متابعين
  const isTopFollower = await checkIfTopFollower(influencerId, followerId);
  if (!isTopFollower) {
    throw new Error('يمكن إرسال التواقيع فقط لكبار المتابعين');
  }

  // التحقق من الحدود اليومية والأسبوعية
  await checkSignatureLimits(influencerId);

  // إنشاء التوقيع أو تحديث الموجود
  const signature = await prisma.userSignature.upsert({
    where: {
      influencerId_followerId: {
        influencerId: influencerId,
        followerId: followerId
      }
    },
    update: {
      signatureText: signatureText,
      updatedAt: new Date(),
      isActive: true
    },
    create: {
      influencerId: influencerId,
      followerId: followerId,
      signatureText: signatureText,
      isActive: true
    }
  });

  console.log(`✍️ تم إرسال توقيع من ${influencerId} إلى ${followerId}`);
  return signature.id;
}

/**
 * التحقق من أن المستخدم كبير متابعين للمؤثر
 */
async function checkIfTopFollower(influencerId: string, followerId: string): Promise<boolean> {
  const activeNomination = await prisma.nomination.findFirst({
    where: {
      influencerId: influencerId,
      candidateUserId: followerId,
      status: 'ACCEPTED'
    },
    orderBy: {
      nominatedAt: 'desc'
    }
  });

  return !!activeNomination;
}

/**
 * التحقق من حدود التواقيع اليومية والأسبوعية
 */
async function checkSignatureLimits(influencerId: string): Promise<void> {
  const now = new Date();
  
  // حد يومي: 1 توقيع
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dailyCount = await prisma.userSignature.count({
    where: {
      influencerId: influencerId,
      createdAt: {
        gte: startOfDay
      }
    }
  });

  if (dailyCount >= 1) {
    throw new Error('تم الوصول للحد اليومي للتواقيع (1 توقيع يومياً)');
  }

  // حد أسبوعي: 3 تواقيع
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // بداية الأسبوع
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyCount = await prisma.userSignature.count({
    where: {
      influencerId: influencerId,
      createdAt: {
        gte: startOfWeek
      }
    }
  });

  if (weeklyCount >= 3) {
    throw new Error('تم الوصول للحد الأسبوعي للتواقيع (3 تواقيع أسبوعياً)');
  }
}

/**
 * جلب دفتر تواقيع المؤثر مقسم حسب الأجيال
 */
async function getInfluencerSignatureBook(influencerId: string): Promise<InfluencerSignatureBook> {
  const isInfluencer = await checkInfluencerStatus(influencerId);
  if (!isInfluencer) {
    throw new Error('المستخدم ليس مؤثراً');
  }

  const now = new Date();
  
  // تواريخ تقسيم الأجيال
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const signatures = await prisma.userSignature.findMany({
    where: {
      influencerId: influencerId,
      isActive: true
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePicture: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // تقسيم التواقيع حسب الأجيال
  const newGeneration = signatures.filter(s => s.createdAt >= thirtyDaysAgo);
  const secondGeneration = signatures.filter(s => 
    s.createdAt < thirtyDaysAgo && s.createdAt >= threeMonthsAgo
  );
  const firstGeneration = signatures.filter(s => s.createdAt < threeMonthsAgo);

  return {
    influencerId,
    totalSignatures: signatures.length,
    generations: {
      new: {
        name: 'الجيل الجديد',
        description: 'آخر 30 يوماً',
        count: newGeneration.length,
        signatures: newGeneration.map(mapSignatureToDisplay)
      },
      second: {
        name: 'الجيل الثاني', 
        description: '1-3 أشهر',
        count: secondGeneration.length,
        signatures: secondGeneration.map(mapSignatureToDisplay)
      },
      first: {
        name: 'الجيل الأول',
        description: 'أكثر من 3 أشهر',
        count: firstGeneration.length,
        signatures: firstGeneration.map(mapSignatureToDisplay)
      }
    },
    limits: {
      dailyRemaining: await getDailySignatureLimit(influencerId),
      weeklyRemaining: await getWeeklySignatureLimit(influencerId)
    }
  };
}

/**
 * جلب تواقيع المستلم
 */
async function getReceivedSignatures(userId: string): Promise<ReceivedSignatures> {
  const signatures = await prisma.userSignature.findMany({
    where: {
      followerId: userId,
      isActive: true
    },
    include: {
      influencer: {
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePicture: true,
          isVerified: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // تجميع التواقيع حسب المؤثر
  const signaturesByInfluencer = signatures.reduce((acc, signature) => {
    const influencerId = signature.influencerId;
    if (!acc[influencerId]) {
      acc[influencerId] = {
        influencer: signature.influencer,
        signatures: [],
        latestSignature: signature.createdAt
      };
    }
    acc[influencerId].signatures.push(mapSignatureToDisplay(signature));
    return acc;
  }, {} as Record<string, any>);

  return {
    userId,
    totalSignatures: signatures.length,
    totalInfluencers: Object.keys(signaturesByInfluencer).length,
    signaturesByInfluencer: Object.values(signaturesByInfluencer).sort(
      (a, b) => new Date(b.latestSignature).getTime() - new Date(a.latestSignature).getTime()
    )
  };
}

/**
 * تحديد جيل التوقيع حسب التاريخ
 */
function determineSignatureGeneration(createdAt: Date): SignatureGeneration {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  if (createdAt >= thirtyDaysAgo) {
    return { type: 'NEW', name: 'الجيل الجديد', emoji: '🌟' };
  } else if (createdAt >= threeMonthsAgo) {
    return { type: 'SECOND', name: 'الجيل الثاني', emoji: '⭐' };
  } else {
    return { type: 'FIRST', name: 'الجيل الأول', emoji: '🏆' };
  }
}

/**
 * تحويل التوقيع لعرض منسق
 */
function mapSignatureToDisplay(signature: any): SignatureDisplay {
  const generation = determineSignatureGeneration(signature.createdAt);
  
  return {
    id: signature.id,
    text: signature.signatureText,
    createdAt: signature.createdAt,
    updatedAt: signature.updatedAt,
    user: signature.follower || signature.influencer,
    generation,
    canHide: true,
    canArchive: true,
    canShare: !!signature.follower // فقط المستلم يمكنه المشاركة
  };
}

/**
 * إخفاء أو أرشفة توقيع
 */
async function toggleSignatureVisibility(
  signatureId: string,
  userId: string,
  action: 'hide' | 'archive' | 'activate'
): Promise<void> {
  const signature = await prisma.userSignature.findUnique({
    where: { id: signatureId }
  });

  if (!signature) {
    throw new Error('التوقيع غير موجود');
  }

  // التحقق من الصلاحية
  if (signature.influencerId !== userId && signature.followerId !== userId) {
    throw new Error('ليس لديك صلاحية لتعديل هذا التوقيع');
  }

  const isActive = action === 'activate';
  
  await prisma.userSignature.update({
    where: { id: signatureId },
    data: {
      isActive: isActive,
      updatedAt: new Date()
    }
  });

  const actionText = action === 'hide' ? 'إخفاء' : action === 'archive' ? 'أرشفة' : 'تفعيل';
  console.log(`✅ تم ${actionText} التوقيع ${signatureId}`);
}

/**
 * مشاركة توقيع عبر رابط
 */
async function generateSignatureShareLink(signatureId: string, userId: string): Promise<string> {
  const signature = await prisma.userSignature.findUnique({
    where: { id: signatureId },
    include: {
      influencer: { select: { username: true, fullName: true } },
      follower: { select: { username: true, fullName: true } }
    }
  });

  if (!signature) {
    throw new Error('التوقيع غير موجود');
  }

  // فقط المستلم يمكنه مشاركة التوقيع
  if (signature.followerId !== userId) {
    throw new Error('فقط مستلم التوقيع يمكنه مشاركته');
  }

  // إنشاء رابط مشاركة
  const shareLink = `https://nehky.com/signatures/share/${signatureId}`;
  
  console.log(`📤 تم إنشاء رابط مشاركة للتوقيع: ${shareLink}`);
  return shareLink;
}

/**
 * جلب الحد اليومي المتبقي للتواقيع
 */
async function getDailySignatureLimit(influencerId: string): Promise<number> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dailyCount = await prisma.userSignature.count({
    where: {
      influencerId: influencerId,
      createdAt: { gte: startOfDay }
    }
  });

  return Math.max(0, 1 - dailyCount); // حد أقصى 1 يومياً
}

/**
 * جلب الحد الأسبوعي المتبقي للتواقيع
 */
async function getWeeklySignatureLimit(influencerId: string): Promise<number> {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyCount = await prisma.userSignature.count({
    where: {
      influencerId: influencerId,
      createdAt: { gte: startOfWeek }
    }
  });

  return Math.max(0, 3 - weeklyCount); // حد أقصى 3 أسبوعياً
}

/**
 * قوالب جاهزة للتواقيع
 */
const signatureTemplates = {
  appreciation: [
    'شكراً لك على دعمك المستمر ❤️',
    'أنت من أفضل المتابعين لدي 🌟',
    'تفاعلك يضيء يومي ✨',
    'ممتن لوجودك في رحلتي 🙏'
  ],
  encouragement: [
    'استمر في إبداعك 🚀',
    'أؤمن بقدراتك الرائعة 💪',
    'مستقبلك مشرق بإذن الله ☀️',
    'لا تتوقف عن الحلم 🌙'
  ],
  friendship: [
    'سعيد بصداقتنا 🤝',
    'أنت صديق عزيز علي 💝',
    'الصداقة الحقيقية نادرة وأنت منها 🌹',
    'معاً نحو النجاح 🎯'
  ],
  motivation: [
    'النجاح ينتظرك 🏆',
    'كل خطوة تقربك من هدفك 👣',
    'الإرادة أقوى من المستحيل 💎',
    'تستحق كل خير 🌈'
  ]
};

/**
 * جلب قوالب التواقيع الجاهزة
 */
function getSignatureTemplates(): typeof signatureTemplates {
  return signatureTemplates;
}

// ===============================
// 📝 جميع أنواع البيانات
// ===============================

interface TopFollower {
  rank: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string | null;
  };
  score: number;
  interactionCount: number;
  lastInteraction: Date;
}

interface BestFriend {
  rank: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string | null;
  };
  score: number;
  interactionCount: number;
  lastInteraction: Date;
  relationshipType: 'BEST_FRIEND';
}

interface SignatureGeneration {
  type: 'NEW' | 'SECOND' | 'FIRST';
  name: string;
  emoji: string;
}

interface SignatureDisplay {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string | null;
  };
  generation: SignatureGeneration;
  canHide: boolean;
  canArchive: boolean;
  canShare: boolean;
}

interface InfluencerSignatureBook {
  influencerId: string;
  totalSignatures: number;
  generations: {
    new: {
      name: string;
      description: string;
      count: number;
      signatures: SignatureDisplay[];
    };
    second: {
      name: string;
      description: string;
      count: number;
      signatures: SignatureDisplay[];
    };
    first: {
      name: string;
      description: string;
      count: number;
      signatures: SignatureDisplay[];
    };
  };
  limits: {
    dailyRemaining: number;
    weeklyRemaining: number;
  };
}

interface ReceivedSignatures {
  userId: string;
  totalSignatures: number;
  totalInfluencers: number;
  signaturesByInfluencer: Array<{
    influencer: {
      id: string;
      username: string;
      fullName: string;
      profilePicture: string | null;
      isVerified: boolean;
    };
    signatures: SignatureDisplay[];
    latestSignature: Date;
  }>;
}

// ===============================
// 🧪 أمثلة للاختبار
// ===============================

async function runExamples() {
  try {
    console.log('🚀 بدء اختبار أنظمة المؤثرين...');
    
    // مثال 1: التحقق من حالة مؤثر
    const isInfluencer = await checkInfluencerStatus('user123');
    console.log(`المستخدم مؤثر: ${isInfluencer}`);
    
    // مثال 2: العثور على كبار المتابعين
    if (isInfluencer) {
      const topFollowers = await findTopFollowersForInfluencer('user123');
      console.log('🏆 أفضل المتابعين:', topFollowers);
    }
    
    // مثال 3: العثور على أفضل الأصدقاء
    const bestFriends = await findBestFriendsForUser('user456');
    console.log('💝 أفضل الأصدقاء:', bestFriends);
    
    // مثال 4: حفظ نقاط تفاعل جديدة
    await saveInteractionScore('user789', 'post123', 'interaction456', 'COMMENT');
    
    // مثال 5: إرسال توقيع
    await createSignature('user123', 'follower456', 'توقيع مميز من مؤثر رائع!');
    
    // مثال 6: جلب دفتر التواقيع
    const signatureBook = await getInfluencerSignatureBook('user123');
    console.log('📚 دفتر التواقيع:', signatureBook);
    
    // مثال 7: جلب تواقيع المستلم
    const receivedSignatures = await getReceivedSignatures('follower456');
    console.log('✉️ تواقيع المستلم:', receivedSignatures);
    
    console.log('✅ تم الانتهاء من الاختبارات بنجاح');
    
  } catch (error) {
    console.error('❌ خطأ في التنفيذ:', error);
  }
}

// تشغيل الأمثلة (احذف هذا السطر في الإنتاج)
// runExamples();

export {
  checkInfluencerStatus,
  promoteToInfluencer,
  findTopFollowersForInfluencer,
  nominateTopFollowers,
  respondToNomination,
  findBestFriendsForUser,
  updateBestFriends,
  calculateInteractionScore,
  saveInteractionScore,
  // نظام التواقيع
  createSignature,
  checkIfTopFollower,
  getInfluencerSignatureBook,
  getReceivedSignatures,
  toggleSignatureVisibility,
  generateSignatureShareLink,
  getSignatureTemplates,
  getDailySignatureLimit,
  getWeeklySignatureLimit
};
