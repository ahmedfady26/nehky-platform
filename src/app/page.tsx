'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import ResponsiveLayout, { useDeviceInfo } from '@/components/ResponsiveLayout';
import { APP_CONFIG } from '@/shared/constants/app';
import { getResponsiveClasses } from '@/shared/utils/responsive';

export default function Home() {
  const { deviceType, isMobile, isTablet } = useDeviceInfo();
  const responsiveClasses = getResponsiveClasses(deviceType);
  
  return (
    <ResponsiveLayout showHeader={false} showFooter={!isMobile} title="الصفحة الرئيسية">
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center ${responsiveClasses.container}`} dir="rtl">
        <div className={`w-full ${isMobile ? 'max-w-sm' : isTablet ? 'max-w-md' : 'max-w-lg'}`}>
          {/* اللوجو */}
          <div className="text-center mb-8">
            <Logo size={isMobile ? "xl" : "2xl"} showText={false} />
          </div>

          {/* بطاقة الترحيب */}
          <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${responsiveClasses.container}`}>
            <div className="text-center mb-6">
              <h1 className={`text-blue-600 font-semibold mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: 'Cooper Hewitt, sans-serif' }}>
                <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} mb-1`}>{APP_CONFIG.name}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{APP_CONFIG.tagline}</div>
              </h1>
              <p className={`text-gray-800 font-bold drop-shadow-sm ${responsiveClasses.text}`} style={{ fontFamily: 'Cooper Hewitt, sans-serif', display: 'inline-block' }}>
                {APP_CONFIG.description}
              </p>
            </div>

          {/* الميزات الرئيسية */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">👥</span>
              <span>اختر كبار متابعينك… وخلّي جمهورك يكون جزء من قصتك.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-purple-500 text-xl">⭐</span>
              <span>احصل على نقاط التفاعل.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-orange-500 text-xl">✨</span>
              <span>في نحكي، ما تكون لوحدك… جمهورك يكتب القصة معك.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-blue-500 text-xl">🤝</span>
              <span>في نحكي التفاعل مش مجرد رقم… ده ترشيح.</span>
            </div>
            <div className="mr-8 mt-2">
              <p className="text-gray-500 text-sm">
                شارك، علّق، اجمع نقاطك، وكن من كبار المتابعين.
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="space-y-3">
            <Link href="/auth" className="block">
              <Button variant="primary" className="w-full">
                تسجيل الدخول / إنشاء حساب
              </Button>
            </Link>
            
            <Link href="/components-showcase" className="block">
              <Button variant="secondary" className="w-full">
                استكشاف المنصة
              </Button>
            </Link>
          </div>

          {/* روابط إضافية */}
          <div className="mt-6 text-center">
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/test-notifications" className="text-blue-600 hover:text-blue-800">
                تجربة الإشعارات
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/input-showcase" className="text-blue-600 hover:text-blue-800">
                معرض التصميم
              </Link>
            </div>
          </div>
        </div>

          {/* معلومات إضافية */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>منصة مخصصة للأجهزة المكتبية</p>
            <p className="mt-1">تدعم العربية بالكامل مع RTL</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
