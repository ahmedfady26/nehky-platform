'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

// قائمة بأكواد البلدان الرئيسية
const COUNTRY_CODES = [
  // الدول العربية
  { code: '+20', country: 'مصر', flag: '🇪🇬' },
  { code: '+966', country: 'السعودية', flag: '🇸🇦' },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
  { code: '+965', country: 'الكويت', flag: '🇰🇼' },
  { code: '+973', country: 'البحرين', flag: '🇧🇭' },
  { code: '+974', country: 'قطر', flag: '🇶🇦' },
  { code: '+968', country: 'عمان', flag: '🇴🇲' },
  { code: '+962', country: 'الأردن', flag: '🇯🇴' },
  { code: '+961', country: 'لبنان', flag: '🇱🇧' },
  { code: '+963', country: 'سوريا', flag: '🇸🇾' },
  { code: '+964', country: 'العراق', flag: '🇮🇶' },
  { code: '+967', country: 'اليمن', flag: '🇾🇪' },
  { code: '+212', country: 'المغرب', flag: '🇲🇦' },
  { code: '+213', country: 'الجزائر', flag: '🇩🇿' },
  { code: '+216', country: 'تونس', flag: '🇹🇳' },
  { code: '+218', country: 'ليبيا', flag: '🇱🇾' },
  { code: '+249', country: 'السودان', flag: '🇸🇩' },
  { code: '+222', country: 'موريتانيا', flag: '🇲🇷' },
  { code: '+252', country: 'الصومال', flag: '🇸🇴' },
  { code: '+253', country: 'جيبوتي', flag: '🇩🇯' },
  { code: '+970', country: 'فلسطين', flag: '🇵🇸' },
  // الدول الأخرى الشائعة
  { code: '+1', country: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: '+44', country: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: '+33', country: 'فرنسا', flag: '🇫🇷' },
  { code: '+49', country: 'ألمانيا', flag: '🇩🇪' },
  { code: '+39', country: 'إيطاليا', flag: '🇮🇹' },
  { code: '+34', country: 'إسبانيا', flag: '🇪🇸' },
  { code: '+90', country: 'تركيا', flag: '🇹🇷' },
  { code: '+98', country: 'إيران', flag: '🇮🇷' },
  { code: '+91', country: 'الهند', flag: '🇮🇳' },
  { code: '+86', country: 'الصين', flag: '🇨🇳' },
  { code: '+81', country: 'اليابان', flag: '🇯🇵' },
  { code: '+82', country: 'كوريا الجنوبية', flag: '🇰🇷' },
  { code: '+7', country: 'روسيا', flag: '🇷🇺' },
  { code: '+55', country: 'البرازيل', flag: '🇧🇷' },
  { code: '+52', country: 'المكسيك', flag: '🇲🇽' },
  { code: '+27', country: 'جنوب أفريقيا', flag: '🇿🇦' },
  { code: '+61', country: 'أستراليا', flag: '🇦🇺' },
  { code: '+64', country: 'نيوزيلندا', flag: '🇳🇿' },
]

interface PhoneNumberInputProps {
  value?: string
  onChange?: (value: string) => void
  name?: string
  className?: string
  placeholder?: string
  required?: boolean
}

