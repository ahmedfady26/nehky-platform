'use client'

// صفحة استكشاف محسنة للتابلت
import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, Bookmark, Filter, TrendingUp, Clock, Users, MoreHorizontal } from 'lucide-react';
import { TabletGrid, TabletCard, TabletButton, TabletViewToggle, useDeviceType } from '../../components/TabletComponents';

export default function TabletExplorePage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { deviceType, isLandscape } = useDeviceType();

  const tabs = [
    { id: 'trending', label: 'الرائج', icon: TrendingUp },
    { id: 'recent', label: 'الأحدث', icon: Clock },
    { id: 'following', label: 'المتابعين', icon: Users }
  ];

  const categories = [
    'الكل', 'طبخ', 'سفر', 'تعليم', 'رياضة', 'فن', 'تكنولوجيا', 'كوميديا', 'موسيقى'
  ];

  const videos = [
    {
      id: 1,
      title: 'أسرار الطبخ العربي الأصيل - وصفات جدتي المفضلة',
      creator: 'شيف نادية',
      avatar: 'ش',
      duration: '12:45',
      views: '2.5M',
      likes: '45K',
      category: 'طبخ',
      timeAgo: 'منذ ساعتين',
      description: 'تعلمي أهم أسرار المطبخ العربي مع وصفات تراثية أصيلة'
    },
    {
      id: 2,
      title: 'رحلة استكشاف المغرب العربي - جمال الطبيعة والثقافة',
      creator: 'مسافر العرب',
      avatar: 'م',
      duration: '18:32',
      views: '1.8M',
      likes: '32K',
      category: 'سفر',
      timeAgo: 'منذ 4 ساعات',
      description: 'استكشف معنا أجمل الوجهات في شمال أفريقيا'
    },
    {
      id: 3,
      title: 'تعلم البرمجة بطريقة سهلة ومبسطة للمبتدئين',
      creator: 'المطور العربي',
      avatar: 'ط',
      duration: '25:18',
      views: '890K',
      likes: '28K',
      category: 'تعليم',
      timeAgo: 'منذ يوم',
      description: 'دورة شاملة لتعلم أساسيات البرمجة من الصفر'
    },
    {
      id: 4,
      title: 'تمارين رياضية في المنزل - لياقة بدنية كاملة',
      creator: 'كوتش فتنس',
      avatar: 'ك',
      duration: '15:22',
      views: '1.2M',
      likes: '38K',
      category: 'رياضة',
      timeAgo: 'منذ يومين',
      description: 'برنامج تدريبي متكامل يمكنك تطبيقه في المنزل'
    },
    {
      id: 5,
      title: 'فن الخط العربي للمبتدئين - جمال الحروف',
      creator: 'خطاط ماهر',
      avatar: 'خ',
      duration: '20:10',
      views: '654K',
      likes: '19K',
      category: 'فن',
      timeAgo: 'منذ 3 أيام',
      description: 'تعلم أساسيات الخط العربي وجماليات الكتابة'
    },
    {
      id: 6,
      title: 'أخبار التكنولوجيا اليوم - آخر التطورات',
      creator: 'تك نيوز',
      avatar: 'ت',
      duration: '8:45',
      views: '445K',
      likes: '12K',
      category: 'تكنولوجيا',
      timeAgo: 'منذ ساعة',
      description: 'كل ما هو جديد في عالم التقنية والابتكار'
    }
  ];

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'الكل' || video.category === selectedCategory
  );

  // عرض مختلف للتابلت
  if (deviceType !== 'tablet') {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">هذه الصفحة محسنة للتابلت. يرجى فتحها على تابلت لرؤية التصميم المحسن.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="tablet-container py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">استكشف المحتوى</h1>
            <p className="text-gray-600">اكتشف أفضل المحتوى من مبدعين مميزين</p>
          </div>
          <div className="flex items-center gap-4">
            <TabletViewToggle view={viewMode} onViewChange={setViewMode} />
            <TabletButton variant="outline" size="md">
              <Filter size={20} />
              فلاتر
            </TabletButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 space-x-reverse bg-white p-1 rounded-2xl mb-6 w-fit shadow-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="tablet-horizontal-list mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <TabletGrid columns={isLandscape ? 3 : 2} gap="lg">
            {filteredVideos.map((video) => (
              <TabletCard key={video.id} hover className="overflow-hidden">
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <div className="aspect-video bg-gradient-to-br from-nehky-primary/20 to-nehky-secondary/20 rounded-xl flex items-center justify-center">
                    <Play className="text-white" size={48} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {video.duration}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                      <Bookmark size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {video.avatar}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold block">{video.creator}</span>
                      <span className="text-gray-500 text-sm">{video.timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{video.views} مشاهدة</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{video.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                        <span className="font-medium">{video.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-nehky-primary transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-medium">تعليق</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-nehky-secondary transition-colors">
                        <Share2 size={20} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </TabletCard>
            ))}
          </TabletGrid>
        ) : (
          <div className="space-y-6">
            {filteredVideos.map((video) => (
              <TabletCard key={video.id} hover className="overflow-hidden">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <div className="w-80 aspect-video bg-gradient-to-br from-nehky-primary/20 to-nehky-secondary/20 rounded-xl flex items-center justify-center">
                      <Play className="text-white" size={48} />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-gray-900 mb-3 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-lg leading-relaxed">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {video.avatar}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold block text-lg">{video.creator}</span>
                        <div className="flex items-center gap-4 text-gray-500">
                          <span>{video.views} مشاهدة</span>
                          <span>•</span>
                          <span>{video.timeAgo}</span>
                          <span>•</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{video.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Heart size={22} />
                          <span className="font-medium text-lg">{video.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-nehky-primary transition-colors">
                          <MessageCircle size={22} />
                          <span className="font-medium text-lg">تعليق</span>
                        </button>
                        <button className="text-gray-600 hover:text-nehky-secondary transition-colors">
                          <Share2 size={22} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                          <Bookmark size={20} className="text-gray-700" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreHorizontal size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabletCard>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <TabletButton variant="primary" size="lg">
            تحميل المزيد من المحتوى
          </TabletButton>
        </div>
      </div>
    </div>
  );
}
