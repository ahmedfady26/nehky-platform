import { NextRequest, NextResponse } from 'next/server'
import { 
  getBestFriendPrivileges,
  upgradeBadgeIfEligible,
  getUserPrivilegeStats,
  getAllBestFriendsWithPrivileges
} from '../../../../lib/bestfriend/privileges'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

// جلب امتيازات الصديق الأفضل
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('user-id')
    const targetUserId = request.nextUrl.searchParams.get('targetUserId')
    const action = request.nextUrl.searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح للوصول' },
        { status: 401 }
      )
    }

    switch (action) {
      case 'privileges':
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: 'مطلوب معرف المستخدم الهدف' },
            { status: 400 }
          )
        }
        
        const privileges = await getBestFriendPrivileges(userId, targetUserId)
        return NextResponse.json({
          success: true,
          data: privileges
        })

      case 'stats':
        const stats = await getUserPrivilegeStats(userId)
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'all':
        const allPrivileges = await getAllBestFriendsWithPrivileges(userId)
        return NextResponse.json({
          success: true,
          data: allPrivileges
        })

      default:
        return NextResponse.json(
          { success: false, error: 'أكشن غير صالح' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ خطأ في API الامتيازات:', error)
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// ترقية شارة الصديق الأفضل
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح للوصول' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetUserId, currentBadge } = body

    if (!targetUserId || !currentBadge) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير مكتملة' },
        { status: 400 }
      )
    }

    const result = await upgradeBadgeIfEligible(userId, targetUserId)
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: 'تم ترقية الشارة بنجاح',
        data: result
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'فشل في ترقية الشارة' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ خطأ في ترقية الشارة:', error)
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// إعادة تعيين الامتيازات الشهرية (وظيفة إدارية)
export async function PUT(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح للوصول' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetUserId } = body

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'مطلوب معرف المستخدم الهدف' },
        { status: 400 }
      )
    }

    // يمكن استبدال هذا بنظام إعادة تعيين حقيقي لاحقاً
    const privileges = await getBestFriendPrivileges(userId, targetUserId)
    
    if (privileges) {
      return NextResponse.json({
        success: true,
        message: 'تم تحديث الامتيازات بنجاح',
        data: privileges
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'فشل في التحديث' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ خطأ في تحديث الامتيازات:', error)
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}
