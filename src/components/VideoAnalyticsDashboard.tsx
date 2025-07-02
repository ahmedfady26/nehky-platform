'use client';

import { useState, useEffect } from 'react';
import { Play, Eye, Clock, TrendingUp, BarChart3, Users, Heart, Share, Calendar, Filter } from 'lucide-react';

interface VideoMetrics {
  totalViews: number;
  averageWatchTime: number;
  completionRate: number;
  retentionRate: number;
  engagementScore?: number;
  shareCount?: number;
  likeCount?: number;
}

interface VideoAnalytics {
  videoId: string;
  title: string;
  metrics: VideoMetrics;
  trends: {
    viewsGrowth: number;
    engagementGrowth: number;
  };
}

interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  avgWatchTime: number;
  topPerformer: string;
}

export default function VideoAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/video?period=${selectedPeriod}`);
      const data = await response.json();
      setAnalytics(data.analytics || []);
      
      // حساب الإحصائيات العامة
      if (data.analytics && data.analytics.length > 0) {
        const totalViews = data.analytics.reduce((sum: number, video: VideoAnalytics) => sum + video.metrics.totalViews, 0);
        const avgWatchTime = data.analytics.reduce((sum: number, video: VideoAnalytics) => sum + video.metrics.averageWatchTime, 0) / data.analytics.length;
        const topPerformer = data.analytics.reduce((top: VideoAnalytics, current: VideoAnalytics) => 
          current.metrics.totalViews > top.metrics.totalViews ? current : top
        );
        
        setStats({
          totalVideos: data.analytics.length,
          totalViews,
          avgWatchTime,
          topPerformer: topPerformer.title
        });
      }
    } catch (error) {
      console.error('خطأ في جلب تحليلات الفيديو:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري تحميل تحليلات الفيديو...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <BarChart3 className="text-blue-600" />
          تحليلات الفيديو الذكية
        </h1>
        <p className="text-gray-600 text-lg">مراقبة أداء المحتوى وفهم سلوك المشاهدين</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-500" size={20} />
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">اليوم</option>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر شهر</option>
            <option value="90d">آخر 3 أشهر</option>
          </select>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          {['overview', 'detailed', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab === 'overview' ? 'نظرة عامة' : tab === 'detailed' ? 'تفصيلي' : 'الاتجاهات'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Play className="text-blue-600" size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <div className="metric-value text-3xl font-bold text-gray-800">{formatNumber(stats.totalVideos)}</div>
            <div className="metric-label text-gray-600">إجمالي الفيديوهات</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="text-purple-600" size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+25%</span>
            </div>
            <div className="metric-value text-3xl font-bold text-gray-800">{formatNumber(stats.totalViews)}</div>
            <div className="metric-label text-gray-600">إجمالي المشاهدات</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <div className="metric-value text-3xl font-bold text-gray-800">{formatTime(Math.round(stats.avgWatchTime))}</div>
            <div className="metric-label text-gray-600">متوسط وقت المشاهدة</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
            <div className="metric-value text-lg font-bold text-gray-800 truncate">{stats.topPerformer}</div>
            <div className="metric-label text-gray-600">الأداء الأفضل</div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              أداء الفيديوهات
            </h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">مخطط بياني لأداء الفيديوهات</p>
            </div>
          </div>

          {/* Engagement Trends */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={20} />
              اتجاهات التفاعل
            </h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">مخطط بياني لاتجاهات التفاعل</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={20} />
              تحليل مفصل للفيديوهات
            </h3>
          </div>
          <div className="p-6">
            {analytics.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-gray-500 text-lg">لا توجد بيانات تحليلات متاحة</p>
                <p className="text-gray-400">ابدأ بإنشاء محتوى فيديو لرؤية التحليلات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الفيديو</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المشاهدات</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">وقت المشاهدة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">معدل الإكمال</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">النمو</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((video, index) => (
                      <tr key={video.videoId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{video.title}</div>
                          <div className="text-sm text-gray-500">ID: {video.videoId}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{formatNumber(video.metrics.totalViews)}</td>
                        <td className="py-4 px-4 text-gray-700">{formatTime(video.metrics.averageWatchTime)}</td>
                        <td className="py-4 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            {video.metrics.completionRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            video.trends.viewsGrowth > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {video.trends.viewsGrowth > 0 ? '+' : ''}{video.trends.viewsGrowth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              اتجاهات المشاهدة
            </h3>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">مخطط بياني لاتجاهات المشاهدة عبر الوقت</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">أوقات الذروة</h4>
              <div className="space-y-3">
                {['09:00 - 11:00', '14:00 - 16:00', '20:00 - 22:00'].map((time, index) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-gray-700">{time}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${85 - index * 15}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{85 - index * 15}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">الأجهزة المستخدمة</h4>
              <div className="space-y-3">
                {[
                  { device: 'الهاتف المحمول', percentage: 65 },
                  { device: 'الكمبيوتر المكتبي', percentage: 25 },
                  { device: 'التابلت', percentage: 10 }
                ].map((item) => (
                  <div key={item.device} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.device}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
