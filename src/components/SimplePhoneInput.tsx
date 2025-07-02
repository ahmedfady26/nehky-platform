'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// نسخة مبسطة للاختبار
const SimplePhoneInput = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative w-full">
      <div className="flex border border-gray-300 rounded-lg">
        <button
          type="button"
          onClick={() => {
            console.log('Button clicked! Current state:', isOpen)
            setIsOpen(!isOpen)
          }}
          className="px-4 py-3 bg-gray-50 border-r border-gray-300 flex items-center gap-2"
        >
          <span>🇪🇬</span>
          <span>+20</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <input
          type="tel"
          className="flex-1 px-3 py-3 border-0 rounded-r-lg"
          placeholder="ادخل رقم الهاتف"
        />
      </div>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-[99999]"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 99999
          }}
        >
          <div className="p-4">
            <div className="text-red-500 font-bold text-center">
              ✅ القائمة تعمل!
            </div>
            <div className="mt-2 space-y-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <span>🇪🇬</span>
                <span>مصر (+20)</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <span>🇸🇦</span>
                <span>السعودية (+966)</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <span>🇦🇪</span>
                <span>الإمارات (+971)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* خلفية للإغلاق */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99998 }}
        />
      )}
      
      {/* مؤشر التشخيص */}
      <div className="text-xs text-gray-500 mt-1">
        🔍 Debug: القائمة {isOpen ? '✅ مفتوحة' : '❌ مغلقة'}
      </div>
    </div>
  )
}

export default SimplePhoneInput
