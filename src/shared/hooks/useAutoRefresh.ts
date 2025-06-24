import { useState, useEffect } from 'react';

interface AutoRefreshOptions {
  intervalMs?: number; // الفترة الزمنية بين التحديثات (ميلي ثانية)
  enabled?: boolean; // تفعيل/إلغاء التحديث التلقائي
  pauseOnHidden?: boolean; // إيقاف التحديث عند إخفاء الصفحة
  refreshOnFocus?: boolean; // تحديث عند العودة للصفحة
}

/**
 * Hook مخصص للتحديث التلقائي الذكي
 * @param refreshFunction الدالة التي ستُستدعى للتحديث
 * @param options خيارات التحديث
 * @returns كائن يحتوي على حالة التحديث ودوال التحكم
 */
export const useAutoRefresh = (
  refreshFunction: () => void | Promise<void>,
  options: AutoRefreshOptions = {}
) => {
  const {
    intervalMs = 30000, // 30 ثانية افتراضياً
    enabled = true,
    pauseOnHidden = true,
    refreshOnFocus = true
  } = options;

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isVisible, setIsVisible] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  // تتبع رؤية الصفحة
  useEffect(() => {
    if (!pauseOnHidden && !refreshOnFocus) return;

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      
      if (visible && refreshOnFocus && isEnabled) {
        console.log('🔄 الصفحة مرئية مرة أخرى - تحديث البيانات...');
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isEnabled, refreshOnFocus]);

  // تنفيذ التحديث
  const handleRefresh = async () => {
    try {
      await refreshFunction();
      setLastUpdate(new Date());
      setRefreshCount(prev => prev + 1);
    } catch (error) {
      console.error('خطأ في التحديث التلقائي:', error);
    }
  };

  // نظام التحديث التلقائي
  useEffect(() => {
    if (!isEnabled || (pauseOnHidden && !isVisible)) {
      return;
    }
    
    const interval = setInterval(() => {
      console.log('🔄 التحديث التلقائي...');
      handleRefresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isEnabled, isVisible, intervalMs, pauseOnHidden]);

  // تحديث فوري
  const refreshNow = () => {
    console.log('🔄 تحديث فوري...');
    handleRefresh();
  };

  // تبديل حالة التحديث التلقائي
  const toggleAutoRefresh = () => {
    setIsEnabled(prev => !prev);
  };

  // معلومات حالة التحديث
  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diff < 60) return `منذ ${diff} ثانية`;
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    return `منذ ${Math.floor(diff / 3600)} ساعة`;
  };

  const getNextRefreshIn = () => {
    if (!isEnabled) return null;
    
    const now = new Date();
    const nextRefresh = new Date(lastUpdate.getTime() + intervalMs);
    const diff = Math.floor((nextRefresh.getTime() - now.getTime()) / 1000);
    
    return Math.max(0, diff);
  };

  return {
    // الحالة
    isEnabled,
    isVisible,
    lastUpdate,
    refreshCount,
    
    // الدوال
    refreshNow,
    toggleAutoRefresh,
    setEnabled: setIsEnabled,
    
    // معلومات مفيدة
    timeAgo: getTimeAgo(),
    nextRefreshIn: getNextRefreshIn(),
    intervalMs,
  };
};

export default useAutoRefresh;
