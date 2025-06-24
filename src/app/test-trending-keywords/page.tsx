"use client";

import React, { useState, useEffect } from 'react'

interface TrendingKeyword {
  id: string
  keyword: string
  type: string
  category: string | null
  trendScore: number
  trendRank: number | null
  dailyUsage: number
  weeklyUsage: number
  monthlyUsage: number
  totalUsage: number
  isCurrentlyTrending: boolean
  velocityScore: number
  language: string
  lastUsedAt: string
  firstSeenAt: string
  usageHistory: Array<{
    date: string
    usageCount: number
    uniqueUsers: number
    postsCount: number
    dailyTrendScore: number
  }>
}

export default function TrendingKeywordsPage() {
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState('day')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isCalculating, setIsCalculating] = useState(false)

  // جلب الكلمات الشائعة
  const fetchTrendingKeywords = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/trending-keywords?limit=50&timeframe=${timeframe}&type=${typeFilter}&trending=true`
      )
      const data = await response.json()
      
      if (data.success) {
        setKeywords(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('حدث خطأ في جلب الكلمات الشائعة')
    } finally {
      setLoading(false)
    }
  }

  // إعادة حساب الترند
  const recalculateTrend = async () => {
    setIsCalculating(true)
    try {
      const response = await fetch('/api/trending-keywords/calculate', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('تم تحديث حسابات الترند بنجاح!')
        fetchTrendingKeywords() // إعادة جلب البيانات
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('حدث خطأ في حساب الترند')
    } finally {
      setIsCalculating(false)
    }
  }

  useEffect(() => {
    fetchTrendingKeywords()
  }, [timeframe, typeFilter])

  // تحديد لون الكلمة حسب النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HASHTAG': return 'bg-blue-100 text-blue-800'
      case 'KEYWORD': return 'bg-green-100 text-green-800'
      case 'MENTION': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // تحديد لون درجة الترند
  const getTrendScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold'
    if (score >= 60) return 'text-orange-600 font-semibold'
    if (score >= 40) return 'text-yellow-600'
    if (score >= 20) return 'text-green-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">جارٍ تحميل الكلمات الشائعة...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={fetchTrendingKeywords}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          الكلمات والهاشتاجات الشائعة 📈
        </h1>

        {/* أدوات التحكم */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الإطار الزمني
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">آخر 24 ساعة</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                  <option value="trend">حسب درجة الترند</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الكلمة
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">الكل</option>
                  <option value="hashtag">هاشتاج</option>
                  <option value="keyword">كلمات مفتاحية</option>
                  <option value="mention">منشن</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={recalculateTrend}
                disabled={isCalculating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    جارٍ الحساب...
                  </>
                ) : (
                  <>
                    🔄 إعادة حساب الترند
                  </>
                )}
              </button>

              <button
                onClick={fetchTrendingKeywords}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 تحديث
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات عامة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{keywords.length}</div>
            <div className="text-gray-600">كلمات شائعة</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {keywords.filter(k => k.type === 'HASHTAG').length}
            </div>
            <div className="text-gray-600">هاشتاج</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {keywords.filter(k => k.type === 'KEYWORD').length}
            </div>
            <div className="text-gray-600">كلمة مفتاحية</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {keywords.filter(k => k.velocityScore > 2).length}
            </div>
            <div className="text-gray-600">سريعة الانتشار</div>
          </div>
        </div>

        {/* قائمة الكلمات الشائعة */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              الكلمات الشائعة ({keywords.length})
            </h2>
          </div>

          {keywords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد كلمات شائعة حالياً</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الترتيب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكلمة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      درجة الترند
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      سرعة الانتشار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاستخدام اليومي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاستخدام الأسبوعي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجمالي الاستخدام
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywords.map((keyword, index) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {keyword.trendRank && (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-bold rounded-full">
                              {keyword.trendRank}
                            </span>
                          )}
                          {!keyword.trendRank && (
                            <span className="text-gray-400 text-sm">#{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-medium text-gray-900">
                          {keyword.keyword}
                        </div>
                        <div className="text-sm text-gray-500">
                          {keyword.language} • منذ {new Date(keyword.firstSeenAt).toLocaleDateString('ar-SA')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(keyword.type)}`}>
                          {keyword.type === 'HASHTAG' && '# هاشتاج'}
                          {keyword.type === 'KEYWORD' && '🔑 كلمة مفتاحية'}
                          {keyword.type === 'MENTION' && '@ منشن'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-lg font-bold ${getTrendScoreColor(keyword.trendScore)}`}>
                          {keyword.trendScore.toFixed(1)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(keyword.trendScore, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {keyword.velocityScore.toFixed(2)}x
                        </div>
                        <div className={`text-xs ${keyword.velocityScore > 2 ? 'text-red-600' : keyword.velocityScore > 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {keyword.velocityScore > 2 ? '🚀 سريع جداً' : keyword.velocityScore > 1 ? '⚡ سريع' : '📈 عادي'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{keyword.dailyUsage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{keyword.weeklyUsage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{keyword.totalUsage.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🔍 كيف يعمل نظام الكلمات الشائعة؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">📊 حساب درجة الترند:</h4>
              <ul className="space-y-1">
                <li>• الاستخدام اليومي (وزن 50%)</li>
                <li>• الاستخدام الأسبوعي (وزن 30%)</li>
                <li>• سرعة الانتشار (وزن 20%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 شروط الترند:</h4>
              <ul className="space-y-1">
                <li>• 5 استخدامات يومية على الأقل</li>
                <li>• درجة ترند 20 أو أكثر</li>
                <li>• 3 مستخدمين فريدين على الأقل</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
