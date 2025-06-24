import { NextRequest, NextResponse } from 'next/server'
import { getValidPoints, getUserPointsByInfluencer } from '@/lib/points-system'

// إجبار التشغيل الديناميكي لهذا الـ route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const influencerId = searchParams.get('influencerId')

    // التحقق من البيانات المطلوبة
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'معرف المستخدم مطلوب'
      }, { status: 400 })
    }

    // إذا تم تحديد المؤثر، جلب النقاط مع مؤثر معين
    if (influencerId) {
      const result = await getValidPoints(userId, influencerId)
      
      return NextResponse.json({
        success: true,
        data: {
          influencerId,
          totalPoints: result.totalPoints,
          pointsCount: result.count,
          points: result.points
        }
      })
    }

    // إذا لم يتم تحديد مؤثر، جلب النقاط مع جميع المؤثرين
    const pointsByInfluencer = await getUserPointsByInfluencer(userId)

    return NextResponse.json({
      success: true,
      data: {
        totalInfluencers: pointsByInfluencer.length,
        pointsByInfluencer
      }
    })

  } catch (error) {
    console.error('خطأ في جلب النقاط:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
