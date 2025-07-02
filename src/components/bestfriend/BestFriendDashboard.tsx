'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Calendar,
  Shield,
  Star,
  Award,
  Settings,
  Activity
} from 'lucide-react'
import BestFriendBadge, { SimpleBestFriendBadge } from './BestFriendBadge'
import { PermissionRequestsList } from './PermissionRequest'
import { RelationshipStrength } from '@prisma/client'

interface BestFriendStats {
  totalBestFriends: number
  totalInteractions: number
  averageCompatibility: number
  monthlyActivity: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
}

interface BestFriend {
  id: string
  username: string
  fullName: string
  profilePicture?: string
  relationshipStrength: RelationshipStrength
  startDate: Date
  totalPoints: number
  lastInteraction: Date
  privileges: string[]
  restrictions: string[]
}

interface BestFriendDashboardProps {
  userId: string
  className?: string
}

export default function BestFriendDashboard({ 
  userId, 
  className = '' 
}: BestFriendDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'friends' | 'requests' | 'settings'>('overview')
  const [stats, setStats] = useState<BestFriendStats | null>(null)
  const [bestFriends, setBestFriends] = useState<BestFriend[]>([])
  const [permissionRequests, setPermissionRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [userId])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // تحميل الإحصائيات
      const statsResponse = await fetch(`/api/bestfriend/privileges?action=stats`, {
        headers: { 'user-id': userId }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // تحميل قائمة الأصدقاء
      const friendsResponse = await fetch(`/api/bestfriend/privileges?action=all`, {
        headers: { 'user-id': userId }
      })
      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json()
        setBestFriends(friendsData.data || [])
      }

      // تحميل طلبات الصلاحيات
      const requestsResponse = await fetch(`/api/bestfriend/permissions?action=pending`, {
        headers: { 'user-id': userId }
      })
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setPermissionRequests(requestsData.data || [])
      }

    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionApprove = async (requestId: string, message?: string) => {
    try {
      const response = await fetch('/api/bestfriend/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({
          action: 'respond',
          requestId,
          response: 'APPROVE',
          message
        })
      })
      
      if (response.ok) {
        await loadDashboardData() // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error('خطأ في الموافقة على الطلب:', error)
    }
  }

  const handlePermissionReject = async (requestId: string, reason?: string) => {
    try {
      const response = await fetch('/api/bestfriend/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({
          action: 'respond',
          requestId,
          response: 'REJECT',
          message: reason
        })
      })
      
      if (response.ok) {
        await loadDashboardData() // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error('خطأ في رفض الطلب:', error)
    }
  }

  const TABS = [
    { id: 'overview', label: 'نظرة عامة', icon: Activity },
    { id: 'friends', label: 'الأصدقاء المؤكدين', icon: Users },
    { id: 'requests', label: 'طلبات الصلاحيات', icon: Shield },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ]

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* رأس اللوحة */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مركز إدارة الأصدقاء المؤكدين</h1>
            <p className="text-gray-600 mt-1">إدارة العلاقات والصلاحيات والامتيازات</p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalBestFriends || 0}</div>
              <div className="text-sm text-gray-500">صديق مؤكد</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.pendingRequests || 0}</div>
              <div className="text-sm text-gray-500">طلب معلق</div>
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="border-b">
        <nav className="flex space-x-8 space-x-reverse px-6">
          {TABS.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'requests' && (stats?.pendingRequests || 0) > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats?.pendingRequests || 0}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} isLoading={isLoading} />
        )}
        
        {activeTab === 'friends' && (
          <FriendsTab 
            friends={bestFriends} 
            isLoading={isLoading}
            userId={userId}
          />
        )}
        
        {activeTab === 'requests' && (
          <RequestsTab 
            requests={permissionRequests}
            onApprove={handlePermissionApprove}
            onReject={handlePermissionReject}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab userId={userId} />
        )}
      </div>
    </div>
  )
}

// تبويب النظرة العامة
function OverviewTab({ 
  stats, 
  isLoading 
}: { 
  stats: BestFriendStats | null
  isLoading: boolean 
}) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
      ))}
    </div>
  }

  const statCards = [
    {
      title: 'إجمالي التفاعلات',
      value: stats?.totalInteractions || 0,
      icon: Heart,
      color: 'text-red-500 bg-red-50',
      change: '+12%'
    },
    {
      title: 'متوسط التوافق',
      value: `${stats?.averageCompatibility || 0}%`,
      icon: Star,
      color: 'text-yellow-500 bg-yellow-50',
      change: '+5%'
    },
    {
      title: 'النشاط الشهري',
      value: stats?.monthlyActivity || 0,
      icon: TrendingUp,
      color: 'text-green-500 bg-green-50',
      change: '+8%'
    },
    {
      title: 'الطلبات الموافق عليها',
      value: stats?.approvedRequests || 0,
      icon: Award,
      color: 'text-blue-500 bg-blue-50',
      change: '95%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 font-medium">{card.change}</span>
              <span className="text-sm text-gray-500"> من الشهر الماضي</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// تبويب الأصدقاء
function FriendsTab({ 
  friends, 
  isLoading, 
  userId 
}: { 
  friends: BestFriend[]
  isLoading: boolean
  userId: string
}) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg" />
      ))}
    </div>
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">لا توجد أصدقاء مؤكدين بعد</h3>
        <p>ابدأ بترشيح أصدقائك لبناء علاقات قوية</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {friend.profilePicture ? (
                <img 
                  src={friend.profilePicture} 
                  alt={friend.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Users className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{friend.fullName}</h3>
              <p className="text-sm text-gray-600">@{friend.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <SimpleBestFriendBadge relationshipStrength={friend.relationshipStrength} />
            <div className="text-sm text-gray-500">
              {friend.totalPoints} نقطة
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// تبويب الطلبات
function RequestsTab({ 
  requests, 
  onApprove, 
  onReject, 
  isLoading 
}: {
  requests: any[]
  onApprove: (requestId: string, message?: string) => Promise<void>
  onReject: (requestId: string, reason?: string) => Promise<void>
  isLoading: boolean
}) {
  return (
    <PermissionRequestsList
      requests={requests}
      onApprove={onApprove}
      onReject={onReject}
      isLoading={isLoading}
    />
  )
}

// تبويب الإعدادات
function SettingsTab({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">إعدادات الصلاحيات</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="mr-2 text-sm">السماح بالموافقة التلقائية للأصدقاء المقربين</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="mr-2 text-sm">إرسال إشعارات فورية للطلبات الجديدة</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded" />
            <span className="mr-2 text-sm">السماح بالنشر المباشر للأصدقاء القدامى</span>
          </label>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">منطقة الخطر</h3>
        <p className="text-sm text-yellow-700 mb-4">
          هذه الإجراءات لا يمكن التراجع عنها. تأكد من رغبتك قبل المتابعة.
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
          إزالة جميع الأصدقاء المؤكدين
        </button>
      </div>
    </div>
  )
}
