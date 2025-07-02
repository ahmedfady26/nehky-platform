'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Heart, MessageCircle, Star, TrendingUp, Sparkles } from 'lucide-react';

interface SuggestionUser {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  followersCount: number;
  postsCount: number;
  reasons?: string[];
  score?: number;
  isVerified?: boolean;
  mutualFollowers?: number;
  recentActivity?: string;
}

interface SuggestionAnalytics {
  totalSuggestions: number;
  acceptedSuggestions: number;
  acceptanceRate: number;
  avgTimeToAccept: number;
  topReasons: string[];
  improvementAreas: string[];
}

export default function SmartFollowSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionUser[]>([]);
  const [analytics, setAnalytics] = useState<SuggestionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadSuggestions();
  }, [activeCategory]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/suggestions/follow?category=${activeCategory}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setAnalytics(data.analytics || null);
    } catch (error) {
      console.error('خطأ في تحميل الاقتراحات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setFollowingUsers(prev => new Set(Array.from(prev).concat(userId)));
        // Remove from suggestions
        setSuggestions(prev => prev.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('خطأ في المتابعة:', error);
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const categories = [
    { id: 'all', label: 'جميع الاقتراحات', icon: Users },
    { id: 'interests', label: 'اهتمامات مشتركة', icon: Heart },
    { id: 'trending', label: 'المتابعون المؤثرون', icon: TrendingUp },
    { id: 'mutual', label: 'أصدقاء الأصدقاء', icon: UserPlus },
  ];

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري تحميل الاقتراحات الذكية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Sparkles className="text-purple-600" />
          اقتراحات المتابعة الذكية
        </h1>
        <p className="text-gray-600 text-lg">اكتشف أشخاص جدد قد تهتم بمتابعتهم</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{analytics.totalSuggestions}</div>
            <div className="text-gray-600">إجمالي الاقتراحات</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <UserPlus className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{analytics.acceptedSuggestions}</div>
            <div className="text-gray-600">المتابعات المقبولة</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{analytics.acceptanceRate}%</div>
            <div className="text-gray-600">معدل القبول</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{Math.round(analytics.avgTimeToAccept)}s</div>
            <div className="text-gray-600">متوسط وقت القرار</div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <IconComponent size={20} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد اقتراحات متاحة</h3>
          <p className="text-gray-500">سنقوم بإنشاء اقتراحات جديدة قريباً بناءً على نشاطك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-24"></div>
              
              {/* Profile Section */}
              <div className="p-6 -mt-12">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    {user.isVerified && (
                      <div className="bg-blue-500 text-white p-1 rounded-full mt-8">
                        <Star size={12} />
                      </div>
                    )}
                  </div>
                  
                  {user.score && (
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(user.score * 100)}% تطابق
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{user.fullName}</h3>
                  <p className="text-gray-500 text-sm mb-2">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-600 text-sm line-clamp-2">{user.bio}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-center mb-4">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{formatNumber(user.followersCount)}</div>
                    <div className="text-xs text-gray-500">متابع</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{formatNumber(user.postsCount)}</div>
                    <div className="text-xs text-gray-500">منشور</div>
                  </div>
                  {user.mutualFollowers && (
                    <div>
                      <div className="text-lg font-bold text-gray-800">{user.mutualFollowers}</div>
                      <div className="text-xs text-gray-500">مشترك</div>
                    </div>
                  )}
                </div>

                {/* Reasons */}
                {user.reasons && user.reasons.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {user.reasons.slice(0, 2).map((reason, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {reason}
                        </span>
                      ))}
                      {user.reasons.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{user.reasons.length - 2} أخرى
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleFollow(user.id)}
                    disabled={followingUsers.has(user.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      followingUsers.has(user.id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                    }`}
                  >
                    {followingUsers.has(user.id) ? (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus size={16} />
                        متابَع
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus size={16} />
                        متابعة
                      </span>
                    )}
                  </button>
                  
                  <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {suggestions.length > 0 && (
        <div className="text-center mt-8">
          <button 
            onClick={loadSuggestions}
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-all"
          >
            تحميل المزيد من الاقتراحات
          </button>
        </div>
      )}
    </div>
  );
}
