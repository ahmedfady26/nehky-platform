/**
 * خدمة إدارة التفاعلات مع نظام احتساب النقاط المتقدم لجميع المستخدمين
 * Advanced Interaction Management Service with Speed-Based Scoring for ALL Users
 * 
 * يعمل مع:
 * - المستخدمين العاديين (Regular Users)
 * - كبار المتابعين / المؤثرين (Influencers)
 * - جميع فئات المستخدمين بعدالة وشفافية
 */

import { PrismaClient, InteractionType, SpeedCategory } from '@prisma/client';
import { 
  calculateInteractionScore, 
  calculateAdjustedPoints,
  DEFAULT_REACTION_SPEED_CONFIG,
  type ReactionSpeedConfig 
} from './reaction-speed-scoring';

export class InteractionService {
  private prisma: PrismaClient;
  private config: ReactionSpeedConfig;

  constructor(prisma: PrismaClient, config: ReactionSpeedConfig = DEFAULT_REACTION_SPEED_CONFIG) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * إنشاء تفاعل جديد مع حساب النقاط تلقائياً - لجميع المستخدمين
   * (المستخدمين العاديين وكبار المتابعين / المؤثرين)
   */
  async createInteraction(data: {
    postId: string;
    userId: string;
    type: InteractionType;
    content?: string;
    parentId?: string;
  }) {
    try {
      // الحصول على معلومات المنشور
      const post = await this.prisma.post.findUnique({
        where: { id: data.postId },
        select: { createdAt: true, userId: true }
      });

      if (!post) {
        throw new Error('المنشور غير موجود');
      }

      const interactionTime = new Date();
      
      // حساب النقاط بناءً على سرعة التفاعل
      const scoreData = calculateInteractionScore(
        post.createdAt,
        interactionTime,
        data.type,
        this.config
      );

      // إنشاء التفاعل مع النقاط المحسوبة
      const interaction = await this.prisma.interaction.create({
        data: {
          postId: data.postId,
          userId: data.userId,
          type: data.type,
          content: data.content,
          parentId: data.parentId,
          reactionSpeedMultiplier: scoreData.speedMultiplier,
          adjustedPoints: scoreData.adjustedPoints,
        },
        include: {
          user: {
            select: { id: true, username: true, fullName: true }
          },
          post: {
            select: { id: true, userId: true }
          }
        }
      });

      // إنشاء سجل في جدول UserScore
      await this.prisma.userScore.create({
        data: {
          userId: data.userId,
          postId: data.postId,
          interactionId: interaction.id,
          interactionType: data.type,
          points: scoreData.basePoints,
          interactionTime,
          calculatedScore: scoreData.adjustedPoints,
          speedCategory: scoreData.speedCategory,
        }
      });

      // تحديث عدادات المنشور حسب نوع التفاعل
      await this.updatePostCounters(data.postId, data.type, 'increment');

      // تحديث نقاط المستخدم الإجمالية (إذا كان هناك جدول للنقاط الإجمالية)
      await this.updateUserTotalPoints(data.userId, scoreData.adjustedPoints);

      return {
        interaction,
        scoreData: {
          basePoints: scoreData.basePoints,
          speedMultiplier: scoreData.speedMultiplier,
          adjustedPoints: scoreData.adjustedPoints,
          speedCategory: scoreData.speedCategory,
          timeDiffMinutes: scoreData.timeDiffMinutes,
        }
      };

    } catch (error) {
      console.error('خطأ في إنشاء التفاعل:', error);
      throw error;
    }
  }

