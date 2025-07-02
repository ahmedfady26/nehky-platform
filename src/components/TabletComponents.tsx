'use client'

// مكونات محسنة خصيصاً للتابلت والآيباد
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Play, User, Menu, X, Grid3X3, List } from 'lucide-react';

// Hook لكشف نوع الجهاز
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    function updateDeviceType() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
      
      setIsLandscape(width > height);
    }

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return { deviceType, isLandscape };
}

// شريط تنقل محسن للتابلت
interface TabletNavigationProps {
  className?: string;
}

export function TabletNavigation({ className = '' }: TabletNavigationProps) {
  const pathname = usePathname();
  const { deviceType, isLandscape } = useDeviceType();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (deviceType !== 'tablet') return null;

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/explore', label: 'استكشف', icon: Search },
    { href: '/videos', label: 'فيديوهاتي', icon: Play },
    { href: '/profile', label: 'الملف الشخصي', icon: User },
  ];

  return (
    <nav className={`tablet-navigation bg-white/95 backdrop-blur-md border-b border-gray-200 ${className}`}>
      <div className="tablet-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ن</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-nehky-primary to-nehky-secondary bg-clip-text text-transparent">
              نحكي
            </h1>
          </Link>

          {/* Center Navigation - Landscape only */}
          {isLandscape && (
            <div className="flex items-center space-x-8 space-x-reverse">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-nehky-primary/10 text-nehky-primary'
                        : 'text-gray-600 hover:text-nehky-primary hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search for Landscape */}
            {isLandscape && (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ابحث..."
                  className="pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-nehky-primary/20 focus:bg-white transition-all w-64"
                />
              </div>
            )}
            
            {/* Menu Button for Portrait */}
            {!isLandscape && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-nehky-primary transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Portrait Menu */}
        {!isLandscape && isMenuOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-nehky-primary/10 text-nehky-primary'
                        : 'text-gray-600 hover:text-nehky-primary hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={24} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {/* Search for Portrait */}
            <div className="mt-4 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن محتوى أو مبدعين..."
                className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nehky-primary/20 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// شبكة محتوى متكيفة للتابلت
interface TabletGridProps {
  children: React.ReactNode;
  columns?: 'auto' | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TabletGrid({ 
  children, 
  columns = 'auto', 
  gap = 'md', 
  className = '' 
}: TabletGridProps) {
  const { deviceType, isLandscape } = useDeviceType();

  if (deviceType !== 'tablet') {
    return <div className={className}>{children}</div>;
  }

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6', 
    lg: 'gap-8'
  };

  const getGridColumns = () => {
    if (columns === 'auto') {
      return isLandscape ? 'grid-cols-3' : 'grid-cols-2';
    }
    return `grid-cols-${columns}`;
  };

  return (
    <div className={`tablet-grid ${getGridColumns()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// بطاقة محسنة للتابلت
interface TabletCardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function TabletCard({ 
  children, 
  hover = true, 
  padding = 'md', 
  className = '',
  onClick 
}: TabletCardProps) {
  const { deviceType } = useDeviceType();

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `
    bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300
    ${deviceType === 'tablet' ? 'ipad-card' : ''}
    ${hover && deviceType === 'tablet' ? 'tablet-touch-target' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

// أزرار محسنة للتابلت
interface TabletButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function TabletButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  onClick, 
  href, 
  className = '' 
}: TabletButtonProps) {
  const { deviceType } = useDeviceType();

  const baseClasses = `
    font-semibold rounded-xl transition-all duration-300 
    flex items-center justify-center gap-2
    ${deviceType === 'tablet' ? 'tablet-button tablet-touch-target' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantClasses = {
    primary: 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-md',
    outline: 'border-2 border-nehky-primary text-nehky-primary hover:bg-nehky-primary hover:text-white'
  };

  const sizeClasses = {
    sm: deviceType === 'tablet' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-sm',
    md: deviceType === 'tablet' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
    lg: deviceType === 'tablet' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
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

// تبديل عرض الشبكة/القائمة للتابلت
interface TabletViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  className?: string;
}

export function TabletViewToggle({ view, onViewChange, className = '' }: TabletViewToggleProps) {
  const { deviceType } = useDeviceType();

  if (deviceType !== 'tablet') return null;

  return (
    <div className={`flex items-center bg-gray-100 p-1 rounded-lg ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-all ${
          view === 'grid' 
            ? 'bg-white text-nehky-primary shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Grid3X3 size={20} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-md transition-all ${
          view === 'list' 
            ? 'bg-white text-nehky-primary shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <List size={20} />
      </button>
    </div>
  );
}
