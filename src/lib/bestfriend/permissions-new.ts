/**
 * 🛡️ نظام الصلاحيات والامتيازات للأصدقاء المؤكدين
 * 
 * يدير الصلاحيات المحدودة للأصدقاء المثاليين مثل:
 * - النشر المحدود (منشور واحد فقط)
 * - التعليقات المحدودة (10 تعليقات)
 * - طلبات الموافقة على الأنشطة
 */

import { prisma } from '../prisma'
import { BestFriendStatus, BestFriendPermissionType } from '@prisma/client'

// ================== أنواع البيانات ==================

export interface BestFriendPermissions {
  canPost: boolean
  postsRemaining: number
  canComment: boolean  
  commentsRemaining: number
  requiresApproval: boolean
  relationshipStrength: string
}

export interface PermissionRequest {
  id: string
  requesterId: string
  approverId: string
  relationId: string
  permissionType: BestFriendPermissionType
  requestDetails?: string
  status: string
  requestedAt: Date
  respondedAt?: Date | null
  expiresAt: Date
}

export interface PermissionResponse {
  success: boolean
  message: string
  permissions?: BestFriendPermissions
  requestId?: string
  errors?: string[]
}

// ================== الحدود الافتراضية ==================

export const PERMISSION_LIMITS = {
  maxPostsPerRelation: 1,        // منشور واحد فقط لكل علاقة
  maxCommentsPerMonth: 10,       // 10 تعليقات شهرياً
  approvalTimeoutHours: 24,      // مهلة 24 ساعة للموافقة
  cooldownHours: 6              // فترة انتظار 6 ساعات بين الطلبات
} as const

// ================== دوال الصلاحيات ==================

/**
 * 🔍 فحص صلاحيات المستخدم مع صديقه الأفضل
 */
export async function checkBestFriendPermissions(
  userId: string,
  friendId: string
): Promise<BestFriendPermissions | null> {
  try {
    // البحث عن العلاقة النشطة
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId, status: BestFriendStatus.ACTIVE },
          { user1Id: friendId, user2Id: userId, status: BestFriendStatus.ACTIVE }
        ]
      }
    })

    if (!relation) {
      return null // لا توجد علاقة صديق أفضل نشطة
    }

    // حساب المنشورات المستخدمة
    const postsUsed = relation.postsUsed || 0
    const postsRemaining = Math.max(0, PERMISSION_LIMITS.maxPostsPerRelation - postsUsed)

    // حساب التعليقات المستخدمة هذا الشهر
    const commentsUsed = relation.commentsUsed || 0
    const commentsRemaining = Math.max(0, PERMISSION_LIMITS.maxCommentsPerMonth - commentsUsed)

    return {
      canPost: postsRemaining > 0,
      postsRemaining,
      canComment: commentsRemaining > 0,
      commentsRemaining,
      requiresApproval: relation.approvalsRequired,
      relationshipStrength: relation.relationshipStrength
    }

  } catch (error) {
    console.error('❌ خطأ في فحص الصلاحيات:', error)
    return null
  }
}

/**
 * 📝 طلب إذن للنشر أو التعليق
 */
