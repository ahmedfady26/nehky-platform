import { useEffect, useRef, useCallback } from 'react'

interface AutoRefreshConfig {
  enabled: boolean
  interval: number // بالميلي ثانية
  onRefresh: () => void | Promise<void>
  dependencies?: any[]
}

/**
 * هوك للتحديث التلقائي للبيانات
 * @param config إعدادات التحديث التلقائي
 */
export function useAutoRefresh(config: AutoRefreshConfig) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  const { enabled, interval, onRefresh, dependencies = [] } = config

  // دالة بدء التحديث التلقائي
  const startAutoRefresh = useCallback(() => {
    if (!enabled || intervalRef.current) return

    intervalRef.current = setInterval(async () => {
      if (isActiveRef.current && document.visibilityState === 'visible') {
        try {
          await onRefresh()
        } catch (error) {
          console.error('خطأ في التحديث التلقائي:', error)
        }
      }
    }, interval)
  }, [enabled, interval, onRefresh])

  // دالة إيقاف التحديث التلقائي
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // دالة التبديل بين التشغيل والإيقاف
  const toggleAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      stopAutoRefresh()
    } else {
      startAutoRefresh()
    }
  }, [startAutoRefresh, stopAutoRefresh])

  // بدء التحديث التلقائي عند تغيير الإعدادات
  useEffect(() => {
    if (enabled) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }

    return stopAutoRefresh
  }, [enabled, startAutoRefresh, stopAutoRefresh, ...dependencies])

  // إيقاف التحديث عند إخفاء الصفحة واستئنافه عند إظهارها
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isActiveRef.current = false
      } else {
        isActiveRef.current = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      stopAutoRefresh()
    }
  }, [stopAutoRefresh])

  return {
    isActive: !!intervalRef.current,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh
  }
}

// إعدادات التحديث التلقائي المختلفة
export const AUTO_REFRESH_INTERVALS = {
  FAST: 5000,      // 5 ثوانِ - للبيانات الحيوية
  NORMAL: 30000,   // 30 ثانية - للبيانات العادية
  SLOW: 60000,     // دقيقة - للبيانات الثابتة نسبياً
  VERY_SLOW: 300000 // 5 دقائق - للإحصائيات
} as const

/**
 * هوك مخصص لصفحات الإدارة مع إعدادات افتراضية
 */
export function useAdminAutoRefresh(
  refreshFunction: () => void | Promise<void>,
  interval: number = AUTO_REFRESH_INTERVALS.NORMAL,
  enabled: boolean = true
) {
  return useAutoRefresh({
    enabled,
    interval,
    onRefresh: refreshFunction
  })
}
