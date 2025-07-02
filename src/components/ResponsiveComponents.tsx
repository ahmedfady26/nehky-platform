'use client'

// Hook للكشف عن حجم الشاشة
import { useState, useEffect } from 'react';

interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768
  });

  useEffect(() => {
    function updateScreenSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height
      });
    }

    // Initial check
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// مكون مخصص للاستجابة للشاشات المختلفة
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  mobileClassName = '', 
  tabletClassName = '', 
  desktopClassName = '' 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  const combinedClassName = [
    className,
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}

// مكون للنص المتجاوب
interface ResponsiveTextProps {
  children: React.ReactNode;
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  className?: string;
}

export function ResponsiveText({ 
  children, 
  mobileSize = 'text-sm', 
  tabletSize = 'text-base', 
  desktopSize = 'text-lg',
  className = ''
}: ResponsiveTextProps) {
  return (
    <span className={`${mobileSize} md:${tabletSize} lg:${desktopSize} ${className}`}>
      {children}
    </span>
  );
}

// مكون للأزرار المتجاوبة
interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function ResponsiveButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false
}: ResponsiveButtonProps) {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 touch-target';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    outline: 'border-2 border-nehky-primary text-nehky-primary hover:bg-nehky-primary hover:text-white'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm md:px-4 md:py-2',
    md: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
    lg: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg'
  };

  const combinedClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
