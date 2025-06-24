'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function NehkyFirstPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* الهيدر البسيط */}
        <header className="text-center py-8">
          <Logo size="lg" showText={true} />
          <p className="text-gray-600 mt-2 text-lg">
            نحكي معاً قصص النجاح
          </p>
        </header>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* بطاقة بسيطة للمؤثرين */}
          <Card title="للمؤثرين" gradient="blue">
            <div className="space-y-3">
              <p className="text-gray-700 text-sm">
                شارك محتواك مع جمهور أوسع واكتسب متابعين جدد
              </p>
              <div className="text-center">
                <Link href="/auth">
                  <Button variant="primary" size="sm">
                    ابدأ الآن
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* بطاقة بسيطة للمتابعين */}
          <Card title="للمتابعين" gradient="green">
            <div className="space-y-3">
              <p className="text-gray-700 text-sm">
                تفاعل مع المؤثرين المفضلين لديك واحصل على نقاط
              </p>
              <div className="text-center">
                <Link href="/auth">
                  <Button variant="success" size="sm">
                    انضم إلينا
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* بطاقة بسيطة للمميزات */}
          <Card title="المميزات" gradient="purple">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                <span>نظام النقاط</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                <span>كبار المتابعين</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">•</span>
                <span>إشعارات لحظية</span>
              </div>
            </div>
          </Card>
        </div>

        {/* روابط سريعة */}
        <div className="text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/">
              <Button variant="secondary" size="sm">
                الصفحة الرئيسية
              </Button>
            </Link>
            <Link href="/components-showcase">
              <Button variant="secondary" size="sm">
                معرض المكونات
              </Button>
            </Link>
            <Link href="/test-notifications">
              <Button variant="secondary" size="sm">
                تجربة الإشعارات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
