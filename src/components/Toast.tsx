// مكون إشعارات منبثقة مع تأثيرات
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const typeClasses = {
    success: "bg-gradient-to-r from-green-500 to-emerald-400 text-white",
    error: "bg-gradient-to-r from-red-500 to-rose-400 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-amber-400 text-white",
    info: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
  };

  const icons = {
    success: "✓",
    error: "✗", 
    warning: "⚠",
    info: "ℹ"
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg min-w-80
        ${typeClasses[type]}
        transform transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <p className="font-medium">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="mr-auto text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
