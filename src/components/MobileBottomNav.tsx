'use client'

// شريط التنقل السفلي للجوال
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Play, User, Plus } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'الرئيسية',
      active: pathname === '/'
    },
    {
      href: '/explore',
      icon: Search,
      label: 'استكشف',
      active: pathname === '/explore'
    },
    {
      href: '/create',
      icon: Plus,
      label: 'إنشاء',
      active: pathname === '/create',
      special: true
    },
    {
      href: '/videos',
      icon: Play,
      label: 'فيديوهاتي',
      active: pathname === '/videos'
    },
    {
      href: '/profile',
      icon: User,
      label: 'الملف الشخصي',
      active: pathname === '/profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 z-50 sm:hidden">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[50px] ${
                item.special
                  ? 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg transform scale-110'
                  : item.active
                  ? 'text-nehky-primary bg-nehky-primary/10'
                  : 'text-gray-500 hover:text-nehky-primary'
              }`}
            >
              <IconComponent 
                size={item.special ? 20 : 18} 
                className={item.active && !item.special ? 'stroke-2' : ''}
              />
              <span className={`text-xs mt-1 font-medium ${
                item.special ? 'text-white' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
