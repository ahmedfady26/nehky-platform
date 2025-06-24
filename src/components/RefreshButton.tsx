"use client";

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useDataRefresh } from '@/lib/DataRefreshContext';

interface RefreshButtonProps {
  dataType: 'posts' | 'users' | 'dashboard' | 'notifications' | 'points' | 'trending';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  dataType,
  label = 'تحديث',
  size = 'md',
  variant = 'ghost',
  className = '',
  disabled = false,
  loading = false
}) => {
  const { triggerRefresh } = useDataRefresh();

  const handleRefresh = () => {
    if (!disabled && !loading) {
      console.log(`🔄 تحديث يدوي مطلوب لنوع البيانات: ${dataType}`);
      triggerRefresh(dataType);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300 hover:text-gray-800'
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 
        border rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${loading ? 'cursor-wait' : 'hover:scale-105'}
        ${className}
      `}
      title={`تحديث ${dataType === 'posts' ? 'المنشورات' : dataType === 'users' ? 'المستخدمين' : dataType === 'dashboard' ? 'لوحة التحكم' : dataType === 'notifications' ? 'الإشعارات' : 'النقاط'}`}
    >
      <RefreshCw 
        size={iconSize[size]} 
        className={`${loading ? 'animate-spin' : ''} transition-transform`} 
      />
      {label && (
        <span>{loading ? 'جاري التحديث...' : label}</span>
      )}
    </button>
  );
};

export default RefreshButton;
