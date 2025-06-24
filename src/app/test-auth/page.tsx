// صفحة اختبار بسيطة للتحقق من الانتقال
'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        
        {/* أزرار التبديل */}
        <div className="flex mb-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => {
              console.log('تبديل إلى تسجيل الدخول');
              setCurrentView('login');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              currentView === 'login' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => {
              console.log('تبديل إلى إنشاء حساب');
              setCurrentView('register');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              currentView === 'register' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {/* المحتوى */}
        <div className="text-center">
          {currentView === 'login' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-600">تسجيل الدخول</h2>
              <p className="text-gray-600">أدخل بياناتك للدخول</p>
              <input 
                type="text" 
                placeholder="اسم المستخدم" 
                className="w-full p-3 border rounded-lg"
              />
              <input 
                type="password" 
                placeholder="كلمة المرور" 
                className="w-full p-3 border rounded-lg"
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
                دخول
              </button>
            </div>
          )}

          {currentView === 'register' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">🎉 إنشاء حساب جديد</h2>
              <p className="text-gray-600">انضم إلى مجتمعنا المميز!</p>
              <input 
                type="text" 
                placeholder="الاسم الكامل" 
                className="w-full p-3 border rounded-lg"
              />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full p-3 border rounded-lg"
              />
              <input 
                type="password" 
                placeholder="كلمة المرور" 
                className="w-full p-3 border rounded-lg"
              />
              <button className="w-full bg-green-500 text-white py-3 rounded-lg">
                إنشاء الحساب
              </button>
            </div>
          )}
        </div>

        {/* معلومات تشخيص */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm">
          <p><strong>الحالة الحالية:</strong> {currentView}</p>
          <p><strong>التاريخ:</strong> {new Date().toLocaleTimeString('ar-SA')}</p>
        </div>
      </div>
    </div>
  );
}
