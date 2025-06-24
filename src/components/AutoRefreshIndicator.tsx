import React from 'react';

interface AutoRefreshIndicatorProps {
  isEnabled: boolean;
  timeAgo: string;
  nextRefreshIn: number | null;
  refreshCount: number;
  onToggle: () => void;
  onRefreshNow: () => void;
  intervalMs: number;
}

const AutoRefreshIndicator: React.FC<AutoRefreshIndicatorProps> = ({
  isEnabled,
  timeAgo,
  nextRefreshIn,
  refreshCount,
  onToggle,
  onRefreshNow,
  intervalMs
}) => {
  const formatInterval = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} ثانية`;
    return `${Math.floor(seconds / 60)} دقيقة`;
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg border">
      {/* مؤشر الحالة */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm font-medium text-gray-700">
          التحديث التلقائي
        </span>
      </div>

      {/* مفتاح التحكم */}
      <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
          isEnabled ? 'bg-green-600' : 'bg-gray-300'
        }`}
        title={isEnabled ? 'إيقاف التحديث التلقائي' : 'تفعيل التحديث التلقائي'}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      {/* معلومات التحديث */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div>
          <span className="font-medium">آخر تحديث:</span> {timeAgo}
        </div>
        
        {isEnabled && nextRefreshIn !== null && (
          <div>
            <span className="font-medium">التحديث القادم خلال:</span> {nextRefreshIn} ثانية
          </div>
        )}

        <div>
          <span className="font-medium">التكرار:</span> كل {formatInterval(intervalMs)}
        </div>

        <div>
          <span className="font-medium">عدد التحديثات:</span> {refreshCount}
        </div>
      </div>

      {/* زر التحديث الفوري */}
      <button
        onClick={onRefreshNow}
        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
        title="تحديث الآن"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        تحديث الآن
      </button>
    </div>
  );
};

export default AutoRefreshIndicator;
