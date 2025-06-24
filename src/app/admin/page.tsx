'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AdminModule {
  id: string
  title: string
  description: string
  icon: string
  path: string
  status: 'active' | 'development' | 'planned'
  features: string[]
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const adminModules: AdminModule[] = [
    {
      id: 'keyword-management',
      title: 'إدارة تكرارات الكلمات',
      description: 'مراقبة وتحليل جميع الكلمات والهاشتاج والاتجاهات في المنصة',
      icon: '🔤',
      path: '/admin/keyword-management',
      status: 'active',
      features: [
        'تتبع تكرارات الكلمات في الوقت الفعلي',
        'تحليل المشاعر والفئات',
        'إحصائيات متقدمة للاتجاهات',
        'فلاتر بحث شاملة',
        'مراقبة نشاط المستخدمين'
      ]
    },
    {
      id: 'user-management',
      title: 'إدارة المستخدمين',
      description: 'إدارة حسابات المستخدمين والأدوار والصلاحيات',
      icon: '👥',
      path: '/admin/user-management',
      status: 'development',
      features: [
        'عرض وتعديل بيانات المستخدمين',
        'إدارة الأدوار والصلاحيات',
        'تفعيل/إلغاء تفعيل الحسابات',
        'إحصائيات النشاط',
        'نظام التحقق'
      ]
    },
    {
      id: 'content-moderation',
      title: 'إدارة المحتوى',
      description: 'مراجعة وإدارة المنشورات والتعليقات والمحتوى المبلغ عنه',
      icon: '📝',
      path: '/admin/content-moderation',
      status: 'development',
      features: [
        'مراجعة المنشورات المبلغ عنها',
        'إدارة التعليقات',
        'نظام التصفية التلقائي',
        'إحصائيات المحتوى',
        'أدوات الإشراف'
      ]
    },
    {
      id: 'points-system',
      title: 'نظام النقاط',
      description: 'مراقبة وإدارة نظام النقاط والمكافآت',
      icon: '⭐',
      path: '/admin/points-system',
      status: 'development',
      features: [
        'تتبع رصيد النقاط',
        'إدارة المكافآت',
        'إحصائيات الأنشطة',
        'نظام الترشيحات',
        'كبار المتابعين'
      ]
    },
    {
      id: 'analytics',
      title: 'التحليلات والإحصائيات',
      description: 'لوحة تحكم شاملة للإحصائيات وتحليل البيانات',
      icon: '📊',
      path: '/admin/analytics',
      status: 'planned',
      features: [
        'إحصائيات شاملة للمنصة',
        'تحليل سلوك المستخدمين',
        'رسوم بيانية تفاعلية',
        'تقارير دورية',
        'متابعة الأداء'
      ]
    },
    {
      id: 'notifications',
      title: 'إدارة الإشعارات',
      description: 'إدارة وإرسال الإشعارات والرسائل الجماعية',
      icon: '🔔',
      path: '/admin/notifications',
      status: 'planned',
      features: [
        'إرسال إشعارات جماعية',
        'إدارة قوالب الرسائل',
        'جدولة الإشعارات',
        'إحصائيات التفاعل',
        'نظام التذكيرات'
      ]
    },
    {
      id: 'settings',
      title: 'إعدادات النظام',
      description: 'إدارة إعدادات المنصة والتكوين العام',
      icon: '⚙️',
      path: '/admin/settings',
      status: 'planned',
      features: [
        'إعدادات عامة للمنصة',
        'إدارة الصلاحيات',
        'تكوين قواعد البيانات',
        'إعدادات الأمان',
        'صيانة النظام'
      ]
    }
  ]

  const filteredModules = adminModules.filter(module =>
    module.title.includes(searchTerm) ||
    module.description.includes(searchTerm) ||
    module.features.some(feature => feature.includes(searchTerm))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">🟢 نشط</span>
      case 'development':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">🟡 قيد التطوير</span>
      case 'planned':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">⚪ مخطط</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* شريط التنقل السريع */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🧭</span>
                <div>
                  <h3 className="font-semibold text-gray-800">التنقل السريع</h3>
                  <p className="text-sm text-gray-600">الوصول السريع لأدوات الإدارة</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/test-keyword-occurrences"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  🧪 صفحات الاختبار
                </Link>
                <Link
                  href="/"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  🏠 الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            🛡️ لوحة إدارة منصة نحكي
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            مركز التحكم الشامل لإدارة ومراقبة جميع جوانب المنصة
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الوحدات النشطة</p>
                <p className="text-3xl font-bold text-green-600">
                  {adminModules.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد التطوير</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {adminModules.filter(m => m.status === 'development').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">🟡</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخططة</p>
                <p className="text-3xl font-bold text-gray-600">
                  {adminModules.filter(m => m.status === 'planned').length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <span className="text-2xl">⚪</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الوحدات</p>
                <p className="text-3xl font-bold text-blue-600">{adminModules.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ابحث في وحدات الإدارة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              🔍 بحث
            </button>
          </div>
        </div>

        {/* قائمة الوحدات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                
                {/* رأس الوحدة */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg">
                      <span className="text-2xl">{module.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(module.status)}
                </div>

                {/* قائمة الميزات */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">الميزات الرئيسية:</h4>
                  <ul className="space-y-1">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-blue-500">•</span>
                        {feature}
                      </li>
                    ))}
                    {module.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{module.features.length - 3} ميزة أخرى...
                      </li>
                    )}
                  </ul>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-3">
                  {module.status === 'active' ? (
                    <Link
                      href={module.path}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                    >
                      🚀 فتح الوحدة
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 text-center py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                    >
                      {module.status === 'development' ? '🔧 قيد التطوير' : '📋 مخطط'}
                    </button>
                  )}
                  
                  <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    ℹ️ تفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة عدم وجود نتائج */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">لم يتم العثور على وحدات تطابق بحثك "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                مسح البحث
              </button>
            </div>
          </div>
        )}

        {/* تذييل مع معلومات إضافية */}
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 ميزات قادمة</h3>
            <p className="text-gray-600 mb-4">
              نعمل على تطوير المزيد من أدوات الإدارة المتقدمة لتحسين تجربة إدارة المنصة
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-sm text-gray-500">📈 تحليلات متقدمة</div>
              <div className="text-sm text-gray-500">🤖 أتمتة ذكية</div>
              <div className="text-sm text-gray-500">🔒 أمان محسن</div>
              <div className="text-sm text-gray-500">📱 تطبيق إدارة</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
