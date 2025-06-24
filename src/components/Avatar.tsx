// مكون صورة شخصية مع تأثيرات
import React from 'react';

// تعريف واجهة المستخدم لتكون متوافقة مع البيانات القادمة
interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
}

interface AvatarProps {
  user: User; // استخدام كائن المستخدم مباشرة
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  gradient?: boolean;
  className?: string;
}

export default function Avatar({ 
  user, 
  size = 'md', 
  status,
  gradient = true,
  className = ''
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl", 
    xl: "h-24 w-24 text-3xl"
  };

  const statusClasses = {
    online: "bg-green-400 border-white",
    offline: "bg-gray-400 border-white", 
    away: "bg-yellow-400 border-white"
  };

  const statusSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-5 w-5"
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center font-bold text-white
          ${gradient ? 'bg-gradient-to-br from-blue-500 to-green-400' : 'bg-gray-400'}
          transition-transform duration-200 hover:scale-110 shadow-lg
        `}
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.fullName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user.fullName.charAt(0).toUpperCase()
        )}
      </div>
      
      {status && (
        <div 
          className={`
            absolute bottom-0 right-0 rounded-full border-2
            ${statusClasses[status]}
            ${statusSizes[size]}
            ${status === 'online' ? 'animate-pulse' : ''}
          `}
        />
      )}
    </div>
  );
}
