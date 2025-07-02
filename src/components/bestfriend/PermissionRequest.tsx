'use client'

import React, { useState } from 'react'
import { Check, X, Clock, MessageSquare, User, Calendar } from 'lucide-react'

interface PermissionRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  type: 'POST_ON_PROFILE' | 'SEND_MESSAGE' | 'TAG_IN_POST' | 'SHARE_CONTENT'
  message?: string
  content?: string
  createdAt: Date
  expiresAt: Date
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
}

interface PermissionRequestProps {
  request: PermissionRequest
  onApprove: (requestId: string, message?: string) => Promise<void>
  onReject: (requestId: string, reason?: string) => Promise<void>
  isProcessing?: boolean
}

const REQUEST_TYPES = {
  POST_ON_PROFILE: {
    icon: MessageSquare,
    title: 'النشر في الملف الشخصي',
    description: 'يريد نشر منشور في ملفك الشخصي',
    color: 'text-blue-500 bg-blue-50'
  },
  SEND_MESSAGE: {
    icon: User,
    title: 'إرسال رسالة خاصة',
    description: 'يريد إرسال رسالة خاصة متقدمة',
    color: 'text-green-500 bg-green-50'
  },
  TAG_IN_POST: {
    icon: User,
    title: 'الإشارة في المنشور',
    description: 'يريد الإشارة إليك في منشور',
    color: 'text-purple-500 bg-purple-50'
  },
  SHARE_CONTENT: {
    icon: MessageSquare,
    title: 'مشاركة المحتوى',
    description: 'يريد مشاركة محتوى معك',
    color: 'text-orange-500 bg-orange-50'
  }
}

export default function PermissionRequestCard({
  request,
  onApprove,
  onReject,
  isProcessing = false
}: PermissionRequestProps) {
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState<'approve' | 'reject' | null>(null)

  const requestConfig = REQUEST_TYPES[request.type]
  const IconComponent = requestConfig.icon

  const timeLeft = Math.max(0, Math.floor((request.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)))
  const isExpired = timeLeft === 0

  const handleResponse = async (type: 'approve' | 'reject') => {
    setResponseType(type)
    setShowResponseDialog(true)
  }

  const confirmResponse = async () => {
    if (!responseType) return

    try {
      if (responseType === 'approve') {
        await onApprove(request.id, responseMessage)
      } else {
        await onReject(request.id, responseMessage)
      }
      setShowResponseDialog(false)
      setResponseMessage('')
      setResponseType(null)
    } catch (error) {
      console.error('خطأ في معالجة الطلب:', error)
    }
  }

  if (request.status !== 'PENDING') {
    return null
  }

  return (
    <>
      <div className={`
        bg-white rounded-lg shadow-md border-r-4 
        ${isExpired ? 'border-red-400 opacity-60' : 'border-blue-400'}
        p-4 space-y-4
      `}>
        {/* رأس الطلب */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* صورة المستخدم */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {request.requesterAvatar ? (
                <img 
                  src={request.requesterAvatar} 
                  alt={request.requesterName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </div>
            
            {/* معلومات الطلب */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {request.requesterName}
              </h3>
              <div className={`
                inline-flex items-center space-x-2 space-x-reverse px-2 py-1 rounded-full text-xs
                ${requestConfig.color}
              `}>
                <IconComponent className="w-3 h-3" />
                <span>{requestConfig.title}</span>
              </div>
            </div>
          </div>

          {/* الوقت المتبقي */}
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {isExpired ? 'منتهي الصلاحية' : `${timeLeft} ساعة متبقية`}
            </span>
          </div>
        </div>

        {/* وصف الطلب */}
        <p className="text-sm text-gray-600">
          {requestConfig.description}
        </p>

        {/* رسالة الطلب */}
        {request.message && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        )}

        {/* محتوى المعاينة */}
        {request.content && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium mb-1">معاينة المحتوى:</p>
            <p className="text-sm text-gray-700">{request.content}</p>
          </div>
        )}

        {/* أزرار الاستجابة */}
        {!isExpired && (
          <div className="flex space-x-3 space-x-reverse pt-2">
            <button
              onClick={() => handleResponse('approve')}
              disabled={isProcessing}
              className="
                flex-1 flex items-center justify-center space-x-2 space-x-reverse
                bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              <Check className="w-4 h-4" />
              <span>موافقة</span>
            </button>
            
            <button
              onClick={() => handleResponse('reject')}
              disabled={isProcessing}
              className="
                flex-1 flex items-center justify-center space-x-2 space-x-reverse
                bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              <X className="w-4 h-4" />
              <span>رفض</span>
            </button>
          </div>
        )}

        {/* تاريخ الطلب */}
        <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-400 pt-2 border-t">
          <Calendar className="w-3 h-3" />
          <span>تم الطلب في {request.createdAt.toLocaleDateString('ar-SA')}</span>
        </div>
      </div>

      {/* مربع حوار الاستجابة */}
      {showResponseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {responseType === 'approve' ? 'موافقة على الطلب' : 'رفض الطلب'}
            </h3>
            
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={
                responseType === 'approve' 
                  ? 'رسالة اختيارية مع الموافقة...' 
                  : 'سبب الرفض (اختياري)...'
              }
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex space-x-3 space-x-reverse mt-4">
              <button
                onClick={confirmResponse}
                disabled={isProcessing}
                className={`
                  flex-1 py-2 px-4 rounded-lg text-white font-medium
                  ${responseType === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `}
              >
                {responseType === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
              </button>
              
              <button
                onClick={() => setShowResponseDialog(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// مكون قائمة طلبات الصلاحيات
interface PermissionRequestsListProps {
  requests: PermissionRequest[]
  onApprove: (requestId: string, message?: string) => Promise<void>
  onReject: (requestId: string, reason?: string) => Promise<void>
  isLoading?: boolean
}

export function PermissionRequestsList({
  requests,
  onApprove,
  onReject,
  isLoading = false
}: PermissionRequestsListProps) {
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set())

  const handleApprove = async (requestId: string, message?: string) => {
    setProcessingRequests(prev => new Set(prev).add(requestId))
    try {
      await onApprove(requestId, message)
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleReject = async (requestId: string, reason?: string) => {
    setProcessingRequests(prev => new Set(prev).add(requestId))
    try {
      await onReject(requestId, reason)
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">لا توجد طلبات صلاحيات</h3>
        <p>لم يطلب أحد من أصدقائك المؤكدين أي صلاحيات بعد</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <PermissionRequestCard
          key={request.id}
          request={request}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={processingRequests.has(request.id)}
        />
      ))}
    </div>
  )
}
