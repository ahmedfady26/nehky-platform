// صفحة الملف الشخصي المتقدمة
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

export default function ProfilePage() {
  const router = useRouter();
  
  // بيانات المستخدم الافتراضية - تم تحديثها لتتوافق مع مكون Avatar
  const user = {
    id: '1',
    fullName: "أحمد فادي",
    username: "ahmedfady",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    role: "مؤثر",
    followers: 12000,
    topFollowers: 3,
    posts: 45,
    points: 3200,
    bio: "مبرمج ومؤسس منصة نحكي. عاشق للتقنية والتواصل الاجتماعي."
  };

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">الملف الشخصي</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* بطاقة الملف الشخصي الرئيسية */}
          <Card className="lg:col-span-2 animate-slideInRight" gradient="blue">
            <div className="flex items-center gap-6 mb-6">
              <Avatar 
                user={user} 
                size="xl" 
                status="online"
                gradient={true}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                  <Badge text={user.role} variant="success" />
                </div>
                <p className="text-gray-600 mb-1">@{user.username}</p>
                <p className="text-sm text-gray-700">{user.bio}</p>
              </div>
            </div>
            
            {/* إحصائيات */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="hover-lift p-3 rounded-lg bg-white/50">
                <div className="font-bold text-2xl text-blue-600">{user.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-600">متابع</div>
              </div>
              <div className="hover-lift p-3 rounded-lg bg-white/50">
                <div className="font-bold text-2xl text-green-600">{user.topFollowers}</div>
                <div className="text-xs text-gray-600">كبار المتابعين</div>
              </div>
              <div className="hover-lift p-3 rounded-lg bg-white/50">
                <div className="font-bold text-2xl text-purple-600">{user.posts}</div>
                <div className="text-xs text-gray-600">منشور</div>
              </div>
              <div className="hover-lift p-3 rounded-lg bg-white/50">
                <div className="font-bold text-2xl text-orange-600">{user.points.toLocaleString()}</div>
                <div className="text-xs text-gray-600">نقاط</div>
              </div>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push('/profile/edit')}
              >
                تعديل الملف الشخصي
              </Button>
              <Button variant="secondary" size="lg">
                مشاهدة النشاط
              </Button>
            </div>
          </Card>
          
          {/* بطاقة الإنجازات */}
          <Card title="الإنجازات" gradient="green" className="animate-fadeInUp">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">🏆</div>
                <div>
                  <p className="font-medium">مؤثر معتمد</p>
                  <p className="text-xs text-gray-600">أكثر من 1000 متابع</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">📝</div>
                <div>
                  <p className="font-medium">كاتب نشط</p>
                  <p className="text-xs text-gray-600">أكثر من 40 منشور</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">⭐</div>
                <div>
                  <p className="font-medium">نجم المنصة</p>
                  <p className="text-xs text-gray-600">أكثر من 3000 نقطة</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
