'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminPageRealtime } from '@/hooks/useAdminPage'
import AutoRefreshControls from '@/components/AutoRefreshControls'

interface KeywordOccurrence {
  id: string
  keyword: string
  normalizedKeyword: string
  type: string
  position?: number
  context?: string
  sentiment?: string
  language: string
  category?: string
  authorRole?: string
  authorVerified?: boolean
  authorFollowers?: number
  extractedBy: string
  occurredAt: string
  createdAt: string
  post: {
    id: string
    content: string
    createdAt: string
    likesCount: number
    commentsCount: number
    sharesCount: number
    viewsCount: number
    visibility: string
    status: string
  }
  user: {
    id: string
    username: string
    fullName: string
    role: string
    verified: boolean
    followersCount: number
  }
  trendingKeyword?: {
    id: string
    keyword: string
    category?: string
    trendScore: number
    isCurrentlyTrending: boolean
    trendRank?: number
  }
  recordedByAdmin?: {
    id: string
    role: string
    department?: string
    accessLevel: number
    user: {
      id: string
      username: string
      fullName: string
      verified: boolean
    }
  }
}

interface AdminStats {
  totalOccurrences: number
  totalUniqueKeywords: number
  totalHashtags: number
  totalMentions: number
  totalUsers: number
  totalPosts: number
  trendsToday: number
  adminReviewed: number
  systemGenerated: number
  topCategories: Array<{category: string, count: number}>
  topUsers: Array<{username: string, fullName: string, count: number}>
  topAdmins: Array<{fullName: string, role: string, count: number}>
  recentActivity: Array<{time: string, action: string, details: string}>
}

