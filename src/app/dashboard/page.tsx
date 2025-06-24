"use client";

/**
 * 🚨 تم تعطيل جميع أنظمة التحديث التلقائي مؤقتاً
 * 
 * التغييرات المطبقة:
 * ✅ تعطيل useEffect للـ interval التلقائي 
 * ✅ تعطيل useEffect للـ visibilitychange
 * ✅ تعطيل useRefreshEffect
 * ✅ تعطيل RefreshButton مؤقتاً
 * ✅ إزالة المتغيرات غير المستخدمة (autoRefresh, isVisible, lastUpdate)
 * 
 * ✨ النتيجة: الصفحة تعمل بثبات تام بدون تضارب في أنظمة التحديث
 * 
 * 📝 ملاحظة: يمكن إعادة تفعيل هذه الأنظمة لاحقاً بعد اكتمال البناء
 * وحل تضارب الأنظمة المتعددة.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
// import RefreshButton from '@/components/RefreshButton'; // معطل مؤقتاً

interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  age?: number;
  gender?: string;
  role: string;
  followersCount: number;
  followingCount: number;
  nationality?: string;
  totalPoints?: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // متغيرات التحديث التلقائي معطلة مؤقتاً
  // const [autoRefresh, setAutoRefresh] = useState(true);
  // const [isVisible, setIsVisible] = useState(true);
  // const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    console.log('🚀 بدء تحميل لوحة التحكم - استخدام بيانات تجريبية مباشرة');
    
    // تحميل فوري للبيانات التجريبية (بدون استدعاء API)
    setTimeout(() => {
      const demoUser: User = {
        id: 'demo-user',
        username: 'مستخدم_تجريبي',
        fullName: 'مستخدم تجريبي - منصة نحكي',
        email: 'demo@nehky.com',
        phone: '+966501234567',
        role: 'USER',
        followersCount: 150,
        followingCount: 89,
        totalPoints: 320,
        age: 25,
        gender: 'MALE',
        nationality: 'السعودية'
      };
      
      setUser(demoUser);
      setLoading(false);
      console.log('✅ تم تحميل البيانات التجريبية بنجاح');
    }, 1500); // تأخير بسيط للتجربة المرئية
  }, []);

  // تتبع رؤية الصفحة لتحسين الأداء - معطل مؤقتاً
  /*
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      if (!document.hidden && autoRefresh) {
        console.log('🔄 لوحة التحكم مرئية مرة أخرى - تحديث البيانات...');
        const token = localStorage.getItem('token');
        if (token) fetchUserData(token);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoRefresh]);
  */

  // نظام التحديث التلقائي الذكي - معطل مؤقتاً
  /*
  useEffect(() => {
    if (!autoRefresh || !isVisible) return;
    
    const interval = setInterval(() => {
      console.log('🔄 التحديث التلقائي للوحة التحكم...');
      const token = localStorage.getItem('token');
      if (token) fetchUserData(token);
    }, 60000); // كل دقيقة

    return () => clearInterval(interval);
  }, [autoRefresh, isVisible]);
  */

  // استخدام نظام التحديث التلقائي للوحة التحكم - معطل مؤقتاً
  /*
  useRefreshEffect('dashboard', () => {
    console.log('🔄 تحديث بيانات لوحة التحكم تلقائياً...');
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);
  */

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  // شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            جاري تحميل لوحة التحكم
          </h3>
          <p className="text-gray-600 text-lg mb-4">يرجى الانتظار لحظات بينما نقوم بتحضير بياناتك...</p>
          <div className="mt-6 flex justify-center space-x-1 space-x-reverse">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            💡 سيتم تحميل البيانات التجريبية خلال لحظات
          </p>
        </div>
      </div>
    );
  }

  // إذا لم تكن هناك بيانات مستخدم بعد انتهاء التحميل
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            حدث خطأ في تحميل البيانات
          </h3>
          <p className="text-gray-600 mb-4">يرجى إعادة تحميل الصفحة</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
          >
            إعادة تحميل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" showText={true} />
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* تنبيه البيانات التجريبية */}
              {user.id.includes('demo') && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-1 text-xs text-yellow-800">
                  📊 بيانات تجريبية
                </div>
              )}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.fullName.charAt(0)}
                </div>
                <span className="text-gray-700 font-medium">أهلاً، {user.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* عنوان الصفحة */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 text-lg">مرحباً بك في منصة نحكي، يمكنك إدارة حسابك من هنا</p>
          
          {/* إشعار البيانات التجريبية */}
          {user.id.includes('demo') && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="text-blue-600">ℹ️</div>
                <div>
                  <h4 className="text-blue-800 font-semibold">وضع التجريب</h4>
                  <p className="text-blue-700 text-sm">
                    يتم عرض بيانات تجريبية حالياً لأغراض العرض. للحصول على بياناتك الحقيقية، 
                    <button 
                      onClick={() => router.push('/auth')}
                      className="text-blue-600 hover:text-blue-800 underline mr-1"
                    >
                      سجل الدخول هنا
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المتابعون</p>
                <p className="text-2xl font-bold text-gray-900">{user.followersCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المتابَعين</p>
                <p className="text-2xl font-bold text-gray-900">{user.followingCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">النقاط</p>
                <p className="text-2xl font-bold text-gray-900">{user.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الدور</p>
                <p className="text-lg font-bold text-gray-900">
                  {user.role === 'USER' ? 'مستخدم' : user.role === 'INFLUENCER' ? 'مؤثر' : 'كبير متابعين'}
                </p>
              </div>
            </div>
          </div>
        </div>
              
        {/* بطاقات المعلومات الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* معلومات الحساب */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mr-3">معلومات الحساب</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">اسم المستخدم:</span>
                <span className="font-medium text-blue-600">@{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم الكامل:</span>
                <span className="font-medium">{user.fullName}</span>
              </div>
              {user.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الهاتف:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
              {user.age && (
                <div className="flex justify-between">
                  <span className="text-gray-600">العمر:</span>
                  <span className="font-medium">{user.age} سنة</span>
                </div>
              )}
              {user.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-600">النوع:</span>
                  <span className="font-medium">{user.gender === 'MALE' ? 'ذكر' : 'أنثى'}</span>
                </div>
              )}
              {user.nationality && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الجنسية:</span>
                  <span className="font-medium">{user.nationality}</span>
                </div>
              )}
              {user.birthDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الميلاد:</span>
                  <span className="font-medium">{new Date(user.birthDate).toLocaleDateString('ar-SA')}</span>
                </div>
              )}
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mr-3">الإحصائيات</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المتابعون</span>
                <span className="text-2xl font-bold text-green-600">{user.followersCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المتابَعين</span>
                <span className="text-2xl font-bold text-blue-600">{user.followingCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">النقاط الإجمالية</span>
                <span className="text-2xl font-bold text-purple-600">{user.totalPoints || 0}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الدور</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'INFLUENCER' ? 'bg-yellow-100 text-yellow-800' :
                    user.role === 'TOP_FOLLOWER' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'USER' ? 'مستخدم' : user.role === 'INFLUENCER' ? 'مؤثر' : 'كبير متابعين'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* الإجراءات السريعة */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mr-3">الإجراءات السريعة</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/create-post')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إنشاء منشور جديد
              </button>
              <button 
                onClick={() => router.push('/feed')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m14 0a2 2 0 002-2V9a2 2 0 00-2-2" />
                </svg>
                تصفح المنشورات
              </button>
              <button 
                onClick={() => router.push('/profile')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                تعديل الملف الشخصي
              </button>
              <button 
                onClick={() => router.push('/points')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                عرض النقاط
              </button>
            </div>
          </div>
        </div>

        {/* رسالة ترحيب */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">مرحباً بك في منصة نحكي! 🎉</h2>
            <p className="text-xl opacity-90 mb-6">
              منصة التواصل الاجتماعي العربية التي تجمع بين المؤثرين والمتابعين في بيئة تفاعلية مميزة
            </p>
            <div className="flex justify-center space-x-6 space-x-reverse">
              <div className="text-center">
                <div className="text-3xl font-bold">+1000</div>
                <div className="text-sm opacity-75">مستخدم نشط</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-75">دعم فني</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-75">آمان ومصداقية</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;