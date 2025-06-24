import React, { useState } from 'react'
import { usePointsSystem } from '@/shared/hooks/usePointsSystem'
import Button from './Button'
import PointsNotification from './PointsNotification'

interface PostInteractionProps {
  postId: string
  authorId: string // المؤثر الذي نشر المنشور
  isInfluencer: boolean // هل المؤلف مؤثر؟
  initialLikes: number
  initialComments: number
  isLiked: boolean
  currentUserId: string
  onLike?: (postId: string, isLiked: boolean) => void
  onComment?: (postId: string, commentId: string) => void
}

export default function PostInteraction({
  postId,
  authorId,
  isInfluencer,
  initialLikes,
  initialComments,
  isLiked: initialIsLiked,
  currentUserId,
  onLike,
  onComment
}: PostInteractionProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  
  // حالة الإشعارات
  const [notification, setNotification] = useState<{
    show: boolean
    points: number
    type: 'LIKE' | 'COMMENT' | 'POST'
    influencerName: string
  }>({
    show: false,
    points: 0,
    type: 'LIKE',
    influencerName: ''
  })

  const { addPointsForInteraction } = usePointsSystem(currentUserId)

  const handleLike = async () => {
    if (isLiking || !currentUserId) return

    setIsLiking(true)
    const newIsLiked = !isLiked

    try {
      // محاكاة API call للإعجاب
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          isLike: newIsLiked
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // تحديث الحالة المحلية
        setIsLiked(newIsLiked)
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)
        
        // إضافة النقاط إذا كان المؤلف مؤثراً والإعجاب جديد
        if (isInfluencer && newIsLiked && authorId !== currentUserId) {
          await addPointsForInteraction({
            influencerId: authorId,
            type: 'LIKE',
            activityRef: {
              postId,
              likeId: data.likeId
            },
            onSuccess: (successData) => {
              // إظهار إشعار النقاط
              setNotification({
                show: true,
                points: successData.points,
                type: 'LIKE',
                influencerName: successData.influencerName
              })
            }
          })
        }

        onLike?.(postId, newIsLiked)
      }
    } catch (error) {
      console.error('خطأ في الإعجاب:', error)
      // يمكن إضافة رسالة خطأ هنا
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async () => {
    if (isCommenting || !commentText.trim() || !currentUserId) return

    setIsCommenting(true)

    try {
      // محاكاة API call للتعليق
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          content: commentText.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // إضافة النقاط إذا كان المؤلف مؤثراً
        if (isInfluencer && authorId !== currentUserId) {
          await addPointsForInteraction({
            influencerId: authorId,
            type: 'COMMENT',
            activityRef: {
              postId,
              commentId: data.commentId
            },
            onSuccess: (successData) => {
              // إظهار إشعار النقاط
              setNotification({
                show: true,
                points: successData.points,
                type: 'COMMENT',
                influencerName: successData.influencerName
              })
            }
          })
        }

        // إعادة تعيين النموذج
        setCommentText('')
        setShowCommentForm(false)
        onComment?.(postId, data.commentId)
      }
    } catch (error) {
      console.error('خطأ في التعليق:', error)
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <>
      {/* إشعار النقاط */}
      <PointsNotification
        points={notification.points}
        type={notification.type}
        influencerName={notification.influencerName}
        show={notification.show}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
      
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        {/* أزرار التفاعل */}
        <div className="flex items-center space-x-6 space-x-reverse">
          {/* زر الإعجاب */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 space-x-reverse transition-colors ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-xl">
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="text-sm font-medium">
              {likesCount} إعجاب
            </span>
          </button>

          {/* زر التعليق */}
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-blue-500 transition-colors"
          >
            <span className="text-xl">💬</span>
            <span className="text-sm font-medium">
              {initialComments} تعليق
            </span>
          </button>

          {/* زر المشاركة */}
          <button className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-green-500 transition-colors">
            <span className="text-xl">📤</span>
            <span className="text-sm font-medium">مشاركة</span>
          </button>
        </div>

        {/* معلومات النقاط (للمؤثرين فقط) */}
        {isInfluencer && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {isLiked && authorId !== currentUserId && '+ 5 نقاط 🎯'}
          </div>
        )}

        {/* نموذج التعليق */}
        {showCommentForm && (
          <div className="absolute left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="flex flex-col space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {500 - commentText.length} حرف متبقي
                </span>
                
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCommentForm(false)
                      setCommentText('')
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!commentText.trim() || isCommenting}
                  >
                    {isCommenting ? 'جار النشر...' : 'نشر'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
