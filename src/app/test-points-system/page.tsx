'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Avatar from '@/components/Avatar'
import PostInteraction from '@/components/PostInteraction'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Post {
  id: string
  content: string
  author: {
    id: string
    username: string
    fullName: string
    avatar?: string
    role: string
    verified: boolean
  }
  likesCount: number
  commentsCount: number
  createdAt: string
  isLiked?: boolean
}

export default function TestPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // محاكاة معرف المستخدم الحالي
  const currentUserId = 'cmc4ykyps0000574ihv1nqmyp' // أحمد محمد

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockPosts: Post[] = [
        {
          id: 'post1',
          content: 'مرحباً بكم في منصة نحكي! نظام النقاط سيجعل التفاعل أكثر متعة 🎉 شاركوا أفكاركم وتفاعلوا مع المحتوى للحصول على نقاط!',
          author: {
            id: 'cmc4ykyps0002574ikfrnv7ve', // سارة أحمد
            username: 'sara_influencer',
            fullName: 'سارة أحمد',
            role: 'INFLUENCER',
            verified: true
          },
          likesCount: 15,
          commentsCount: 3,
          createdAt: new Date().toISOString(),
          isLiked: false
        },
        {
          id: 'post2',
          content: 'أفكار جديدة لتطوير المنصة وتحسين تجربة المستخدمين 💡 ما رأيكم في إضافة ميزة المناقشات المباشرة؟',
          author: {
            id: 'cmc4ykyps0001574ixq2kvbmy', // علي السعدي
            username: 'ali_influencer',
            fullName: 'علي السعدي',
            role: 'INFLUENCER',
            verified: true
          },
          likesCount: 8,
          commentsCount: 5,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // قبل ساعتين
          isLiked: true
        },
        {
          id: 'post3',
          content: 'تجربتي مع نظام النقاط رائعة جداً! 🌟 الآن أشعر بالتحفيز أكثر للتفاعل مع المحتوى المفيد.',
          author: {
            id: 'cmc4ykyps0003574i9b8d929l', // فاطمة حسن
            username: 'fatima_user',
            fullName: 'فاطمة حسن',
            role: 'USER',
            verified: false
          },
          likesCount: 2,
          commentsCount: 1,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // قبل 30 دقيقة
          isLiked: false
        }
      ]

      setPosts(mockPosts)
    } catch (error) {
      console.error('خطأ في تحميل المنشورات:', error)
      setError('حدث خطأ في تحميل المنشورات')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = (postId: string, isLiked: boolean) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked, likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1 }
        : post
    ))
  }

  const handleComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, commentsCount: post.commentsCount + 1 }
        : post
    ))
  }

  const formatTimeAgo = (dateString: string) => {
    const now = Date.now()
    const postTime = new Date(dateString).getTime()
    const diffMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffMinutes < 1) return 'الآن'
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    
    const diffDays = Math.floor(diffHours / 24)
    return `منذ ${diffDays} يوم`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">حدث خطأ</h2>
            <p className="text-gray-600">{error}</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            اختبار نظام النقاط 🎯
          </h1>
          <p className="text-gray-600">
            تفاعل مع المنشورات واحصل على نقاط!
          </p>
        </div>

        {/* رابط صفحة النقاط */}
        <div className="mb-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-blue-800 mb-2">
                📊 تحقق من نقاطك وترشيحاتك
              </p>
              <a 
                href="/points" 
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                عرض صفحة النقاط →
              </a>
            </div>
          </Card>
        </div>

        {/* المنشورات */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {/* معلومات المؤلف */}
              <div className="p-6 pb-4">
                <div className="flex items-center mb-4">
                  <Avatar 
                    user={post.author} 
                    size="md" 
                    className="ml-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-800">
                        {post.author.fullName}
                      </h3>
                      {post.author.verified && (
                        <span className="mr-2 text-blue-500">✓</span>
                      )}
                      {post.author.role === 'INFLUENCER' && (
                        <span className="mr-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          مؤثر
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      @{post.author.username} • {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* محتوى المنشور */}
                <div className="text-gray-800 leading-relaxed">
                  {post.content}
                </div>
              </div>

              {/* أزرار التفاعل */}
              <PostInteraction
                postId={post.id}
                authorId={post.author.id}
                isInfluencer={post.author.role === 'INFLUENCER'}
                initialLikes={post.likesCount}
                initialComments={post.commentsCount}
                isLiked={post.isLiked || false}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
              />
            </Card>
          ))}
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8">
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-3">
              💡 كيف يعمل نظام النقاط؟
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center">
                <span className="mr-2">❤️</span>
                <span>إعجاب مع منشور مؤثر = 5 نقاط</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💬</span>
                <span>تعليق على منشور مؤثر = 10 نقاط</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📝</span>
                <span>نشر باسم مؤثر = 20 نقطة</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏰</span>
                <span>النقاط صالحة لمدة 14 يوم فقط</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
