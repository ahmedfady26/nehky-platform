import { NextRequest, NextResponse } from 'next/server'
import { getUserDailyNominations } from '@/lib/points-system'

// إجبار التشغيل الديناميكي لهذا الـ route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // التحقق من البيانات المطلوبة
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'معرف المستخدم مطلوب'
      }, { status: 400 })
    }

    // جلب ترشيحات المستخدم النشطة
    const nominations = await getUserDailyNominations(userId)

    return NextResponse.json({
      success: true,
      data: {
        nominations,
        count: nominations.length,
        hasNominations: nominations.length > 0
      }
    })

  } catch (error) {
    console.error('خطأ في جلب الترشيحات اليومية:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
