'use client'

import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'

interface NameFieldsProps {
  onNameChange?: (fullName: string, nameData: NameData) => void
  className?: string
}

interface NameData {
  firstName: string
  secondName: string
  thirdName: string
  lastName: string
  fullName: string
}

export default function NameFields({ onNameChange, className = '' }: NameFieldsProps) {
  const [nameData, setNameData] = useState<NameData>({
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    fullName: ''
  })

  // تحديث الاسم الكامل عند تغيير أي من الحقول
  useEffect(() => {
    const { firstName, secondName, thirdName, lastName } = nameData
    const fullName = [firstName, secondName, thirdName, lastName]
      .filter(name => name.trim() !== '')
      .join(' ')
      .trim()

    const updatedNameData = { ...nameData, fullName }
    setNameData(updatedNameData)

    if (onNameChange) {
      onNameChange(fullName, updatedNameData)
    }
  }, [nameData.firstName, nameData.secondName, nameData.thirdName, nameData.lastName])

  const handleNameChange = (field: keyof NameData, value: string) => {
    // السماح بالأحرف العربية والإنجليزية والمسافات فقط
    let cleanValue = value.replace(/[^a-zA-Zأ-ي\u0600-\u06FF\s]/g, '')
    
    // التحقق من عدد الكلمات - الحد الأقصى اسم واحد مركب (كلمتان)
    const words = cleanValue.trim().split(/\s+/).filter(word => word.length > 0)
    if (words.length > 2) {
      // الاحتفاظ بأول كلمتين فقط
      cleanValue = words.slice(0, 2).join(' ')
    }
    
    // الحد الأقصى للطول: 30 حرف (يكفي لأسماء مثل "عبد الرحمن" أو "أبو بكر")
    if (cleanValue.length > 30) {
      cleanValue = cleanValue.substring(0, 30)
    }
    
    setNameData(prev => ({
      ...prev,
      [field]: cleanValue
    }))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* حقول الاسم الأربعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الاسم الأول */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium nehky-text-primary mb-2">
            الاسم الأول <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={nameData.firstName}
              onChange={(e) => handleNameChange('firstName', e.target.value)}
              className="nehky-input w-full pr-10"
              placeholder="الاسم الأول"
              maxLength={30}
              required
            />
            <User size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* الاسم الثاني */}
        <div>
          <label htmlFor="secondName" className="block text-sm font-medium nehky-text-primary mb-2">
            الاسم الثاني
          </label>
          <input
            type="text"
            id="secondName"
            name="secondName"
            value={nameData.secondName}
            onChange={(e) => handleNameChange('secondName', e.target.value)}
            className="nehky-input w-full"
            placeholder="الاسم الثاني (اختياري)"
            maxLength={30}
          />
        </div>

        {/* الاسم الثالث */}
        <div>
          <label htmlFor="thirdName" className="block text-sm font-medium nehky-text-primary mb-2">
            الاسم الثالث
          </label>
          <input
            type="text"
            id="thirdName"
            name="thirdName"
            value={nameData.thirdName}
            onChange={(e) => handleNameChange('thirdName', e.target.value)}
            className="nehky-input w-full"
            placeholder="الاسم الثالث (اختياري)"
            maxLength={30}
          />
        </div>

        {/* اسم العائلة */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium nehky-text-primary mb-2">
            اسم العائلة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={nameData.lastName}
            onChange={(e) => handleNameChange('lastName', e.target.value)}
            className="nehky-input w-full"
            placeholder="اسم العائلة"
            maxLength={30}
            required
          />
        </div>
      </div>

      {/* عرض الاسم الكامل */}
      {nameData.fullName && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">الاسم الكامل:</span>
          </div>
          <div className="text-lg font-semibold text-blue-800 bg-white px-3 py-2 rounded-md border border-blue-300">
            {nameData.fullName}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            سيظهر هذا الاسم في ملفك الشخصي ويمكن للآخرين رؤيته
          </p>
        </div>
      )}

      {/* حقل مخفي للاسم الكامل للإرسال مع النموذج */}
      <input
        type="hidden"
        name="fullName"
        value={nameData.fullName}
      />

      {/* إرشادات للمستخدم */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 text-lg">💡</span>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">إرشادات مهمة:</p>
            <ul className="text-xs space-y-1">
              <li>• الاسم الأول واسم العائلة مطلوبان</li>
              <li>• كل حقل يمكن أن يحتوي على اسم واحد مركب فقط (مثل "عبد الله" أو "أبو بكر")</li>
              <li>• الحد الأقصى لكل حقل: كلمتان و 30 حرف</li>
              <li>• يمكن استخدام الأحرف العربية أو الإنجليزية</li>
              <li>• استخدم الأسماء الحقيقية فقط للمصداقية</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
