'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  userId?: string;
  username?: string;
  user?: {
    email: string;
    [key: string]: any;
  };
}

interface TestError {
  message: string;
  [key: string]: any;
}

export default function TestEmailGenerationPage() {
  const [testData, setTestData] = useState(() => {
    const timestamp = Date.now();
    return {
      username: `web_test_${timestamp}`,
      firstName: "أحمد",
      secondName: "محمد",
      thirdName: "سالم", 
      lastName: "الأحمد",
      phone: `+966${Math.floor(Math.random() * 1000000000)}`,
      password: "test123456",
      birthDate: "1990-01-01",
      gender: "male"
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<TestError | null>(null);

  const generateTestData = () => {
    const timestamp = Date.now();
    setTestData({
      username: `web_test_${timestamp}`,
      firstName: "أحمد",
      secondName: "محمد",
      thirdName: "سالم", 
      lastName: "الأحمد",
      phone: `+966${Math.floor(Math.random() * 1000000000)}`,
      password: "test123456",
      birthDate: "1990-01-01",
      gender: "male"
    });
    setResult(null);
    setError(null);
  };

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError({ message: 'انتهت المهلة الزمنية للطلب' });
      } else {
        setError({ message: `خطأ في الاتصال: ${err instanceof Error ? err.message : 'خطأ غير معروف'}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const expectedEmail = `${testData.username}@nehky.com`;
  const emailGenerated = result?.user?.email === expectedEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🧪 اختبار توليد البريد الإلكتروني</h1>
          <p className="text-blue-100">منصة نحكي - اختبار التسجيل التلقائي</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Test Purpose */}
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="text-xl ml-2">🎯</span>
              هدف الاختبار
            </h3>
            <p className="text-gray-700">
              التحقق من أن المنصة تولد بريد إلكتروني تلقائياً بصيغة <code className="bg-gray-200 px-2 py-1 rounded">username@nehky.com</code> عند عدم إدخال بريد إلكتروني أثناء التسجيل.
            </p>
          </div>

          {/* Test Data */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-xl ml-2">📋</span>
              بيانات الاختبار
            </h3>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4 font-mono text-sm space-y-2">
              <div><strong>اسم المستخدم:</strong> {testData.username}</div>
              <div><strong>الاسم:</strong> {testData.firstName} {testData.secondName} {testData.thirdName} {testData.lastName}</div>
              <div><strong>رقم الهاتف:</strong> {testData.phone}</div>
              <div><strong>كلمة المرور:</strong> {testData.password}</div>
              <div><strong>تاريخ الميلاد:</strong> {testData.birthDate}</div>
              <div><strong>النوع:</strong> {testData.gender}</div>
              <div><strong>البريد الإلكتروني:</strong> <span className="text-red-600">غير مرسل (سيتم توليده تلقائياً)</span></div>
              <div><strong>البريد المتوقع:</strong> <span className="text-green-600">{expectedEmail}</span></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateTestData}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                🔄 تحديث البيانات
              </button>
              
              <button
                onClick={runTest}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? '⏳ جاري الاختبار...' : '🚀 تشغيل الاختبار'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-xl ml-2">📊</span>
              نتائج الاختبار
            </h3>

            {!result && !error && !isLoading && (
              <p className="text-gray-600">اضغط على "تشغيل الاختبار" لبدء الاختبار</p>
            )}

            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-xl ml-2">⏳</span>
                  جاري تشغيل الاختبار...
                </h4>
                <p>إرسال طلب التسجيل إلى الخادم...</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-800 flex items-center">
                  <span className="text-xl ml-2">✅</span>
                  نجح إنشاء الحساب!
                </h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      تم التسجيل بنجاح
                    </span>
                  </div>
                  
                  <p><strong>معرف المستخدم:</strong> {result.userId || 'غير متوفر'}</p>
                  <p><strong>اسم المستخدم:</strong> {result.username || testData.username}</p>
                  <p><strong>البريد الإلكتروني المتوقع:</strong> {expectedEmail}</p>
                  
                  {emailGenerated ? (
                    <div className="flex items-center">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        🎉 تم توليد البريد الإلكتروني تلقائياً بنجاح!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ❌ البريد الإلكتروني لم يُولد بالصيغة المتوقعة
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <strong className="text-green-300">استجابة الخادم:</strong><br/>
                  {JSON.stringify(result, null, 2)}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-red-800 flex items-center">
                  <span className="text-xl ml-2">❌</span>
                  {error.message?.includes('انتهت المهلة') ? 'انتهت المهلة الزمنية' : 'فشل في إنشاء الحساب'}
                </h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {error.message?.includes('انتهت المهلة') ? 'Timeout' : 'خطأ في التسجيل'}
                    </span>
                  </div>
                  
                  <p><strong>رسالة الخطأ:</strong> {error.message || 'خطأ غير معروف'}</p>
                  
                  {error.message && (error.message.includes('اسم المستخدم') || error.message.includes('رقم الهاتف')) && (
                    <p className="text-gray-600">
                      <span className="text-xl ml-1">💡</span>
                      <em>هذا طبيعي إذا كان الاختبار تم من قبل</em>
                    </p>
                  )}
                </div>

                <div className="bg-gray-800 text-red-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <strong className="text-red-300">استجابة الخادم:</strong><br/>
                  {JSON.stringify(error, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
