// اختبار شامل لمعالجة إيميل الاسترداد
'use client';

import { useState } from 'react';

export default function RecoveryEmailTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, success: boolean, details: any) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      details,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // اختبار 1: استرداد حساب بدون إيميل استرداد
    try {
      const response1 = await fetch('/api/auth/account-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+966123456789' })
      });
      const data1 = await response1.json();
      
      addResult(
        'استرداد حساب بدون إيميل استرداد',
        response1.ok,
        {
          status: response1.status,
          hasRecoveryEmail: data1.data?.hasRecoveryEmail,
          message: data1.message,
          errors: data1.errors || 'لا توجد أخطاء'
        }
      );
    } catch (error) {
      addResult('استرداد حساب بدون إيميل استرداد', false, { error: String(error) });
    }

    // اختبار 2: تسجيل بدون إيميل استرداد
    try {
      const response2 = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser2',
          firstName: 'أحمد',
          lastName: 'محمد',
          email: 'test2@example.com',
          phone: '+966987654321',
          password: 'Password123',
          birthDate: '1990-01-01',
          gender: 'MALE',
          // recoveryEmail غير موجود
        })
      });
      const data2 = await response2.json();
      
      addResult(
        'تسجيل بدون إيميل استرداد',
        response2.ok,
        {
          status: response2.status,
          message: data2.message,
          userId: data2.user?.id || 'غير متوفر'
        }
      );
    } catch (error) {
      addResult('تسجيل بدون إيميل استرداد', false, { error: String(error) });
    }

    // اختبار 3: تسجيل بإيميل استرداد فارغ
    try {
      const response3 = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser3',
          firstName: 'سارة',
          lastName: 'أحمد',
          email: 'test3@example.com',
          phone: '+966111222333',
          password: 'Password123',
          birthDate: '1992-05-15',
          gender: 'FEMALE',
          recoveryEmail: '' // فارغ
        })
      });
      const data3 = await response3.json();
      
      addResult(
        'تسجيل بإيميل استرداد فارغ',
        response3.ok,
        {
          status: response3.status,
          message: data3.message,
          userId: data3.user?.id || 'غير متوفر'
        }
      );
    } catch (error) {
      addResult('تسجيل بإيميل استرداد فارغ', false, { error: String(error) });
    }

    // اختبار 4: تسجيل بإيميل استرداد غير صحيح
    try {
      const response4 = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser4',
          firstName: 'محمد',
          lastName: 'علي',
          email: 'test4@example.com',
          phone: '+966444555666',
          password: 'Password123',
          birthDate: '1988-12-10',
          gender: 'MALE',
          recoveryEmail: 'invalid-email' // غير صحيح
        })
      });
      const data4 = await response4.json();
      
      addResult(
        'تسجيل بإيميل استرداد غير صحيح',
        !response4.ok, // نتوقع فشل
        {
          status: response4.status,
          message: data4.message,
          expectedFailure: true
        }
      );
    } catch (error) {
      addResult('تسجيل بإيميل استرداد غير صحيح', false, { error: String(error) });
    }

    // اختبار 5: تسجيل بإيميل استرداد صحيح
    try {
      const response5 = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser5',
          firstName: 'فاطمة',
          lastName: 'حسن',
          email: 'test5@example.com',
          phone: '+966777888999',
          password: 'Password123',
          birthDate: '1995-03-20',
          gender: 'FEMALE',
          recoveryEmail: 'recovery5@example.com' // صحيح
        })
      });
      const data5 = await response5.json();
      
      addResult(
        'تسجيل بإيميل استرداد صحيح',
        response5.ok,
        {
          status: response5.status,
          message: data5.message,
          userId: data5.user?.id || 'غير متوفر'
        }
      );
    } catch (error) {
      addResult('تسجيل بإيميل استرداد صحيح', false, { error: String(error) });
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            🧪 اختبار معالجة إيميل الاسترداد
          </h1>
          
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {isRunning ? 'جاري التشغيل...' : 'تشغيل جميع الاختبارات'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              مسح النتائج
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">📊 نتائج الاختبارات:</h2>
              
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-r-4 ${
                    result.success 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <h3 className="font-bold">{result.test}</h3>
                    <span className="text-sm text-gray-500">({result.timestamp})</span>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
              
              {/* إحصائيات */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">📈 الإحصائيات:</h3>
                <p>
                  <strong>إجمالي الاختبارات:</strong> {testResults.length}
                </p>
                <p>
                  <strong>نجح:</strong> {testResults.filter(r => r.success).length}
                </p>
                <p>
                  <strong>فشل:</strong> {testResults.filter(r => !r.success).length}
                </p>
                <p>
                  <strong>معدل النجاح:</strong> {
                    testResults.length > 0 
                      ? ((testResults.filter(r => r.success).length / testResults.length) * 100).toFixed(1)
                      : 0
                  }%
                </p>
              </div>
            </div>
          )}
          
          {isRunning && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تشغيل الاختبارات...</p>
            </div>
          )}
          
          {testResults.length === 0 && !isRunning && (
            <div className="text-center text-gray-500">
              <p>اضغط على "تشغيل جميع الاختبارات" لبدء الفحص</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
