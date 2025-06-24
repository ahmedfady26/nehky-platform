// صفحة إدارة الإشعارات الكاملة
'use client';
import React, { useState } from 'react';
import { useNotifications } from '@/lib/NotificationContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import NotificationsList from '@/components/NotificationsList';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    socket,
    requestPermission 
  } = useNotifications();

  const [testNotification, setTestNotification] = useState({
    type: 'like',
    title: 'إعجاب جديد',
    message: 'أعجب أحمد بمنشورك الأخير',
    userName: 'أحمد فادي'
  });

  // إرسال إشعار تجريبي
  const sendTestNotification = () => {
    if (socket) {
      socket.emit('send-notification', {
        userId: 'current-user',
        notification: testNotification
      });
    }
  };

  // إحصائيات الإشعارات
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    likes: notifications.filter(n => n.type === 'like').length,
    comments: notifications.filter(n => n.type === 'comment').length,
    follows: notifications.filter(n => n.type === 'follow').length,
    mentions: notifications.filter(n => n.type === 'mention').length,
  };

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
          إدارة الإشعارات
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* إحصائيات الإشعارات */}
          <Card title="إحصائيات الإشعارات" gradient="blue" className="animate-slideInRight">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-gray-600">المجموع</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
                <div className="text-xs text-gray-600">غير مقروء</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{stats.likes}</div>
                <div className="text-xs text-gray-600">إعجابات</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.comments}</div>
                <div className="text-xs text-gray-600">تعليقات</div>
              </div>
            </div>
          </Card>

          {/* حالة الاتصال */}
          <Card title="حالة الاتصال" gradient="green" className="animate-fadeInUp">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${socket?.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className={socket?.connected ? 'text-green-700' : 'text-red-700'}>
                  {socket?.connected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>معرف الاتصال:</strong><br />
                <code className="text-xs bg-gray-100 p-1 rounded">
                  {socket?.id || 'غير متاح'}
                </code>
              </div>

              <Button 
                variant="primary" 
                size="sm" 
                onClick={requestPermission}
              >
                تفعيل إشعارات المتصفح
              </Button>
            </div>
          </Card>

          {/* إرسال إشعار تجريبي */}
          <Card title="إشعار تجريبي" gradient="purple" className="animate-slideInRight">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">نوع الإشعار:</label>
                <select 
                  value={testNotification.type}
                  onChange={(e) => setTestNotification(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="like">إعجاب</option>
                  <option value="comment">تعليق</option>
                  <option value="follow">متابعة</option>
                  <option value="mention">إشارة</option>
                  <option value="post">منشور</option>
                  <option value="nomination">ترشيح</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">العنوان:</label>
                <input 
                  type="text"
                  value={testNotification.title}
                  onChange={(e) => setTestNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الرسالة:</label>
                <textarea 
                  value={testNotification.message}
                  onChange={(e) => setTestNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 h-20"
                />
              </div>

              <Button 
                variant="success" 
                onClick={sendTestNotification}
                disabled={!socket?.connected}
              >
                إرسال إشعار تجريبي
              </Button>
            </div>
          </Card>
        </div>

        {/* قائمة الإشعارات الكاملة */}
        <div className="mt-8">
          <Card title="جميع الإشعارات" gradient="blue" className="animate-fadeInUp">
            <div className="max-h-96 overflow-hidden">
              <NotificationsList />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
