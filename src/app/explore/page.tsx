'use client'

// صفحة استكشاف المحتوى للمستخدمين
import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Heart, MessageCircle, Share2, Bookmark, Search, Filter, TrendingUp, Clock, Users } from 'lucide-react';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'trending', label: 'الرائج', icon: TrendingUp },
    { id: 'recent', label: 'الأحدث', icon: Clock },
    { id: 'following', label: 'المتابعين', icon: Users }
  ];

  const videos = [
    {
      id: 1,
      title: 'أسرار الطبخ العربي الأصيل',
      creator: 'شيف نادية',
      thumbnail: '/api/placeholder/400/300',
      duration: '12:45',
      views: '2.5M',
      likes: '45K',
      category: 'طبخ',
      timeAgo: 'منذ ساعتين'
    },
    {
      id: 2,
      title: 'رحلة استكشاف المغرب العربي',
      creator: 'مسافر العرب',
      thumbnail: '/api/placeholder/400/300',
      duration: '18:32',
      views: '1.8M',
      likes: '32K',
      category: 'سفر',
      timeAgo: 'منذ 4 ساعات'
    },
    {
      id: 3,
      title: 'تعلم البرمجة بطريقة سهلة',
      creator: 'المطور العربي',
      thumbnail: '/api/placeholder/400/300',
      duration: '25:18',
      views: '890K',
      likes: '28K',
      category: 'تعليم',
      timeAgo: 'منذ يوم'
    },
    {
      id: 4,
      title: 'تمارين رياضية في المنزل',
      creator: 'كوتش فتنس',
      thumbnail: '/api/placeholder/400/300',
      duration: '15:22',
      views: '1.2M',
      likes: '38K',
      category: 'رياضة',
      timeAgo: 'منذ يومين'
    },
    {
      id: 5,
      title: 'فن الخط العربي للمبتدئين',
      creator: 'خطاط ماهر',
      thumbnail: '/api/placeholder/400/300',
      duration: '20:10',
      views: '654K',
      likes: '19K',
      category: 'فن',
      timeAgo: 'منذ 3 أيام'
    },
    {
      id: 6,
      title: 'أخبار التكنولوجيا اليوم',
      creator: 'تك نيوز',
      thumbnail: '/api/placeholder/400/300',
      duration: '8:45',
      views: '445K',
      likes: '12K',
      category: 'تكنولوجيا',
      timeAgo: 'منذ ساعة'
    }
  ];

  const categories = [
    'الكل', 'طبخ', 'سفر', 'تعليم', 'رياضة', 'فن', 'تكنولوجيا', 'كوميديا', 'موسيقى'
  ];

  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'الكل' || video.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm md:text-lg">ن</span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-nehky-primary to-nehky-secondary bg-clip-text text-transparent">
                نحكي
              </h1>
            </Link>
            
            {/* Mobile Search Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-nehky-primary transition-colors">
                <Search size={20} />
              </button>
              <Link href="/login" className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-3 py-1.5 rounded-full text-xs font-medium">
                دخول
              </Link>
            </div>
            
            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ابحث عن فيديوهات، مبدعين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-nehky-primary/20 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-nehky-primary transition-colors">
                <Filter size={24} />
              </button>
              <Link href="/login" className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                تسجيل الدخول
              </Link>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="ابحث عن فيديوهات، مبدعين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-9 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-nehky-primary/20 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Page Title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">استكشف المحتوى</h1>
          <p className="text-sm md:text-base text-gray-600">اكتشف أفضل المحتوى من مبدعين مميزين</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-xl mb-6 md:mb-8 w-fit overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-white text-nehky-primary shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              {/* Thumbnail */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-nehky-primary/20 to-nehky-secondary/20 flex items-center justify-center">
                  <Play className="text-white" size={48} />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Bookmark size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-nehky-primary transition-colors">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {video.creator.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-600 font-medium">{video.creator}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{video.views} مشاهدة</span>
                  <span>{video.timeAgo}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart size={18} />
                      <span className="text-sm">{video.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-nehky-primary transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm">تعليق</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-nehky-secondary transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            تحميل المزيد
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ن</span>
            </div>
            <h3 className="text-2xl font-bold">نحكي</h3>
          </div>
          <p className="text-gray-400 mb-6">منصة التواصل الاجتماعي العربية المتقدمة</p>
          <div className="flex justify-center space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link>
            <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">استكشف</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
