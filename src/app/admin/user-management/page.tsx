'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminPage } from '@/hooks/useAdminPage'
import { AUTO_REFRESH_INTERVALS } from '@/hooks/useAutoRefresh'
import AutoRefreshControls from '@/components/AutoRefreshControls'

interface User {
  id: string
  username: string
  fullName: string
  email: string
  phone: string
  role: string
  verified: boolean
  followersCount: number
  followingCount: number
  createdAt: string
  lastLogin?: string
  adminProfile?: {
    id: string
    role: string
    department?: string
    isActive: boolean
  }
}

interface UserStats {
  totalUsers: number
  verifiedUsers: number
  influencers: number
  topFollowers: number
  admins: number
  newUsersToday: number
  activeUsersToday: number
  topUsersByFollowers: User[]
  recentRegistrations: User[]
  adminActivities: Array<{
    time: string
    action: string
    details: string
  }>
}

export default function AdminUserManagement() {
  const router = useRouter()
  
  // حالات التحقق من الصلاحيات
  const [authLoading, setAuthLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)
  const [authError, setAuthError] = useState('')
  
  // فلاتر البحث
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    verified: '',
    dateFrom: '',
    dateTo: '',
    minFollowers: '',
    maxFollowers: ''
  })
  
  const [selectedTab, setSelectedTab] = useState('overview')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(25)

  // دالة جلب بيانات المستخدمين - بيانات تجريبية
  const fetchUserData = useCallback(async () => {
    if (!hasPermission) return null

    console.log('📊 جلب بيانات المستخدمين التجريبية...')
    
    // محاكاة تأخير API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // بيانات تجريبية للمستخدمين
    const demoUsers: User[] = [
      {
        id: 'user-1',
        username: 'أحمد_المطور',
        fullName: 'أحمد محمد المطور',
        email: 'ahmed@nehky.com',
        phone: '+966501234567',
        role: 'INFLUENCER',
        verified: true,
        followersCount: 15420,
        followingCount: 234,
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'user-2',
        username: 'فاطمة_التقنية',
        fullName: 'فاطمة علي التقنية',
        email: 'fatima@nehky.com',
        phone: '+966507654321',
        role: 'TOP_FOLLOWER',
        verified: true,
        followersCount: 890,
        followingCount: 456,
        createdAt: '2024-02-20T14:15:00Z',
        lastLogin: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'user-3',
        username: 'محمد_المحتوى',
        fullName: 'محمد سالم صانع المحتوى',
        email: 'mohammed@nehky.com',
        phone: '+966502345678',
        role: 'USER',
        verified: false,
        followersCount: 125,
        followingCount: 89,
        createdAt: '2024-03-10T09:45:00Z',
        lastLogin: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'user-4',
        username: 'سارة_الإبداع',
        fullName: 'سارة خالد الإبداعية',
        email: 'sara@nehky.com',
        phone: '+966503456789',
        role: 'INFLUENCER',
        verified: true,
        followersCount: 8760,
        followingCount: 145,
        createdAt: '2024-01-28T16:20:00Z',
        lastLogin: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'user-5',
        username: 'عبدالله_التطوير',
        fullName: 'عبدالله أحمد المطور',
        email: 'abdullah@nehky.com',
        phone: '+966504567890',
        role: 'USER',
        verified: true,
        followersCount: 567,
        followingCount: 234,
        createdAt: '2024-04-05T11:30:00Z',
        lastLogin: new Date().toISOString(),
        adminProfile: {
          id: 'admin-1',
          role: 'SYSTEM_ADMIN',
          department: 'التطوير التقني',
          isActive: true
        }
      }
    ]

    const today = new Date().toISOString().split('T')[0]
    
    const stats: UserStats = {
      totalUsers: demoUsers.length + 1250, // إجمالي أكبر للتجريب
      verifiedUsers: demoUsers.filter(user => user.verified).length + 890,
      influencers: demoUsers.filter(user => user.role === 'INFLUENCER').length + 45,
      topFollowers: demoUsers.filter(user => user.role === 'TOP_FOLLOWER').length + 23,
      admins: demoUsers.filter(user => user.adminProfile).length + 5,
      newUsersToday: 12,
      activeUsersToday: 156,
      topUsersByFollowers: demoUsers
        .sort((a, b) => b.followersCount - a.followersCount)
        .slice(0, 5),
      recentRegistrations: demoUsers
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
      adminActivities: [
        {
          time: new Date().toLocaleString('ar-SA'),
          action: 'مراجعة البيانات',
          details: 'تم تحديث إحصائيات المستخدمين'
        },
        {
          time: new Date(Date.now() - 1800000).toLocaleString('ar-SA'),
          action: 'تفعيل حساب',
          details: 'تم تفعيل حساب المؤثر أحمد_المطور'
        },
        {
          time: new Date(Date.now() - 3600000).toLocaleString('ar-SA'),
          action: 'إضافة مستخدم',
          details: 'تم تسجيل مستخدم جديد: سارة_الإبداع'
        }
      ]
    }

    return {
      users: demoUsers,
      stats,
      pagination: {
        total: stats.totalUsers,
        page: currentPage,
        limit,
        totalPages: Math.ceil(stats.totalUsers / limit)
      }
    }
  }, [hasPermission, currentPage, limit, sortBy, sortOrder, filters])

  // استخدام نظام التحديث التلقائي (تحديث كل دقيقة للمستخدمين)
  const {
    data: userData,
    loading,
    error,
    lastRefreshTime,
    refresh,
    toggleAutoRefresh,
    changeRefreshInterval,
    autoRefresh
  } = useAdminPage(fetchUserData, {
    defaultInterval: AUTO_REFRESH_INTERVALS.SLOW,
    enabledByDefault: true
  })

  // التحقق من صلاحيات الإدارة - مبسط للوضع التجريبي
  const checkAdminPermissions = async () => {
    setAuthLoading(true)
    try {
      console.log('🎭 وضع تجريبي - تخطي فحص الصلاحيات')
      
      // في الوضع التجريبي، منح الصلاحيات مباشرة
      setHasPermission(true)
      setAuthError('')
      
      console.log('✅ تم منح صلاحيات إدارة المستخدمين (وضع تجريبي)')

    } catch (err: any) {
      console.error('خطأ في التحقق من الصلاحيات:', err)
      setAuthError('حدث خطأ في النظام')
      setHasPermission(false)
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    checkAdminPermissions()
  }, [])

  // إذا كان يتم التحقق من الصلاحيات
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🔒 التحقق من الصلاحيات</h2>
          <p className="text-gray-600">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    )
  }

  // إذا لم تكن هناك صلاحيات
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-semibold text-red-800 mb-4">وصول مرفوض</h2>
          <p className="text-red-600 mb-6">{authError}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin')}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              العودة للوحة الإدارة
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { users = [], stats, pagination } = userData || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">👥 إدارة المستخدمين</h1>
              <p className="text-gray-600 mt-2">مراقبة وإدارة جميع حسابات المستخدمين في المنصة</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← العودة للوحة الإدارة
            </button>
          </div>

          {/* التحديث التلقائي */}
          <AutoRefreshControls
            isActive={autoRefresh.active}
            onToggle={toggleAutoRefresh}
            onIntervalChange={changeRefreshInterval}
            currentInterval={autoRefresh.interval}
            lastRefreshTime={lastRefreshTime || undefined}
            className="mb-4"
          />

          {/* أزرار التحديث والإجراءات */}
          <div className="flex items-center gap-4">
            <button
              onClick={refresh}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '🔄 تحديث...' : '🔄 تحديث يدوي'}
            </button>
            
            <button
              onClick={() => setFilters({
                search: '', role: '', verified: '', dateFrom: '', dateTo: '', 
                minFollowers: '', maxFollowers: ''
              })}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              🗑️ مسح المرشحات
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 إجمالي المستخدمين</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                جديد اليوم: {stats.newUsersToday}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ مستخدمون موثقون</h3>
              <p className="text-3xl font-bold text-green-600">{stats.verifiedUsers.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                نسبة: {stats.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🌟 مؤثرون</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.influencers.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                كبار متابعين: {stats.topFollowers}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">👑 إداريون</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.admins.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                نشط اليوم: {stats.activeUsersToday}
              </div>
            </div>
          </div>
        )}

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">خطأ في جلب البيانات:</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* التبويبات */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: '📊 نظرة عامة' },
                { id: 'users', label: '👥 المستخدمون' },
                { id: 'admins', label: '👑 الإداريون' },
                { id: 'devices', label: '📱 الأجهزة' },
                { id: 'trends', label: '🔥 مراجعة الترندات' },
                { id: 'analytics', label: '📈 التحليلات' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* محتوى التبويبات */}
          <div className="p-6">
            {selectedTab === 'overview' && stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* أهم المستخدمين */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">🏆 أهم المستخدمين بالمتابعين</h3>
                  {stats.topUsersByFollowers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between bg-gradient-to-l from-blue-50 to-transparent p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {user.fullName}
                            {user.verified && <span className="text-blue-500">✓</span>}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{user.followersCount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">متابع</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* التسجيلات الأخيرة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">👤 التسجيلات الأخيرة</h3>
                  {stats.recentRegistrations.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="border-r-4 border-green-500 pr-4 py-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-6">
                {/* فلاتر البحث */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="البحث في المستخدمين..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الأدوار</option>
                    <option value="USER">مستخدم عادي</option>
                    <option value="INFLUENCER">مؤثر</option>
                    <option value="TOP_FOLLOWER">كبير متابعين</option>
                  </select>

                  <select
                    value={filters.verified}
                    onChange={(e) => setFilters({...filters, verified: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="true">موثق</option>
                    <option value="false">غير موثق</option>
                  </select>

                  <input
                    type="number"
                    placeholder="أقل عدد متابعين"
                    value={filters.minFollowers}
                    onChange={(e) => setFilters({...filters, minFollowers: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* جدول المستخدمين */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدور</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتابعون</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span className="mr-2">جاري التحميل...</span>
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            لا توجد بيانات للعرض
                          </td>
                        </tr>
                      ) : (
                        users.map((user: User) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{user.fullName}</span>
                                    {user.verified && <span className="text-blue-500">✓</span>}
                                    {user.adminProfile && <span className="text-purple-500">👑</span>}
                                  </div>
                                  <div className="text-sm text-gray-500">@{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'INFLUENCER' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'TOP_FOLLOWER' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role === 'INFLUENCER' ? '🌟 مؤثر' :
                                 user.role === 'TOP_FOLLOWER' ? '⭐ كبير متابعين' : '👤 مستخدم'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-900">{user.followersCount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">
                                يتابع: {user.followingCount.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</div>
                              {user.lastLogin && (
                                <div className="text-xs">
                                  آخر دخول: {new Date(user.lastLogin).toLocaleDateString('ar-EG')}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {user.verified ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  ✅ موثق
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  ⏳ غير موثق
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  👁️ عرض
                                </button>
                                <button className="text-green-600 hover:text-green-800 text-sm">
                                  ✏️ تعديل
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* التنقل بين الصفحات */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      عرض {((currentPage - 1) * limit) + 1} إلى {Math.min(currentPage * limit, pagination.total)} من {pagination.total} مستخدم
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                      >
                        السابق
                      </button>
                      <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
                        {currentPage} من {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'admins' && stats && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">👑 إدارة الإداريين</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-purple-800 mb-2">👑 إجمالي الإداريين</h4>
                    <div className="text-3xl font-bold text-purple-600">{stats.admins}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-green-800 mb-2">✅ نشط اليوم</h4>
                    <div className="text-3xl font-bold text-green-600">{stats.activeUsersToday}</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-blue-800 mb-2">📊 نسبة الإداريين</h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.totalUsers > 0 ? ((stats.admins / stats.totalUsers) * 100).toFixed(2) : 0}%
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">👥 قائمة الإداريين</h4>
                  <div className="space-y-4">
                    {users.filter((user: User) => user.adminProfile).map((admin: User) => (
                      <div key={admin.id} className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                            👑
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {admin.fullName}
                              {admin.verified && <span className="text-blue-500">✓</span>}
                            </div>
                            <div className="text-sm text-gray-500">@{admin.username}</div>
                            <div className="text-sm text-purple-600">
                              {admin.adminProfile?.role} - {admin.adminProfile?.department || 'عام'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            admin.adminProfile?.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.adminProfile?.isActive ? '✅ نشط' : '⏸️ معطل'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && stats && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">📈 تحليلات المستخدمين</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-blue-800 mb-2">📈 معدل النمو</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      +{stats.newUsersToday}
                    </div>
                    <div className="text-sm text-blue-600">مستخدم جديد اليوم</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-green-800 mb-2">✅ معدل التوثيق</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-green-600">من إجمالي المستخدمين</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-purple-800 mb-2">🌟 معدل التأثير</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.totalUsers > 0 ? ((stats.influencers / stats.totalUsers) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-purple-600">نسبة المؤثرين</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">📊 إحصائيات تفصيلية</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.verifiedUsers}</div>
                      <div className="text-sm text-gray-600">موثق</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{stats.influencers}</div>
                      <div className="text-sm text-gray-600">مؤثر</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{stats.activeUsersToday}</div>
                      <div className="text-sm text-gray-600">نشط اليوم</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'devices' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">📱 إحصائيات الأجهزة</h3>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    📊 عرض إحصائيات شاملة عن أجهزة المستخدمين وأنماط تسجيل الدخول
                  </p>
                </div>

                {/* إحصائيات سريعة للأجهزة */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">💻</div>
                      <div className="text-2xl font-bold text-blue-600">456</div>
                      <div className="text-sm text-gray-600">أجهزة كمبيوتر</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="text-2xl font-bold text-green-600">123</div>
                      <div className="text-sm text-gray-600">أجهزة جوال</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-2xl font-bold text-purple-600">89</div>
                      <div className="text-sm text-gray-600">أجهزة لوحية</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌍</div>
                      <div className="text-2xl font-bold text-orange-600">15</div>
                      <div className="text-sm text-gray-600">دولة</div>
                    </div>
                  </div>
                </div>

                {/* أنظمة التشغيل والمتصفحات */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">🖥️ أنظمة التشغيل</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Windows</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">65%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">macOS</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-gray-800 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Linux</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{width: '10%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">🌐 المتصفحات</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Chrome</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">70%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Safari</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '20%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">20%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Firefox</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{width: '10%'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">📈 آخر عمليات تسجيل الدخول</h4>
                    <button 
                      onClick={() => window.open('/api/admin/device-analytics', '_blank')}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                    >
                      عرض التقرير الكامل →
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    عرض تفاصيل 20 عملية تسجيل دخول الأحدث مع معلومات الأجهزة والمواقع
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'trends' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">🔥 سجلات مراجعة الترندات</h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">
                    📋 عرض جميع الإجراءات التي اتخذها الإداريون على الكلمات الشائعة والترندات
                  </p>
                </div>

                {/* إحصائيات سريعة للمراجعات */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚫</div>
                      <div className="text-2xl font-bold text-red-600">23</div>
                      <div className="text-sm text-gray-600">كلمة محجوبة</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📌</div>
                      <div className="text-2xl font-bold text-green-600">15</div>
                      <div className="text-sm text-gray-600">كلمة مثبتة</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⏳</div>
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <div className="text-sm text-gray-600">كلمة مؤجلة</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-2xl font-bold text-blue-600">42</div>
                      <div className="text-sm text-gray-600">كلمة موافق عليها</div>
                    </div>
                  </div>
                </div>

                {/* أنشطة الإداريين */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">👥 أنشطة الإداريين</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          أ
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">أحمد المشرف</div>
                          <div className="text-sm text-gray-600">مشرف عام</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">12 إجراء</div>
                        <div className="text-xs text-gray-500">آخر نشاط: منذ ساعتين</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          ف
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">فاطمة المراجعة</div>
                          <div className="text-sm text-gray-600">مراجع محتوى</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">8 إجراءات</div>
                        <div className="text-xs text-gray-500">آخر نشاط: منذ 4 ساعات</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* آخر المراجعات */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">📝 آخر المراجعات</h4>
                    <button 
                      onClick={() => window.open('/api/admin/trend-reviews', '_blank')}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                    >
                      عرض السجل الكامل →
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs mr-3">🚫</span>
                        <div>
                          <div className="font-medium text-gray-800">#تقنية_مشكوك_فيها</div>
                          <div className="text-sm text-gray-600">حجب بواسطة أحمد المشرف</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">منذ 30 دقيقة</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">📌</span>
                        <div>
                          <div className="font-medium text-gray-800">#الذكاء_الاصطناعي</div>
                          <div className="text-sm text-gray-600">تثبيت بواسطة فاطمة المراجعة</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">منذ ساعة</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mr-3">⏳</span>
                        <div>
                          <div className="font-medium text-gray-800">#البرمجة_السحابية</div>
                          <div className="text-sm text-gray-600">تأجيل بواسطة أحمد المشرف</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">منذ ساعتين</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
