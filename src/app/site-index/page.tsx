// صفحة فهرس جميع صفحات المنصة مع روابط قابلة للنقر
'use client';
import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function SiteIndexPage() {
  const pages = [
    // الصفحات الأساسية
    {
      category: "الصفحات الأساسية",
      items: [
        { name: "الصفحة الرئيسية", url: "/", description: "صفحة الاستقبال والترحيب", icon: "🏠" },
        { name: "تسجيل الدخول", url: "/auth", description: "إنشاء حساب أو تسجيل دخول", icon: "🔐" },
        { name: "الصفحة البديلة", url: "/nehky_firstpage_simple", description: "تصميم مبسط للترحيب", icon: "📄" }
      ]
    },
    // صفحات المستخدم
    {
      category: "صفحات المستخدم",
      items: [
        { name: "الملف الشخصي", url: "/profile", description: "بيانات وإحصائيات المستخدم", icon: "👤" },
        { name: "لوحة التحكم", url: "/dashboard", description: "واجهة إدارية شاملة", icon: "📊" }
      ]
    },
    // صفحات المحتوى
    {
      category: "صفحات المحتوى",
      items: [
        { name: "الخلاصة الرئيسية", url: "/feed", description: "منشورات المتابعين", icon: "📰" },
        { name: "إنشاء منشور", url: "/create-post", description: "كتابة ونشر محتوى جديد", icon: "✍️" },
        { name: "الاستكشاف", url: "/explore", description: "البحث واكتشاف المحتوى", icon: "🔍" }
      ]
    },
    // صفحات التواصل
    {
      category: "صفحات التواصل",
      items: [
        { name: "الرسائل الخاصة", url: "/messages", description: "التواصل المباشر", icon: "💬" },
        { name: "الإشعارات", url: "/notifications", description: "إدارة الإشعارات", icon: "🔔" }
      ]
    },
    // صفحات التطوير
    {
      category: "صفحات التطوير والاختبار",
      items: [
        { name: "معرض المكونات", url: "/components-showcase", description: "جميع مكونات واجهة المستخدم", icon: "🎨" },
        { name: "معرض صناديق الإدخال", url: "/input-showcase", description: "مكونات الإدخال مع الشعار", icon: "📝" },
        { name: "اختبار الإشعارات", url: "/test-notifications", description: "تجربة نظام الإشعارات", icon: "🧪" }
      ]
    }
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-7xl mx-auto">
        {/* الهيدر */}
        <div className="text-center mb-8">
          <Logo size="lg" showText={true} />
          <h1 className="text-4xl font-bold text-white mt-4 animate-fadeInUp">
            فهرس صفحات منصة نحكي
          </h1>
          <p className="text-white/80 text-lg mt-2">
            جميع الصفحات المتاحة مع روابط قابلة للنقر المباشر
          </p>
        </div>

        {/* عرض الصفحات حسب الفئات */}
        <div className="space-y-8">
          {pages.map((category, categoryIndex) => (
            <div key={categoryIndex} className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((page, pageIndex) => (
                  <Card 
                    key={pageIndex}
                    gradient={categoryIndex % 4 === 0 ? 'blue' : categoryIndex % 4 === 1 ? 'green' : categoryIndex % 4 === 2 ? 'purple' : 'pink'}
                    className="hover:scale-105 transition-transform"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{page.icon}</span>
                        <h3 className="font-bold text-gray-800">{page.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm">
                        {page.description}
                      </p>
                      
                      <div className="pt-2">
                        <Link href={page.url} className="block">
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="w-full"
                          >
                            زيارة الصفحة
                          </Button>
                        </Link>
                      </div>
                      
                      {/* عرض الرابط للنسخ */}
                      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                        <code>localhost:3000{page.url}</code>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* معلومات إضافية */}
        <Card title="معلومات مهمة" gradient="blue" className="mt-8 animate-fadeInUp">
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>جميع الروابط أعلاه قابلة للنقر المباشر</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>المنصة تعمل على: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>خادم الإشعارات يعمل على: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3001</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              <span>يمكنك إضافة هذه الصفحة للمفضلة للوصول السريع لجميع الصفحات</span>
            </div>
          </div>
        </Card>

        {/* روابط سريعة للصفحات الأكثر استخداماً */}
        <Card title="الصفحات الأكثر استخداماً" gradient="green" className="mt-6 animate-fadeInUp">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/auth">
              <Button variant="primary" size="sm" className="w-full">
                🔐 تسجيل الدخول
              </Button>
            </Link>
            <Link href="/components-showcase">
              <Button variant="secondary" size="sm" className="w-full">
                🎨 معرض المكونات
              </Button>
            </Link>
            <Link href="/test-notifications">
              <Button variant="success" size="sm" className="w-full">
                🧪 اختبار الإشعارات
              </Button>
            </Link>
            <Link href="/create-post">
              <Button variant="primary" size="sm" className="w-full">
                ✍️ إنشاء منشور
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
