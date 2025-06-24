'use client'

import { useState, useEffect } from 'react'

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
}

interface ApiResponse {
  success: boolean
  data: KeywordOccurrence[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  stats: {
    byType: Record<string, number>
    topKeywords: Array<{
      keyword: string
      type: string
      count: number
    }>
    topUsers: Array<{
      userId: string
      count: number
    }>
  }
  filters: Record<string, any>
}

export default function TestKeywordOccurrencesPage() {
  const [occurrences, setOccurrences] = useState<KeywordOccurrence[]>([])
  const [stats, setStats] = useState<any>({})
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // فلاتر البحث
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    sentiment: '',
    language: '',
    category: '',
    authorRole: '',
    sortBy: 'occurredAt',
    sortOrder: 'desc',
    limit: '20',
    page: '1'
  })

  const fetchOccurrences = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      
      const response = await fetch(`/api/keyword-occurrences?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setOccurrences(data.data)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        setError('فشل في جلب البيانات')
      }
    } catch (err) {
      console.error('خطأ في جلب تكرارات الكلمات:', err)
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOccurrences()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: '1' // إعادة تعيين الصفحة عند تغيير الفلتر
    }))
  }

  const handleSearch = () => {
    fetchOccurrences()
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage.toString()
    }))
    setTimeout(fetchOccurrences, 100)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HASHTAG': return '🏷️'
      case 'KEYWORD': return '🔑'
      case 'MENTION': return '📢'
      default: return '💬'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return '😊'
      case 'NEGATIVE': return '😞'
      case 'NEUTRAL': return '😐'
      default: return '❓'
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔗 اختبار تكرارات الكلمات
          </h1>
          <p className="text-gray-600">
            تتبع مصدر كل كلمة شائعة بدقة - جدول KeywordOccurrence
          </p>
        </div>

        {/* فلاتر البحث */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔍 فلاتر البحث</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكلمة
              </label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="ابحث عن كلمة..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                النوع
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">الكل</option>
                <option value="HASHTAG">هاشتاج</option>
                <option value="KEYWORD">كلمة مفتاحية</option>
                <option value="MENTION">منشن</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المشاعر
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">الكل</option>
                <option value="POSITIVE">إيجابي</option>
                <option value="NEUTRAL">محايد</option>
                <option value="NEGATIVE">سلبي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اللغة
              </label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">الكل</option>
                <option value="AR">عربي</option>
                <option value="EN">إنجليزي</option>
                <option value="MIXED">مختلط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دور المؤلف
              </label>
              <select
                value={filters.authorRole}
                onChange={(e) => handleFilterChange('authorRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">الكل</option>
                <option value="USER">مستخدم عادي</option>
                <option value="INFLUENCER">مؤثر</option>
                <option value="TOP_FOLLOWER">كبير متابعين</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ترتيب حسب
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="occurredAt">وقت التكرار</option>
                <option value="createdAt">تاريخ الإضافة</option>
                <option value="keyword">الكلمة</option>
                <option value="type">النوع</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اتجاه الترتيب
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">تنازلي</option>
                <option value="asc">تصاعدي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عدد النتائج
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            🔍 بحث
          </button>
        </div>

        {/* إحصائيات */}
        {stats.byType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2">📊 حسب النوع</h3>
              <div className="space-y-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      {type === 'HASHTAG' ? 'هاشتاج' : 
                       type === 'KEYWORD' ? 'كلمة مفتاحية' : 
                       type === 'MENTION' ? 'منشن' : type}
                    </span>
                    <span className="font-bold text-blue-600">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2">🔥 أكثر الكلمات تكراراً</h3>
              <div className="space-y-2">
                {stats.topKeywords?.slice(0, 5).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      {item.keyword}
                    </span>
                    <span className="font-bold text-green-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2">📈 معلومات عامة</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>إجمالي التكرارات:</span>
                  <span className="font-bold text-purple-600">{pagination.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الصفحات:</span>
                  <span className="font-bold text-purple-600">{pagination.totalPages || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>الصفحة الحالية:</span>
                  <span className="font-bold text-purple-600">{pagination.page || 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جارٍ تحميل تكرارات الكلمات...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        {/* النتائج */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                📝 تكرارات الكلمات ({pagination.total || 0})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">الكلمة</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">النوع</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">المؤلف</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">المنشور</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">السياق</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">المشاعر</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">وقت التكرار</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {occurrences.map((occurrence) => (
                    <tr key={occurrence.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(occurrence.type)}
                          <div>
                            <div className="font-medium text-blue-600">
                              {occurrence.keyword}
                            </div>
                            <div className="text-xs text-gray-500">
                              {occurrence.normalizedKeyword}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          occurrence.type === 'HASHTAG' ? 'bg-blue-100 text-blue-800' :
                          occurrence.type === 'KEYWORD' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {occurrence.type === 'HASHTAG' ? 'هاشتاج' : 
                           occurrence.type === 'KEYWORD' ? 'كلمة مفتاحية' : 'منشن'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {occurrence.user.verified && <span>✅</span>}
                          <div>
                            <div className="font-medium">{occurrence.user.fullName}</div>
                            <div className="text-xs text-gray-500">@{occurrence.user.username}</div>
                            <div className="text-xs text-gray-500">{occurrence.user.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <div className="text-xs text-gray-600 truncate">
                            {occurrence.post.content.substring(0, 100)}...
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            👍 {occurrence.post.likesCount} | 💬 {occurrence.post.commentsCount} | 👁️ {occurrence.post.viewsCount}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {occurrence.context && (
                          <div className="max-w-xs text-xs text-gray-600">
                            {occurrence.context.substring(0, 80)}...
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg">
                          {getSentimentIcon(occurrence.sentiment || 'NEUTRAL')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(occurrence.occurredAt).toLocaleString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  عرض {((pagination.page - 1) * parseInt(filters.limit)) + 1} - {Math.min(pagination.page * parseInt(filters.limit), pagination.total)} من {pagination.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    السابق
                  </button>
                  <span className="px-3 py-1 text-sm border rounded bg-blue-50 text-blue-600">
                    {pagination.page}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