export default function PhoneNumberInput({ 
  value = '', 
  onChange, 
  name = 'phone',
  className = '',
  placeholder = 'ادخل رقم الهاتف',
  required = false 
}: PhoneNumberInputProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+20') // مصر كافتراضي
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // التحقق من صحة رقم الهاتف
  const validatePhoneNumber = (code: string, number: string) => {
    if (!number || number.length === 0) {
      setErrorMessage(required ? 'رقم الهاتف مطلوب' : '')
      setIsValid(false)
      return false
    }

    // تحديد الحد الأدنى لطول الرقم حسب البلد
    const minLengths: { [key: string]: number } = {
      '+20': 10,  // مصر: 10 أرقام
      '+966': 9,  // السعودية: 9 أرقام
      '+971': 9,  // الإمارات: 9 أرقام
      '+965': 8,  // الكويت: 8 أرقام
      '+973': 8,  // البحرين: 8 أرقام
      '+974': 8,  // قطر: 8 أرقام
      '+968': 8,  // عمان: 8 أرقام
      '+962': 9,  // الأردن: 9 أرقام
      '+961': 8,  // لبنان: 8 أرقام
    }

    const minLength = minLengths[code] || 7 // الحد الأدنى العام
    
    if (number.length < minLength) {
      setErrorMessage(`رقم الهاتف يجب أن يكون ${minLength} أرقام على الأقل`)
      setIsValid(false)
      return false
    }

    setErrorMessage('')
    setIsValid(true)
    return true
  }

  // إغلاق القائمة بالضغط على Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDropdownOpen])

  // تصفية البلدان حسب البحث
  const filteredCountries = COUNTRY_CODES.filter(country => 
    country.country.includes(searchTerm) || 
    country.code.includes(searchTerm)
  )

  // تحديث القيمة الكاملة عند تغيير الكود أو الرقم
  const updateFullValue = (countryCode: string, number: string) => {
    validatePhoneNumber(countryCode, number)
    const fullValue = countryCode + number
    if (onChange) {
      onChange(fullValue)
    }
  }

  const handleCountryCodeChange = (code: string) => {
    setSelectedCountryCode(code)
    setIsDropdownOpen(false)
    setSearchTerm('')
    validatePhoneNumber(code, phoneNumber)
    updateFullValue(code, phoneNumber)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // إزالة الكود القديم إذا كان موجود في النص المُدخل
    let inputValue = e.target.value
    if (inputValue.startsWith(selectedCountryCode)) {
      inputValue = inputValue.slice(selectedCountryCode.length)
    }
    
    const number = inputValue.replace(/[^0-9]/g, '') // السماح بالأرقام فقط
    setPhoneNumber(number)
    updateFullValue(selectedCountryCode, number)
  }

  // العثور على البيانات للبلد المحدد
  const selectedCountry = COUNTRY_CODES.find(country => country.code === selectedCountryCode) || COUNTRY_CODES[0]

  return (
    <div className="relative">
      <div className={`flex border rounded-lg focus-within:ring-1 focus-within:ring-nehky-primary ${
        errorMessage 
          ? 'border-red-500 focus-within:border-red-500' 
          : isValid && phoneNumber 
            ? 'border-green-500 focus-within:border-green-500' 
            : 'border-gray-300 focus-within:border-nehky-primary'
      } ${className}`}>
        {/* قائمة اختيار مفتاح البلد */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDropdownOpen(!isDropdownOpen)
            }}
            className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 transition-colors min-w-[120px] focus:outline-none focus:ring-2 focus:ring-nehky-primary rounded-l-lg"
            aria-label="اختيار مفتاح البلد"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountryCode}</span>
            <ChevronDown 
              size={16} 
              className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* قائمة البلدان المنسدلة - محسَّنة */}
          {isDropdownOpen && (
            <div 
              className="fixed z-[99999] mt-1 bg-white border border-gray-300 rounded-lg shadow-xl w-80 max-h-60 overflow-hidden"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxHeight: '400px',
                width: '320px',
                zIndex: 99999
              }}
            >
              {/* عنوان القائمة */}
              <div className="bg-nehky-primary text-white px-4 py-2 flex items-center justify-between">
                <span className="font-medium">اختر مفتاح البلد</span>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              {/* حقل البحث */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <input
                  type="text"
                  placeholder="ابحث عن بلد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-nehky-primary focus:ring-1 focus:ring-nehky-primary focus:outline-none"
                />
              </div>
              
              {/* قائمة البلدان */}
              <div className="overflow-y-auto max-h-64 bg-white">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCountryCodeChange(country.code)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        selectedCountryCode === country.code ? 'bg-nehky-primary bg-opacity-10 border-l-4 border-l-nehky-primary' : ''
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1 text-right">
                        <div className="text-sm font-medium text-gray-900">{country.country}</div>
                        <div className="text-xs text-gray-500">{country.code}</div>
                      </div>
                      {selectedCountryCode === country.code && (
                        <span className="text-nehky-primary">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="text-sm">لا توجد نتائج</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* حقل إدخال رقم الهاتف */}
        <input
          type="tel"
          name={name}
          value={selectedCountryCode + phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-3 py-3 border-0 focus:outline-none focus:ring-0 rounded-r-lg"
          dir="ltr"
        />
      </div>

      {/* رسائل التحقق والتوضيح */}
      {errorMessage ? (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span>❌</span>
          {errorMessage}
        </p>
      ) : isValid && phoneNumber ? (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <span>✅</span>
          رقم الهاتف صحيح
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">
          سنرسل لك رمز التحقق عبر SMS
        </p>
      )}

      {/* خلفية للإغلاق */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-[99998]" 
          onClick={(e) => {
            e.preventDefault()
            setIsDropdownOpen(false)
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            zIndex: 99998
          }}
        />
      )}
    </div>
  )
}
