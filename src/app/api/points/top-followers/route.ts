import { NextRequest, NextResponse } from 'next/server'
import { getTopFollowersForInfluencer } from '@/lib/points-system'
import { prisma } from '@/lib/prisma'

// إجبار التشغيل الديناميكي لهذا الـ route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const influencerId = searchParams.get('influencerId')

    // التحقق من البيانات المطلوبة
    if (!influencerId) {
      return NextResponse.json({
        success: false,
        message: 'معرف المؤثر مطلوب'
      }, { status: 400 })
    }

    // التحقق من وجود المؤثر
    const influencer = await prisma.user.findUnique({
      where: { 
        id: influencerId,
        role: 'INFLUENCER'
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true
      }
    })

    if (!influencer) {
      return NextResponse.json({
        success: false,
        message: 'المؤثر غير موجود'
      }, { status: 404 })
    }

    // جلب أفضل 3 متابعين
    const topFollowers = await getTopFollowersForInfluencer(influencerId)

    return NextResponse.json({
      success: true,
      data: {
        influencer,
        topFollowers,
        count: topFollowers.length
      }
    })

  } catch (error) {
    console.error('خطأ في جلب أفضل المتابعين:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
