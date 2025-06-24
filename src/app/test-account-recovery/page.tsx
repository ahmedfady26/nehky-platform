'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function TestAccountRecoveryPage() {
  const [selectedUser, setSelectedUser] = useState<string>('')

  // بيانات المستخدمين التجريبيين
  const testUsers = [
    {
      id: 'user1',
      username: 'ahmed_test',
      fullName: 'أحمد محمد',
      email: 'ahmed@test.com',
      recoveryEmail: 'ahmed.recovery@gmail.com',
      phone: '+966501234567'
    },
    {
      id: 'user2',
      username: 'sara_test',
      fullName: 'سارة أحمد',
      email: 'sara@test.com',
      recoveryEmail: 'sara.backup@outlook.com',
      phone: '+966507654321'
    },
    {
      id: 'user3',
      username: 'ali_test',
      fullName: 'علي السعدي',
      email: 'ali@test.com',
      recoveryEmail: null,
      phone: '+966509876543'
    }
  ]

  const handleTestRecovery = (email: string) => {
    // فتح صفحة الاسترداد مع البريد المحدد
    window.open(`/account-recovery?email=${encodeURIComponent(email)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 اختبار نظام استرداد الحساب
          </h1>
          <p className="text-gray-600">
            جرب استرداد الحساب باستخدام البيانات التجريبية
          </p>
        </div>

        {/* المستخدمون التجريبيون */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testUsers.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {user.fullName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  @{user.username}
                </p>
                <p className="text-sm text-blue-600 mb-1">
                  {user.email}
                </p>
                {user.recoveryEmail && (
                  <p className="text-sm text-green-600 mb-1">
                    📧 {user.recoveryEmail}
                  </p>
                )}
                <p className="text-sm text-purple-600 mb-4">
                  📱 {user.phone}
                </p>
                
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleTestRecovery(user.email)}
                  >
                    اختبار الاسترداد
                  </Button>
                  {user.recoveryEmail && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleTestRecovery(user.recoveryEmail!)}
                    >
                      استرداد بديل
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* تعليمات الاستخدام */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">
            📋 تعليمات الاختبار
          </h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>اختر مستخدم للاختبار من الكروت أعلاه</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>اضغط على "اختبار الاسترداد" لفتح صفحة الاسترداد</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>أدخل البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>سيتم إرسال رمز الاسترداد (مُحاكي في البيئة التجريبية)</span>
            </div>
          </div>
        </Card>

        {/* روابط سريعة */}
        <div className="mt-8 text-center">
          <div className="space-x-4 space-x-reverse">
            <a
              href="/account-recovery"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              صفحة الاسترداد الرئيسية →
            </a>
            <a
              href="/auth"
              className="text-green-600 hover:text-green-800 font-semibold underline"
            >
              صفحة تسجيل الدخول →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}