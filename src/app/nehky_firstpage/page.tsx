'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function NehkyFirstPage() {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  })
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/auth/login')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/auth/register')
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* الأشكال المتحركة في الخلفية */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* القسم الأيسر - معلومات المنصة */}
          <div className="text-center lg:text-right lg:pr-16">
            {/* الشعار والعنوان الرئيسي */}
            <div className="mb-12">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="shimmer">
                  <Logo size="xl" showText={false} href={undefined} />
                </div>
              </div>
              <h1 className="text-7xl lg:text-8xl font-bold mb-6 gradient-text glow-text">
                نحكي
              </h1>
              <p className="text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-lg drop-shadow-lg">
                منصة التواصل الاجتماعي العربية التي تربط بين المؤثرين والمتابعين بطريقة مبتكرة ومتطورة
              </p>
            </div>

            {/* الميزات مع تأثيرات متطورة */}
            <div className="space-y-8">
              <div className="flex items-start gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">نظام كبار المتابعين</h3>
                  <p className="text-white/80 text-lg">يمكن للمؤثرين ترشيح أفضل متابعيهم للمشاركة في إنشاء المحتوى</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">نظام النقاط التفاعلي</h3>
                  <p className="text-white/80 text-lg">اكسب نقاط من خلال التفاعل مع المحتوى والمشاركة الفعالة</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">تواصل مباشر</h3>
                  <p className="text-white/80 text-lg">رسائل خاصة، مشاركة الملفات، وإشعارات لحظية</p>
                </div>
              </div>
            </div>
          </div>

          {/* القسم الأيمن - صندوق تسجيل البيانات المتطور */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md">
              
              {!isRegistering ? (
                /* صندوق تسجيل الدخول المتطور */
                <div className="auth-card p-8 shimmer">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text mb-2">
                      مرحباً بك في نحكي
                    </h2>
                    <p className="text-gray-600">سجل دخولك للاستمرار</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="identifier"
                        value={loginData.identifier}
                        onChange={handleLoginChange}
                        className="modern-input"
                        placeholder="البريد الإلكتروني أو رقم الهاتف"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="modern-input"
                        placeholder="كلمة المرور"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="modern-btn-primary"
                    >
                      تسجيل الدخول
                    </button>
                  </form>

                  <div className="text-center mt-6">
                    <a href="#" className="modern-link text-sm">
                      نسيت كلمة المرور؟
                    </a>
                  </div>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">أو</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setIsRegistering(true)}
                      className="modern-btn-secondary"
                    >
                      إنشاء حساب جديد
                    </button>
                  </div>
                </div>
              ) : (
                /* صندوق إنشاء الحساب المتطور */
                <div className="auth-card p-8 shimmer">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold gradient-text mb-2">انضم إلى نحكي</h2>
                    <p className="text-gray-600">سريع ومجاني وآمن</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        className="modern-input"
                        placeholder="الاسم الكامل"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="modern-input"
                        placeholder="البريد الإلكتروني"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="modern-input"
                        placeholder="كلمة المرور الجديدة"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="modern-input"
                        placeholder="تأكيد كلمة المرور"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="modern-btn-primary"
                      >
                        إنشاء حساب
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsRegistering(false)}
                      className="modern-link text-sm"
                    >
                      لديك حساب بالفعل؟ سجل دخولك
                    </button>
                  </div>

                  <div className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
                    بالنقر على "إنشاء حساب"، فإنك توافق على
                    <a href="#" className="modern-link mx-1">شروط الاستخدام</a>
                    و
                    <a href="#" className="modern-link mx-1">سياسة الخصوصية</a>
                  </div>
                </div>
              )}

              {/* رابط إنشاء صفحة للمشاهير */}
              <div className="text-center mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <a href="#" className="text-white hover:text-white/80 text-sm font-medium transition-colors">
                    <strong>إنشاء صفحة</strong> لمشهور أو فرقة أو نشاط تجاري
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
