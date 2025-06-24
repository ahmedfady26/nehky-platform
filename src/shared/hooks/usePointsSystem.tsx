import { useState, useCallback } from 'react'

interface UsePointsSystemReturn {
  addPointsForInteraction: (params: {
    influencerId: string
    type: 'LIKE' | 'COMMENT' | 'POST'
    activityRef?: {
      postId?: string
      commentId?: string
      likeId?: string
    }
    onSuccess?: (data: { points: number, influencerName: string }) => void
  }) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

export function usePointsSystem(userId: string): UsePointsSystemReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPointsForInteraction = useCallback(async (params: {
    influencerId: string
    type: 'LIKE' | 'COMMENT' | 'POST'
    activityRef?: {
      postId?: string
      commentId?: string
      likeId?: string
    }
    onSuccess?: (data: { points: number, influencerName: string }) => void
  }) => {
    if (!userId) {
      setError('معرف المستخدم مطلوب')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/points/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          influencerId: params.influencerId,
          type: params.type,
          activityRef: params.activityRef
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في إضافة النقاط')
      }

      if (data.success) {
        // جلب اسم المؤثر للإشعار
        const influencerResponse = await fetch(`/api/user/profile?userId=${params.influencerId}`)
        let influencerName = 'المؤثر'
        
        if (influencerResponse.ok) {
          const influencerData = await influencerResponse.json()
          if (influencerData.success) {
            influencerName = influencerData.data.fullName
          }
        }

        // استدعاء callback النجاح
        params.onSuccess?.({
          points: data.data.points,
          influencerName
        })

        console.log(`✅ تم إضافة ${data.data.points} نقطة بنجاح!`)
        return true
      } else {
        throw new Error(data.message || 'فشل في إضافة النقاط')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      setError(errorMessage)
      console.error('خطأ في إضافة النقاط:', errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  return {
    addPointsForInteraction,
    isLoading,
    error
  }
}
