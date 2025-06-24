import React, { useState, useEffect } from 'react'

interface PointsNotificationProps {
  points: number
  type: 'LIKE' | 'COMMENT' | 'POST'
  influencerName: string
  show: boolean
  onClose: () => void
}

const typeMessages = {
  LIKE: 'إعجاب',
  COMMENT: 'تعليق', 
  POST: 'منشور'
}

const typeEmojis = {
  LIKE: '❤️',
  COMMENT: '💬',
  POST: '📝'
}

export default function PointsNotification({
  points,
  type,
  influencerName,
  show,
  onClose
}: PointsNotificationProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (show) {
      // تحديث شريط التقدم
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressInterval)
            onClose()
            return 0
          }
          return prev - 2.5 // ينقص كل 100ms لمدة 4 ثواني
        })
      }, 100)

      // إعادة تعيين التقدم عند الظهور
      setProgress(100)

      return () => clearInterval(progressInterval)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 transform
      ${show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'}
    `}>
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg shadow-lg border-2 border-white relative overflow-hidden">
        <div className="flex items-center">
          <div className="text-2xl mr-3 animate-bounce">
            {typeEmojis[type]}
          </div>
          
          <div className="flex-1">
            <div className="font-bold text-lg">
              +{points} نقطة! 🎯
            </div>
            <div className="text-sm opacity-90">
              {typeMessages[type]} مع {influencerName}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl ml-2 transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* شريط التقدم */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
          <div 
            className="h-full bg-white/50 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
