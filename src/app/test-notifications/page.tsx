// صفحة اختبار سريع لنظام الإشعارات
'use client';
import React from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useNotifications } from '@/lib/NotificationContext';

export default function TestNotificationsPage() {
  const { socket } = useNotifications();

  // إشعارات تجريبية مختلفة
  const testNotifications = [
    {
      type: 'like',
      title: 'إعجاب جديد! ❤️',
      message: 'أعجبت سارة بمنشورك الأخير عن التقنية',
      userName: 'سارة محمد'
    },
    {
      type: 'comment',
      title: 'تعليق جديد! 💬',
      message: 'علق أحمد على منشورك: "معلومات مفيدة جداً، شكراً"',
      userName: 'أحمد علي'
    },
    {
      type: 'follow',
      title: 'متابع جديد! 👤',
      message: 'بدأ خالد بمتابعتك. لديه 500 متابع',
      userName: 'خالد محمود'
    },
    {
      type: 'mention',
      title: 'تم ذكرك! 📢',
      message: 'ذكرتك فاطمة في منشور عن أفضل المطورين',
      userName: 'فاطمة أحمد'
    },
    {
      type: 'nomination',
      title: 'ترشيح جديد! ⭐',
      message: 'رشحك المؤثر د.ريم لتكون من كبار المتابعين',
      userName: 'د.ريم خالد'
    }
  ];

  const sendTestNotification = (notification: any) => {
    if (socket) {
      socket.emit('send-notification', {
        userId: 'current-user',
        notification
      });
    }
  };

  return (
    <div className="min-h-screen bg-nehky-primary">
      <Header />
      
      <main className="max-w-4xl mx-auto p-6" dir="rtl">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
          اختبار نظام الإشعارات 🧪
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testNotifications.map((notification, index) => (
            <Card 
              key={index}
              title={notification.title}
              gradient={index % 2 === 0 ? 'blue' : 'green'}
              className="animate-fadeInUp"
            >
              <div className="space-y-3">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500">من: {notification.userName}</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => sendTestNotification(notification)}
                  disabled={!socket?.connected}
                >
                  إرسال هذا الإشعار
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card title="معلومات الاتصال" gradient="purple">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${socket?.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span>حالة الاتصال: {socket?.connected ? 'متصل ✅' : 'غير متصل ❌'}</span>
              </div>
              <div>معرف الاتصال: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{socket?.id || 'غير متاح'}</code></div>
              <div>عنوان الخادم: <code className="bg-gray-100 px-2 py-1 rounded text-xs">http://localhost:3001</code></div>
            </div>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            💡 تأكد من أن خادم الإشعارات يعمل على المنفذ 3001
          </p>
          <p className="text-white/80 text-sm mt-2">
            🔔 راقب جرس الإشعارات في الأعلى لرؤية التأثيرات
          </p>
        </div>
      </main>
    </div>
  );
}
