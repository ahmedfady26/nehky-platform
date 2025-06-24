// مكون زر متقدم مع تأثيرات - محسن للتوافق مع الأجهزة المختلفة
import React from 'react';
import { getResponsiveClasses, DeviceType } from '@/shared/utils/responsive';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'; // إضافة variant جديد
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode; // خاصية الأيقونة
  responsive?: boolean; // للتكيف التلقائي مع حجم الشاشة
  deviceType?: DeviceType; // لتحديد نوع الجهاز يدوياً
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon
}: ButtonProps) {
  const baseClasses = "font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white shadow-lg hover:shadow-xl focus:ring-blue-300",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    success: "bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl focus:ring-green-300",
    danger: "bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500 text-white shadow-lg hover:shadow-xl focus:ring-red-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          جاري التحميل...
        </div>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
