import { NextRequest, NextResponse } from 'next/server'
import { saveDailyTopFollowerNominations, cleanupExpiredPoints, cleanupExpiredNominations } from '@/lib/points-system'

export async function POST(request: NextRequest) {
  try {
    // تنظيف النقاط والترشيحات المنتهية الصلاحية أولاً
    const expiredPoints = await cleanupExpiredPoints()
    const expiredNominations = await cleanupExpiredNominations()

    // حفظ الترشيحات الجديدة
    const newNominations = await saveDailyTopFollowerNominations()

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الترشيحات اليومية بنجاح',
      data: {
        newNominations,
        expiredPoints,
        expiredNominations
      }
    })

  } catch (error) {
    console.error('خطأ في تحديث الترشيحات اليومية:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
