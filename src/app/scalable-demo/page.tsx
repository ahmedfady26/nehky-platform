'use client'

// صفحة استكشاف محسنة باستخدام المكونات القابلة للتطوير
import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, Bookmark, TrendingUp, Clock, Users } from 'lucide-react';
import { 
  useDevice, 
  ResponsiveShow, 
  AdvancedGrid, 
  AdaptiveLayout, 
  ResponsiveText, 
  ResponsiveButton 
} from '../../components/ScalableComponents';

export default function ScalableExplorePage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const { device, isMobile } = useDevice();

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
      title: 'تعلم البرمجة بالذكاء الاصطناعي - مستقبل التطوير',
      creator: 'مطور محترف',
      avatar: 'م',
      duration: '25:10',
      views: '1.2M',
      likes: '28K',
      category: 'تكنولوجيا',
      timeAgo: 'منذ 6 ساعات',
      description: 'كيف تستخدم الذكاء الاصطناعي في تطوير التطبيقات'
    },
    {
      id: 4,
      title: 'أفضل التمارين للياقة البدنية في المنزل',
      creator: 'مدرب فتنس',
      avatar: 'ف',
      duration: '15:22',
      views: '980K',
      likes: '22K',
      category: 'رياضة',
      timeAgo: 'منذ 8 ساعات',
      description: 'تمارين بسيطة وفعالة لا تحتاج معدات'
    },
    {
      id: 5,
      title: 'فن الخط العربي - تعلم الأساسيات',
      creator: 'خطاط ماهر',
      avatar: 'خ',
      duration: '20:45',
      views: '750K',
      likes: '18K',
      category: 'فن',
      timeAgo: 'منذ 10 ساعات',
      description: 'دروس تفصيلية لتعلم الخط العربي الجميل'
    },
    {
      id: 6,
      title: 'كوميديا عربية - مواقف طريفة من الحياة اليومية',
      creator: 'كوميدي عربي',
      avatar: 'ك',
      duration: '8:30',
      views: '3.2M',
      likes: '65K',
      category: 'كوميديا',
      timeAgo: 'منذ 12 ساعة',
      description: 'اضحك مع أطرف المواقف من حياتنا العربية'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* معلومات الجهاز للتطوير */}
      <ResponsiveShow mobile tablet>
        <div className="bg-blue-100 p-2 text-center text-sm">
          <ResponsiveText mobileSize="xs" tabletSize="sm">
            الجهاز: {device.type} | العرض: {device.width}px | اللمس: {device.isTouch ? 'نعم' : 'لا'}
          </ResponsiveText>
        </div>
      </ResponsiveShow>

      <div className="scalable-container">
        <div className="py-6">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-8">
            <ResponsiveText 
              mobileSize="xl" 
              tabletSize="xl" 
              desktopSize="xl" 
              weight="bold"
              className="bg-gradient-to-r from-nehky-primary to-nehky-secondary bg-clip-text text-transparent"
            >
              استكشف المحتوى
            </ResponsiveText>
            <ResponsiveText 
              mobileSize="sm" 
              tabletSize="base" 
              desktopSize="lg"
              className="text-gray-600 mt-2"
            >
              اكتشف أفضل المحتوى من مبدعين مميزين
            </ResponsiveText>
          </div>

          {/* التبويبات */}
          <div className="mb-6">
            <AdaptiveLayout
              mobileLayout="scroll"
              tabletLayout="grid"
              desktopLayout="grid"
            >
              <div className="flex space-x-2 space-x-reverse overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <ResponsiveButton
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={isActive ? 'primary' : 'ghost'}
                      size="md"
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <IconComponent size={isMobile ? 16 : 20} />
                      <span>{tab.label}</span>
                    </ResponsiveButton>
                  );
                })}
              </div>
            </AdaptiveLayout>
          </div>

          {/* الفئات */}
          <div className="mb-8">
            <ResponsiveText 
              mobileSize="sm" 
              tabletSize="base" 
              weight="medium" 
              className="text-gray-700 mb-3"
            >
              الفئات
            </ResponsiveText>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <ResponsiveButton
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </ResponsiveButton>
              ))}
            </div>
          </div>

          {/* شبكة الفيديوهات */}
          <AdvancedGrid
            mobileColumns={1}
            tabletColumns={2}
            desktopColumns={3}
            largeTabletColumns={4}
            gap="lg"
          >
            {videos.map((video) => (
              <div key={video.id} className="scalable-card scalable-card-padding group cursor-pointer">
                {/* صورة الفيديو */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Play size={isMobile ? 32 : 48} className="text-white drop-shadow-lg" />
                  </div>
                  
                  {/* مدة الفيديو */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  
                  {/* أيقونة التشغيل عند التمرير */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play size={24} className="text-nehky-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* معلومات الفيديو */}
                <div className="space-y-3">
                  {/* المبدع */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {video.avatar}
                    </div>
                    <ResponsiveText 
                      mobileSize="sm" 
                      tabletSize="base" 
                      weight="medium" 
                      className="text-gray-700"
                    >
                      {video.creator}
                    </ResponsiveText>
                    <span className="text-xs text-gray-500">{video.timeAgo}</span>
                  </div>

                  {/* عنوان الفيديو */}
                  <ResponsiveText 
                    mobileSize="sm" 
                    tabletSize="base" 
                    weight="semibold" 
                    className="text-gray-900 group-hover:text-nehky-primary transition-colors line-clamp-2"
                  >
                    {video.title}
                  </ResponsiveText>

                  {/* الوصف */}
                  <ResponsiveShow tablet desktop>
                    <ResponsiveText 
                      mobileSize="xs" 
                      tabletSize="sm" 
                      className="text-gray-600 line-clamp-2"
                    >
                      {video.description}
                    </ResponsiveText>
                  </ResponsiveShow>

                  {/* إحصائيات */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{video.views} مشاهدة</span>
                      <span>{video.likes} إعجاب</span>
                    </div>
                    
                    {/* أزرار التفاعل */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Heart size={16} className="text-gray-500 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MessageCircle size={16} className="text-gray-500 hover:text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 size={16} className="text-gray-500 hover:text-green-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Bookmark size={16} className="text-gray-500 hover:text-nehky-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </AdvancedGrid>

          {/* زر تحميل المزيد */}
          <div className="text-center mt-12">
            <ResponsiveButton
              variant="outline"
              size="lg"
              fullWidth={isMobile}
              className="min-w-[200px]"
            >
              عرض المزيد من الفيديوهات
            </ResponsiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
