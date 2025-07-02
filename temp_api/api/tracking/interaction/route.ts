// 👍 API لتتبع التفاعل (إعجاب، تعليق، مشاركة)
// منصة نحكي - Nehky.com

import { NextRequest, NextResponse } from 'next/server';
import { trackAdvancedInteraction } from '@/lib/advanced-user-tracking';
import { getServerSession } from 'next-auth';
import { UserEngagementType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // التحقق من البيانات المطلوبة
    const {
      postId,
      interactionType, // 'LIKE', 'COMMENT', 'SHARE', 'PASSIVE_VIEW', 'ACTIVE_VIEW'
      timeToInteract = 0,
      scrollPosition = 0,
      clickPosition = { x: 0, y: 0 },
      deviceType = 'unknown',
      sessionId
    } = body;

    if (!postId || !interactionType) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة' },
        { status: 400 }
      );
    }

    // التحقق من صحة نوع التفاعل
    const validInteractionTypes = [
      'PASSIVE_VIEW', 'ACTIVE_VIEW', 'LIKE', 'COMMENT', 'SHARE', 
      'SAVE', 'CLICK_PROFILE', 'CLICK_HASHTAG', 'FULL_ENGAGEMENT'
    ];
    if (!validInteractionTypes.includes(interactionType)) {
      return NextResponse.json(
        { error: 'نوع تفاعل غير صحيح' },
        { status: 400 }
      );
    }

    // تتبع التفاعل المتقدم
    await trackAdvancedInteraction({
      userId: session.user.email!, // استخدام email كمعرف مؤقت
      postId,
      interactionType: interactionType as UserEngagementType,
      interactionTime: new Date(),
      timeToInteract: Number(timeToInteract),
      scrollPosition: Number(scrollPosition),
      clickPosition: clickPosition || { x: 0, y: 0 },
      deviceType: deviceType || 'unknown',
      sessionId: sessionId || `interaction_session_${Date.now()}`,
      timestamp: new Date()
    });

    return NextResponse.json({ 
      success: true,
      message: `تم تتبع التفاعل: ${interactionType}`
    });

  } catch (error) {
    console.error('خطأ في API تتبع التفاعل:', error);
    return NextResponse.json(
      { error: 'خطأ في تتبع التفاعل' },
      { status: 500 }
    );
  }
}
