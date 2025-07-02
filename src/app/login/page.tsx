'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // منع التداخل والتكرار في العناصر
  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setRememberMe(e.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      // هنا سيتم إضافة منطق تسجيل الدخول الفعلي
      console.log('تسجيل الدخول:', { email, password, rememberMe })
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // في حالة تفعيل "تذكرني"، يتم حفظ المعلومات
      if (rememberMe) {
        localStorage.setItem('nehky_remember_me', 'true')
        localStorage.setItem('nehky_user_email', email)
        console.log('تم حفظ معلومات المستخدم للذاكرة الدائمة')
      } else {
        // استخدام session storage للجلسة المؤقتة فقط
        sessionStorage.setItem('nehky_session_active', 'true')
        console.log('تم إنشاء جلسة مؤقتة')
      }
      
      // إعادة توجيه للصفحة الرئيسية أو dashboard
      window.location.href = '/'
      
    } catch (error) {
      setErrorMessage('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.')
      console.error('خطأ في تسجيل الدخول:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // تحقق من وجود معلومات محفوظة عند تحميل الصفحة
  useEffect(() => {
    document.title = "تسجيل الدخول - نحكي"
    const rememberedEmail = localStorage.getItem('nehky_user_email')
    const rememberMeStatus = localStorage.getItem('nehky_remember_me')
    
    if (rememberedEmail && rememberMeStatus === 'true') {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="auth-page min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* زر العودة للصفحة الرئيسية */}
      <Link 
        href="/"
        className="back-button flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-nehky-primary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>العودة للرئيسية</span>
      </Link>

      <div className="max-w-md w-full">
        <div className="nehky-card auth-card p-8 shadow-xl">
          {/* الشعار والعنوان */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/nehky_logo.webp"
                alt="شعار نحكي"
                width={200}
                height={150}
                className="mx-auto mb-4 hover:scale-105 transition-transform"
              />
            </Link>
            <h1 className="text-3xl font-bold nehky-text-gradient mb-2">
              مرحباً بعودتك إلى نحكي
            </h1>
            <p className="text-gray-600">
              سجل دخولك لمتابعة مشاركة قصصك المميزة
            </p>
          </div>

          {/* رسالة الخطأ */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg nehky-notification">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium nehky-text-primary mb-2">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nehky-input w-full"
                placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium nehky-text-primary mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="nehky-input w-full"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="nehky-checkbox-container flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleCheckboxClick}
                    className="nehky-checkbox"
                  />
                  <span className="mr-3 text-sm text-gray-700 font-medium group-hover:text-nehky-primary transition-colors">
                    تذكرني (البقاء متصلاً)
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm nehky-text-primary hover:text-nehky-primary-light transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* معلومات إضافية عن ميزة "تذكرني" */}
              {rememberMe && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 nehky-notification">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mr-3">
                      <p className="text-sm text-green-700">
                        ✅ سيتم تذكر معلومات الدخول لمدة 30 يوماً
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`nehky-btn-primary w-full py-3 text-lg transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="nehky-loading-spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جارٍ تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* رابط التسجيل */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              ليس لديك حساب بعد؟{' '}
              <Link
                href="/register"
                className="nehky-text-primary hover:text-nehky-primary-light font-medium transition-colors"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        {/* روابط إضافية */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-700 transition-colors">شروط الاستخدام</Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-gray-700 transition-colors">سياسة الخصوصية</Link>
        </div>
      </div>
    </div>
  )
}
