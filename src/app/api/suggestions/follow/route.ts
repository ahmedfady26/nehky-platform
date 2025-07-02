// API لاقتراحات المتابعة
// src/app/api/suggestions/follow/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateSmartFollowSuggestions } from '@/lib/smart-follow-suggestions';

export async function GET(request: NextRequest) {
  try {
    // استخراج معرف المستخدم من الجلسة أو التوكن
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
    }

    const suggestions = await generateSmartFollowSuggestions(userId);
    
    return NextResponse.json({
      success: true,
      data: suggestions,
      count: suggestions.length
    });
    
  } catch (error) {
    console.error('خطأ في API الاقتراحات:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, targetUserId } = await request.json();
    
    if (!userId || !targetUserId) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 });
    }

    // تنفيذ عملية المتابعة
    // await followUser(userId, targetUserId);
    
    return NextResponse.json({
      success: true,
      message: 'تمت المتابعة بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في المتابعة:', error);
    return NextResponse.json(
      { error: 'خطأ في عملية المتابعة' }, 
      { status: 500 }
    );
  }
}
