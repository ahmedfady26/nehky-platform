'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import LoadingSpinner from '@/components/LoadingSpinner'

interface DailyNomination {
  id: string
  totalPoints: number
  rank: number
  nominationDate: string
  influencer: {
    id: string
    username: string
    fullName: string
    avatar?: string
  }
}

interface UserPointsSummary {
  influencerId: string
  influencerUsername: string
  influencerFullName: string
  totalPoints: number
  pointsCount: number
}

export default function PointsPage() {
  const [nominations, setNominations] = useState<DailyNomination[]>([])
  const [userPoints, setUserPoints] = useState<UserPointsSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'nominations' | 'points'>('nominations')

  // محاكاة معرف المستخدم (في التطبيق الحقيقي يأتي من السياق)
  const userId = 'cmc4ykyps0000574ihv1nqmyp' // أحمد محمد - من البيانات التجريبية

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // جلب الترشيحات اليومية
      const nominationsResponse = await fetch(`/api/nominations/daily?userId=${userId}`)
      const nominationsData = await nominationsResponse.json()

      if (nominationsData.success) {
        setNominations(nominationsData.data.nominations)
      }

      // جلب نقاط المستخدم
      const pointsResponse = await fetch(`/api/points/get?userId=${userId}`)
      const pointsData = await pointsResponse.json()

      if (pointsData.success) {
        setUserPoints(pointsData.data.pointsByInfluencer)
      }

    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error)
      setError('حدث خطأ في تحميل البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏆'
    }
  }

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1: return 'المركز الأول'
      case 2: return 'المركز الثاني'
      case 3: return 'المركز الثالث'
      default: return `المركز ${rank}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">جاري تحميل نقاطك وترشيحاتك...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 نقاطي وترشيحاتي</h1>
          <p className="text-gray-600">تابع نقاطك وترشيحاتك ككبير متابعين</p>
        </div>

        {/* التبويبات */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('nominations')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'nominations'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🏆 ترشيحات اليوم ({nominations.length})
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'points'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              ⭐ نقاطي ({userPoints.length})
            </button>
          </div>
        </div>

        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <p className="text-red-600 text-center">{error}</p>
          </Card>
        )}

        {/* ترشيحات اليوم */}
        {activeTab === 'nominations' && (
          <div className="space-y-6">
            {nominations.length > 0 ? (
              <>
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h2 className="text-xl font-bold text-green-800 mb-2">
                      مبروك! تم ترشيحك اليوم لتكون كبير المتابعين
                    </h2>
                    <p className="text-green-600">
                      لقد حصلت على ترشيح مع {nominations.length} من المؤثرين
                    </p>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nominations.map((nomination) => (
                    <Card key={nomination.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <Avatar
                            user={nomination.influencer}
                            size="lg"
                          />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {nomination.influencer.fullName}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          @{nomination.influencer.username}
                        </p>

                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 mb-4">
                          <div className="text-3xl mb-2">
                            {getRankIcon(nomination.rank)}
                          </div>
                          <p className="font-bold text-orange-800">
                            {getRankText(nomination.rank)}
                          </p>
                          <p className="text-sm text-orange-600">
                            {nomination.totalPoints} نقطة
                          </p>
                        </div>

                        <p className="text-xs text-gray-500">
                          تاريخ الترشيح: {new Date(nomination.nominationDate).toLocaleDateString('ar')}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  لا توجد ترشيحات اليوم
                </h2>
                <p className="text-gray-600 mb-4">
                  لم يتم ترشيحك كككبير متابعين اليوم. تفاعل أكثر مع المؤثرين لزيادة فرصك!
                </p>
                <Button onClick={loadData}>
                  تحديث البيانات
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* نقاط المستخدم */}
        {activeTab === 'points' && (
          <div className="space-y-6">
            {userPoints.length > 0 ? (
              <>
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <h2 className="text-xl font-bold text-blue-800 mb-2">
                      إجمالي نقاطك الصالحة
                    </h2>
                    <p className="text-blue-600">
                      لديك نقاط مع {userPoints.length} من المؤثرين
                    </p>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPoints.map((points, index) => (
                    <Card key={points.influencerId} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {points.influencerFullName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            @{points.influencerUsername}
                          </p>
                          
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg px-4 py-2">
                              <p className="text-lg font-bold text-blue-800">
                                {points.totalPoints} نقطة
                              </p>
                              <p className="text-xs text-blue-600">
                                {points.pointsCount} تفاعل
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-2xl mr-4">
                          {index < 3 ? getRankIcon(index + 1) : '🌟'}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  لا توجد نقاط حالياً
                </h2>
                <p className="text-gray-600 mb-4">
                  ابدأ بالتفاعل مع المؤثرين للحصول على نقاط!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">👍</div>
                    <p className="font-medium text-green-800">إعجاب</p>
                    <p className="text-sm text-green-600">5 نقاط</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="font-medium text-blue-800">تعليق</p>
                    <p className="text-sm text-blue-600">10 نقاط</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="font-medium text-purple-800">منشور</p>
                    <p className="text-sm text-purple-600">20 نقطة</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* معلومات النظام */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 معلومات نظام النقاط</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">كيفية الحصول على النقاط:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• الإعجاب بمنشور: 5 نقاط</li>
                <li>• كتابة تعليق: 10 نقاط</li>
                <li>• نشر منشور باسم مؤثر: 20 نقطة</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">قواعد النظام:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• النقاط صالحة لمدة 14 يوم فقط</li>
                <li>• النقاط منفصلة لكل مؤثر</li>
                <li>• الترشيح لأفضل 3 متابعين يومياً</li>
                <li>• الترشيحات تظهر لمدة 24 ساعة</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
