// مكون منطقة نص مع الشعار
import React from 'react';
import Image from 'next/image';

interface TextareaWithLogoProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  rows?: number;
  showLogo?: boolean;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function TextareaWithLogo({
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  rows = 4,
  showLogo = true,
  logoPosition = 'top-right'
}: TextareaWithLogoProps) {
  const getLogoPosition = () => {
    switch (logoPosition) {
      case 'top-left':
        return 'top-3 left-3';
      case 'top-right':
        return 'top-3 right-3';
      case 'bottom-left':
        return 'bottom-3 left-3';
      case 'bottom-right':
        return 'bottom-3 right-3';
      default:
        return 'top-3 right-3';
    }
  };

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-lg border border-blue-200 
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          transition-all duration-200 font-cairo text-right resize-none
          ${showLogo ? 'pr-12' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-300'}
          ${className}
        `}
        dir="rtl"
      />
      
      {showLogo && (
        <div className={`absolute ${getLogoPosition()}`}>
          <Image
            src="/nehky_logo.webp"
            alt="نحكي"
            width={20}
            height={20}
            className="opacity-40 hover:opacity-60 transition-opacity"
          />
        </div>
      )}
    </div>
  );
}
