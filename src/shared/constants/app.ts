// ثوابت التطبيق العامة - قابلة للاستخدام في Web/Mobile
export const APP_CONFIG = {
  name: 'نحكي',
  tagline: 'حيث يأتي الحضور',
  description: 'نحكي هي المنصة اللي الكل فيها موجود',
  version: '1.0.0',
  supportedLanguages: ['ar', 'en'],
  defaultLanguage: 'ar',
  rtlLanguages: ['ar'],
} as const;

// أحجام الشاشات للاستخدام المستقبلي
export const BREAKPOINTS = {
  mobile: 320,
  mobileLarge: 425,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  desktopLarge: 2560,
} as const;

// أبعاد المكونات القابلة للتكيف
export const COMPONENT_SIZES = {
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80,
  },
  button: {
    sm: { height: 32, fontSize: 14 },
    md: { height: 40, fontSize: 16 },
    lg: { height: 48, fontSize: 18 },
    xl: { height: 56, fontSize: 20 },
  },
  input: {
    sm: { height: 32, fontSize: 14 },
    md: { height: 40, fontSize: 16 },
    lg: { height: 48, fontSize: 18 },
  },
} as const;

// ألوان المنصة - متوافقة مع الأنظمة المختلفة
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  success: {
    500: '#10b981',
    600: '#059669',
  },
} as const;

// إعدادات نظام النقاط
export const POINTS_SYSTEM = {
  POST_CREATE: 20,
  COMMENT_CREATE: 10,
  LIKE_GIVE: 5,
  FOLLOW: 3,
  SHARE: 8,
} as const;

// حدود النظام
export const LIMITS = {
  POST_LENGTH: 2000,
  COMMENT_LENGTH: 500,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  TOP_FOLLOWERS_COUNT: 3,
  TOP_FOLLOWERS_PERIOD_WEEKS: 2,
  MAX_POST_IMAGES: 10,
} as const;
