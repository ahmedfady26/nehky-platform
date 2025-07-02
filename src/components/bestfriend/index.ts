/**
 * 🎭 مكونات نظام الصديق الأفضل - المرحلة الرابعة
 * 
 * تصدير جميع المكونات المتعلقة بالصلاحيات والامتيازات
 */

// مكونات الشارات
export { default as BestFriendBadge } from './BestFriendBadge'
export { SimpleBestFriendBadge, CompactBestFriendBadge } from './BestFriendBadge'

// مكونات طلبات الصلاحيات
export { default as PermissionRequestCard } from './PermissionRequest'
export { PermissionRequestsList } from './PermissionRequest'

// لوحة التحكم الرئيسية
export { default as BestFriendDashboard } from './BestFriendDashboard'

// أنواع البيانات المشتركة
export interface BestFriendComponentProps {
  userId: string
  className?: string
}

export interface BadgeVariant {
  size: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export interface PermissionRequestComponentProps {
  onApprove: (requestId: string, message?: string) => Promise<void>
  onReject: (requestId: string, reason?: string) => Promise<void>
  isProcessing?: boolean
}

// مساعدات للتطوير
export const COMPONENT_VERSIONS = {
  BestFriendBadge: '1.0.0',
  PermissionRequest: '1.0.0', 
  BestFriendDashboard: '1.0.0'
} as const

export const SUPPORTED_RELATIONSHIP_STRENGTHS = [
  'WEAK',
  'MODERATE', 
  'STRONG',
  'VERY_STRONG'
] as const

export const PERMISSION_TYPES = [
  'POST_ON_PROFILE',
  'SEND_MESSAGE',
  'TAG_IN_POST', 
  'SHARE_CONTENT'
] as const
