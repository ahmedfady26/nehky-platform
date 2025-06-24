import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

/**
 * Middleware للتحقق من صلاحيات الإدارة
 */
export async function adminAuthMiddleware(request: NextRequest) {
  try {
    // التحقق من وجود token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
    
    // التحقق من وجود cookie session إذا لم يكن هناك token
    const sessionToken = token || request.cookies.get('admin_session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح بالوصول - يرجى تسجيل الدخول',
        redirect: '/admin/login'
      }, { status: 401 })
    }

    // فك تشفير التوكن
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    // التحقق من وجود المستخدم والتأكد من صلاحياته الإدارية
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        verified: true,
        followersCount: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود',
        redirect: '/admin/login'
      }, { status: 401 })
    }

    // التحقق من الصلاحيات الإدارية
    // يمكن للمؤثرين الكبار (أكثر من 1000 متابع) أو الحسابات المتحققة الوصول للوحة الإدارة
    const isInfluencer = user.role === 'INFLUENCER'
    const isVerified = user.verified === true
    const hasEnoughFollowers = user.followersCount >= 1000
    
    if (!isInfluencer && !isVerified && !hasEnoughFollowers) {
      return NextResponse.json({
        success: false,
        message: 'ليس لديك صلاحيات إدارية كافية',
        redirect: '/dashboard'
      }, { status: 403 })
    }

    // إضافة معلومات المستخدم للطلب
    const response = NextResponse.next()
    response.headers.set('X-Admin-User-Id', user.id)
    response.headers.set('X-Admin-User-Role', user.role)
    response.headers.set('X-Admin-User-Name', user.fullName)
    
    return response

  } catch (error) {
    console.error('خطأ في التحقق من صلاحيات الإدارة:', error)
    
    return NextResponse.json({
      success: false,
      message: 'خطأ في التحقق من الصلاحيات',
      redirect: '/admin/login'
    }, { status: 401 })
  }
}

/**
 * التحقق من صلاحية إدارية محددة
 */
export async function checkAdminPermission(
  userId: string, 
  permission: 'KEYWORD_MANAGEMENT' | 'USER_MANAGEMENT' | 'CONTENT_MODERATION' | 'SYSTEM_ADMIN'
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        verified: true,
        followersCount: true
      }
    })

    if (!user) return false

    // صلاحيات حسب نوع الإذن
    switch (permission) {
      case 'KEYWORD_MANAGEMENT':
        // يمكن للمؤثرين والحسابات المتحققة إدارة الكلمات
        return user.role === 'INFLUENCER' || user.verified
        
      case 'USER_MANAGEMENT':
        // إدارة المستخدمين محصورة للمؤثرين الكبار فقط
        return user.role === 'INFLUENCER' && user.followersCount >= 50000
        
      case 'CONTENT_MODERATION':
        // الإشراف على المحتوى للمؤثرين والحسابات المتحققة
        return user.role === 'INFLUENCER' || user.verified
        
      case 'SYSTEM_ADMIN':
        // إدارة النظام للمؤثرين الكبار جداً فقط
        return user.role === 'INFLUENCER' && user.followersCount >= 100000
        
      default:
        return false
    }
  } catch (error) {
    console.error('خطأ في التحقق من الصلاحية:', error)
    return false
  }
}
