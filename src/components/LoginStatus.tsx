import { useEffect, useState } from 'react';
import AuthHelper from '@/lib/auth-helper';

interface LoginStatusProps {
  className?: string;
}

const LoginStatus: React.FC<LoginStatusProps> = ({ className = '' }) => {
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isValid = AuthHelper.isTokenValid();
      setIsLoggedIn(isValid);
      
      if (isValid) {
        setRemainingDays(AuthHelper.getRemainingDays());
        setIsRememberMe(AuthHelper.isRememberMeEnabled());
      }
    };

    checkLoginStatus();
    
    // تحديث الحالة كل دقيقة
    const interval = setInterval(checkLoginStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatRemainingTime = (days: number): string => {
    if (days > 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (months >= 12) {
        return 'سنة كاملة';
      }
      return remainingDays > 0 ? `${months} شهر و ${remainingDays} يوم` : `${months} شهر`;
    }
    return `${days} يوم`;
  };

  if (!isLoggedIn) {
    return null;
  }

  const formattedTime = formatRemainingTime(remainingDays);

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      {isRememberMe ? (
        <span className="flex items-center gap-1">
          <span className="text-green-600">🔒</span>
          تسجيل دخول دائم ({formattedTime} متبقية)
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <span className="text-blue-600">⏰</span>
          جلسة مؤقتة ({formattedTime} متبقية)
        </span>
      )}
    </div>
  );
};

export default LoginStatus;
