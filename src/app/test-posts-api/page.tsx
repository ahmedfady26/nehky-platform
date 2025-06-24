"use client";

import React, { useState, useEffect } from 'react'

interface Post {
  id: string
  content: string
  images: string[]
  videos: string[]
  hashtags: string[]
  author: {
    id: string
    username: string
    fullName: string
    avatar: string | null
    verified: boolean
    role: string
  }
  publishedFor: {
    id: string
    username: string
    fullName: string
    avatar: string | null
    verified: boolean
  } | null
  likesCount: number
  commentsCount: number
  sharesCount: number
  viewsCount: number
  createdAt: string
  allowComments: boolean
  allowLikes: boolean
  allowShares: boolean
  _count: {
    likes: number
    comments: number
    shares: number
    views: number
  }
}

export default function TestPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // جلب المنشورات
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?page=1&limit=10')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('حدث خطأ في جلب المنشورات')
    } finally {
      setLoading(false)
    }
  }

  // إنشاء منشور جديد
  const createPost = async () => {
    if (!newPostContent.trim()) return

    setIsCreating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostContent,
          hashtags: ['#اختبار'],
          allowComments: true,
          allowLikes: true,
          allowShares: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setNewPostContent('')
        fetchPosts() // إعادة جلب المنشورات
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('حدث خطأ في إنشاء المنشور')
    } finally {
      setIsCreating(false)
    }
  }

  // إعجاب بمنشور
  const likePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // تحديث المنشور في القائمة
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likesCount: data.data.likesCount }
              : post
          )
        )
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('حدث خطأ في الإعجاب')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">جارٍ تحميل المنشورات...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          اختبار واجهة برمجة تطبيقات المنشورات
        </h1>

        {/* نموذج إنشاء منشور */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">إنشاء منشور جديد</h2>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="اكتب منشورك هنا..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={createPost}
            disabled={isCreating || !newPostContent.trim()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'جارٍ النشر...' : 'نشر'}
          </button>
        </div>

        {/* قائمة المنشورات */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد منشورات</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
                {/* معلومات المؤلف */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.fullName.charAt(0)}
                  </div>
                  <div className="mr-3 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{post.author.fullName}</h3>
                      <span className="text-gray-500 text-sm">@{post.author.username}</span>
                      {post.author.verified && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {post.author.role}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                {/* محتوى المنشور */}
                <div className="mb-4">
                  <p className="text-gray-800 text-lg leading-relaxed">{post.content}</p>
                  
                  {/* الهاشتاج */}
                  {post.hashtags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.hashtags.map((hashtag, index) => (
                        <span key={index} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* الصور */}
                  {post.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img 
                          key={index} 
                          src={image} 
                          alt={`صورة ${index + 1}`}
                          className="rounded-lg max-h-64 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* إحصائيات المنشور */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-gray-600">
                    <button
                      onClick={() => likePost(post.id)}
                      disabled={!post.allowLikes}
                      className="flex items-center gap-2 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>❤️</span>
                      <span>{post.likesCount}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span>💬</span>
                      <span>{post.commentsCount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📤</span>
                      <span>{post.sharesCount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>👁️</span>
                      <span>{post.viewsCount}</span>
                    </div>
                  </div>

                  {/* إعدادات المنشور */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {!post.allowComments && <span>🚫💬</span>}
                    {!post.allowLikes && <span>🚫❤️</span>}
                    {!post.allowShares && <span>🚫📤</span>}
                  </div>
                </div>

                {/* منشور نيابة عن مؤثر */}
                {post.publishedFor && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      منشور نيابة عن: <strong>{post.publishedFor.fullName}</strong> (@{post.publishedFor.username})
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