  /**
   * حذف تفاعل مع تحديث النقاط
   */
  async deleteInteraction(interactionId: string, userId: string) {
    try {
      // الحصول على معلومات التفاعل
      const interaction = await this.prisma.interaction.findUnique({
        where: { id: interactionId },
        select: {
          id: true,
          userId: true,
          postId: true,
          type: true,
          adjustedPoints: true,
        }
      });

      if (!interaction) {
        throw new Error('التفاعل غير موجود');
      }

      if (interaction.userId !== userId) {
        throw new Error('غير مسموح بحذف هذا التفاعل');
      }

      // حذف التفاعل (سيتم حذف UserScore تلقائياً بسبب onDelete: Cascade)
      await this.prisma.interaction.delete({
        where: { id: interactionId }
      });

      // تحديث عدادات المنشور
      await this.updatePostCounters(interaction.postId, interaction.type, 'decrement');

      // تحديث نقاط المستخدم الإجمالية (طرح النقاط)
      if (interaction.adjustedPoints) {
        await this.updateUserTotalPoints(userId, -interaction.adjustedPoints);
      }

      return { success: true };

    } catch (error) {
      console.error('خطأ في حذف التفاعل:', error);
      throw error;
    }
  }

  /**
   * تحديث عدادات المنشور - مناسب لجميع المستخدمين العاديين
   */
  private async updatePostCounters(
    postId: string, 
    interactionType: InteractionType, 
    operation: 'increment' | 'decrement'
  ) {
    const increment = operation === 'increment' ? 1 : -1;

    switch (interactionType) {
      case 'LIKE':
        await this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment } }
        });
        break;
      case 'COMMENT':
        await this.prisma.post.update({
          where: { id: postId },
          data: { commentsCount: { increment } }
        });
        break;
      case 'SHARE':
        await this.prisma.post.update({
          where: { id: postId },
          data: { sharesCount: { increment } }
        });
        break;
      case 'VIEW':
        await this.prisma.post.update({
          where: { id: postId },
          data: { viewsCount: { increment } }
        });
        break;
      case 'SAVE':
        // حقل SAVE غير موجود في جدول Post، يمكن إضافته لاحقاً
        console.log(`تفاعل SAVE للمنشور ${postId} - سيتم تتبعه في UserScore فقط`);
        break;
    }
  }

  /**
   * تحديث النقاط الإجمالية للمستخدم (عادي أو مؤثر)
   */
  private async updateUserTotalPoints(userId: string, pointsChange: number) {
    try {
      // البحث عن جدول النقاط الإجمالية أو إنشاؤه
      // يمكن أن يكون هذا في جدول User أو جدول منفصل للنقاط
      
      // مؤقتاً نستخدم aggregation للحصول على النقاط الإجمالية
      const totalPoints = await this.prisma.userScore.aggregate({
        where: { userId },
        _sum: { calculatedScore: true }
      });

      // يمكن إضافة حقل totalPoints في جدول User لاحقاً للأداء الأفضل
      console.log(`نقاط المستخدم ${userId} الإجمالية: ${totalPoints._sum.calculatedScore || 0}`);
      
    } catch (error) {
      console.error('خطأ في تحديث النقاط الإجمالية:', error);
    }
  }

  /**
   * الحصول على إحصائيات سرعة التفاعل للمستخدم (عادي أو مؤثر)
   */
  async getUserSpeedStats(userId: string, timeframe?: { from: Date; to: Date }) {
    const whereCondition: any = { userId };
    
    if (timeframe) {
      whereCondition.createdAt = {
        gte: timeframe.from,
        lte: timeframe.to,
      };
    }

    const interactions = await this.prisma.interaction.findMany({
      where: whereCondition,
      select: {
        type: true,
        reactionSpeedMultiplier: true,
        adjustedPoints: true,
        createdAt: true,
      }
    });

    // الحصول على بيانات UserScore المرتبطة
    const userScores = await this.prisma.userScore.findMany({
      where: {
        userId,
        ...(timeframe && {
          createdAt: {
            gte: timeframe.from,
            lte: timeframe.to,
          }
        })
      },
      select: {
        speedCategory: true,
        calculatedScore: true,
        interactionType: true,
      }
    });

    // حساب الإحصائيات
    const stats = {
      totalInteractions: interactions.length,
      fastInteractions: 0,
      mediumInteractions: 0,
      slowInteractions: 0,
      totalPoints: 0,
      averageSpeedMultiplier: 0,
      interactionTypes: {} as Record<InteractionType, number>,
    };

    // دمج البيانات من الجدولين
    interactions.forEach((interaction, index) => {
      const correspondingScore = userScores[index];
      const points = interaction.adjustedPoints || 0;
      
      stats.totalPoints += points;
      stats.averageSpeedMultiplier += interaction.reactionSpeedMultiplier || 1;
      
      // عد الفئات من UserScore
      if (correspondingScore?.speedCategory === 'FAST') stats.fastInteractions++;
      else if (correspondingScore?.speedCategory === 'MEDIUM') stats.mediumInteractions++;
      else stats.slowInteractions++;
      
      // عد أنواع التفاعلات
      stats.interactionTypes[interaction.type] = (stats.interactionTypes[interaction.type] || 0) + 1;
    });

    if (stats.totalInteractions > 0) {
      stats.averageSpeedMultiplier /= stats.totalInteractions;
    }

    return {
      ...stats,
      fastPercentage: Math.round((stats.fastInteractions / stats.totalInteractions) * 100) || 0,
      mediumPercentage: Math.round((stats.mediumInteractions / stats.totalInteractions) * 100) || 0,
      slowPercentage: Math.round((stats.slowInteractions / stats.totalInteractions) * 100) || 0,
    };
  }

  /**
   * إعادة حساب النقاط للتفاعلات الموجودة (للترقية) - لجميع المستخدمين
   */
  async recalculateExistingInteractions(batchSize: number = 100) {
    let offset = 0;
    let processedCount = 0;

    while (true) {
      const interactions = await this.prisma.interaction.findMany({
        skip: offset,
        take: batchSize,
        include: {
          post: { select: { createdAt: true } },
        },
        orderBy: { createdAt: 'asc' }
      });

      if (interactions.length === 0) break;

      for (const interaction of interactions) {
        try {
          const scoreData = calculateInteractionScore(
            interaction.post.createdAt,
            interaction.createdAt,
            interaction.type,
            this.config
          );

          // تحديث التفاعل
          await this.prisma.interaction.update({
            where: { id: interaction.id },
            data: {
              reactionSpeedMultiplier: scoreData.speedMultiplier,
              adjustedPoints: scoreData.adjustedPoints,
            }
          });

          // تحديث UserScore إذا كان موجوداً
          await this.prisma.userScore.updateMany({
            where: { interactionId: interaction.id },
            data: {
              calculatedScore: scoreData.adjustedPoints,
              speedCategory: scoreData.speedCategory,
            }
          });

          processedCount++;
        } catch (error) {
          console.error(`خطأ في إعادة حساب التفاعل ${interaction.id}:`, error);
        }
      }

      offset += batchSize;
      console.log(`تم معالجة ${processedCount} تفاعل...`);
    }

    console.log(`تم الانتهاء من إعادة حساب ${processedCount} تفاعل لجميع المستخدمين (عاديين ومؤثرين)`);
    return processedCount;
  }
}

/**
 * مثال على الاستخدام لجميع المستخدمين (عاديين ومؤثرين)
 */
export async function exampleUsage() {
  const prisma = new PrismaClient();
  const interactionService = new InteractionService(prisma);

  try {
    // إنشاء إعجاب سريع من مستخدم (عادي أو مؤثر)
    const result = await interactionService.createInteraction({
      postId: 'post-id-example',
      userId: 'user-id-example', // يمكن أن يكون مستخدم عادي أو مؤثر
      type: 'LIKE'
    });

    console.log('تم إنشاء التفاعل للمستخدم:', result);
    
    // الحصول على إحصائيات المستخدم
    const stats = await interactionService.getUserSpeedStats('user-id-example');
    console.log('إحصائيات المستخدم:', stats);

  } catch (error) {
    console.error('خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}
