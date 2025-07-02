/**
 * 🔔 API للإشعارات المتقدمة للصديق الأفضل
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getBestFriendNotifications,
  markNotificationsAsRead,
  getUnreadNotificationsCount,
  createBestFriendNotification,
  BestFriendNotificationType 
} from '../../../../lib/notifications/bestfriend-notifications'

export const dynamic = 'force-dynamic'

// GET - جلب الإشعارات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // جلب عدد الإشعارات غير المقروءة
    if (action === 'unread-count') {
      const count = await getUnreadNotificationsCount(userId)
      return NextResponse.json({ count })
    }

    // جلب الإشعارات
    const notifications = await getBestFriendNotifications(userId, limit, offset)
    
    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length
    })

  } catch (error) {
    console.error('Error in notifications GET:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإشعارات' },
      { status: 500 }
    )
  }
}

// POST - إنشاء إشعار جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, data } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'معرف المستخدم ونوع الإشعار مطلوبان' },
        { status: 400 }
      )
    }

    await createBestFriendNotification(
      userId,
      type as BestFriendNotificationType,
      data
    )

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الإشعار بنجاح'
    })

  } catch (error) {
    console.error('Error in notifications POST:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الإشعار' },
      { status: 500 }
    )
  }
}

// PUT - تحديث حالة الإشعارات (تمييز كمقروءة)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds, action } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    if (action === 'mark-read') {
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return NextResponse.json(
          { error: 'معرفات الإشعارات مطلوبة' },
          { status: 400 }
        )
      }

      await markNotificationsAsRead(userId, notificationIds)

      return NextResponse.json({
        success: true,
        message: 'تم تحديث حالة الإشعارات بنجاح'
      })
    }

    return NextResponse.json(
      { error: 'إجراء غير صحيح' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in notifications PUT:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإشعارات' },
      { status: 500 }
    )
  }
}
