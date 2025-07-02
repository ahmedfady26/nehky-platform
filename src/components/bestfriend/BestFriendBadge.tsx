'use client'

import React from 'react'
import { Heart, Star, Crown, Shield } from 'lucide-react'
import { RelationshipStrength } from '@prisma/client'

interface BestFriendBadgeProps {
  relationshipStrength: RelationshipStrength
  username: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  onClick?: () => void
}

const BADGE_CONFIG = {
  [RelationshipStrength.WEAK]: {
    icon: Heart,
    color: 'text-pink-500 bg-pink-50 border-pink-200',
    label: 'صديق جديد',
    emoji: '💗',
    gradient: 'from-pink-400 to-pink-600'
  },
  [RelationshipStrength.MODERATE]: {
    icon: Star,
    color: 'text-blue-500 bg-blue-50 border-blue-200',
    label: 'صديق جيد',
    emoji: '⭐',
    gradient: 'from-blue-400 to-blue-600'
  },
  [RelationshipStrength.STRONG]: {
    icon: Crown,
    color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    label: 'صديق مميز',
    emoji: '👑',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  [RelationshipStrength.VERY_STRONG]: {
    icon: Shield,
    color: 'text-purple-500 bg-purple-50 border-purple-200',
    label: 'أفضل صديق',
    emoji: '🛡️',
    gradient: 'from-purple-400 to-purple-600'
  }
}

const SIZES = {
  sm: {
    badge: 'w-6 h-6 text-xs',
    icon: 'w-3 h-3',
    text: 'text-xs'
  },
  md: {
    badge: 'w-8 h-8 text-sm',
    icon: 'w-4 h-4',
    text: 'text-sm'
  },
  lg: {
    badge: 'w-12 h-12 text-lg',
    icon: 'w-6 h-6',
    text: 'text-lg'
  }
}

export default function BestFriendBadge({
  relationshipStrength,
  username,
  size = 'md',
  showLabel = false,
  animated = false,
  onClick
}: BestFriendBadgeProps) {
  const config = BADGE_CONFIG[relationshipStrength]
  const sizeConfig = SIZES[size]
  const IconComponent = config.icon

  return (
    <div 
      className={`
        inline-flex items-center gap-2 
        ${onClick ? 'cursor-pointer hover:scale-105' : ''} 
        transition-all duration-200
        ${animated ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
      title={`${config.label} - ${username}`}
    >
      {/* الشارة الرئيسية */}
      <div className={`
        ${sizeConfig.badge} ${config.color}
        border-2 rounded-full
        flex items-center justify-center
        shadow-lg relative overflow-hidden
        group
      `}>
        {/* التدرج المتحرك */}
        {animated && (
          <div className={`
            absolute inset-0 bg-gradient-to-r ${config.gradient}
            opacity-0 group-hover:opacity-20
            transition-opacity duration-300
          `} />
        )}
        
        {/* الأيقونة */}
        <IconComponent className={`${sizeConfig.icon} z-10`} />
        
        {/* النقاط المتحركة للتأثير */}
        {animated && (
          <>
            <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping delay-200" />
          </>
        )}
      </div>

      {/* النص والتسمية */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`${sizeConfig.text} font-semibold text-gray-800`}>
            {config.emoji} {config.label}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-500">
              @{username}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// مكون الشارة المبسطة للاستخدام في القوائم
export function SimpleBestFriendBadge({ 
  relationshipStrength 
}: { 
  relationshipStrength: RelationshipStrength 
}) {
  const config = BADGE_CONFIG[relationshipStrength]
  
  return (
    <span 
      className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${config.color}
      `}
      title={config.label}
    >
      {config.emoji} {config.label}
    </span>
  )
}

// مكون الشارة المضغوطة للتعليقات والمنشورات
export function CompactBestFriendBadge({ 
  relationshipStrength 
}: { 
  relationshipStrength: RelationshipStrength 
}) {
  const config = BADGE_CONFIG[relationshipStrength]
  const IconComponent = config.icon
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center
        w-5 h-5 rounded-full ${config.color}
        border shadow-sm
      `}
      title={config.label}
    >
      <IconComponent className="w-3 h-3" />
    </div>
  )
}
