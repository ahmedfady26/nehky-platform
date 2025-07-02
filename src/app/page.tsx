'use client'

// الصفحة الرئيسية للمستخدمين - منصة نحكي
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Users, Heart, Search, Bell, UserPlus } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Play,
      title: 'شاهد المحتوى المفضل',
      description: 'اكتشف مقاطع فيديو مخصصة لاهتماماتك من المبدعين المفضلين لديك مع نظام ذكي يتعلم من تفضيلاتك',
      color: 'from-nehky-primary to-nehky-primary-light',
      stats: ['محتوى مخصص بالذكاء الاصطناعي', 'جودة عالية', 'تحديث مستمر']
    },
    {
      icon: Users,
      title: 'نظام الصديق الأفضل الثوري',
      description: 'اكتشف من هو صديقك الأفضل بناءً على التفاعل الحقيقي! النظام يحلل تفاعلكما ليحدد أقوى الصداقات ويمنحكما امتيازات خاصة',
      color: 'from-purple-500 to-pink-500',
      stats: ['تحليل ذكي للصداقات', 'امتيازات خاصة للأصدقاء', 'مجتمع متفاعل']
    },
    {
      icon: Heart,
      title: 'كبير المتابعين - لقب الشرف',
      description: 'احصل على لقب كبير المتابعين عبر التفاعل النشط! استمتع بمحتوى حصري، أولوية في الاقتراحات، وشارة مميزة تظهر تأثيرك',
      color: 'from-yellow-500 to-orange-500',
      stats: ['لقب شرفي مميز', 'محتوى حصري', 'امتيازات VIP']
    }
  ];

  const trendingTopics = [
    'التكنولوجيا', 'الطبخ', 'السفر', 'التعليم', 'الرياضة', 'الفن'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/nehky_logo.webp"
                alt="نحكي"
                width={48}
                height={48}
                className="rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-nehky-primary to-nehky-secondary bg-clip-text text-transparent">
                  نحكي
                </h1>
                <span className="text-xs text-gray-500 hidden md:block">منصة التواصل الذكية</span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Link href="/login" className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-4 py-2 rounded-full text-sm font-medium">
                دخول
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ابحث عن محتوى أو مبدعين..."
                  className="pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-nehky-primary/20 focus:bg-white transition-all w-64"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-nehky-primary transition-colors relative">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <Link href="/login" className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                تسجيل الدخول
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-nehky-primary/5 to-nehky-secondary/5"></div>
        <div className="relative max-w-4xl mx-auto">
          {/* Logo الرئيسي */}
          <div className="mb-8 md:mb-12 flex justify-center">
            <div className="relative">
              <Image
                src="/assets/nehky_logo.webp"
                alt="نحكي - شعار المنصة"
                width={128}
                height={128}
                className="rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 md:w-32 md:h-32 w-24 h-24"
                priority
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-nehky-primary to-nehky-secondary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* اسم المنصة */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-nehky-primary via-nehky-secondary to-nehky-accent bg-clip-text text-transparent mb-4 leading-tight">
              نحكي
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              منصة التواصل الاجتماعي الذكية
            </p>
          </div>

          <div className="mb-6 md:mb-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-sm text-sm">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="text-purple-800 font-medium">نظام الصديق الأفضل</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 shadow-sm text-sm">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 font-medium">كبير المتابعين</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-sm text-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-nehky-primary to-nehky-secondary rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">أكثر من مليون مستخدم نشط</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
            اكتشف عالماً من
            <span className="bg-gradient-to-r from-nehky-primary to-nehky-secondary bg-clip-text text-transparent block">
              المحتوى المميز
            </span>
          </h2>
          
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            انضم إلى مجتمع نحكي واستمتع بمشاهدة ومشاركة أفضل المحتوى من مبدعين مميزين من حول العالم العربي
          </p>

          {/* ميزات خاصة */}
          <div className="mb-8 md:mb-10 max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 md:p-6 border border-purple-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="text-white" size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-purple-800">نظام الصديق الأفضل</h3>
                </div>
                <p className="text-purple-700 text-sm leading-relaxed">
                  🌟 اكتشف من هو أفضل صديق لك بناءً على تفاعلكما وابن علاقات حقيقية تدوم
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 md:p-6 border border-blue-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Users className="text-white" size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">كبير المتابعين</h3>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  👑 احصل على لقب كبير المتابعين واستمتع بامتيازات خاصة ومحتوى حصري
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link 
              href="/register"
              className="bg-gradient-to-r from-nehky-primary to-nehky-secondary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <UserPlus size={20} />
              ابدأ الآن مجاناً
            </Link>
            <Link 
              href="/explore"
              className="bg-white text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-green-200 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Play size={20} />
              استكشف المحتوى
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار نحكي؟
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              منصة متكاملة للاستمتاع بأفضل تجربة مشاهدة وتفاعل مع المحتوى العربي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  <div className={`h-32 bg-gradient-to-br ${feature.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10"></div>
                    <div className="relative h-full flex items-center justify-center">
                      <IconComponent className="text-white drop-shadow-lg" size={48} />
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-nehky-primary to-nehky-secondary rounded-full"></div>
                          {stat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Systems Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🌟 أنظمة ذكية ومبتكرة
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف ميزاتنا الحصرية التي تجعل من تجربتك في نحكي فريدة ومميزة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* نظام الصديق الأفضل */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 md:p-10 text-white transform hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Heart size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">نظام الصديق الأفضل</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-100">نظام ذكي ثوري</span>
                  </div>
                </div>
              </div>
              
              <p className="text-lg mb-6 text-purple-100 leading-relaxed">
                يحلل نظامنا الذكي تفاعلاتك مع الأصدقاء ويحدد من هو صديقك الأفضل بناءً على التفاعل الحقيقي والمستمر
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>تحليل ذكي للتفاعلات والصداقات</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>امتيازات خاصة للأصدقاء المقربين</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>إشعارات مخصصة وأولوية في المحتوى</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>شارات وألقاب مميزة للصداقات القوية</span>
                </div>
              </div>
            </div>

            {/* نظام كبير المتابعين */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 md:p-10 text-white transform hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">كبير المتابعين</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-orange-100">لقب الشرف والتميز</span>
                  </div>
                </div>
              </div>
              
              <p className="text-lg mb-6 text-orange-100 leading-relaxed">
                احصل على لقب كبير المتابعين عبر التفاعل النشط والمستمر واستمتع بامتيازات VIP حصرية
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>👑 لقب شرفي يظهر تأثيرك في المجتمع</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>🎯 محتوى حصري ومميز</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>⚡ أولوية في الاقتراحات والظهور</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span>💎 شارة مميزة وامتيازات خاصة</span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              كيف يعمل النظام؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">تفاعل طبيعي</h4>
                <p className="text-gray-600 text-sm">تفاعل مع أصدقائك ومحتواهم بشكل طبيعي</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">تحليل ذكي</h4>
                <p className="text-gray-600 text-sm">النظام يحلل تفاعلاتك ويحدد الصداقات القوية</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">امتيازات خاصة</h4>
                <p className="text-gray-600 text-sm">احصل على الألقاب والامتيازات تلقائياً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16 px-4 bg-gradient-to-r from-nehky-primary/5 to-nehky-secondary/5">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">المواضيع الرائجة</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {trendingTopics.map((topic, index) => (
              <span 
                key={index}
                className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-gray-700 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-green-100"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-nehky-primary to-nehky-secondary rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">🚀 جاهز لتجربة فريدة؟</h3>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              انضم إلى الآلاف من المستخدمين واكتشف صديقك الأفضل
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              ابدأ رحلتك في عالم المحتوى المميز واحصل على لقب كبير المتابعين من خلال التفاعل النشط
            </p>
            
            {/* Achievement preview */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                👑 لقب كبير المتابعين
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                💎 نظام الصديق الأفضل
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🌟 امتيازات VIP
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-white text-nehky-primary px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                ابدأ رحلتك الآن
              </Link>
              <Link 
                href="/login"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users size={20} />
                لدي حساب بالفعل
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-nehky-primary to-nehky-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">ن</span>
                </div>
                <h3 className="text-xl font-bold">نحكي</h3>
              </div>
              <p className="text-gray-400">منصة التواصل الاجتماعي العربية المتقدمة</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المنصة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">الوظائف</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">المدونة</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المساعدة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">الأمان</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">قانوني</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">الشروط</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">الخصوصية</Link></li>
                <li><Link href="/guidelines" className="hover:text-white transition-colors">المعايير</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 نحكي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
