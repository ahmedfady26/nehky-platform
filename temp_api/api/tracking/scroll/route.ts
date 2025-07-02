// 📊 API لتتبع سلوك التمرير
// منصة نحكي - Nehky.com

import { NextRequest, NextResponse } from 'next/server';
import { trackScrollBehavior } from '@/lib/advanced-user-tracking';
import { getServerSession } from 'next-auth';

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
      scrollDepth,
      timeOnPost,
      scrollSpeed,
      pauseTime,
      isVisible,
      viewportHeight,
      postHeight,
      sessionId
    } = body;

    if (!postId || scrollDepth === undefined || timeOnPost === undefined) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة' },
        { status: 400 }
      );
    }

    // تتبع سلوك التمرير
    await trackScrollBehavior({
      userId: session.user.email!, // استخدام email كمعرف مؤقت
      postId,
      scrollDepth: Number(scrollDepth),
      timeOnPost: Number(timeOnPost),
      scrollSpeed: Number(scrollSpeed) || 0,
      pauseTime: Number(pauseTime) || 0,
      isVisible: Boolean(isVisible),
      viewportHeight: Number(viewportHeight) || 0,
      postHeight: Number(postHeight) || 0,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('خطأ في API تتبع التمرير:', error);
    return NextResponse.json(
      { error: 'خطأ في تتبع التمرير' },
      { status: 500 }
    );
  }
}
