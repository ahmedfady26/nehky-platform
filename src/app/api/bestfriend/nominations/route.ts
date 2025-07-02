/**
 * 🎪 API لإدارة الترشيحات والموافقات
 * 
 * يوفر endpoints لإنشاء الترشيحات، معالجة الموافقات والرفض،
 * وإدارة الترشيحات النشطة للمستخدمين
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  createBestFriendNomination,
  processBestFriendResponse,
  getUserActiveNominations,
  getUserNominationStats,
  checkNominationLimits,
  handleExpiredNominations,
  DEFAULT_NOMINATION_LIMITS 
} from '@/lib/bestfriend/nominations'

export const dynamic = 'force-dynamic';

/**
 * GET /api/bestfriend/nominations
 * الحصول على ترشيحات المستخدم (مُرسلة ومُستلمة)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'stats':
        // إحصائيات الترشيحات للمستخدم
        const stats = await getUserNominationStats(userId)
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'check-limits':
        // فحص قيود الترشيح
        const targetUserId = searchParams.get('targetUserId')
        if (!targetUserId) {
          return NextResponse.json(
            { error: 'معرف المستخدم المستهدف مطلوب' },
            { status: 400 }
          )
        }

        const limitCheck = await checkNominationLimits(userId, targetUserId)
        return NextResponse.json({
          success: true,
          data: limitCheck
        })

      case 'expired':
        // معالجة الترشيحات المنتهية الصلاحية
        const expiredResult = await handleExpiredNominations()
        return NextResponse.json({
          success: true,
          message: `تم معالجة ${expiredResult.processedCount} ترشيح منتهي الصلاحية`,
          data: expiredResult
        })

      default:
        // الترشيحات النشطة للمستخدم
        const activeNominations = await getUserActiveNominations(userId)
        return NextResponse.json({
          success: true,
          data: {
            userId,
            sent: activeNominations.sent,
            received: activeNominations.received,
            totalSent: activeNominations.sent.length,
            totalReceived: activeNominations.received.length,
            fetchedAt: new Date().toISOString()
          }
        })
    }

  } catch (error) {
    console.error('❌ خطأ في GET API الترشيحات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في الخادم',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bestfriend/nominations
 * إنشاء ترشيح جديد لأفضل صديق
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      nominatorId, 
      nomineeId, 
      customLimits,
      bypassLimits = false // للاستخدام الإداري فقط
    } = body

    // التحقق من البيانات المطلوبة
    if (!nominatorId || !nomineeId) {
      return NextResponse.json(
        { error: 'معرف المرشح والمرشح له مطلوبان' },
        { status: 400 }
      )
    }

    // استخدام القيود المخصصة أو الافتراضية
    const limits = customLimits ? { ...DEFAULT_NOMINATION_LIMITS, ...customLimits } : DEFAULT_NOMINATION_LIMITS

    // تجاوز القيود في حالة الاستخدام الإداري
    if (bypassLimits) {
      limits.maxActiveNominations = 999
      limits.maxDailyNominations = 999
      limits.cooldownPeriodHours = 0
      limits.rejectionCooldownDays = 0
    }

    // إنشاء الترشيح
    const result = await createBestFriendNomination(nominatorId, nomineeId, limits)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          nominationId: result.nominationId,
          nominatorId,
          nomineeId,
          createdAt: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          details: result.errors
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ خطأ في POST API الترشيحات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء الترشيح',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/bestfriend/nominations
 * معالجة الموافقة أو الرفض على ترشيح
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      nominationId, 
      respondentId, 
      response, 
      responseMessage 
    } = body

    // التحقق من البيانات المطلوبة
    if (!nominationId || !respondentId || !response) {
      return NextResponse.json(
        { error: 'معرف الترشيح، المجيب، ونوع الاستجابة مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من صحة نوع الاستجابة
    if (!['ACCEPT', 'REJECT'].includes(response)) {
      return NextResponse.json(
        { error: 'نوع الاستجابة يجب أن يكون ACCEPT أو REJECT' },
        { status: 400 }
      )
    }

    // معالجة الاستجابة
    const result = await processBestFriendResponse(
      nominationId,
      respondentId,
      response,
      responseMessage
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          nominationId: result.nominationId,
          newRelationId: result.newRelationId,
          response,
          respondentId,
          processedAt: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          details: result.errors
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ خطأ في PUT API الترشيحات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في معالجة الاستجابة',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bestfriend/nominations
 * إلغاء ترشيح (للمرسل فقط)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const nominationId = searchParams.get('nominationId')
    const userId = searchParams.get('userId')

    if (!nominationId || !userId) {
      return NextResponse.json(
        { error: 'معرف الترشيح ومعرف المستخدم مطلوبان' },
        { status: 400 }
      )
    }

    // يمكن إضافة دالة إلغاء الترشيح هنا
    // const result = await cancelBestFriendNomination(nominationId, userId)

    return NextResponse.json({
      success: true,
      message: 'ميزة إلغاء الترشيح ستتم إضافتها قريباً',
      data: {
        nominationId,
        userId,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ خطأ في DELETE API الترشيحات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إلغاء الترشيح',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
