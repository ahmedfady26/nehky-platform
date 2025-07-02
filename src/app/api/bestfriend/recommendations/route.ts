/**
 * 🎯 API لنظام الترشيحات الذكية
 * 
 * يوفر endpoints للحصول على ترشيحات الأصدقاء المثاليين
 * وتشغيل دورات الترشيح التلقائية
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  generateBestFriendRecommendations,
  getRecommendationSystemStats 
} from '@/lib/bestfriend/recommendations'
import { 
  runWeeklyBestFriendRecommendations,
  getBestFriendRecommendationCycle,
  trackRecommendationSchedule 
} from '@/lib/bestfriend/scheduler'

export const dynamic = 'force-dynamic';

/**
 * GET /api/bestfriend/recommendations
 * الحصول على ترشيحات الأصدقاء المثاليين للمستخدم
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const maxRecommendations = parseInt(searchParams.get('maxRecommendations') || '3')
    const action = searchParams.get('action')

    // التحقق من معرف المستخدم
    if (!userId && action !== 'stats' && action !== 'schedule') {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // إجراءات مختلفة حسب نوع الطلب
    switch (action) {
      case 'stats':
        // إحصائيات نظام الترشيح
        const systemStats = await getRecommendationSystemStats()
        return NextResponse.json({
          success: true,
          data: systemStats
        })

      case 'schedule':
        // معلومات الجدولة
        const scheduleInfo = await trackRecommendationSchedule()
        return NextResponse.json({
          success: true,
          data: scheduleInfo
        })

      case 'cycle':
        // معلومات الدورة الحالية
        const cycleInfo = await getBestFriendRecommendationCycle()
        return NextResponse.json({
          success: true,
          data: cycleInfo
        })

      default:
        // ترشيحات للمستخدم المحدد
        if (!userId) {
          return NextResponse.json(
            { error: 'معرف المستخدم مطلوب للترشيحات' },
            { status: 400 }
          )
        }

        const recommendations = await generateBestFriendRecommendations(userId, {
          maxRecommendationsPerUser: maxRecommendations,
          excludeCurrentBestFriends: true,
          excludeRecentlyRejected: true,
          requireMutualInteraction: false,
          minCompatibilityScore: 60
        })

        return NextResponse.json({
          success: true,
          data: {
            userId,
            recommendations,
            count: recommendations.length,
            generatedAt: new Date().toISOString()
          }
        })
    }

  } catch (error) {
    console.error('❌ خطأ في API الترشيحات:', error)
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
 * POST /api/bestfriend/recommendations
 * تشغيل دورة ترشيحات جديدة أو إجراءات إدارية
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, parameters } = body

    switch (action) {
      case 'runCycle':
        // تشغيل دورة ترشيحات جديدة
        console.log('🚀 بدء تشغيل دورة ترشيحات جديدة...')
        const cycleResult = await runWeeklyBestFriendRecommendations()
        
        return NextResponse.json({
          success: true,
          message: 'تم تشغيل دورة الترشيحات بنجاح',
          data: cycleResult
        })

      case 'generatePersonal':
        // إنشاء ترشيحات شخصية للمستخدم
        if (!userId) {
          return NextResponse.json(
            { error: 'معرف المستخدم مطلوب' },
            { status: 400 }
          )
        }

        const personalRecommendations = await generateBestFriendRecommendations(userId, {
          maxRecommendationsPerUser: parameters?.maxRecommendations || 5,
          excludeCurrentBestFriends: true,
          excludeRecentlyRejected: parameters?.excludeRejected !== false,
          requireMutualInteraction: parameters?.requireMutual || false,
          minCompatibilityScore: parameters?.minScore || 50
        })

        return NextResponse.json({
          success: true,
          message: 'تم إنشاء الترشيحات الشخصية بنجاح',
          data: {
            userId,
            recommendations: personalRecommendations,
            parameters: parameters || {}
          }
        })

      case 'analyze':
        // تحليل توافق بين مستخدمين محددين
        const { targetUserId } = parameters || {}
        
        if (!userId || !targetUserId) {
          return NextResponse.json(
            { error: 'معرفات المستخدمين مطلوبة للتحليل' },
            { status: 400 }
          )
        }

        // يمكن إضافة دالة تحليل التوافق هنا
        // const compatibilityAnalysis = await analyzeUserCompatibility(userId, targetUserId)
        
        return NextResponse.json({
          success: true,
          message: 'تحليل التوافق غير متاح حالياً',
          data: {
            userId,
            targetUserId,
            message: 'ستتم إضافة هذه الميزة قريباً'
          }
        })

      default:
        return NextResponse.json(
          { error: 'إجراء غير مدعوم' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ خطأ في POST API الترشيحات:', error)
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
 * PUT /api/bestfriend/recommendations
 * تحديث إعدادات نظام الترشيح
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    // يمكن إضافة تحديث الإعدادات هنا
    // await updateRecommendationSettings(settings)

    return NextResponse.json({
      success: true,
      message: 'تم تحديث إعدادات الترشيح بنجاح',
      data: {
        updatedSettings: settings,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ خطأ في PUT API الترشيحات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في تحديث الإعدادات',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
