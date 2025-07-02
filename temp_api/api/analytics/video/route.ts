// API للتحليلات والاقتراحات
// src/app/api/analytics/video/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { calculateVideoMetrics, getUserVideoWatchingPatterns } from '@/lib/video-analytics';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const userId = session.user.email; // استخدام email كمعرف مؤقت

    if (postId) {
      // تحليلات فيديو محدد
      const metrics = await calculateVideoMetrics(postId);
      return NextResponse.json(metrics);
    } else {
      // أنماط مشاهدة المستخدم
      const patterns = await getUserVideoWatchingPatterns(userId);
      return NextResponse.json(patterns);
    }
    
  } catch (error) {
    console.error('خطأ في API التحليلات:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' }, 
      { status: 500 }
    );
  }
}
