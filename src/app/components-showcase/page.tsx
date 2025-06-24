// صفحة تجريبية لعرض المكونات الجديدة
'use client';
import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  LoadingSpinner, 
  Badge, 
  Avatar, 
  Toast 
} from '@/components';

// بيانات وهمية للمستخدمين
const mockUsers = {
  ahmed: { id: '1', username: 'ahmed', fullName: 'أحمد علي', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  sara: { id: '2', username: 'sara', fullName: 'سارة محمد', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  mohammed: { id: '3', username: 'mohammed', fullName: 'محمد خالد', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  fatima: { id: '4', username: 'fatima', fullName: 'فاطمة حسن' }, // بدون صورة
  ali: { id: '5', username: 'ali', fullName: 'علي عبد الله', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  nour: { id: '6', username: 'nour', fullName: 'نور ياسر', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  khaled: { id: '7', username: 'khaled', fullName: 'خالد وليد' }, // بدون صورة
};

export default function ComponentsShowcase() {
  const [showToast, setShowToast] = useState(false);

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
          معرض مكونات واجهة المستخدم
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* بطاقة الأزرار */}
          <Card title="الأزرار" gradient="blue" className="animate-slideInRight">
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" size="sm">صغير</Button>
                <Button variant="primary" size="md">متوسط</Button>
                <Button variant="primary" size="lg">كبير</Button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">أساسي</Button>
                <Button variant="secondary">ثانوي</Button>
                <Button variant="success">نجاح</Button>
                <Button variant="danger">خطر</Button>
              </div>
              <div className="flex gap-3">
                <Button loading={true}>جاري التحميل</Button>
                <Button disabled={true}>معطل</Button>
              </div>
            </div>
          </Card>

          {/* بطاقة الشارات */}
          <Card title="الشارات" gradient="green" className="animate-fadeInUp">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge text="افتراضي" variant="default" />
                <Badge text="نجاح" variant="success" />
                <Badge text="تحذير" variant="warning" />
                <Badge text="خطر" variant="danger" />
                <Badge text="معلومات" variant="info" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge text="صغير" variant="info" size="sm" />
                <Badge text="متوسط" variant="info" size="md" />
                <Badge text="متحرك" variant="success" animated={true} />
              </div>
            </div>
          </Card>

          {/* بطاقة الصور الشخصية */}
          <Card title="الصور الشخصية" gradient="purple" className="animate-slideInRight">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <Avatar user={mockUsers.ahmed} size="sm" />
                <Avatar user={mockUsers.sara} size="md" />
                <Avatar user={mockUsers.mohammed} size="lg" />
                <Avatar user={mockUsers.fatima} size="xl" />
              </div>
              <div className="flex gap-4">
                <Avatar user={mockUsers.ali} status="online" />
                <Avatar user={mockUsers.nour} status="away" />
                <Avatar user={mockUsers.khaled} status="offline" />
              </div>
            </div>
          </Card>

          {/* بطاقة أدوات التحميل */}
          <Card title="أدوات التحميل" gradient="pink" className="animate-fadeInUp">
            <div className="space-y-6">
              <div className="flex gap-6 justify-center">
                <LoadingSpinner size="sm" color="blue" />
                <LoadingSpinner size="md" color="green" />
                <LoadingSpinner size="lg" color="blue" />
              </div>
              <LoadingSpinner text="يتم تحميل البيانات..." />
            </div>
          </Card>

          {/* بطاقة التفاعلات */}
          <Card title="التفاعلات" gradient="blue" className="animate-slideInRight">
            <div className="space-y-4">
              <Button 
                onClick={() => setShowToast(true)}
                variant="primary"
              >
                عرض إشعار
              </Button>
              <div className="hover-lift p-4 bg-white/50 rounded-lg cursor-pointer">
                <p>مرر فوقي لرؤية التأثير</p>
              </div>
              <div className="animate-pulse-soft p-4 bg-green-100 rounded-lg">
                <p>عنصر بتأثير نبضة ناعمة</p>
              </div>
            </div>
          </Card>

          {/* بطاقة التدرجات */}
          <Card title="التدرجات المخصصة" gradient="green" className="animate-fadeInUp">
            <div className="space-y-4">
              <div className="bg-nehky-primary p-4 rounded-lg text-white text-center">
                تدرج أساسي
              </div>
              <div className="bg-nehky-secondary p-4 rounded-lg text-white text-center">
                تدرج ثانوي
              </div>
              <div className="bg-nehky-accent p-4 rounded-lg text-white text-center">
                تدرج مميز
              </div>
              <div className="bg-nehky-warm p-4 rounded-lg text-white text-center">
                تدرج دافئ
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* إشعار منبثق */}
      {showToast && (
        <Toast 
          message="تم عرض الإشعار بنجاح!" 
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}
