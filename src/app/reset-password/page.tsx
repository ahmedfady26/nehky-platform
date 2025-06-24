'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/Card'
import Button from '@/components/Button'
import InputWithLogo from '@/components/InputWithLogo'
import Logo from '@/components/Logo'
import LoadingSpinner from '@/components/LoadingSpinner'
import Toast from '@/components/Toast'
import Link from 'next/link'

function ResetPasswordContent() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingToken, setIsVerifyingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username: string; fullName: string } | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({ show: false, message: '', type: 'success' })

  const searchParams = useSearchParams()

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000)
  }

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      verifyToken(urlToken)
    } else {
      setIsVerifyingToken(false)
      showToast('رابط الاسترداد غير صحيح', 'error')
    }
  }, [searchParams])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${tokenToVerify}`)
      const data = await response.json()

      if (data.success) {
        setTokenValid(true)
        setUserInfo(data.user)
      } else {
        setTokenValid(false)
        showToast(data.message, 'error')
      }
    } catch (error) {
      setTokenValid(false)
      showToast('حدث خطأ في التحقق من الرابط', 'error')
    } finally {
      setIsVerifyingToken(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      showToast('يرجى إدخال كلمة المرور الجديدة', 'error')
      return
    }

    if (newPassword.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showToast('كلمة المرور وتأكيدها غير متطابقتين', 'error')
      return
    }

    const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]*$/
    if (!englishOnlyRegex.test(newPassword)) {
      showToast('كلمة المرور يجب أن تكون باللغة الإنجليزية فقط', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/confirm-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await response.json()

      if (data.success) {
        showToast('تم تغيير كلمة المرور بنجاح! سيتم تحويلك لصفحة تسجيل الدخول', 'success')
        setTimeout(() => {
          window.location.href = '/auth'
        }, 3000)
      } else {
        showToast(data.message, 'error')
      }
    } catch (error) {
      showToast('حدث خطأ في الاتصال', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifyingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">جاري التحقق من رابط الاسترداد...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-600 mb-2">رابط غير صحيح</h1>
            <p className="text-gray-600">رابط الاسترداد غير صحيح أو منتهي الصلاحية</p>
          </div>

          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-6">
              يبدو أن رابط استعادة الحساب غير صحيح أو منتهي الصلاحية.
              يرجى طلب رابط جديد.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = '/account-recovery'}
                className="w-full"
              >
                طلب رابط جديد
              </Button>
              
              <Link href="/auth" className="block text-blue-600 hover:text-blue-800 font-medium">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">أدخل كلمة المرور الجديدة لحسابك</p>
        </div>

        <Card className="p-8">
          {userInfo && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="text-blue-600 text-xl">👤</div>
                <div>
                  <p className="font-medium text-blue-800">{userInfo.fullName}</p>
                  <p className="text-sm text-blue-600">@{userInfo.username}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <InputWithLogo
                type="password"
                placeholder="أدخل كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <InputWithLogo
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">متطلبات كلمة المرور:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 6 أحرف على الأقل</li>
                <li>• أحرف إنجليزية فقط</li>
                <li>• يمكن استخدام الأرقام والرموز</li>
              </ul>
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingSpinner /> : 'تغيير كلمة المرور'}
            </Button>
          </div>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
