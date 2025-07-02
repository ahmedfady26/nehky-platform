/**
 * API لمعالجة تفاعلات الصديق الأفضل
 * POST /api/bestfriend/interaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { handlePostInteraction } from '@/lib/bestfriend';
import { InteractionType } from '@prisma/client';

interface InteractionRequest {
  userId: string;
  postId: string;
  postAuthorId: string;
  interactionType: 'LIKE' | 'COMMENT' | 'SHARE' | 'VIEW' | 'SAVE';
  metadata?: {
    reactionSpeed?: number;
    isReciprocal?: boolean;
    topicSimilarity?: number;
    contentType?: 'text' | 'image' | 'video' | 'audio';
    timeOfDay?: 'peak' | 'normal' | 'off-peak';
    isFirstInteraction?: boolean;
  };
}

export const dynamic = 'force-dynamic';

/**
 * POST /api/bestfriend/interaction
 * تسجيل تفاعل جديد بين أصدقاء
 */
export async function POST(request: NextRequest) {
  try {
    const body: InteractionRequest = await request.json();
    
    const { 
      userId, 
      postId, 
      postAuthorId, 
      interactionType, 
      metadata = {} 
    } = body;

    // التحقق من صحة البيانات
    if (!userId || !postId || !postAuthorId || !interactionType) {
      return NextResponse.json(
        { error: 'بيانات مطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // عدم معالجة التفاعل مع نفس المستخدم
    if (userId === postAuthorId) {
      return NextResponse.json(
        { message: 'لا يمكن احتساب نقاط للتفاعل مع المنشورات الشخصية' },
        { status: 200 }
      );
    }

    // تحويل نوع التفاعل
    const interactionTypeEnum = InteractionType[interactionType];
    if (!interactionTypeEnum) {
      return NextResponse.json(
        { error: 'نوع تفاعل غير صحيح' },
        { status: 400 }
      );
    }

    // معالجة التفاعل
    const result = await handlePostInteraction(
      userId,
      postId,
      interactionTypeEnum,
      postAuthorId,
      metadata
    );

    return NextResponse.json({
      success: result.success,
      pointsAwarded: result.pointsAwarded,
      relationUpdated: result.relationUpdated,
      achievements: result.achievements,
      message: result.success 
        ? `تم منح ${result.pointsAwarded} نقطة للتفاعل`
        : result.errorMessage || 'فشل في معالجة التفاعل'
    });

  } catch (error) {
    console.error('خطأ في API تفاعل الصديق الأفضل:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
