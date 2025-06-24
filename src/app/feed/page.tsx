"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  PlusCircle, 
  LayoutDashboard,
  TrendingUp,
  Search,
  Hash,
  AtSign,
  Loader2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import ResponsiveLayout, { useDeviceInfo } from '@/components/ResponsiveLayout';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Author {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  role: string;
  verified?: boolean;
}

interface Media {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  filename: string;
  size: number;
}

interface Post {
  id: string;
  content: string;
  hashtags: string[];
  keywords: string[];
  media: Media[];
  createdAt: string;
  updatedAt: string;
  author: Author;
  publishedFor?: Author;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  _count: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

interface TrendingKeyword {
  id: string;
  keyword: string;
  type: string;
  trendScore: number;
  trendRank: number;
  dailyUsage: number;
  isCurrentlyTrending: boolean;
}

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const router = useRouter();
  const { deviceType, isMobile } = useDeviceInfo();

  useEffect(() => {
    fetchPosts();
    fetchTrendingKeywords();
  }, [sortBy, selectedHashtag]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      console.log(`📡 جلب المنشورات - الصفحة ${pageNum}`);
      
      let url = `/api/posts?page=${pageNum}&limit=10&sort=${sortBy}`;
      
      if (selectedHashtag) {
        url += `&hashtag=${encodeURIComponent(selectedHashtag)}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setPosts(data.data);
          console.log(`✅ تم تحميل ${data.data.length} منشور في الصفحة الأولى`);
        } else {
          setPosts(prev => [...prev, ...data.data]);
          console.log(`✅ تم تحميل ${data.data.length} منشور إضافي`);
        }
        setHasMore(data.data.length === 10);
        setPage(pageNum);
      } else {
        setError(data.message || 'حدث خطأ في تحميل المنشورات');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingKeywords = async () => {
    try {
      setLoadingTrending(true);
      const response = await fetch('/api/trending-keywords?limit=10&trending=true');
      const data = await response.json();

      if (data.success) {
        setTrendingKeywords(data.data);
        console.log(`🔥 تم تحميل ${data.data.length} كلمة شائعة`);
      }
    } catch (err) {
      console.error('Fetch trending keywords error:', err);
    } finally {
      setLoadingTrending(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, _count: { ...post._count, likes: data.data.likesCount } }
            : post
        ));
        console.log('👍 تم تسجيل الإعجاب بنجاح');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, _count: { ...post._count, shares: data.data.sharesCount } }
            : post
        ));
        console.log('📤 تم مشاركة المنشور بنجاح');
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    setSelectedHashtag(hashtag === selectedHashtag ? null : hashtag);
    setPage(1);
    setHasMore(true);
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    
    return date.toLocaleDateString('ar-SA');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}م`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}ك`;
    }
    return num.toString();
  };

  const renderMedia = (media: Media[]) => {
    if (!media || media.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {media.map((item) => (
          <div key={item.id} className="relative">
            {item.type === 'IMAGE' && (
              <img
                src={item.url}
                alt={item.filename}
                className="w-full max-h-[500px] object-cover rounded-lg border border-gray-200"
              />
            )}
            {item.type === 'VIDEO' && (
              <video
                src={item.url}
                controls
                className="w-full max-h-[500px] rounded-lg border border-gray-200"
              >
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            )}
            {item.type === 'DOCUMENT' && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  📄
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.filename}</div>
                  <div className="text-sm text-gray-500">
                    {(item.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button
                  onClick={() => window.open(item.url, '_blank')}
                  variant="secondary"
                  size="sm"
                >
                  تحميل
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" text="جاري تحميل المنشورات..." />
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="التغذية">
      <div className={`container mx-auto px-2 sm:px-4 py-6 ${isMobile ? 'mb-16' : ''}`}>
        
        {/* Header مع شريط البحث والفلاتر */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">التغذية</h1>
            
            {!isMobile && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => fetchPosts(1)}
                  variant="secondary"
                  size="md"
                  disabled={loading}
                >
                  {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> تحديث</> : 'تحديث'}
                </Button>
                <Button
                  onClick={() => router.push('/create-post')}
                  variant="primary"
                  size="md"
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  منشور جديد
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="secondary"
                  size="md"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </Button>
              </div>
            )}
          </div>

          {/* شريط البحث والفلاتر */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث في المنشورات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">الأحدث</option>
                <option value="likes">الأكثر إعجاباً</option>
                <option value="comments">الأكثر تفاعلاً</option>
              </select>
              
              <Button onClick={handleSearch} variant="primary" size="md">
                بحث
              </Button>
            </div>
          </div>

          {/* الهاشتاج المحدد */}
          {selectedHashtag && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-blue-600" />
                <span className="text-blue-800">تصفية بالهاشتاج: {selectedHashtag}</span>
              </div>
              <Button
                onClick={() => handleHashtagClick(selectedHashtag)}
                variant="secondary"
                size="sm"
              >
                إزالة الفلتر
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* العمود الرئيسي - المنشورات */}
          <div className="flex-1">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            {posts.length === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="text-gray-500 text-2xl mb-4">لا توجد منشورات</div>
                <Button onClick={() => router.push('/create-post')} variant="primary" size="lg">
                  كن أول من ينشر!
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* معلومات المؤلف */}
                    <div className="p-4 flex items-center gap-3">
                      <Avatar user={post.author} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{post.author.fullName}</h3>
                          {post.author.verified && (
                            <span className="text-blue-500">✓</span>
                          )}
                          {post.author.role === 'INFLUENCER' && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              مؤثر
                            </span>
                          )}
                          {post.status === 'DRAFT' && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              مسودة
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">@{post.author.username} · {formatDate(post.createdAt)}</p>
                        {post.publishedFor && (
                          <p className="text-blue-600 text-sm">
                            نُشر باسم: {post.publishedFor.fullName}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>

                    {/* محتوى المنشور */}
                    <div className="px-4 pb-2">
                      <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
                      
                      {/* الهاشتاجات */}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.hashtags.map((hashtag, index) => (
                            <button
                              key={index}
                              onClick={() => handleHashtagClick(hashtag)}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-full text-sm transition-colors"
                            >
                              <Hash size={14} />
                              {hashtag}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* الوسائط */}
                      {renderMedia(post.media)}
                    </div>

                    {/* إحصائيات وأزرار التفاعل */}
                    <div className="px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-5">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-2 hover:text-red-500 transition-colors group"
                          >
                            <Heart size={20} className="group-hover:fill-current" />
                            <span>{formatNumber(post._count.likes)}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                            <MessageCircle size={20} />
                            <span>{formatNumber(post._count.comments)}</span>
                          </button>
                          <button 
                            onClick={() => handleShare(post.id)}
                            className="flex items-center gap-2 hover:text-green-500 transition-colors"
                          >
                            <Share2 size={20} />
                            <span>{formatNumber(post._count.shares)}</span>
                          </button>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Eye size={20} />
                            <span>{formatNumber(post._count.views)}</span>
                          </div>
                        </div>
                        <button className="hover:text-gray-800 transition-colors">
                          <Bookmark size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* زر تحميل المزيد */}
                {hasMore && (
                  <div className="text-center py-6">
                    <Button onClick={loadMore} disabled={loading} variant="secondary">
                      {loading ? <><Loader2 className="animate-spin mr-2" /> جاري التحميل...</> : 'تحميل المزيد'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* العمود الجانبي - الكلمات الشائعة */}
          {!isMobile && (
            <div className="w-80">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-orange-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-800">الكلمات الشائعة</h2>
                  <Button
                    onClick={fetchTrendingKeywords}
                    variant="ghost"
                    size="sm"
                    disabled={loadingTrending}
                  >
                    {loadingTrending ? <Loader2 className="animate-spin" size={16} /> : '🔄'}
                  </Button>
                </div>
                
                {loadingTrending ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trendingKeywords.map((keyword, index) => (
                      <div
                        key={keyword.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleHashtagClick(keyword.keyword)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-400 w-6">
                            {index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {keyword.type === 'HASHTAG' ? (
                              <Hash size={14} className="text-blue-500" />
                            ) : (
                              <AtSign size={14} className="text-green-500" />
                            )}
                            <span className="font-medium text-gray-800">{keyword.keyword}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(keyword.dailyUsage)} استخدام
                        </div>
                      </div>
                    ))}
                    
                    {trendingKeywords.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        لا توجد كلمات شائعة حالياً
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-200">
                      <Button
                        onClick={() => router.push('/test-trending-keywords')}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        عرض جميع الكلمات الشائعة
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating action button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-30">
          <Button
            onClick={() => router.push('/create-post')}
            variant="primary"
            className="rounded-full shadow-lg !p-4"
          >
            <PlusCircle size={28} />
          </Button>
        </div>
      )}
    </ResponsiveLayout>
  );
};

export default FeedPage;
