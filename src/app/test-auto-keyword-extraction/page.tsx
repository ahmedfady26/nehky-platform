'use client'

import { useState } from 'react'

export default function TestAutoKeywordExtraction() {
  const [postContent, setPostContent] = useState('أهلاً وسهلاً بكم في #منصة_نحكي! نحن متحمسون لتقديم #تجربة_فريدة للمستخدمين العرب. شاركونا آراءكم حول #التكنولوجيا و #الذكاء_الاصطناعي!')
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setError('يرجى إدخال محتوى المنشور')
      return
    }

    setIsCreating(true)
    setError('')
    setResult(null)

    try {
      // إنشاء token تجريبي
      const tokenResponse = await fetch('/api/auth/create-test-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!tokenResponse.ok) {
        throw new Error('فشل في إنشاء token التجريبي')
      }

      const { token } = await tokenResponse.json()

      // إنشاء المنشور
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: postContent,
          visibility: 'PUBLIC',
          allowComments: true,
          allowLikes: true,
          allowShares: true
        })
      })

      if (!postResponse.ok) {
        const errorData = await postResponse.json()
        throw new Error(errorData.message || 'فشل في إنشاء المنشور')
      }

      const postResult = await postResponse.json()
      setResult(postResult)

      // الانتظار قليلاً ثم جلب تكرارات الكلمات للمنشور الجديد
      setTimeout(async () => {
        try {
          const keywordsResponse = await fetch(`/api/keyword-occurrences?postId=${postResult.data.id}&limit=50`)
          if (keywordsResponse.ok) {
            const keywordsData = await keywordsResponse.json()
            setResult({
              ...postResult,
              extractedKeywords: keywordsData.data
            })
          }
        } catch (err) {
          console.error('خطأ في جلب الكلمات المستخرجة:', err)
        }
      }, 1000)

    } catch (err: any) {
      console.error('خطأ في إنشاء المنشور:', err)
      setError(err.message || 'حدث خطأ غير متوقع')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            اختبار استخراج الكلمات التلقائي
          </h1>
          <p className="text-gray-600">
            اختبار استخراج وحفظ تكرارات الكلمات تلقائياً عند إنشاء منشور جديد
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">إنشاء منشور جديد</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوى المنشور
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="اكتب محتوى المنشور هنا..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isCreating}
            />
          </div>

          <button
            onClick={handleCreatePost}
            disabled={isCreating || !postContent.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isCreating ? 'جاري الإنشاء...' : 'إنشاء المنشور واستخراج الكلمات'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">نتائج العملية</h2>
            
            {result.success && (
              <div className="space-y-6">
                {/* معلومات المنشور */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ تم إنشاء المنشور بنجاح</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">معرف المنشور:</span> {result.data.id}</p>
                    <p><span className="font-medium">المحتوى:</span> {result.data.content}</p>
                    <p><span className="font-medium">تاريخ الإنشاء:</span> {new Date(result.data.createdAt).toLocaleString('ar')}</p>
                  </div>
                </div>

                {/* الكلمات المستخرجة */}
                {result.extractedKeywords && result.extractedKeywords.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">🔍 الكلمات المستخرجة ({result.extractedKeywords.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.extractedKeywords.map((keyword: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{keyword.keyword}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              keyword.type === 'HASHTAG' ? 'bg-green-100 text-green-800' :
                              keyword.type === 'KEYWORD' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {keyword.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">الموضع:</span> {keyword.position}</p>
                            <p><span className="font-medium">الفئة:</span> {keyword.category || 'غير محدد'}</p>
                            <p><span className="font-medium">المشاعر:</span> {keyword.sentiment || 'غير محدد'}</p>
                            {keyword.context && (
                              <p><span className="font-medium">السياق:</span> "{keyword.context}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.extractedKeywords && result.extractedKeywords.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">⚠️ لم يتم العثور على كلمات مستخرجة للمنشور</p>
                  </div>
                )}

                {!result.extractedKeywords && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-600">🔄 جاري جلب الكلمات المستخرجة...</p>
                  </div>
                )}
              </div>
            )}

            {!result.success && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">❌ فشل في إنشاء المنشور: {result.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
