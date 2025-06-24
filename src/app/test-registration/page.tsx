"use client";

import React, { useState } from 'react';
import { Card, Button } from '@/components';

export default function TestRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testSimpleRegistration = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const testData = {
        username: `simpletest_${Date.now()}`,
        firstName: 'أحمد',
        lastName: 'محمد',
        password: 'Test123'
      };

      console.log('Sending simple registration data:', testData);

      const response = await fetch('/api/auth/register-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Simple response status:', response.status);
      
      const data = await response.json();
      console.log('Simple response data:', data);

      setResult({
        success: response.ok,
        data: data,
        status: response.status,
        type: 'simple'
      });
    } catch (error: any) {
      console.error('Simple registration error:', error);
      setError(`خطأ في التسجيل المبسط: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const testData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        phone: `+966501234567`,
        password: 'TestPass123',
        firstName: 'أحمد',
        lastName: 'محمد',
        birthDate: '1990-01-01',
        gender: 'MALE',
        fullName: 'أحمد محمد'
      };

      console.log('Sending registration data:', testData);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setResult({
          success: true,
          data: data,
          status: response.status
        });
      } else {
        setResult({
          success: false,
          error: data.message || 'خطأ غير معروف',
          status: response.status
        });
      }
    } catch (error: any) {
      console.error('Network error:', error);
      setError(`خطأ في الشبكة: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/test-db', {
        method: 'GET',
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        data: data,
        status: response.status
      });
    } catch (error: any) {
      setError(`خطأ في اختبار قاعدة البيانات: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
          🧪 اختبار عملية التسجيل
        </h1>

        <Card title="اختبار التسجيل" gradient="blue" className="mb-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              هذه الصفحة لاختبار عملية التسجيل والتأكد من عمل API وقاعدة البيانات.
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <Button
                variant="success"
                onClick={testSimpleRegistration}
                loading={isLoading}
                disabled={isLoading}
              >
                🧪 اختبار تسجيل مبسط
              </Button>
              
              <Button
                variant="primary"
                onClick={testRegistration}
                loading={isLoading}
                disabled={isLoading}
              >
                🧪 اختبار التسجيل الكامل
              </Button>
              
              <Button
                variant="secondary"
                onClick={testDatabaseConnection}
                loading={isLoading}
                disabled={isLoading}
              >
                🗄️ اختبار قاعدة البيانات
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <Card title="❌ خطأ" gradient="pink" className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          </Card>
        )}

        {result && (
          <Card title={result.success ? "✅ نتيجة ناجحة" : "❌ نتيجة فاشلة"} gradient={result.success ? "green" : "pink"} className="mb-6">
            <div className={`${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border p-4 rounded-lg`}>
              <div className="mb-2">
                <strong>كود الاستجابة:</strong> {result.status}
              </div>
              <div className="mb-2">
                <strong>النتيجة:</strong>
              </div>
              <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                {JSON.stringify(result.success ? result.data : result.error, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        <Card title="📋 معلومات التشخيص" gradient="purple">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
              <h4 className="font-bold mb-2">✅ ما تم فحصه:</h4>
              <ul className="text-sm space-y-1">
                <li>• الكود المصدري لصفحة التسجيل (/auth)</li>
                <li>• API route للتسجيل (/api/auth/register)</li>
                <li>• بنية قاعدة البيانات (Prisma Schema)</li>
                <li>• تزامن قاعدة البيانات مع Schema</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
              <h4 className="font-bold mb-2">🔍 المشاكل المحتملة:</h4>
              <ul className="text-sm space-y-1">
                <li>• قد يكون هناك خطأ في JavaScript لا يظهر للمستخدم</li>
                <li>• قد تكون هناك مشكلة في تمرير البيانات من النموذج</li>
                <li>• قد يكون هناك خطأ صامت في API route</li>
                <li>• قد تكون هناك مشكلة في اتصال قاعدة البيانات</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
              <h4 className="font-bold mb-2">🛠️ الخطوات التالية:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>اضغط على "اختبار التسجيل" لفحص API مباشرة</li>
                <li>افتح Developer Console (F12) في المتصفح</li>
                <li>انتقل إلى صفحة التسجيل وحاول إنشاء حساب</li>
                <li>راقب الأخطاء في Console و Network tab</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
