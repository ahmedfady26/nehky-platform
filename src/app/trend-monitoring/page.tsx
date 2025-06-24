'use client';

import { useState, useEffect } from 'react';

interface TrendingKeyword {
  id: string;
  keyword: string;
  normalizedKeyword: string;
  type: string;
  category: string | null;
  
  // إحصائيات الاستخدام
  totalUsage: number;
  dailyUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
  
  // درجة الترند
  trendScore: number;
  velocityScore: number;
  peakUsage: number;
  peakDate: string | null;
  
  // حالة الترند
  isCurrentlyTrending: boolean;
  trendRank: number | null;
  trendStartDate: string | null;
  trendEndDate: string | null;
  
  // معلومات إضافية
  sentiment: string | null;
  language: string;
  
  // إحصائيات التفاعل
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  sharesCount: number;
  
  // التواريخ
  firstSeenAt: string;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrendReview {
  id: string;
  keyword: string;
  action: string;
  reason: string | null;
  reviewedAt: string;
  admin: {
    username: string;
  };
}

export default function TrendMonitoringPage() {
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [trendReviews, setTrendReviews] = useState<TrendReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'keywords' | 'reviews'>('keywords');

  // جلب الكلمات الترندينغ
  const fetchTrendingKeywords = async () => {
    try {
      const response = await fetch('/api/trending-keywords');
      if (response.ok) {
        const data = await response.json();
        setTrendingKeywords(data.keywords || []);
      } else {
        throw new Error('فشل في جلب الكلمات الترندينغ');
      }
    } catch (error) {
      console.error('خطأ في جلب الكلمات:', error);
      setError(error instanceof Error ? error.message : 'خطأ غير معروف');
    }
  };

  // جلب سجل المراجعات
  const fetchTrendReviews = async () => {
    try {
      const response = await fetch('/api/admin/trend-reviews');
      if (response.ok) {
        const data = await response.json();
        setTrendReviews(data.reviews || []);
      } else {
        throw new Error('فشل في جلب سجل المراجعات');
      }
    } catch (error) {
      console.error('خطأ في جلب المراجعات:', error);
    }
  };

  // حساب الترندات
  const calculateTrends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trending-keywords/calculate', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`تم حساب الترندات بنجاح! تم العثور على ${data.trendsCount} كلمة ترندينغ`);
        await fetchTrendingKeywords();
      } else {
        throw new Error('فشل في حساب الترندات');
      }
    } catch (error) {
      alert(`خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // مراجعة كلمة ترندينغ
  const reviewKeyword = async (keywordId: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const response = await fetch('/api/admin/trend-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywordId,
          action,
          reason
        })
      });

      if (response.ok) {
        alert(`تم ${action === 'APPROVE' ? 'قبول' : 'رفض'} الكلمة بنجاح`);
        await fetchTrendingKeywords();
        await fetchTrendReviews();
      } else {
        throw new Error('فشل في مراجعة الكلمة');
      }
    } catch (error) {
      alert(`خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTrendingKeywords(),
        fetchTrendReviews()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (keyword: TrendingKeyword) => {
    if (!keyword.isCurrentlyTrending) return 'bg-gray-100 text-gray-800';
    if (keyword.trendRank && keyword.trendRank <= 3) return 'bg-red-100 text-red-800'; // ترند عالي
    if (keyword.trendRank && keyword.trendRank <= 10) return 'bg-yellow-100 text-yellow-800'; // ترند متوسط
    return 'bg-green-100 text-green-800'; // ترند منخفض
  };

  const getStatusText = (keyword: TrendingKeyword) => {
    if (!keyword.isCurrentlyTrending) return 'غير نشط';
    if (keyword.trendRank) return `ترند #${keyword.trendRank}`;
    return 'ترند نشط';
  };

  const getSentimentEmoji = (sentiment: string | null) => {
    switch (sentiment) {
      case 'POSITIVE': return '😊';
      case 'NEGATIVE': return '😞';
      case 'NEUTRAL': return '😐';
      default: return '🤔';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الترندات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">📈 مراقبة الترندات</h1>
            <p className="text-blue-100">إدارة ومراقبة الكلمات الترندينغ في منصة نحكي</p>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={calculateTrends}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-1"
                >
                  🔄 حساب الترندات
                </button>
                
                <button
                  onClick={fetchTrendingKeywords}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1"
                >
                  🔃 تحديث البيانات
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-white rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setSelectedTab('keywords')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedTab === 'keywords'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  📊 الكلمات الترندينغ
                </button>
                <button
                  onClick={() => setSelectedTab('reviews')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedTab === 'reviews'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  📋 سجل المراجعات
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>خطأ:</strong> {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {selectedTab === 'keywords' ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-2xl ml-2">📊</span>
                الكلمات الترندينغ ({trendingKeywords.length})
                <span className="mr-4 text-lg text-gray-600">
                  🔥 نشطة: {trendingKeywords.filter(k => k.isCurrentlyTrending).length}
                </span>
              </h2>

              {trendingKeywords.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-xl">لا توجد كلمات ترندينغ حالياً</p>
                  <p className="mt-2">اضغط على "حساب الترندات" لتحديث البيانات</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trendingKeywords.map((keyword) => (
                    <div key={keyword.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {keyword.keyword}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(keyword)}`}>
                          {getStatusText(keyword)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span><strong>الاستخدام الإجمالي:</strong> {keyword.totalUsage.toLocaleString()} مرة</span>
                          <span><strong>درجة الترند:</strong> {keyword.trendScore.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>يومي:</strong> {keyword.dailyUsage}</span>
                          <span><strong>أسبوعي:</strong> {keyword.weeklyUsage}</span>
                          <span><strong>شهري:</strong> {keyword.monthlyUsage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>المنشورات:</strong> {keyword.postsCount}</span>
                          <span><strong>التعليقات:</strong> {keyword.commentsCount}</span>
                          <span><strong>الإعجابات:</strong> {keyword.likesCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>المشاعر:</strong> {getSentimentEmoji(keyword.sentiment)} {keyword.sentiment || 'غير محدد'}</span>
                          <span><strong>السرعة:</strong> {keyword.velocityScore.toFixed(1)}</span>
                        </div>
                        <p><strong>أول ظهور:</strong> {formatDate(keyword.firstSeenAt)}</p>
                        {keyword.lastUsedAt && (
                          <p><strong>آخر استخدام:</strong> {formatDate(keyword.lastUsedAt)}</p>
                        )}
                        {keyword.trendStartDate && (
                          <p><strong>بداية الترند:</strong> {formatDate(keyword.trendStartDate)}</p>
                        )}
                      </div>

                      {keyword.isCurrentlyTrending && (
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-orange-800 font-semibold">🔥 ترند نشط الآن!</span>
                            {keyword.trendRank && (
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                                المركز #{keyword.trendRank}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-2xl ml-2">📋</span>
                سجل المراجعات ({trendReviews.length})
              </h2>

              {trendReviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-xl">لا توجد مراجعات بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trendReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {review.keyword}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.action === 'APPROVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {review.action === 'APPROVE' ? '✅ تم القبول' : '❌ تم الرفض'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>تمت المراجعة بواسطة:</strong> {review.admin.username}</p>
                          <p><strong>تاريخ المراجعة:</strong> {formatDate(review.reviewedAt)}</p>
                        </div>
                        {review.reason && (
                          <div>
                            <p><strong>السبب:</strong></p>
                            <p className="bg-gray-100 p-2 rounded mt-1">{review.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
