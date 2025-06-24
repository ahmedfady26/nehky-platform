// مكون قائمة الإشعارات
'use client';
import React, { useState } from 'react';
import { useNotifications, Notification } from '@/lib/NotificationContext';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  // تجميع بيانات المستخدم لمكون Avatar
  const userForAvatar = {
    id: notification.id, // استخدام id الإشعار كمُعرّف مؤقت
    fullName: notification.userName,
    username: notification.userName, // استخدام اسم المستخدم كاسم كامل مؤقت
    avatar: notification.userAvatar,
  };

  // أيقونات حسب نوع الإشعار
  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '📢';
      case 'post': return '📝';
      case 'nomination': return '⭐';
      default: return '🔔';
    }
  };

  // ألوان حسب نوع الإشعار
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'like': return 'danger';
      case 'comment': return 'info';
      case 'follow': return 'success';
      case 'mention': return 'warning';
      case 'post': return 'default';
      case 'nomination': return 'success';
      default: return 'default';
    }
  };

  return (
    <div 
      className={`
        p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors
        ${!notification.read ? 'bg-blue-50/50 border-r-4 border-r-blue-400' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <Avatar 
          user={userForAvatar}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getIcon(notification.type)}</span>
            <Badge 
              text={notification.type} 
              variant={getTypeColor(notification.type) as any}
              size="sm"
            />
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <h4 className="font-bold text-gray-900 mb-1">{notification.title}</h4>
          <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <div className="flex gap-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  تحديد كمقروء
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsList() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-hidden">
      {/* رأس القائمة */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-green-400 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">الإشعارات</h3>
          {unreadCount > 0 && (
            <Badge text={unreadCount.toString()} variant="danger" />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm transition ${
              filter === 'all' ? 'bg-white text-blue-600' : 'bg-white/20'
            }`}
          >
            الكل ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded text-sm transition ${
              filter === 'unread' ? 'bg-white text-blue-600' : 'bg-white/20'
            }`}
          >
            غير مقروء ({unreadCount})
          </button>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      {notifications.length > 0 && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                تحديد الكل كمقروء
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={clearAll}>
              مسح الكل
            </Button>
          </div>
        </div>
      )}

      {/* قائمة الإشعارات */}
      <div className="overflow-y-auto max-h-64">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p>{filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}
