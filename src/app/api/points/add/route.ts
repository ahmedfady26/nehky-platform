import { NextRequest, NextResponse } from 'next/server'
import { addPoints, InteractionType, INTERACTION_POINTS } from '@/lib/points-system'
import { prisma } from '@/lib/prisma'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { userId, influencerId, type, activityRef } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!userId || !influencerId || !type) {
      return NextResponse.json({
        success: false,
        message: 'البيانات المطلوبة ناقصة'
      }, { status: 400 })
    }

    // التحقق من صحة نوع التفاعل
    if (!Object.keys(INTERACTION_POINTS).includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'نوع التفاعل غير صحيح'
      }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // التحقق من وجود المؤثر
    const influencer = await prisma.user.findUnique({
      where: { 
        id: influencerId,
        role: 'INFLUENCER'
      }
    })

    if (!influencer) {
      return NextResponse.json({
        success: false,
        message: 'المؤثر غير موجود'
      }, { status: 404 })
    }

    // إضافة النقاط
    const pointRecord = await addPoints(
      userId,
      influencerId,
      type as InteractionType,
      activityRef
    )

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${pointRecord.points} نقطة بنجاح`,
      data: {
        pointId: pointRecord.id,
        points: pointRecord.points,
        type: pointRecord.type,
        expiresAt: pointRecord.expiresAt
      }
    })

  } catch (error) {
    console.error('خطأ في إضافة النقاط:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