export async function requestPermission(
  requesterId: string,
  approverId: string,
  permissionType: BestFriendPermissionType,
  requestDetails?: string
): Promise<PermissionResponse> {
  try {
    // التحقق من وجود علاقة صديق أفضل
    const relation = await prisma.bestFriendRelation.findFirst({
      where: {
        OR: [
          { user1Id: requesterId, user2Id: approverId, status: BestFriendStatus.ACTIVE },
          { user1Id: approverId, user2Id: requesterId, status: BestFriendStatus.ACTIVE }
        ]
      }
    })

    if (!relation) {
      return {
        success: false,
        message: 'لا توجد علاقة صديق أفضل نشطة'
      }
    }

    // فحص الصلاحيات الحالية
    const permissions = await checkBestFriendPermissions(requesterId, approverId)
    if (!permissions) {
      return {
        success: false,
        message: 'تعذر التحقق من الصلاحيات'
      }
    }

    // فحص الحدود حسب نوع النشاط
    if (permissionType === BestFriendPermissionType.POST_ON_PROFILE && !permissions.canPost) {
      return {
        success: false,
        message: `لا يمكن النشر. المنشورات المتبقية: ${permissions.postsRemaining}`,
        permissions
      }
    }

    if (permissionType === BestFriendPermissionType.COMMENT_SPECIAL && !permissions.canComment) {
      return {
        success: false,
        message: `لا يمكن التعليق. التعليقات المتبقية: ${permissions.commentsRemaining}`,
        permissions
      }
    }

    // إذا لم تكن الموافقة مطلوبة، اسمح مباشرة
    if (!permissions.requiresApproval) {
      await updateUsageCount(relation.id, permissionType)
      return {
        success: true,
        message: 'تم منح الإذن مباشرة',
        permissions: await checkBestFriendPermissions(requesterId, approverId) || undefined
      }
    }

    // فحص وجود طلبات معلقة
    const existingRequest = await prisma.bestFriendPermissionRequest.findFirst({
      where: {
        requesterId,
        approverId,
        relationId: relation.id,
        permissionType,
        status: 'pending',
        expiresAt: { gt: new Date() }
      }
    })

    if (existingRequest) {
      return {
        success: false,
        message: 'يوجد طلب معلق بالفعل لنفس النشاط',
        requestId: existingRequest.id
      }
    }

    // إنشاء طلب إذن جديد
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + PERMISSION_LIMITS.approvalTimeoutHours)

    const permissionRequest = await prisma.bestFriendPermissionRequest.create({
      data: {
        requesterId,
        approverId,
        relationId: relation.id,
        permissionType,
        requestDetails: requestDetails?.substring(0, 500),
        status: 'pending',
        expiresAt
      }
    })

    return {
      success: true,
      message: 'تم إرسال طلب الإذن بنجاح. في انتظار الموافقة.',
      requestId: permissionRequest.id,
      permissions
    }

  } catch (error) {
    console.error('❌ خطأ في طلب الإذن:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال طلب الإذن',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * ✅❌ الرد على طلب إذن
 */
export async function respondToPermissionRequest(
  requestId: string,
  approverId: string,
  decision: 'APPROVE' | 'REJECT',
  responseMessage?: string
): Promise<PermissionResponse> {
  try {
    // البحث عن الطلب
    const request = await prisma.bestFriendPermissionRequest.findFirst({
      where: {
        id: requestId,
        approverId,
        status: 'pending',
        expiresAt: { gt: new Date() }
      }
    })

    if (!request) {
      return {
        success: false,
        message: 'لم يتم العثور على الطلب أو انتهت صلاحيته'
      }
    }

    // تحديث حالة الطلب
    await prisma.bestFriendPermissionRequest.update({
      where: { id: requestId },
      data: {
        status: decision === 'APPROVE' ? 'approved' : 'rejected',
        respondedAt: new Date(),
        approvalReason: responseMessage?.substring(0, 200)
      }
    })

    if (decision === 'APPROVE') {
      // تحديث عداد الاستخدام
      await updateUsageCount(request.relationId, request.permissionType)
      
      const updatedPermissions = await checkBestFriendPermissions(
        request.requesterId, 
        approverId
      )

      return {
        success: true,
        message: 'تم قبول الطلب بنجاح',
        permissions: updatedPermissions || undefined,
        requestId
      }
    } else {
      return {
        success: true,
        message: 'تم رفض الطلب',
        requestId
      }
    }

  } catch (error) {
    console.error('❌ خطأ في الرد على الطلب:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء معالجة الرد',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * 📊 الحصول على طلبات الإذن للمستخدم
 */
export async function getUserPermissionRequests(userId: string): Promise<{
  sent: PermissionRequest[]
  received: PermissionRequest[]
}> {
  try {
    const [sentRequests, receivedRequests] = await Promise.all([
      // الطلبات المُرسلة
      prisma.bestFriendPermissionRequest.findMany({
        where: { requesterId: userId },
        orderBy: { requestedAt: 'desc' },
        take: 20
      }),

      // الطلبات المُستلمة  
      prisma.bestFriendPermissionRequest.findMany({
        where: { 
          approverId: userId,
          status: 'pending',
          expiresAt: { gt: new Date() }
        },
        orderBy: { requestedAt: 'desc' }
      })
    ])

    const mapRequest = (req: any): PermissionRequest => ({
      id: req.id,
      requesterId: req.requesterId,
      approverId: req.approverId,
      relationId: req.relationId,
      permissionType: req.permissionType,
      requestDetails: req.requestDetails,
      status: req.status,
      requestedAt: req.requestedAt,
      respondedAt: req.respondedAt,
      expiresAt: req.expiresAt
    })

    return {
      sent: sentRequests.map(mapRequest),
      received: receivedRequests.map(mapRequest)
    }

  } catch (error) {
    console.error('❌ خطأ في جلب طلبات الإذن:', error)
    return { sent: [], received: [] }
  }
}

// ================== دوال مساعدة ==================

/**
 * تحديث عداد الاستخدام للمنشورات أو التعليقات
 */
async function updateUsageCount(
  relationId: string, 
  permissionType: BestFriendPermissionType
): Promise<void> {
  if (permissionType === BestFriendPermissionType.POST_ON_PROFILE) {
    await prisma.bestFriendRelation.update({
      where: { id: relationId },
      data: { postsUsed: { increment: 1 } }
    })
  } else if (permissionType === BestFriendPermissionType.COMMENT_SPECIAL) {
    await prisma.bestFriendRelation.update({
      where: { id: relationId },
      data: { commentsUsed: { increment: 1 } }
    })
  }
}

/**
 * 🔄 إعادة تعيين عدادات الاستخدام الشهرية
 */
export async function resetMonthlyUsage(): Promise<{
  updatedRelations: number
  errors: string[]
}> {
  try {
    const result = await prisma.bestFriendRelation.updateMany({
      where: { status: BestFriendStatus.ACTIVE },
      data: { commentsUsed: 0 }
    })

    return {
      updatedRelations: result.count,
      errors: []
    }

  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين العدادات:', error)
    return {
      updatedRelations: 0,
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}

/**
 * 🧹 تنظيف الطلبات منتهية الصلاحية
 */
export async function cleanupExpiredRequests(): Promise<{
  deletedRequests: number
  errors: string[]
}> {
  try {
    const result = await prisma.bestFriendPermissionRequest.deleteMany({
      where: {
        status: 'pending',
        expiresAt: { lt: new Date() }
      }
    })

    return {
      deletedRequests: result.count,
      errors: []
    }

  } catch (error) {
    console.error('❌ خطأ في تنظيف الطلبات:', error)
    return {
      deletedRequests: 0,
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
    }
  }
}