export default function AdminKeywordManagement() {
  const router = useRouter()
  
  // حالات التحقق من الصلاحيات
  const [authLoading, setAuthLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)
  const [authError, setAuthError] = useState('')
  
  // فلاتر البحث المتقدم
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    category: '',
    sentiment: '',
    authorRole: '',
    authorVerified: '',
    dateFrom: '',
    dateTo: '',
    minFollowers: '',
    maxFollowers: '',
    recordedByAdminId: '', // فلتر الإداري المسجل
    adminRole: '' // فلتر دور الإداري
  })
  
  const [selectedTab, setSelectedTab] = useState('overview')
  const [sortBy, setSortBy] = useState('occurredAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(50)

  // دالة جلب البيانات الرئيسية
  const fetchKeywordData = useCallback(async () => {
    if (!hasPermission) return null

    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    })

    const [occurrencesRes, statsRes] = await Promise.all([
      fetch(`/api/keyword-occurrences?${params}`),
      fetch('/api/admin/keyword-stats')
    ])

    if (!occurrencesRes.ok) {
      throw new Error('فشل في جلب بيانات التكرارات')
    }

    const occurrencesData = await occurrencesRes.json()
    
    // حساب إحصائيات محلية إذا لم تكن متوفرة من الخادم
    let statsData = { data: null }
    if (statsRes.ok) {
      statsData = await statsRes.json()
    }

    // حساب الإحصائيات من البيانات المجلبة
    const occurrences = occurrencesData.data || []
    const today = new Date().toISOString().split('T')[0]
    
    const adminReviewed = occurrences.filter((item: KeywordOccurrence) => item.recordedByAdmin).length
    const systemGenerated = occurrences.length - adminReviewed

    const topCategories = Object.entries(
      occurrences.reduce((acc: any, item: KeywordOccurrence) => {
        const cat = item.category || 'غير محدد'
        acc[cat] = (acc[cat] || 0) + 1
        return acc
      }, {})
    ).map(([category, count]) => ({ category, count: count as number }))
     .sort((a, b) => b.count - a.count)
     .slice(0, 5)

    const topAdmins = Object.entries(
      occurrences
        .filter((item: KeywordOccurrence) => item.recordedByAdmin)
        .reduce((acc: any, item: KeywordOccurrence) => {
          const admin = item.recordedByAdmin!
          const key = admin.user.fullName
          acc[key] = {
            fullName: admin.user.fullName,
            role: admin.role,
            count: (acc[key]?.count || 0) + 1
          }
          return acc
        }, {})
    ).map(([_, data]) => data as {fullName: string, role: string, count: number})
     .sort((a, b) => b.count - a.count)
     .slice(0, 5)

    const stats: AdminStats = {
      totalOccurrences: occurrencesData.pagination?.total || occurrences.length,
      totalUniqueKeywords: new Set(occurrences.map((item: KeywordOccurrence) => item.normalizedKeyword)).size,
      totalHashtags: occurrences.filter((item: KeywordOccurrence) => item.type === 'HASHTAG').length,
      totalMentions: occurrences.filter((item: KeywordOccurrence) => item.type === 'MENTION').length,
      totalUsers: new Set(occurrences.map((item: KeywordOccurrence) => item.user.id)).size,
      totalPosts: new Set(occurrences.map((item: KeywordOccurrence) => item.post.id)).size,
      trendsToday: occurrences.filter((item: KeywordOccurrence) => 
        item.occurredAt.startsWith(today)
      ).length,
      adminReviewed,
      systemGenerated,
      topCategories,
      topUsers: occurrencesData.stats?.topUsers?.slice(0, 5) || [],
      topAdmins,
      recentActivity: occurrences.slice(0, 10).map((item: KeywordOccurrence) => ({
        time: new Date(item.occurredAt).toLocaleString('ar-EG'),
        action: item.recordedByAdmin ? 'مراجعة إدارية' : 'استخراج تلقائي',
        details: `${item.keyword} بواسطة ${item.user.fullName}${item.recordedByAdmin ? ` (مراجع: ${item.recordedByAdmin.user.fullName})` : ''}`
      }))
    }

    return {
      occurrences,
      stats,
      pagination: occurrencesData.pagination || null
    }
  }, [hasPermission, currentPage, limit, sortBy, sortOrder, filters])

  // استخدام نظام التحديث التلقائي
  const {
    data: keywordData,
    loading,
    error,
    lastRefreshTime,
    refresh,
    toggleAutoRefresh,
    changeRefreshInterval,
    autoRefresh
  } = useAdminPageRealtime(fetchKeywordData)

  // التحقق من صلاحيات الإدارة - مبسط للوضع التجريبي
  const checkAdminPermissions = async () => {
    setAuthLoading(true)
    try {
      console.log('🎭 وضع تجريبي - تخطي فحص الصلاحيات')
      
      // في الوضع التجريبي، منح الصلاحيات مباشرة
      setHasPermission(true)
      setAuthError('')
      
      console.log('✅ تم منح صلاحيات إدارة الكلمات المفتاحية (وضع تجريبي)')

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
              onClick={() => router.push('/')}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    )
  }

  // دالة للتعامل مع إجراءات الترند
  const handleTrendAction = async (keywordId: string, actionTaken: string, notes?: string, reason?: string) => {
    try {
      const userToken = localStorage.getItem('userToken')
      const userData = localStorage.getItem('userData')
      
      if (!userToken || !userData) {
        setAuthError('بيانات المصادقة غير متوفرة')
        return
      }

      const user = JSON.parse(userData)
      
      // جلب معرف الإداري من بيانات المستخدم أو الخادم
      const adminResponse = await fetch(`/api/admin/check-permissions?userId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })
      
      if (!adminResponse.ok) {
        throw new Error('فشل في التحقق من الصلاحيات الإدارية')
      }
      
      const adminData = await adminResponse.json()
      
      const response = await fetch('/api/admin/trend-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          adminId: adminData.adminId,
          keywordId,
          actionTaken,
          notes,
          reason
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في تنفيذ الإجراء')
      }

      const result = await response.json()
      
      // إظهار رسالة نجاح
      alert(`تم ${actionTaken === 'BLOCK' ? 'حجب' : actionTaken === 'PIN' ? 'تثبيت' : 'تنفيذ'} الإجراء بنجاح`)
      
      // إعادة تحديث البيانات
      refresh()
      
    } catch (error) {
      console.error('خطأ في تنفيذ إجراء الترند:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ في تنفيذ الإجراء')
    }
  }

  const { occurrences = [], stats, pagination } = keywordData || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🔤 إدارة تكرارات الكلمات</h1>
              <p className="text-gray-600 mt-2">مراقبة وتحليل جميع الكلمات والهاشتاج والاتجاهات في المنصة</p>
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
                keyword: '', type: '', category: '', sentiment: '', authorRole: '', 
                authorVerified: '', dateFrom: '', dateTo: '', minFollowers: '', maxFollowers: '',
                recordedByAdminId: '', adminRole: ''
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 إجمالي التكرارات</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOccurrences.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span className="text-green-600">👤 مراجعة إدارية: {stats.adminReviewed}</span>
                <br />
                <span className="text-blue-600">🤖 تلقائي: {stats.systemGenerated}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔤 كلمات فريدة</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalUniqueKeywords.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                من {stats.totalPosts} منشور
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2"># هاشتاج</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalHashtags.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                منشن: {stats.totalMentions}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔥 ترندات اليوم</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.trendsToday.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-2">
                من {stats.totalUsers} مستخدم
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
                { id: 'overview', label: '📊 نظرة عامة', icon: '📊' },
                { id: 'keywords', label: '🔤 الكلمات', icon: '🔤' },
                { id: 'admins', label: '👥 الإداريين', icon: '👥' },
                { id: 'analytics', label: '📈 التحليلات', icon: '📈' }
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
                {/* أهم الفئات */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">📂 أهم الفئات</h3>
                  {stats.topCategories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-200 rounded-full h-2" style={{width: `${(cat.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}px`}}></div>
                        <span className="text-sm text-gray-500">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* آخر الأنشطة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">⏰ آخر الأنشطة</h3>
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="border-r-4 border-blue-500 pr-4 py-2">
                      <div className="text-sm text-gray-500">{activity.time}</div>
                      <div className="font-medium text-gray-800">{activity.action}</div>
                      <div className="text-gray-600">{activity.details}</div>
                    </div>
                  ))}
                </div>

                {/* أهم الإداريين */}
                {stats.topAdmins.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">👑 أهم الإداريين</h3>
                    {stats.topAdmins.map((admin, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-800">{admin.fullName}</span>
                          <span className="text-sm text-green-600 mr-2">({admin.role})</span>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          {admin.count} مراجعة
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'keywords' && (
              <div className="space-y-6">
                {/* فلاتر البحث */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="البحث في الكلمات..."
                    value={filters.keyword}
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="HASHTAG">هاشتاج</option>
                    <option value="KEYWORD">كلمة مفتاحية</option>
                    <option value="MENTION">منشن</option>
                  </select>

                  <select
                    value={filters.adminRole}
                    onChange={(e) => setFilters({...filters, adminRole: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الإداريين</option>
                    <option value="SUPER_ADMIN">مدير عام</option>
                    <option value="ADMIN">إداري</option>
                    <option value="MODERATOR">مشرف</option>
                  </select>

                  <select
                    value={filters.sentiment}
                    onChange={(e) => setFilters({...filters, sentiment: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع المشاعر</option>
                    <option value="POSITIVE">إيجابي</option>
                    <option value="NEUTRAL">محايد</option>
                    <option value="NEGATIVE">سلبي</option>
                  </select>
                </div>

                {/* جدول التكرارات */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكلمة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإداري</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشاعر</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات الترند</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span className="mr-2">جاري التحميل...</span>
                            </div>
                          </td>
                        </tr>
                      ) : occurrences.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            لا توجد بيانات للعرض
                          </td>
                        </tr>
                      ) : (
                        occurrences.map((occurrence: KeywordOccurrence) => (
                          <tr key={occurrence.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">{occurrence.keyword}</span>
                                {occurrence.trendingKeyword?.isCurrentlyTrending && (
                                  <span className="mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                    🔥 ترند
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                occurrence.type === 'HASHTAG' ? 'bg-blue-100 text-blue-800' :
                                occurrence.type === 'MENTION' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {occurrence.type === 'HASHTAG' ? '# هاشتاج' :
                                 occurrence.type === 'MENTION' ? '@ منشن' : 'كلمة'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="text-gray-900">{occurrence.user.fullName}</span>
                                {occurrence.user.verified && (
                                  <span className="mr-1 text-blue-500">✓</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">@{occurrence.user.username}</div>
                            </td>
                            <td className="px-6 py-4">
                              {occurrence.recordedByAdmin ? (
                                <div>
                                  <span className="text-green-800 font-medium">
                                    {occurrence.recordedByAdmin.user.fullName}
                                  </span>
                                  <div className="text-xs text-green-600">
                                    {occurrence.recordedByAdmin.role}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">تلقائي</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(occurrence.occurredAt).toLocaleString('ar-EG')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                occurrence.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                                occurrence.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {occurrence.sentiment === 'POSITIVE' ? '😊 إيجابي' :
                                 occurrence.sentiment === 'NEGATIVE' ? '😞 سلبي' : '😐 محايد'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {occurrence.trendingKeyword ? (
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => handleTrendAction(
                                      occurrence.trendingKeyword!.id, 
                                      occurrence.trendingKeyword!.isCurrentlyTrending ? 'BLOCK' : 'PIN',
                                      `إجراء على الكلمة: ${occurrence.keyword}`
                                    )}
                                    className={`text-xs px-2 py-1 rounded ${
                                      occurrence.trendingKeyword.isCurrentlyTrending 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    {occurrence.trendingKeyword.isCurrentlyTrending ? '🚫 حجب' : '📌 تثبيت'}
                                  </button>
                                  <button
                                    onClick={() => handleTrendAction(
                                      occurrence.trendingKeyword!.id, 
                                      'POSTPONE',
                                      `تأجيل الكلمة: ${occurrence.keyword}`
                                    )}
                                    className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  >
                                    ⏳ تأجيل
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">غير متاح</span>
                              )}
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
                      عرض {((currentPage - 1) * limit) + 1} إلى {Math.min(currentPage * limit, pagination.total)} من {pagination.total} نتيجة
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
                <h3 className="text-xl font-semibold text-gray-800">👥 إحصائيات الإداريين</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-blue-800 mb-4">📊 نسبة المراجعة الإدارية</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats.totalOccurrences > 0 ? ((stats.adminReviewed / stats.totalOccurrences) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-blue-600">
                      {stats.adminReviewed} من {stats.totalOccurrences} تكرار
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-green-800 mb-4">🤖 التكرارات التلقائية</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.systemGenerated.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      تكرار بدون مراجعة إدارية
                    </div>
                  </div>
                </div>

                {stats.topAdmins.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">🏆 أنشط الإداريين</h4>
                    <div className="space-y-4">
                      {stats.topAdmins.map((admin, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{admin.fullName}</div>
                              <div className="text-sm text-gray-500">{admin.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{admin.count}</div>
                            <div className="text-sm text-gray-500">مراجعة</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'analytics' && stats && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">📈 تحليلات متقدمة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-purple-800 mb-2">📊 معدل التفاعل</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.totalPosts > 0 ? (stats.totalOccurrences / stats.totalPosts).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-purple-600">كلمة لكل منشور</div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-yellow-800 mb-2">👥 معدل المستخدمين</h4>
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.totalUsers > 0 ? (stats.totalOccurrences / stats.totalUsers).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-yellow-600">كلمة لكل مستخدم</div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-indigo-800 mb-2">🔄 معدل التكرار</h4>
                    <div className="text-2xl font-bold text-indigo-600">
                      {stats.totalUniqueKeywords > 0 ? (stats.totalOccurrences / stats.totalUniqueKeywords).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-indigo-600">تكرار لكل كلمة فريدة</div>
                  </div>
                </div>

                {/* إحصائيات أخرى */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">📊 إحصائيات عامة</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.totalHashtags}</div>
                      <div className="text-sm text-gray-600">هاشتاج</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.totalMentions}</div>
                      <div className="text-sm text-gray-600">منشن</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{stats.trendsToday}</div>
                      <div className="text-sm text-gray-600">ترند اليوم</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-600">مستخدم نشط</div>
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
