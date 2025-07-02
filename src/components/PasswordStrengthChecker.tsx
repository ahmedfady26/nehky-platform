'use client'

import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'

interface PasswordValidation {
  hasEnglishLetters: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumbers: boolean
  minLength: boolean
  noArabicCharacters: boolean
}

interface PasswordStrengthCheckerProps {
  value: string
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  required?: boolean
  confirmPassword?: string
  onValidationChange?: (isValid: boolean) => void
}

export default function PasswordStrengthChecker({
  value,
  onChange,
  name = 'password',
  placeholder = 'أدخل كلمة مرور قوية',
  required = false,
  confirmPassword,
  onValidationChange
}: PasswordStrengthCheckerProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [validation, setValidation] = useState<PasswordValidation>({
    hasEnglishLetters: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    minLength: false,
    noArabicCharacters: true
  })

  // التحقق من صحة كلمة المرور
  useEffect(() => {
    const newValidation: PasswordValidation = {
      hasEnglishLetters: /[a-zA-Z]/.test(value),
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumbers: /[0-9]/.test(value),
      minLength: value.length >= 8,
      noArabicCharacters: !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value)
    }
    
    setValidation(newValidation)
    
    const isValid = Object.values(newValidation).every(condition => condition)
    if (onValidationChange) {
      onValidationChange(isValid)
    }
  }, [value, onValidationChange])

  const getStrengthLevel = () => {
    const validConditions = Object.values(validation).filter(condition => condition).length
    if (validConditions <= 2) return { level: 'ضعيف جداً', color: 'bg-red-600', width: '16%' }
    if (validConditions <= 3) return { level: 'ضعيف', color: 'bg-red-500', width: '33%' }
    if (validConditions <= 4) return { level: 'متوسط', color: 'bg-yellow-500', width: '50%' }
    if (validConditions <= 5) return { level: 'جيد', color: 'bg-blue-500', width: '80%' }
    if (validConditions === 6) return { level: 'قوي جداً', color: 'bg-green-500', width: '100%' }
    return { level: 'ضعيف', color: 'bg-red-500', width: '16%' }
  }

  const strength = getStrengthLevel()
  const isPasswordMatch = confirmPassword ? value === confirmPassword : true

  const ValidationItem = ({ condition, text }: { condition: boolean, text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${condition ? 'text-green-600' : 'text-red-500'}`}>
      {condition ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* حقل كلمة المرور */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="nehky-input w-full pr-12"
          dir="ltr"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* مؤشر قوة كلمة المرور */}
      {value && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">قوة كلمة المرور:</span>
              <span className={`text-sm font-bold ${
                strength.level === 'قوي جداً' ? 'text-green-600' :
                strength.level === 'جيد' ? 'text-blue-600' : 
                strength.level === 'متوسط' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {strength.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>

          {/* قائمة شروط كلمة المرور */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 mb-3">متطلبات كلمة المرور:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ValidationItem 
                condition={validation.minLength} 
                text="8 أحرف على الأقل" 
              />
              <ValidationItem 
                condition={validation.hasEnglishLetters} 
                text="حروف إنجليزية" 
              />
              <ValidationItem 
                condition={validation.hasUppercase} 
                text="حرف كبير (A-Z)" 
              />
              <ValidationItem 
                condition={validation.hasLowercase} 
                text="حرف صغير (a-z)" 
              />
              <ValidationItem 
                condition={validation.hasNumbers} 
                text="رقم واحد على الأقل" 
              />
              <ValidationItem 
                condition={validation.noArabicCharacters} 
                text="بدون أحرف عربية" 
              />
            </div>
            
            {/* نصائح إضافية */}
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-lg">💡</span>
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">نصائح لكلمة مرور قوية:</p>
                  <ul className="space-y-1">
                    <li>• استخدم مزيج من الأحرف والأرقام والرموز</li>
                    <li>• تجنب المعلومات الشخصية (اسمك، تاريخ ميلادك)</li>
                    <li>• استخدم عبارة سهلة التذكر مع أرقام</li>
                    <li>• مثال: MyPassword123 أو SecurePass2024</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* تحقق من تطابق كلمة المرور */}
          {confirmPassword !== undefined && (
            <div className={`flex items-center gap-2 text-sm ${
              isPasswordMatch ? 'text-green-600' : 'text-red-500'
            }`}>
              {isPasswordMatch ? <Check size={16} /> : <X size={16} />}
              <span>
                {isPasswordMatch ? 'كلمات المرور متطابقة' : 'كلمات المرور غير متطابقة'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
