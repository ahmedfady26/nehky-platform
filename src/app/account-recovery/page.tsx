'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import InputWithLogo from '@/components/InputWithLogo'
import Logo from '@/components/Logo'
import LoadingSpinner from '@/components/LoadingSpinner'
import Toast from '@/components/Toast'
import Link from 'next/link'

export default function AccountRecoveryPage() {
  const [step, setStep] = useState<'method' | 'sent'>('method')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({ show: false, message: '', type: 'success' })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000)
  }

  const handleSendRecovery = async () => {
    if (!identifier.trim()) {
      showToast(method === 'email' ? 'يرجى إدخال الإيميل' : 'يرجى إدخال رقم الهاتف', 'error')
      return
    }

    // التحقق من صحة البريد الإلكتروني
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(identifier)) {
        showToast('الإيميل غير صحيح', 'error')
        return
      }
    }

    // التحقق من صحة رقم الهاتف
    if (method === 'phone') {
      const phoneRegex = /^\+\d{1,4}\d{7,15}$/
      if (!phoneRegex.test(identifier)) {
        showToast('رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ويحتوي على مفتاح البلد والرقم', 'error')
        return
      }
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/recover-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, identifier })
      })

      const data = await response.json()

      if (data.success) {
        showToast(data.message, 'success')
        setStep('sent')
      } else {
        showToast(data.message, 'error')
      }
    } catch (error) {
      showToast('حدث خطأ في الاتصال', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMethod = () => {
    setStep('method')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">استعادة الحساب</h1>
          <p className="text-gray-600">استعد حسابك في منصة نحكي</p>
        </div>

        <Card className="p-8">
          {step === 'method' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">اختر طريقة الاسترداد</h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-4 space-x-reverse">
                    <button
                      onClick={() => setMethod('email')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        method === 'email'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📧</div>
                        <div className="font-medium">البريد الإلكتروني</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setMethod('phone')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        method === 'phone'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <div className="font-medium">رقم الهاتف</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <InputWithLogo
                  type={method === 'email' ? 'email' : 'tel'}
                  placeholder={
                    method === 'email'
                      ? 'أدخل الإيميل (username@nehky.com أو إيميل الاسترداد)'
                      : 'أدخل رقم الهاتف (مع مفتاح البلد)'
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full"
                />
                
                {method === 'email' && (
                  <p className="text-sm text-gray-500 mt-2">
                    يمكنك إدخال البريد الداخلي (username@nehky.com) أو إيميل الاسترداد إذا كان مسجلاً
                  </p>
                )}
              </div>

              <Button
                onClick={handleSendRecovery}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <LoadingSpinner /> : 'إرسال رمز الاسترداد'}
              </Button>
            </div>
          )}

          {step === 'sent' && (
            <div className="space-y-6 text-center">
              <div className="text-6xl mb-4">📧</div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">تم إرسال رابط الاسترداد</h2>
                <p className="text-gray-600 mb-4">
                  {method === 'email' 
                    ? 'تحقق من بريدك الإلكتروني للحصول على رابط استعادة الحساب'
                    : 'تحقق من رسائلك النصية للحصول على رابط استعادة الحساب'
                  }
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">تعليمات مهمة:</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-right">
                  <li>• تحقق من مجلد الرسائل المرفوضة (Spam)</li>
                  <li>• الرابط صالح لمدة 15 دقيقة فقط</li>
                  <li>• يمكن استخدام الرابط مرة واحدة فقط</li>
                  <li>• إذا لم تتلق الرسالة، يمكنك طلب رابط جديد</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBackToMethod}
                  variant="secondary"
                  className="w-full"
                >
                  طلب رابط جديد
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </Card>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'success' })}
          />
        )}
      </div>
    </div>
  )
}
