// الصفحة الرئيسية المحدثة مع الأنظمة الذكية
import React from 'react';
import Link from 'next/link';
import { BarChart3, Users, Settings, Sparkles, TrendingUp, Eye, Heart, MessageCircle, Share, ArrowRight } from 'lucide-react';
import '../styles/dashboard.css';

export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: 'تحليلات الفيديو الذكية',
      description: 'مراقبة شاملة لأداء الفيديوهات مع تحليلات متقدمة لسلوك المشاهدين ومعدلات التفاعل',
      link: '/analytics',
      color: 'from-blue-500 to-purple-600',
      stats: ['تتبع المشاهدات', 'تحليل وقت المشاهدة', 'معدل الإكمال']
    },
    {
      icon: Sparkles,
      title: 'اقتراحات المتابعة الذكية',
      description: 'خوارزميات متطورة لاقتراح متابعات مخصصة بناءً على الاهتمامات والسلوك',
      link: '/suggestions',
      color: 'from-purple-500 to-pink-600',
      stats: ['تحليل الاهتمامات', 'التطابق الذكي', 'اقتراحات مخصصة']
    },
    {
      icon: Settings,
      title: 'إدارة النظام',
      description: 'لوحة شاملة لمراقبة النظام وإدارة المهام الدورية والصحة العامة للمنصة',
      link: '/admin',
      color: 'from-green-500 to-blue-600',
      stats: ['مراقبة المهام', 'سجلات النظام', 'التحكم الآلي']
    }
  ];

  const metrics = [
    { icon: Eye, label: 'مشاهدات يومية', value: '2.5M+', growth: '+25%' },
    { icon: Users, label: 'مستخدمين نشطين', value: '150K+', growth: '+18%' },
    { icon: Heart, label: 'تفاعلات', value: '850K+', growth: '+32%' },
    { icon: TrendingUp, label: 'نمو الاقتراحات', value: '95%', growth: '+12%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ن</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                نحكي
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                التحليلات
              </Link>
              <Link href="/suggestions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                الاقتراحات
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                الإدارة
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Sparkles className="text-purple-600" size={20} />
            <span className="text-gray-700 font-medium">منصة نحكي المطورة</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            مرحباً بك في
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              الأنظمة الذكية الجديدة
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            اكتشف قوة الذكاء الاصطناعي في تحليل الفيديوهات، تحسين الاهتمامات، واقتراح المتابعات المخصصة لتجربة استخدام فريدة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/analytics"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BarChart3 size={24} />
              استكشف التحليلات
            </Link>
            <Link 
              href="/suggestions"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 flex items-center justify-center gap-2"
            >
              <Users size={24} />
              اقتراحات ذكية
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <span className="text-green-600 font-semibold text-sm">{metric.growth}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
                  <div className="text-gray-600 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              الأنظمة الذكية المتقدمة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تقنيات متطورة مدعومة بالذكاء الاصطناعي لتحسين تجربة المستخدمين وزيادة التفاعل
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  <div className={`h-32 bg-gradient-to-br ${feature.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative h-full flex items-center justify-center">
                      <IconComponent className="text-white" size={48} />
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                          {stat}
                        </div>
                      ))}
                    </div>
                    
                    <Link 
                      href={feature.link}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 group-hover:shadow-xl"
                    >
                      استكشف الآن
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">ابدأ رحلتك مع الأنظمة الذكية</h2>
          <p className="text-xl mb-8 opacity-90">
            استفد من قوة الذكاء الاصطناعي لتحسين منصتك وزيادة تفاعل المستخدمين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admin"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Settings size={24} />
              لوحة الإدارة
            </Link>
            <Link 
              href="/analytics"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BarChart3 size={24} />
              عرض التحليلات
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ن</span>
            </div>
            <h3 className="text-2xl font-bold">نحكي</h3>
          </div>
          <p className="text-gray-400 mb-6">منصة التواصل الاجتماعي الذكية</p>
          <div className="flex justify-center space-x-8 space-x-reverse">
            <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">التحليلات</Link>
            <Link href="/suggestions" className="text-gray-400 hover:text-white transition-colors">الاقتراحات</Link>
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">الإدارة</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
