// 🎬 API لتتبع مشاهدة الفيديو
// منصة نحكي - Nehky.com

import { NextRequest, NextResponse } from 'next/server';
import { trackVideoWatching } from '@/lib/advanced-user-tracking';
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
      videoDuration,
      watchedDuration,
      watchedPercentage,
      playCount = 1,
      pauseCount = 0,
      seekCount = 0,
      qualityChanges = 0,
      volumeChanges = 0,
      isCompleted = false,
      exitPoint = 0,
      sessionId
    } = body;

    if (!postId || videoDuration === undefined || watchedDuration === undefined) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة' },
        { status: 400 }
      );
    }

    // تتبع مشاهدة الفيديو
    await trackVideoWatching({
      userId: session.user.email!, // استخدام email كمعرف مؤقت
      postId,
      videoDuration: Number(videoDuration),
      watchedDuration: Number(watchedDuration),
      watchedPercentage: Number(watchedPercentage),
      playCount: Number(playCount),
      pauseCount: Number(pauseCount),
      seekCount: Number(seekCount),
      qualityChanges: Number(qualityChanges),
      volumeChanges: Number(volumeChanges),
      isCompleted: Boolean(isCompleted),
      exitPoint: Number(exitPoint),
      sessionId: sessionId || `video_session_${Date.now()}`,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('خطأ في API تتبع الفيديو:', error);
    return NextResponse.json(
      { error: 'خطأ في تتبع الفيديو' },
      { status: 500 }
    );
  }
}
