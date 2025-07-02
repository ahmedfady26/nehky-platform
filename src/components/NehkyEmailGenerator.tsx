'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Check, X } from 'lucide-react'

interface NehkyEmailGeneratorProps {
  username: string
  onUsernameChange: (username: string) => void
  onEmailGenerated: (email: string) => void
  className?: string
}

export default function NehkyEmailGenerator({ 
  username, 
  onUsernameChange, 
  onEmailGenerated,
  className = ''
}: NehkyEmailGeneratorProps) {
  const [nehkyEmail, setNehkyEmail] = useState('')
  const [isUsernameValid, setIsUsernameValid] = useState(false)
  const [usernameError, setUsernameError] = useState('')

  // التحقق من صحة اسم المستخدم
  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError('')
      setIsUsernameValid(false)
      return false
    }

    // يجب أن يكون 3-20 حرف
    if (value.length < 3) {
      setUsernameError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
      setIsUsernameValid(false)
      return false
    }

    if (value.length > 20) {
      setUsernameError('اسم المستخدم يجب ألا يزيد عن 20 حرف')
      setIsUsernameValid(false)
      return false
    }

    // يجب أن يحتوي على أحرف وأرقام فقط (بدون مسافات أو رموز خاصة)
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('يمكن استخدام الأحرف الإنجليزية والأرقام وخط السفلي فقط')
      setIsUsernameValid(false)
      return false
    }

    // يجب أن يبدأ بحرف
    if (!/^[a-zA-Z]/.test(value)) {
      setUsernameError('اسم المستخدم يجب أن يبدأ بحرف')
      setIsUsernameValid(false)
      return false
    }

    // يجب ألا يحتوي على الكلمات المحجوزة
    const reservedWords = ['admin', 'root', 'test', 'user', 'nehky', 'api', 'www', 'mail', 'email']
    if (reservedWords.includes(value.toLowerCase())) {
      setUsernameError('هذا الاسم محجوز، يرجى اختيار اسم آخر')
      setIsUsernameValid(false)
      return false
    }

    setUsernameError('')
    setIsUsernameValid(true)
    return true
  }

  // توليد البريد الإلكتروني عند تغيير اسم المستخدم
  useEffect(() => {
    if (username && isUsernameValid) {
      const generatedEmail = `${username}@nehky.com`
      setNehkyEmail(generatedEmail)
      onEmailGenerated(generatedEmail)
    } else {
      setNehkyEmail('')
      onEmailGenerated('')
    }
  }, [username, isUsernameValid, onEmailGenerated])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim()
    onUsernameChange(value)
    validateUsername(value)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* حقل اسم المستخدم */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium nehky-text-primary mb-2">
          اسم المستخدم <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            className={`nehky-input w-full pr-10 ${
              username ? (isUsernameValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : ''
            }`}
            placeholder="اختر اسم مستخدم فريد"
            required
            dir="ltr"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {username && (
              isUsernameValid ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <X size={20} className="text-red-500" />
              )
            )}
          </div>
        </div>
        
        {/* رسالة خطأ اسم المستخدم */}
        {usernameError && (
          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
            <X size={14} />
            {usernameError}
          </p>
        )}

        {/* نصائح لاسم المستخدم */}
        {!username && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">إرشادات اسم المستخدم:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• يجب أن يكون بين 3-20 حرف</li>
              <li>• يبدأ بحرف إنجليزي</li>
              <li>• يحتوي على أحرف وأرقام وخط سفلي فقط</li>
              <li>• مثال: ahmed_2024 أو sarah_khaled</li>
              <li>• سيتم إنشاء بريدك تلقائياً: اسم_المستخدم@nehky.com</li>
            </ul>
          </div>
        )}

        {/* عرض معاينة البريد الإلكتروني أثناء الكتابة */}
        {username && !nehkyEmail && (
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⏳</span>
              <span className="text-sm text-yellow-700">
                معاينة البريد الإلكتروني: <span className="font-mono">{username}@nehky.com</span>
              </span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              يرجى إكمال اسم المستخدم بطريقة صحيحة لإنشاء البريد الإلكتروني
            </p>
          </div>
        )}
      </div>

      {/* عرض البريد الإلكتروني المُولد */}
      {nehkyEmail && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-700">بريدك الإلكتروني في نحكي:</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-md border border-purple-300 font-mono text-lg text-purple-800">
            {nehkyEmail}
          </div>
          <p className="text-xs text-purple-600 mt-2">
            ✨ تم إنشاء بريدك الإلكتروني تلقائياً! يمكنك استخدامه لتسجيل الدخول مستقبلاً
          </p>
        </div>
      )}

      {/* حقل مخفي للبريد الإلكتروني */}
      <input
        type="hidden"
        name="nehkyEmail"
        value={nehkyEmail}
      />
    </div>
  )
}
