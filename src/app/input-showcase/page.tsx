// صفحة تجريبية لعرض صناديق الإدخال مع الشعار
'use client';
import React, { useState } from 'react';
import { 
  InputWithLogo, 
  TextareaWithLogo, 
  Card, 
  Button 
} from '@/components';

export default function InputShowcasePage() {
  const [demoText, setDemoText] = useState('');
  const [demoTextarea, setDemoTextarea] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
          معرض صناديق الإدخال مع الشعار 🎨
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* صناديق الإدخال العادية */}
          <Card title="صناديق الإدخال" gradient="blue" className="animate-slideInRight">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  نص عادي (الشعار على اليمين)
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="اكتب نصاً هنا..."
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  بريد إلكتروني (الشعار على اليسار)
                </label>
                <InputWithLogo
                  type="email"
                  placeholder="your@email.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  showLogo={true}
                  logoPosition="left"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  كلمة مرور
                </label>
                <InputWithLogo
                  type="password"
                  placeholder="كلمة المرور..."
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  بدون شعار
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="صندوق بدون شعار..."
                  showLogo={false}
                />
              </div>
            </div>
          </Card>

          {/* مناطق النص */}
          <Card title="مناطق النص" gradient="green" className="animate-fadeInUp">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  نص طويل (الشعار في أعلى اليمين)
                </label>
                <TextareaWithLogo
                  placeholder="اكتب نصاً طويلاً هنا..."
                  value={demoTextarea}
                  onChange={(e) => setDemoTextarea(e.target.value)}
                  rows={4}
                  showLogo={true}
                  logoPosition="top-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  نص طويل (الشعار في أسفل اليمين)
                </label>
                <TextareaWithLogo
                  placeholder="اكتب رسالة..."
                  rows={3}
                  showLogo={true}
                  logoPosition="bottom-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  نص طويل (الشعار في أعلى اليسار)
                </label>
                <TextareaWithLogo
                  placeholder="تعليق أو ملاحظة..."
                  rows={3}
                  showLogo={true}
                  logoPosition="top-left"
                />
              </div>
            </div>
          </Card>

          {/* أمثلة تطبيقية */}
          <Card title="أمثلة تطبيقية" gradient="purple" className="animate-slideInRight">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  البحث في المنصة
                </label>
                <InputWithLogo
                  type="search"
                  placeholder="ابحث في نحكي..."
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  رقم الهاتف
                </label>
                <InputWithLogo
                  type="tel"
                  placeholder="+966 5X XXX XXXX"
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  موقع الويب
                </label>
                <InputWithLogo
                  type="url"
                  placeholder="https://nehky.com"
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <Button variant="primary" className="w-full">
                حفظ البيانات
              </Button>
            </form>
          </Card>

          {/* حالات خاصة */}
          <Card title="حالات خاصة" gradient="pink" className="animate-fadeInUp">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  حقل معطل
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="هذا الحقل معطل"
                  disabled={true}
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  حقل مطلوب
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="هذا الحقل مطلوب *"
                  required={true}
                  showLogo={true}
                  logoPosition="right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  نص كبير مع شعار متحرك
                </label>
                <TextareaWithLogo
                  placeholder="نص مع تأثيرات..."
                  rows={6}
                  showLogo={true}
                  logoPosition="bottom-right"
                  className="hover:shadow-lg transition-shadow"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* معلومات إضافية */}
        <Card title="ملاحظات التطوير" gradient="blue" className="mt-8 animate-fadeInUp">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>جميع صناديق الإدخال تدعم RTL والعربية</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>الشعار يمكن وضعه في مواضع مختلفة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>تأثيرات hover وfocus ناعمة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>دعم جميع أنواع الإدخال (text, email, password, url, tel, search)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>إمكانية إخفاء الشعار حسب الحاجة</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
