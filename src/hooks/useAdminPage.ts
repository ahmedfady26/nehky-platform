import { useState, useEffect, useCallback } from 'react'
import { useAutoRefresh, AUTO_REFRESH_INTERVALS } from './useAutoRefresh'

interface AdminPageConfig {
  defaultInterval?: number
  enabledByDefault?: boolean
  dependencies?: any[]
}

interface AdminPageData<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastRefreshTime: Date | null
}

/**
 * هوك شامل لإدارة صفحات الإدارة مع التحديث التلقائي
 */
export function useAdminPage<T>(
  fetchFunction: () => Promise<T>,
  config: AdminPageConfig = {}
) {
  const {
    defaultInterval = AUTO_REFRESH_INTERVALS.NORMAL,
    enabledByDefault = true,
    dependencies = []
  } = config

  // حالة البيانات
  const [pageData, setPageData] = useState<AdminPageData<T>>({
    data: null,
    loading: true,
    error: null,
    lastRefreshTime: null
  })

  // إعدادات التحديث التلقائي
  const [refreshEnabled, setRefreshEnabled] = useState(enabledByDefault)
  const [refreshInterval, setRefreshInterval] = useState(defaultInterval)

  // دالة تحديث البيانات
  const refreshData = useCallback(async () => {
    try {
      setPageData(prev => ({ ...prev, loading: true, error: null }))
      
      const newData = await fetchFunction()
      
      setPageData({
        data: newData,
        loading: false,
        error: null,
        lastRefreshTime: new Date()
      })
    } catch (error) {
      console.error('خطأ في تحديث بيانات الصفحة:', error)
      setPageData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
      }))
    }
  }, [fetchFunction, ...dependencies])

  // إعداد التحديث التلقائي
  const autoRefresh = useAutoRefresh({
    enabled: refreshEnabled,
    interval: refreshInterval,
    onRefresh: refreshData,
    dependencies
  })

  // التحميل الأولي
  useEffect(() => {
    refreshData()
  }, [...dependencies])

  // دوال التحكم
  const toggleAutoRefresh = useCallback(() => {
    setRefreshEnabled(prev => !prev)
    autoRefresh.toggleAutoRefresh()
  }, [autoRefresh])

  const changeRefreshInterval = useCallback((newInterval: number) => {
    setRefreshInterval(newInterval)
    if (refreshEnabled) {
      autoRefresh.stopAutoRefresh()
      // إعادة تشغيل التحديث بالفترة الجديدة سيحدث تلقائياً بسبب useEffect في useAutoRefresh
    }
  }, [refreshEnabled, autoRefresh])

  const manualRefresh = useCallback(() => {
    refreshData()
  }, [refreshData])

  return {
    // البيانات
    ...pageData,
    
    // دوال التحكم
    refresh: manualRefresh,
    toggleAutoRefresh,
    changeRefreshInterval,
    
    // معلومات التحديث التلقائي
    autoRefresh: {
      enabled: refreshEnabled,
      active: autoRefresh.isActive,
      interval: refreshInterval
    }
  }
}

/**
 * هوك مبسط لصفحات الإدارة مع إعدادات سريعة
 */
export function useAdminPageSimple<T>(
  fetchFunction: () => Promise<T>,
  refreshInterval: number = AUTO_REFRESH_INTERVALS.NORMAL
) {
  return useAdminPage(fetchFunction, {
    defaultInterval: refreshInterval,
    enabledByDefault: true
  })
}

/**
 * هوك للصفحات التي تحتاج تحديث سريع (مثل الإحصائيات المباشرة)
 */
export function useAdminPageRealtime<T>(
  fetchFunction: () => Promise<T>
) {
  return useAdminPage(fetchFunction, {
    defaultInterval: AUTO_REFRESH_INTERVALS.FAST,
    enabledByDefault: true
  })
}

/**
 * هوك للصفحات التي تحتاج تحديث بطيء (مثل التقارير)
 */
export function useAdminPageReports<T>(
  fetchFunction: () => Promise<T>
) {
  return useAdminPage(fetchFunction, {
    defaultInterval: AUTO_REFRESH_INTERVALS.VERY_SLOW,
    enabledByDefault: false
  })
}
