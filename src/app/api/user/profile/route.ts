import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-middleware'

// إجبار التشغيل الديناميكي لهذا الـ route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح'
      }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // حساب النقاط الإجمالية
    const totalPoints = await prisma.point.aggregate({
      where: { userId: userProfile.id },
      _sum: { points: true }
    })

    return NextResponse.json({
      success: true,
      user: {
        ...userProfile,        totalPoints: totalPoints._sum.points || 0,
        hobbies: userProfile.hobbies ? JSON.parse(userProfile.hobbies) : [],
        interests: userProfile.interests ? JSON.parse(userProfile.interests) : []
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// دالة تحديث الملف الشخصي
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح'
      }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      fullName,
      username,
      email,
      phone,
      recoveryEmail,
      nationality,
      birthCountry,
      currentCountry,
      graduationYear,
      degree,
      highSchool,
      hobbies,
      interests
    } = body

    // التحقق من البيانات المطلوبة
    if (!fullName?.trim() || !username?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'الاسم الكامل واسم المستخدم مطلوبان'
      }, { status: 400 })
    }

    // التحقق من تفرد اسم المستخدم
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        NOT: { id: user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'اسم المستخدم مستخدم بالفعل'
      }, { status: 400 })
    }

    // التحقق من تفرد البريد الإلكتروني إذا تم إدخاله
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: email.trim(),
          NOT: { id: user.id }
        }
      })

      if (existingEmail) {
        return NextResponse.json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل'
        }, { status: 400 })
      }
    }

    // التحقق من تفرد رقم الهاتف إذا تم إدخاله
    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone: phone.trim(),
          NOT: { id: user.id }
        }
      })

      if (existingPhone) {
        return NextResponse.json({
          success: false,
          message: 'رقم الهاتف مستخدم بالفعل'
        }, { status: 400 })
      }
    }

    // التحقق من إيميل الاسترداد إذا تم إدخاله
    if (recoveryEmail !== undefined) {
      // إذا كان فارغاً أو null، فهذا مقبول (يعني إزالة الإيميل)
      if (recoveryEmail && recoveryEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(recoveryEmail.trim())) {
          return NextResponse.json({
            success: false,
            message: 'إيميل الاسترداد غير صالح'
          }, { status: 400 })
        }

        // التحقق من أن إيميل الاسترداد مختلف عن الإيميل الرئيسي
        if (email && recoveryEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
          return NextResponse.json({
            success: false,
            message: 'إيميل الاسترداد يجب أن يكون مختلفاً عن البريد الإلكتروني الرئيسي'
          }, { status: 400 })
        }
      }
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        recoveryEmail: recoveryEmail !== undefined ? (recoveryEmail && recoveryEmail.trim() ? recoveryEmail.trim() : null) : undefined,
        nationality: nationality?.trim() || null,
        birthCountry: birthCountry?.trim() || null,
        currentCountry: currentCountry?.trim() || null,
        graduationYear: graduationYear || null,
        degree: degree?.trim() || null,
        highSchool: highSchool?.trim() || null,
        hobbies: hobbies && hobbies.length > 0 ? JSON.stringify(hobbies) : null,
        interests: interests && interests.length > 0 ? JSON.stringify(interests) : null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: {
        ...updatedUser,
        hobbies: updatedUser.hobbies ? JSON.parse(updatedUser.hobbies) : [],
        interests: updatedUser.interests ? JSON.parse(updatedUser.interests) : []
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
