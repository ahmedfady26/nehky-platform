// مكون بطاقة متقدم مع تأثيرات
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  gradient?: 'blue' | 'green' | 'purple' | 'pink';
  hoverable?: boolean;
  className?: string;
}

export default function Card({ 
  children, 
  title, 
  gradient = 'blue', 
  hoverable = true,
  className = ""
}: CardProps) {
  const gradientClasses = {
    blue: "bg-gradient-to-br from-blue-400/20 to-cyan-300/20 border-blue-200",
    green: "bg-gradient-to-br from-green-400/20 to-emerald-300/20 border-green-200",
    purple: "bg-gradient-to-br from-purple-400/20 to-indigo-300/20 border-purple-200",
    pink: "bg-gradient-to-br from-pink-400/20 to-rose-300/20 border-pink-200"
  };

  return (
    <div 
      className={`
        backdrop-blur-sm rounded-xl p-6 border shadow-lg
        ${gradientClasses[gradient]}
        ${hoverable ? 'hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
}
