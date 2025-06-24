// أدوات مساعدة للتكيف مع أحجام الشاشات المختلفة
import { BREAKPOINTS } from '../constants/app';

// نوع الجهاز المكتشف
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// كشف نوع الجهاز (للاستخدام الحالي في Web)
export const detectDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.tablet) {
    return 'mobile';
  } else if (width < BREAKPOINTS.laptop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// فئات CSS للتكيف مع الأجهزة المختلفة
export const getResponsiveClasses = (deviceType?: DeviceType) => {
  const device = deviceType || detectDeviceType();
  
  return {
    container: {
      mobile: 'px-4 py-4',
      tablet: 'px-6 py-6',
      desktop: 'px-8 py-8',
    }[device],
    
    text: {
      mobile: 'text-sm',
      tablet: 'text-base',
      desktop: 'text-lg',
    }[device],
    
    heading: {
      mobile: 'text-xl',
      tablet: 'text-2xl',
      desktop: 'text-3xl',
    }[device],
    
    button: {
      mobile: 'px-4 py-2 text-sm',
      tablet: 'px-6 py-3 text-base',
      desktop: 'px-8 py-4 text-lg',
    }[device],
    
    input: {
      mobile: 'px-3 py-2 text-sm',
      tablet: 'px-4 py-3 text-base',
      desktop: 'px-4 py-3 text-lg',
    }[device],
    
    spacing: {
      mobile: 'space-y-3',
      tablet: 'space-y-4',
      desktop: 'space-y-6',
    }[device],
  };
};

// تحويل البكسل إلى rem للتوافق مع الأجهزة المختلفة
export const pxToRem = (px: number, baseFontSize: number = 16): string => {
  return `${px / baseFontSize}rem`;
};

// تحويل البكسل إلى vw للتصميم المتجاوب
export const pxToVw = (px: number, viewportWidth: number = 1440): string => {
  return `${(px / viewportWidth) * 100}vw`;
};

// فئة مساعدة لإدارة التخزين المحلي مع توافق الخادم
export class Storage {
  static get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static set(key: string, value: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  static remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  static clear(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}

// تنسيق التاريخ مع دعم العربية
export const formatDate = (
  date: string | Date,
  locale: string = 'ar-SA',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

// تنسيق الوقت النسبي (منذ 5 دقائق، منذ ساعة، إلخ)
export const formatRelativeTime = (date: string | Date, locale: string = 'ar'): string => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'الآن';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  } else {
    return formatDate(dateObj, locale, { month: 'short', day: 'numeric' });
  }
};

// تحقق من صحة البريد الإلكتروني
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// تحقق من صحة رقم الهاتف
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// تقصير النص مع إضافة نقاط
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// تنسيق الأرقام (1000 → 1ك، 1000000 → 1م)
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}ك`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}م`;
  return `${(num / 1000000000).toFixed(1)}ب`;
};
