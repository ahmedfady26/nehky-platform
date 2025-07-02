/**
 * 🔔 مكون الإشعار الواحد للصديق الأفضل
 */

'use client'

import React from 'react'

// دالة بسيطة لحساب الوقت النسبي
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'الآن'
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
  if (diffInDays === 1) return 'أمس'
  if (diffInDays < 7) return `منذ ${diffInDays} أيام`
  return date.toLocaleDateString('ar-SA')
}

interface BestFriendNotificationProps {
  id: string
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  onMarkAsRead?: (id: string) => void
  onAction?: (id: string, action: string) => void
}

const priorityStyles = {
  LOW: 'border-l-gray-300 bg-gray-50',
  MEDIUM: 'border-l-blue-400 bg-blue-50',
  HIGH: 'border-l-orange-400 bg-orange-50',
  URGENT: 'border-l-red-500 bg-red-50'
}

const priorityIcons = {
  LOW: '📝',
  MEDIUM: '💬', 
  HIGH: '⚡',
  URGENT: '🚨'
}

export default function BestFriendNotification({
  id,
  type,
  title,
  message,
  data,
  read,
  createdAt,
  priority,
  onMarkAsRead,
  onAction
}: BestFriendNotificationProps) {

  const handleClick = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id)
    }
  }

  const getActionButtons = () => {
    if (type === 'PERMISSION_REQUEST' && data?.requestId) {
      return (
        <div className="flex space-x-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(data.requestId, 'approve')
            }}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
          >
            ✅ موافق
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(data.requestId, 'deny')
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            ❌ رفض
          </button>
        </div>
      )
    }
    
    if (type === 'BADGE_UPGRADED') {
      return (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(id, 'view_badge')
            }}
            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
          >
            🏅 عرض الشارة
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`
        border-l-4 p-4 mb-3 rounded-r-lg cursor-pointer transition-all duration-200
        ${priorityStyles[priority]}
        ${read ? 'opacity-70' : 'opacity-100 shadow-md hover:shadow-lg'}
        ${!read ? 'border-l-4' : 'border-l-2'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
            <span className="text-lg">{priorityIcons[priority]}</span>
            <h4 className={`font-semibold text-gray-800 ${!read ? 'font-bold' : ''}`}>
              {title}
            </h4>
            {!read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            {message}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {getRelativeTime(new Date(createdAt))}
            </span>
            {priority === 'URGENT' && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                عاجل
              </span>
            )}
          </div>

          {getActionButtons()}
        </div>
      </div>
    </div>
  )
}
