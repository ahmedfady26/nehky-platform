import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { checkAdminPermission } from '@/lib/admin-middleware'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // التحقق من التوكن
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح بالوصول'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    // التحقق من الصلاحيات
    const permissions = {
      keywordManagement: await checkAdminPermission(userId, 'KEYWORD_MANAGEMENT'),
      userManagement: await checkAdminPermission(userId, 'USER_MANAGEMENT'),
      contentModeration: await checkAdminPermission(userId, 'CONTENT_MODERATION'),
      systemAdmin: await checkAdminPermission(userId, 'SYSTEM_ADMIN')
    }

    return NextResponse.json({
      success: true,
      userId,
      permissions,
      hasAnyAdminAccess: Object.values(permissions).some(Boolean)
    })

  } catch (error) {
    console.error('خطأ في التحقق من صلاحيات الإدارة:', error)
    return NextResponse.json({
      success: false,
      message: 'خطأ في التحقق من الصلاحيات'
    }, { status: 500 })
  }
}
