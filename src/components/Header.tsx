// مكون الهيدر مع جرس الإشعارات
'use client';
import React from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';
import Logo from './Logo';
import Avatar from './Avatar';

// من المفترض أن تأتي هذه البيانات من نظام المصادقة (useAuth hook)
const mockUser = {
  id: '1',
  fullName: "أحمد فادي",
  username: "ahmedfady",
  avatar: "https://randomuser.me/api/portraits/men/35.jpg",
};

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* اللوجو والقائمة */}
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/feed" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                الرئيسية
              </Link>
              <Link 
                href="/explore" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                استكشاف
              </Link>
              <Link 
                href="/messages" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                الرسائل
              </Link>
              <Link 
                href="/notifications" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                الإشعارات
              </Link>
            </nav>
          </div>

          {/* الإشعارات والملف الشخصي */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <Link href="/profile" className="hover:opacity-80 transition-opacity">
              <Avatar 
                user={mockUser}
                size="sm"
                status="online"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
