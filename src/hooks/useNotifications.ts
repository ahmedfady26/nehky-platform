/**
 * 🔔 Hook للإشعارات المتقدمة للصديق الأفضل
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

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

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  loadNotifications: () => Promise<void>
  markAsRead: (ids: string[]) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}

export function useNotifications(userId: string): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // جلب الإشعارات
  const loadNotifications = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/bestfriend/notifications?userId=${userId}&limit=50`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في تحميل الإشعارات')
      }

      setNotifications(data.notifications || [])
      
      // جلب عدد الإشعارات غير المقروءة
      const countResponse = await fetch(`/api/bestfriend/notifications?userId=${userId}&action=unread-count`)
      const countData = await countResponse.json()
      
      if (countResponse.ok) {
        setUnreadCount(countData.count || 0)
      }

    } catch (err) {
      console.error('Error loading notifications:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // تمييز إشعارات كمقروءة
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!userId || notificationIds.length === 0) return

    try {
      const response = await fetch('/api/bestfriend/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          notificationIds,
          action: 'mark-read'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في تحديث الإشعارات')
      }

      // تحديث الحالة المحلية
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif.id)
            ? { ...notif, read: true }
            : notif
        )
      )

      // تحديث العداد
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length))

    } catch (err) {
      console.error('Error marking notifications as read:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث الإشعارات')
    }
  }, [userId])

  // تمييز جميع الإشعارات كمقروءة
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications
      .filter(notif => !notif.read)
      .map(notif => notif.id)
    
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds)
    }
  }, [notifications, markAsRead])

  // إعادة تحميل
  const refresh = useCallback(async () => {
    await loadNotifications()
  }, [loadNotifications])

  // تحميل الإشعارات عند التهيئة
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // تحديث دوري كل دقيقة
  useEffect(() => {
    if (!userId) return

    const interval = setInterval(() => {
      // جلب عدد الإشعارات الجديدة فقط لتوفير الموارد
      fetch(`/api/bestfriend/notifications?userId=${userId}&action=unread-count`)
        .then(response => response.json())
        .then(data => {
          if (data.count !== undefined) {
            setUnreadCount(data.count)
          }
        })
        .catch(console.error)
    }, 60000) // كل دقيقة

    return () => clearInterval(interval)
  }, [userId])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh
  }
}

// Hook مبسط لعدد الإشعارات فقط
export function useUnreadNotificationsCount(userId: string) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const updateCount = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/bestfriend/notifications?userId=${userId}&action=unread-count`)
      const data = await response.json()
      
      if (response.ok) {
        setCount(data.count || 0)
      }
    } catch (err) {
      console.error('Error fetching unread count:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    updateCount()
    
    // تحديث كل 30 ثانية
    const interval = setInterval(updateCount, 30000)
    return () => clearInterval(interval)
  }, [updateCount])

  return { count, loading, refresh: updateCount }
}

export default useNotifications
