'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PageInfo {
  path: string;
  title: string;
  description: string;
  status: 'active' | 'development' | 'test';
  icon: string;
}

export default function SiteMapPage() {
  const [selectedCategory, setSelectedCategory] = useState<'user' | 'admin' | 'test' | 'all'>('all');

  // صفحات المستخدمين
  const userPages: PageInfo[] = [
    {
      path: '/',
      title: 'الصفحة الرئيسية',
      description: 'صفحة البداية الرئيسية للمنصة',
      status: 'active',
      icon: '🏠'
    },
    {
      path: '/auth',
      title: 'تسجيل الدخول والتسجيل',
      description: 'صفحة تسجيل الدخول وإنشاء حساب جديد',
      status: 'active',
      icon: '🔐'
    },
    {
      path: '/dashboard',
      title: 'لوحة التحكم الشخصية',
      description: 'لوحة تحكم المستخدم الرئيسية',
      status: 'active',
      icon: '📊'
    },
    {
      path: '/feed',
      title: 'التغذية الرئيسية',
      description: 'عرض منشورات المتابعين والترندات',
      status: 'active',
      icon: '📰'
    },
    {
      path: '/explore',
      title: 'استكشاف',
      description: 'اكتشاف محتوى وأشخاص جدد',
      status: 'active',
      icon: '🔍'
    },
    {
      path: '/profile',
      title: 'الملف الشخصي',
      description: 'عرض وإدارة الملف الشخصي',
      status: 'active',
      icon: '👤'
    },
    {
      path: '/profile/edit',
      title: 'تعديل الملف الشخصي',
      description: 'تحديث معلومات الحساب الشخصي',
      status: 'active',
      icon: '✏️'
    },
    {
      path: '/create-post',
      title: 'إنشاء منشور',
      description: 'كتابة ونشر منشور جديد',
      status: 'active',
      icon: '✍️'
    },
    {
      path: '/messages',
      title: 'الرسائل',
      description: 'إدارة الرسائل الشخصية والمحادثات',
      status: 'active',
      icon: '💬'
    },
    {
      path: '/notifications',
      title: 'الإشعارات',
      description: 'عرض جميع الإشعارات والتنبيهات',
      status: 'active',
      icon: '🔔'
    },
    {
      path: '/points',
      title: 'نظام النقاط',
      description: 'عرض وإدارة النقاط المكتسبة',
      status: 'active',
      icon: '⭐'
    },
    {
      path: '/account-recovery',
      title: 'استعادة الحساب',
      description: 'استعادة الحساب عند فقدان كلمة المرور',
      status: 'active',
      icon: '🔄'
    },
    {
      path: '/reset-password',
      title: 'إعادة تعيين كلمة المرور',
      description: 'تغيير كلمة المرور المفقودة',
      status: 'active',
      icon: '🔑'
    },
    {
      path: '/nehky_firstpage',
      title: 'صفحة نحكي الأولى',
      description: 'صفحة الترحيب والتعريف بالمنصة',
      status: 'development',
      icon: '🎉'
    },
    {
      path: '/nehky_firstpage_simple',
      title: 'صفحة نحكي البسيطة',
      description: 'نسخة مبسطة من صفحة الترحيب',
      status: 'development',
      icon: '🎈'
    },
    {
      path: '/site-index',
      title: 'فهرس الموقع',
      description: 'دليل شامل لجميع صفحات الموقع',
      status: 'development',
      icon: '📋'
    }
  ];

  // صفحات الإدارة
  const adminPages: PageInfo[] = [
    {
      path: '/admin',
      title: 'لوحة تحكم الإدارة',
      description: 'لوحة التحكم الرئيسية للمشرفين',
      status: 'active',
      icon: '👨‍💼'
    },
    {
      path: '/admin/user-management',
      title: 'إدارة المستخدمين',
      description: 'عرض وإدارة جميع المستخدمين والحسابات',
      status: 'active',
      icon: '👥'
    },
    {
      path: '/admin/keyword-management',
      title: 'إدارة الكلمات المفتاحية',
      description: 'إدارة ومراقبة الكلمات الترندينغ',
      status: 'active',
      icon: '🔤'
    },
    {
      path: '/trend-monitoring',
      title: 'مراقبة الترندات',
      description: 'مراقبة وتحليل الترندات الحالية',
      status: 'active',
      icon: '📈'
    }
  ];

  // صفحات الاختبار والتطوير
  const testPages: PageInfo[] = [
    {
      path: '/test-email-generation',
      title: 'اختبار توليد البريد الإلكتروني',
      description: 'اختبار نظام توليد البريد الإلكتروني التلقائي',
      status: 'test',
      icon: '📧'
    },
    {
      path: '/test-auth',
      title: 'اختبار التحقق',
      description: 'اختبار نظام التحقق وتسجيل الدخول',
      status: 'test',
      icon: '🔐'
    },
    {
      path: '/test-registration',
      title: 'اختبار التسجيل',
      description: 'اختبار عملية إنشاء الحسابات الجديدة',
      status: 'test',
      icon: '📝'
    },
    {
      path: '/test-account-recovery',
      title: 'اختبار استعادة الحساب',
      description: 'اختبار نظام استعادة الحسابات المفقودة',
      status: 'test',
      icon: '🔄'
    },
    {
      path: '/test-recovery-email',
      title: 'اختبار بريد الاستعادة',
      description: 'اختبار إرسال رسائل استعادة الحساب',
      status: 'test',
      icon: '📬'
    },
    {
      path: '/test-notifications',
      title: 'اختبار الإشعارات',
      description: 'اختبار نظام الإشعارات والتنبيهات',
      status: 'test',
      icon: '🔔'
    },
    {
      path: '/test-points-system',
      title: 'اختبار نظام النقاط',
      description: 'اختبار عمل نظام النقاط والمكافآت',
      status: 'test',
      icon: '⭐'
    },
    {
      path: '/test-posts-api',
      title: 'اختبار API المنشورات',
      description: 'اختبار واجهات برمجة تطبيقات المنشورات',
      status: 'test',
      icon: '📄'
    },
    {
      path: '/test-trending-keywords',
      title: 'اختبار الكلمات الترندينغ',
      description: 'اختبار نظام رصد الكلمات الشائعة',
      status: 'test',
      icon: '📊'
    },
    {
      path: '/test-keyword-occurrences',
      title: 'اختبار تكرار الكلمات',
      description: 'اختبار نظام تتبع تكرار الكلمات',
      status: 'test',
      icon: '📈'
    },
    {
      path: '/test-auto-keyword-extraction',
      title: 'اختبار استخراج الكلمات',
      description: 'اختبار نظام استخراج الكلمات التلقائي',
      status: 'test',
      icon: '🔍'
    },
    {
      path: '/components-showcase',
      title: 'معرض المكونات',
      description: 'عرض جميع مكونات الواجهة المتاحة',
      status: 'test',
      icon: '🎨'
    },
    {
      path: '/input-showcase',
      title: 'معرض حقول الإدخال',
      description: 'عرض أنواع حقول الإدخال المختلفة',
      status: 'test',
      icon: '⌨️'
    }
  ];

  const getFilteredPages = () => {
    switch (selectedCategory) {
      case 'user': return userPages;
      case 'admin': return adminPages;
      case 'test': return testPages;
      default: return [...userPages, ...adminPages, ...testPages];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'test': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'development': return 'قيد التطوير';
      case 'test': return 'اختبار';
      default: return 'غير معروف';
    }
  };

  const getCategoryStats = () => {
    return {
      user: userPages.length,
      admin: adminPages.length,
      test: testPages.length,
      total: userPages.length + adminPages.length + testPages.length,
      active: [...userPages, ...adminPages, ...testPages].filter(p => p.status === 'active').length
    };
  };

  const stats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">📋 خريطة موقع منصة نحكي</h1>
            <p className="text-blue-100">دليل شامل لجميع صفحات المنصة</p>
          </div>

          {/* Stats */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">إجمالي الصفحات</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{stats.user}</div>
                <div className="text-sm text-gray-600">صفحات المستخدمين</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">{stats.admin}</div>
                <div className="text-sm text-gray-600">صفحات الإدارة</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">{stats.test}</div>
                <div className="text-sm text-gray-600">صفحات الاختبار</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">صفحات نشطة</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🌐 جميع الصفحات ({stats.total})
              </button>
              <button
                onClick={() => setSelectedCategory('user')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedCategory === 'user'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👤 المستخدمين ({stats.user})
              </button>
              <button
                onClick={() => setSelectedCategory('admin')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedCategory === 'admin'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👨‍💼 الإدارة ({stats.admin})
              </button>
              <button
                onClick={() => setSelectedCategory('test')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedCategory === 'test'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🧪 الاختبار ({stats.test})
              </button>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredPages().map((page) => (
            <Link key={page.path} href={page.path}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{page.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {getStatusText(page.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {page.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {page.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {page.path}
                    </code>
                    <div className="text-blue-500 hover:text-blue-700">
                      ← زيارة
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Info */}
        {selectedCategory !== 'all' && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategory === 'user' && '👤 صفحات المستخدمين'}
              {selectedCategory === 'admin' && '👨‍💼 صفحات الإدارة'}
              {selectedCategory === 'test' && '🧪 صفحات الاختبار'}
            </h2>
            <div className="text-gray-600">
              {selectedCategory === 'user' && (
                <p>
                  هذه الصفحات مخصصة للمستخدمين العاديين في المنصة. تشمل الصفحة الرئيسية، 
                  الملف الشخصي، التغذية، الرسائل، والإشعارات. جميع هذه الصفحات تتطلب 
                  تسجيل دخول باستثناء الصفحة الرئيسية وصفحة التسجيل.
                </p>
              )}
              {selectedCategory === 'admin' && (
                <p>
                  صفحات مخصصة للمشرفين والإدارة فقط. تتطلب صلاحيات خاصة للوصول إليها.
                  تشمل إدارة المستخدمين، مراقبة الترندات، وإدارة الكلمات المفتاحية.
                  هذه الصفحات محمية بنظام أذونات متقدم.
                </p>
              )}
              {selectedCategory === 'test' && (
                <p>
                  صفحات مخصصة لاختبار وتطوير ميزات المنصة. تُستخدم للتحقق من عمل 
                  الأنظمة المختلفة مثل التسجيل، الإشعارات، النقاط، والـ APIs. 
                  هذه الصفحات مفيدة للمطورين والمختبرين.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
