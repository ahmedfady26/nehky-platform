// مكون إدخال البيانات مع الشعار
import React from 'react';
import Image from 'next/image';

interface InputWithLogoProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  showLogo?: boolean;
  logoPosition?: 'left' | 'right';
}

export default function InputWithLogo({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  showLogo = true,
  logoPosition = 'right'
}: InputWithLogoProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        className={`
          w-full px-4 py-3 rounded-lg border border-blue-200 
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          transition-all duration-200 font-cairo text-right
          ${showLogo ? (logoPosition === 'right' ? 'pr-12' : 'pl-12') : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-300'}
          ${className}
        `}
        dir="rtl"
      />
      
      {showLogo && (
        <div 
          className={`
            absolute top-1/2 transform -translate-y-1/2 
            ${logoPosition === 'right' ? 'right-3' : 'left-3'}
          `}
        >
          <Image
            src="/nehky_logo.webp"
            alt="نحكي"
            width={24}
            height={24}
            className="opacity-60 hover:opacity-80 transition-opacity"
          />
        </div>
      )}
    </div>
  );
}
