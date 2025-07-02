/**
 * 🔔 مركز الإشعارات الشامل للصديق الأفضل
 */

'use client'

import React, { useState, useEffect } from 'react'
import BestFriendNotification from './BestFriendNotification'
import { 
  getBestFriendNotifications, 
  markNotificationsAsRead,
  getUnreadNotificationsCount 
} from '../../lib/notifications/bestfriend-notifications'

interface NotificationCenterProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export default function NotificationCenter({ userId, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'permissions' | 'badges'>('all')

  // تحميل الإشعارات
  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await getBestFriendNotifications(userId, 50, 0)
      setNotifications(data)
      
      const count = await getUnreadNotificationsCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // تحميل الإشعارات عند فتح المركز
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, userId])

  // تمييز الإشعار كمقروء
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead(userId, [notificationId])
      
      // تحديث الحالة المحلية
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      )
      
      // تحديث العداد
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // تمييز جميع الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter(notif => !notif.read)
      .map(notif => notif.id)
    
    if (unreadIds.length === 0) return

    try {
      await markNotificationsAsRead(userId, unreadIds)
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // معالجة أزرار الإجراءات
  const handleAction = async (targetId: string, action: string) => {
    console.log(`Action ${action} for ${targetId}`)
    // هنا يمكن إضافة منطق معالجة الإجراءات
    // مثل الموافقة على طلب صلاحية أو عرض الشارة
  }

  // فلترة الإشعارات
  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.read)
      case 'permissions':
        return notifications.filter(notif => 
          notif.type.includes('PERMISSION') || notif.type.includes('REQUEST')
        )
      case 'badges':
        return notifications.filter(notif => 
          notif.type.includes('BADGE') || notif.type.includes('PRIVILEGE')
        )
      default:
        return notifications
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                🔔
              </div>
              <div>
                <h2 className="text-xl font-bold">مركز الإشعارات</h2>
                <p className="text-sm opacity-90">
                  {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'لا توجد إشعارات جديدة'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded hover:bg-opacity-30 transition-colors"
                >
                  تمييز الكل كمقروء
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2 rtl:space-x-reverse mt-3">
            {[
              { key: 'all', label: 'الكل', icon: '📋' },
              { key: 'unread', label: 'غير مقروء', icon: '🔔' },
              { key: 'permissions', label: 'الصلاحيات', icon: '🔐' },
              { key: 'badges', label: 'الشارات', icon: '🏅' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`
                  px-3 py-1 text-xs rounded-full transition-colors
                  ${filter === key 
                    ? 'bg-white text-purple-600 font-semibold' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }
                `}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="mr-2 text-gray-600">جاري التحميل...</span>
            </div>
          ) : getFilteredNotifications().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📪</div>
              <p>لا توجد إشعارات لعرضها</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-purple-600 hover:underline"
                >
                  عرض جميع الإشعارات
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {getFilteredNotifications().map(notification => (
                <BestFriendNotification
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={handleMarkAsRead}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              إجمالي الإشعارات: {notifications.length}
            </span>
            <button
              onClick={loadNotifications}
              className="text-purple-600 hover:underline"
            >
              🔄 إعادة تحميل
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
