// مكون جرس الإشعارات في الهيدر
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/NotificationContext';
import NotificationsList from './NotificationsList';
import Badge from './Badge';

export default function NotificationBell() {
  const { unreadCount, requestPermission } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // طلب إذن الإشعارات عند أول فتح
  const handleToggle = () => {
    if (!isOpen) {
      requestPermission();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* زر الجرس */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
        aria-label="الإشعارات"
      >
        <div className="relative">
          {/* أيقونة الجرس */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className={`transition-transform ${isOpen ? 'animate-bounce' : ''}`}
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          
          {/* عداد الإشعارات غير المقروءة */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <Badge 
                text={unreadCount > 99 ? '99+' : unreadCount.toString()} 
                variant="danger" 
                size="sm"
                animated={true}
              />
            </div>
          )}
        </div>
      </button>

      {/* قائمة الإشعارات المنسدلة */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-fadeInUp">
          <div className="relative">
            {/* مثلث صغير يشير للأعلى */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-r border-gray-200"></div>
            <NotificationsList />
          </div>
        </div>
      )}
    </div>
  );
}
