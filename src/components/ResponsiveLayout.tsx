'use client';
// مكون Layout متجاوب - قابل للتكيف مع Web/Mobile
import React, { ReactNode, useEffect, useState } from 'react';
import { detectDeviceType, getResponsiveClasses, DeviceType } from '@/shared/utils/responsive';
import { APP_CONFIG } from '@/shared/constants/app';
import { Menu, X } from 'lucide-react'; // استيراد أيقونات أفضل

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  className?: string;
  title?: string;
}

interface HeaderProps {
  deviceType: DeviceType;
  title?: string;
  onMenuClick: () => void; // دالة لفتح القائمة
}

interface SidebarProps {
  deviceType: DeviceType;
  isOpen: boolean;
  onClose: () => void;
}

// مكون الهيدر المتجاوب
function Header({ deviceType, title, onMenuClick }: HeaderProps) {
  const responsiveClasses = getResponsiveClasses(deviceType);
  
  return (
    <header 
      className={`bg-white shadow-sm border-b border-gray-200 ${responsiveClasses.container}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        {/* اللوجو */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ن</span>
          </div>
          <div>
            <h1 className={`font-bold text-blue-600 ${responsiveClasses.text}`}>
              {APP_CONFIG.name}
            </h1>
            {title && (
              <p className="text-gray-500 text-xs">{title}</p>
            )}
          </div>
        </div>

        {/* أزرار التحكم للموبايل */}
        {deviceType === 'mobile' && (
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* شريط التنقل للديسكتوب */}
        {deviceType === 'desktop' && (
          <nav className="flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              الرئيسية
            </a>
            <a href="/feed" className="text-gray-600 hover:text-blue-600 transition-colors">
              التغذية
            </a>
            <a href="/explore" className="text-gray-600 hover:text-blue-600 transition-colors">
              اكتشف
            </a>
            <a href="/messages" className="text-gray-600 hover:text-blue-600 transition-colors">
              الرسائل
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

// مكون الشريط الجانبي للموبايل
function MobileSidebar({ deviceType, isOpen, onClose }: SidebarProps) {
  if (deviceType !== 'mobile' || !isOpen) return null;

  return (
    <>
      {/* خلفية شفافة */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* الشريط الجانبي */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} dir="rtl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">القائمة</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <a href="/" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            الرئيسية
          </a>
          <a href="/feed" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            التغذية
          </a>
          <a href="/explore" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            اكتشف
          </a>
          <a href="/messages" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            الرسائل
          </a>
          <a href="/notifications" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            الإشعارات
          </a>
          <a href="/profile" className="p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            ملفي الشخصي
          </a>
        </nav>
      </aside>
    </>
  );
}

// مكون الفوتر
function Footer({ deviceType }: { deviceType: DeviceType }) {
  const responsiveClasses = getResponsiveClasses(deviceType);
  
  return (
    <footer 
      className={`bg-gray-50 border-t border-gray-200 ${responsiveClasses.container}`}
      dir="rtl"
    >
      <div className="text-center">
        <p className={`text-gray-500 ${responsiveClasses.text}`}>
          © 2025 منصة نحكي. جميع الحقوق محفوظة.
        </p>
        {deviceType === 'desktop' && (
          <div className="flex justify-center gap-6 mt-2">
            <a href="/privacy" className="text-gray-400 hover:text-gray-600 text-sm">
              سياسة الخصوصية
            </a>
            <a href="/terms" className="text-gray-400 hover:text-gray-600 text-sm">
              شروط الاستخدام
            </a>
            <a href="/contact" className="text-gray-400 hover:text-gray-600 text-sm">
              تواصل معنا
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}

// مكون Layout الرئيسي
export default function ResponsiveLayout({
  children,
  showHeader = true,
  showFooter = true,
  showSidebar = true,
  className = '',
  title,
}: LayoutProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const updateDeviceType = () => {
      setDeviceType(detectDeviceType());
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const responsiveClasses = getResponsiveClasses(deviceType);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`} dir="rtl">
      {showHeader && <Header deviceType={deviceType} title={title} onMenuClick={toggleSidebar} />}
      
      {showSidebar && <MobileSidebar deviceType={deviceType} isOpen={isSidebarOpen} onClose={toggleSidebar} />}

      <main className={`flex-grow w-full ${responsiveClasses.container} mx-auto`}>
        {children}
      </main>

      {showFooter && <Footer deviceType={deviceType} />}
    </div>
  );
}

// Hook للحصول على معلومات الجهاز
export function useDeviceInfo() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceType(detectDeviceType());
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);
  
  return {
    deviceType,
    screenSize,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
}
