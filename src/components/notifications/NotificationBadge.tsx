/**
 * 🔔 شارة الإشعارات للصديق الأفضل
 */

'use client'

import React, { useState, useEffect } from 'react'
import { getUnreadNotificationsCount } from '../../lib/notifications/bestfriend-notifications'

interface NotificationBadgeProps {
  userId: string
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

export default function NotificationBadge({ 
  userId, 
  onClick, 
  size = 'md',
  showCount = true,
  className = ''
}: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base', 
    lg: 'p-4 text-lg'
  }

  const badgeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  }

  // تحميل عدد الإشعارات غير المقروءة
  const loadUnreadCount = async () => {
    setIsLoading(true)
    try {
      const count = await getUnreadNotificationsCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // تحديث العدد كل 30 ثانية
  useEffect(() => {
    loadUnreadCount()
    
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [userId])

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`
          relative inline-flex items-center justify-center rounded-full 
          transition-all duration-200 hover:scale-110 focus:outline-none
          ${sizeClasses[size]}
          ${unreadCount > 0 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
          ${className}
        `}
        title={`${unreadCount} إشعار غير مقروء`}
      >
        {/* أيقونة الجرس */}
        <span className={`${unreadCount > 0 ? 'animate-pulse' : ''}`}>
          {unreadCount > 0 ? '🔔' : '🔕'}
        </span>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
          </div>
        )}
      </button>

      {/* شارة العدد */}
      {showCount && unreadCount > 0 && !isLoading && (
        <div 
          className={`
            absolute -top-1 -right-1 bg-red-500 text-white rounded-full 
            flex items-center justify-center font-bold animate-bounce
            ${badgeClasses[size]}
          `}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}

      {/* نبضة للإشعارات الجديدة */}
      {unreadCount > 0 && (
        <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
      )}
    </div>
  )
}
