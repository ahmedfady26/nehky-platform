'use client'

// نظام مرن لإدارة التخطيطات المختلفة حسب الجهاز
import React, { createContext, useContext, useEffect, useState } from 'react';

// أنواع الأجهزة المدعومة
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-tablet' | 'foldable';
export type Orientation = 'portrait' | 'landscape';

// معلومات الجهاز
interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  isTouch: boolean;
  pixelRatio: number;
}

// Context للجهاز
interface DeviceContextType {
  device: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeTablet: boolean;
  isFoldable: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Hook لاستخدام معلومات الجهاز
export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}

// دالة تحديد نوع الجهاز
function getDeviceType(width: number, height: number): DeviceType {
  if (width < 768) {
    return 'mobile';
  } else if (width >= 768 && width < 1024) {
    return 'tablet';
  } else if (width >= 1024 && width < 1400) {
    return 'desktop';
  } else if (width >= 1400 && width < 1920) {
    return 'large-tablet';
  } else {
    return 'desktop';
  }
}

// دالة كشف الأجهزة القابلة للطي
function isFoldableDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // CSS Media Query للأجهزة القابلة للطي
  return window.matchMedia('(spanning: single-fold-vertical)').matches ||
         window.matchMedia('(spanning: single-fold-horizontal)').matches;
}

// دالة كشف الأجهزة التي تدعم اللمس
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 ||
         window.matchMedia('(pointer: coarse)').matches;
}

// مزود معلومات الجهاز
interface DeviceProviderProps {
  children: React.ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
  const [device, setDevice] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    width: 1920,
    height: 1080,
    isTouch: false,
    pixelRatio: 1,
  });

  useEffect(() => {
    function updateDeviceInfo() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const type = isFoldableDevice() ? 'foldable' : getDeviceType(width, height);
      const orientation: Orientation = width > height ? 'landscape' : 'portrait';
      const isTouch = isTouchDevice();
      const pixelRatio = window.devicePixelRatio || 1;

      setDevice({
        type,
        orientation,
        width,
        height,
        isTouch,
        pixelRatio,
      });
    }

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  const contextValue: DeviceContextType = {
    device,
    isMobile: device.type === 'mobile',
    isTablet: device.type === 'tablet',
    isDesktop: device.type === 'desktop',
    isLargeTablet: device.type === 'large-tablet',
    isFoldable: device.type === 'foldable',
    isPortrait: device.orientation === 'portrait',
    isLandscape: device.orientation === 'landscape',
  };

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
}

// مكون للعرض الشرطي حسب الجهاز
interface ResponsiveShowProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  largeTablet?: boolean;
  foldable?: boolean;
  children: React.ReactNode;
}

export function ResponsiveShow({
  mobile = false,
  tablet = false,
  desktop = false,
  largeTablet = false,
  foldable = false,
  children
}: ResponsiveShowProps) {
  const { isMobile, isTablet, isDesktop, isLargeTablet, isFoldable } = useDevice();

  const shouldShow = (
    (mobile && isMobile) ||
    (tablet && isTablet) ||
    (desktop && isDesktop) ||
    (largeTablet && isLargeTablet) ||
    (foldable && isFoldable)
  );

  if (!shouldShow) return null;

  return <>{children}</>;
}

// مكون شبكة متجاوبة متقدمة
interface AdvancedGridProps {
  children: React.ReactNode;
  className?: string;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  largeTabletColumns?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdvancedGrid({
  children,
  className = '',
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  largeTabletColumns = 4,
  gap = 'md'
}: AdvancedGridProps) {
  const { isMobile, isTablet, isDesktop, isLargeTablet } = useDevice();

  let columns = desktopColumns;
  if (isMobile) columns = mobileColumns;
  else if (isTablet) columns = tabletColumns;
  else if (isLargeTablet) columns = largeTabletColumns;

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`grid grid-cols-${columns} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// مكون تخطيط متكيف
interface AdaptiveLayoutProps {
  children: React.ReactNode;
  mobileLayout?: 'stack' | 'scroll';
  tabletLayout?: 'grid' | 'sidebar' | 'split';
  desktopLayout?: 'grid' | 'sidebar' | 'split' | 'masonry';
}

export function AdaptiveLayout({
  children,
  mobileLayout = 'stack',
  tabletLayout = 'grid',
  desktopLayout = 'grid'
}: AdaptiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useDevice();

  if (isMobile) {
    return (
      <div className={`mobile-layout ${mobileLayout === 'scroll' ? 'overflow-x-auto flex gap-4' : 'space-y-4'}`}>
        {children}
      </div>
    );
  }

  if (isTablet) {
    const tabletClasses = {
      grid: 'grid grid-cols-2 gap-6',
      sidebar: 'flex gap-6',
      split: 'grid grid-cols-2 gap-8'
    };

    return (
      <div className={`tablet-layout ${tabletClasses[tabletLayout]}`}>
        {children}
      </div>
    );
  }

  const desktopClasses = {
    grid: 'grid grid-cols-3 gap-8',
    sidebar: 'flex gap-8',
    split: 'grid grid-cols-2 gap-10',
    masonry: 'columns-3 gap-8'
  };

  return (
    <div className={`desktop-layout ${desktopClasses[desktopLayout]}`}>
      {children}
    </div>
  );
}

// مكون نص متجاوب
interface ResponsiveTextProps {
  children: React.ReactNode;
  mobileSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  tabletSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  desktopSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function ResponsiveText({
  children,
  mobileSize = 'base',
  tabletSize = 'lg',
  desktopSize = 'xl',
  weight = 'normal',
  className = ''
}: ResponsiveTextProps) {
  const { isMobile, isTablet } = useDevice();

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  let sizeClass = sizeClasses[desktopSize];
  if (isMobile) sizeClass = sizeClasses[mobileSize];
  else if (isTablet) sizeClass = sizeClasses[tabletSize];

  return (
    <span className={`${sizeClass} ${weightClasses[weight]} ${className}`}>
      {children}
    </span>
  );
}

// مكون زر متجاوب متقدم
interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  adaptiveSize?: boolean; // يغير الحجم حسب الجهاز تلقائياً
}

export function ResponsiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  adaptiveSize = true
}: ResponsiveButtonProps) {
  const { isMobile, isTablet, device } = useDevice();

  // تكييف الحجم حسب الجهاز
  let adaptedSize = size;
  if (adaptiveSize) {
    if (isMobile) adaptedSize = 'lg'; // أزرار أكبر للجوال
    else if (isTablet) adaptedSize = size; // حجم عادي للتابلت
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white hover:shadow-lg',
    secondary: 'bg-nehky-secondary text-white hover:bg-nehky-secondary-dark',
    outline: 'border-2 border-nehky-primary text-nehky-primary hover:bg-nehky-primary hover:text-white',
    ghost: 'text-nehky-primary hover:bg-nehky-primary/10'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // إضافة padding إضافي للأجهزة التي تدعم اللمس
  const touchPadding = device.isTouch ? 'min-h-[44px]' : 'min-h-[36px]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[adaptedSize]}
        ${fullWidth ? 'w-full' : ''}
        ${touchPadding}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 transform
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Hook للإيماءات (للتطوير المستقبلي)
export function useGestures() {
  const [gesture, setGesture] = useState<{
    type: 'swipe' | 'pinch' | 'tap' | null;
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
  }>({ type: null });

  useEffect(() => {
    // هنا يمكن إضافة دعم الإيماءات في المستقبل
    // مثل: Hammer.js أو مكتبة إيماءات أخرى
  }, []);

  return gesture;
}

// Hook للوضع الليلي/النهاري (للتطوير المستقبلي)
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };
}
