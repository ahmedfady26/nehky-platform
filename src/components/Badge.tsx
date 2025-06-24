// مكون شارة مع تأثيرات
import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  animated?: boolean;
}

export default function Badge({ 
  text, 
  variant = 'default', 
  size = 'md',
  animated = false 
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full border";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    success: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300",
    danger: "bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border-red-300",
    info: "bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${animated ? 'animate-pulse' : ''}
        transition-all duration-200 hover:scale-110
      `}
    >
      {text}
    </span>
  );
}
