'use client'

import { useState } from 'react'
import { AUTO_REFRESH_INTERVALS } from '@/hooks/useAutoRefresh'

interface AutoRefreshControlsProps {
  isActive: boolean
  onToggle: () => void
  onIntervalChange?: (interval: number) => void
  currentInterval?: number
  lastRefreshTime?: Date
  className?: string
}

export default function AutoRefreshControls({
  isActive,
  onToggle,
  onIntervalChange,
  currentInterval = AUTO_REFRESH_INTERVALS.NORMAL,
  lastRefreshTime,
  className = ''
}: AutoRefreshControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  const formatLastRefresh = (date?: Date) => {
    if (!date) return 'لم يحدث بعد'
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return `منذ ${diff} ثانية`
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
    return date.toLocaleTimeString('ar-EG')
  }

  const getIntervalLabel = (interval: number) => {
    switch (interval) {
      case AUTO_REFRESH_INTERVALS.FAST: return '5 ثوانِ'
      case AUTO_REFRESH_INTERVALS.NORMAL: return '30 ثانية'
      case AUTO_REFRESH_INTERVALS.SLOW: return 'دقيقة'
      case AUTO_REFRESH_INTERVALS.VERY_SLOW: return '5 دقائق'
      default: return `${interval / 1000} ثانية`
    }
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border shadow-sm ${className}`}>
      {/* حالة التحديث التلقائي */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm font-medium text-gray-700">
          التحديث التلقائي: {isActive ? 'مفعل' : 'معطل'}
        </span>
      </div>

      {/* زر التبديل */}
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isActive ? '⏸️ إيقاف' : '▶️ تشغيل'}
      </button>

      {/* معلومات الفترة الزمنية */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">كل:</span>
        <span className="text-sm font-medium text-blue-600">
          {getIntervalLabel(currentInterval)}
        </span>
      </div>

      {/* آخر تحديث */}
      {lastRefreshTime && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">آخر تحديث:</span>
          <span className="text-sm font-medium text-gray-700">
            {formatLastRefresh(lastRefreshTime)}
          </span>
        </div>
      )}

      {/* إعدادات متقدمة */}
      {onIntervalChange && (
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="إعدادات التحديث"
          >
            ⚙️
          </button>

          {showSettings && (
            <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
              <h3 className="text-sm font-medium text-gray-900 mb-3">فترة التحديث</h3>
              <div className="space-y-2">
                {Object.entries(AUTO_REFRESH_INTERVALS).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="refresh-interval"
                      value={value}
                      checked={currentInterval === value}
                      onChange={() => {
                        onIntervalChange(value)
                        setShowSettings(false)
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      {getIntervalLabel(value)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* مؤشر التحميل */}
      {isActive && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs text-gray-500">نشط</span>
        </div>
      )}
    </div>
  )
}
