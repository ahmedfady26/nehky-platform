// نظام إدارة الإشعارات مع Socket.IO
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// أنواع الإشعارات
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post' | 'nomination';
  title: string;
  message: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => void;
  showBrowserNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // الاتصال بـ Socket.IO
  useEffect(() => {
    const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    });

    socketConnection.on('connect', () => {
      console.log('✅ متصل بخادم الإشعارات');
    });

    // استقبال الإشعارات الجديدة
    socketConnection.on('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
      showBrowserNotification(data);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // طلب إذن الإشعارات في المتصفح
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
    }
  };

  // عرض إشعار في المتصفح
  const showBrowserNotification = (notification: Notification) => {
    if (permission === 'granted' && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/nehky_logo.webp',
        badge: '/nehky_logo.webp',
        tag: notification.id,
        requireInteraction: false,
        silent: false,
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // إغلاق تلقائي بعد 5 ثوان
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  };

  // تحديد إشعار كمقروء
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // حذف إشعار
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // مسح جميع الإشعارات
  const clearAll = () => {
    setNotifications([]);
  };

  // حساب عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      socket,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      requestPermission,
      showBrowserNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
