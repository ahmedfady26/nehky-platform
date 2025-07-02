/**
 * 🛡️ API لإدارة صلاحيات الأصدقاء المؤكدين
 * 
 * يوفر endpoints لطلب الصلاحيات، الموافقة عليها، 
 * وإدارة الحدود والقيود
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  checkBestFriendPermissions,
  requestPermission,
  respondToPermissionRequest,
  getUserPermissionRequests,
  resetMonthlyUsage,
  cleanupExpiredRequests
} from '@/lib/bestfriend/permissions'
import { BestFriendPermissionType } from '@prisma/client'

export const dynamic = 'force-dynamic';

/**
 * GET /api/bestfriend/permissions
 * فحص الصلاحيات أو الحصول على الطلبات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const friendId = searchParams.get('friendId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'check':
        // فحص الصلاحيات مع صديق معين
        if (!friendId) {
          return NextResponse.json(
            { error: 'معرف الصديق مطلوب لفحص الصلاحيات' },
            { status: 400 }
          )
        }

        const permissions = await checkBestFriendPermissions(userId, friendId)
        if (!permissions) {
          return NextResponse.json(
            { error: 'لا توجد علاقة صديق أفضل نشطة' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            userId,
            friendId,
            permissions,
            checkedAt: new Date().toISOString()
          }
        })

      case 'requests':
        // الحصول على طلبات الإذن
        const requests = await getUserPermissionRequests(userId)
        return NextResponse.json({
          success: true,
          data: {
            sent: requests.sent,
            received: requests.received,
            totalSent: requests.sent.length,
            totalReceived: requests.received.length,
            fetchedAt: new Date().toISOString()
          }
        })

      case 'cleanup':
        // تنظيف الطلبات منتهية الصلاحية (للمشرفين فقط)
        const cleanupResult = await cleanupExpiredRequests()
        return NextResponse.json({
          success: true,
          message: `تم حذف ${cleanupResult.deletedRequests} طلب منتهي الصلاحية`,
          data: cleanupResult
        })

      case 'reset-monthly':
        // إعادة تعيين العدادات الشهرية (للمشرفين فقط)
        const resetResult = await resetMonthlyUsage()
        return NextResponse.json({
          success: true,
          message: `تم إعادة تعيين عدادات ${resetResult.updatedRelations} علاقة`,
          data: resetResult
        })

      default:
        return NextResponse.json(
          { error: 'نوع العملية غير مدعوم' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ خطأ في GET API الصلاحيات:', error)
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
 * POST /api/bestfriend/permissions
 * طلب إذن جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      requesterId,
      approverId,
      permissionType,
      requestDetails
    } = body

    // التحقق من البيانات المطلوبة
    if (!requesterId || !approverId || !permissionType) {
      return NextResponse.json(
        { error: 'معرف الطالب، المعتمد، ونوع الصلاحية مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من صحة نوع الصلاحية
    const validPermissionTypes = Object.values(BestFriendPermissionType)
    if (!validPermissionTypes.includes(permissionType)) {
      return NextResponse.json(
        { error: 'نوع الصلاحية غير صالح' },
        { status: 400 }
      )
    }

    // إنشاء طلب الإذن
    const result = await requestPermission(
      requesterId,
      approverId,
      permissionType,
      requestDetails
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          requestId: result.requestId,
          requesterId,
          approverId,
          permissionType,
          permissions: result.permissions,
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
    console.error('❌ خطأ في POST API الصلاحيات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء طلب الإذن',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/bestfriend/permissions
 * الرد على طلب إذن (موافقة أو رفض)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      requestId,
      approverId,
      decision,
      responseMessage
    } = body

    // التحقق من البيانات المطلوبة
    if (!requestId || !approverId || !decision) {
      return NextResponse.json(
        { error: 'معرف الطلب، المعتمد، ونوع القرار مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من صحة نوع القرار
    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return NextResponse.json(
        { error: 'نوع القرار يجب أن يكون APPROVE أو REJECT' },
        { status: 400 }
      )
    }

    // معالجة الرد
    const result = await respondToPermissionRequest(
      requestId,
      approverId,
      decision,
      responseMessage
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          requestId: result.requestId,
          decision,
          approverId,
          permissions: result.permissions,
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
    console.error('❌ خطأ في PUT API الصلاحيات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في معالجة الرد',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bestfriend/permissions
 * إلغاء طلب إذن (للطالب فقط)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('requestId')
    const requesterId = searchParams.get('requesterId')

    if (!requestId || !requesterId) {
      return NextResponse.json(
        { error: 'معرف الطلب ومعرف الطالب مطلوبان' },
        { status: 400 }
      )
    }

    // يمكن إضافة دالة إلغاء الطلب هنا
    // const result = await cancelPermissionRequest(requestId, requesterId)

    return NextResponse.json({
      success: true,
      message: 'ميزة إلغاء طلب الإذن ستتم إضافتها قريباً',
      data: {
        requestId,
        requesterId,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ خطأ في DELETE API الصلاحيات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إلغاء الطلب',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
