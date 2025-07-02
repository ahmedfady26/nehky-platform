// 📝 مثال على منشور مع التتبع المتقدم
// منصة نحكي - Nehky.com

'use client';

import { useState } from 'react';
import { AdvancedTracking, useAdvancedTracking } from './AdvancedTracking';
import { Heart, MessageCircle, Share2, Play, Pause } from 'lucide-react';

interface TrackedPostProps {
  postId: string;
  content: string;
  author: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  videoDuration?: number;
}

export function TrackedPost({
  postId,
  content,
  author,
  mediaUrl,
  mediaType,
  videoDuration = 0
}: TrackedPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const { trackInteraction } = useAdvancedTracking(postId);

  const handleLike = async (event: React.MouseEvent) => {
    setIsLiked(!isLiked);
    const clickPosition = {
      x: event.clientX,
      y: event.clientY
    };
    await trackInteraction('LIKE', clickPosition);
  };

  const handleComment = async (event: React.MouseEvent) => {
    setShowComments(!showComments);
    const clickPosition = {
      x: event.clientX,
      y: event.clientY
    };
    await trackInteraction('COMMENT', clickPosition);
  };

  const handleShare = async (event: React.MouseEvent) => {
    const clickPosition = {
      x: event.clientX,
      y: event.clientY
    };
    await trackInteraction('SHARE', clickPosition);
    
    // منطق المشاركة
    if (navigator.share) {
      navigator.share({
        title: `منشور من ${author}`,
        text: content,
        url: window.location.href
      });
    }
  };

  return (
    <AdvancedTracking
      postId={postId}
      isVideo={mediaType === 'VIDEO'}
      videoDuration={videoDuration}
    >
      <article className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto">
        {/* رأس المنشور */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {author.charAt(0)}
          </div>
          <div className="mr-3">
            <h3 className="font-semibold text-gray-800">{author}</h3>
            <p className="text-sm text-gray-500">منذ ساعتين</p>
          </div>
        </div>

        {/* محتوى المنشور */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{content}</p>
        </div>

        {/* الوسائط */}
        {mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {mediaType === 'IMAGE' ? (
              <img
                src={mediaUrl}
                alt="محتوى المنشور"
                className="w-full h-auto object-cover"
              />
            ) : mediaType === 'VIDEO' ? (
              <div className="relative">
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {isPlaying ? <Play size={16} /> : <Pause size={16} />}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* أزرار التفاعل */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6 space-x-reverse">
            {/* زر الإعجاب */}
            <button
              onClick={handleLike}
              data-interaction="like"
              className={`flex items-center space-x-2 space-x-reverse transition-colors duration-200 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart 
                size={20} 
                className={isLiked ? 'fill-current' : ''} 
              />
              <span className="text-sm font-medium">
                {isLiked ? 'مُعجب' : 'إعجاب'}
              </span>
            </button>

            {/* زر التعليق */}
            <button
              onClick={handleComment}
              data-interaction="comment"
              className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <MessageCircle size={20} />
              <span className="text-sm font-medium">تعليق</span>
            </button>

            {/* زر المشاركة */}
            <button
              onClick={handleShare}
              data-interaction="share"
              className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-green-500 transition-colors duration-200"
            >
              <Share2 size={20} />
              <span className="text-sm font-medium">مشاركة</span>
            </button>
          </div>

          {/* إحصائيات */}
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
            <span>24 إعجاب</span>
            <span>5 تعليقات</span>
            <span>3 مشاركات</span>
          </div>
        </div>

        {/* قسم التعليقات */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  أ
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800">
                    منشور رائع! شكراً لك على المشاركة.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  م
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800">
                    محتوى مفيد جداً، استفدت منه كثيراً.
                  </p>
                </div>
              </div>
            </div>

            {/* إضافة تعليق جديد */}
            <div className="mt-4 flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                أ
              </div>
              <input
                type="text"
                placeholder="اكتب تعليقاً..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </article>
    </AdvancedTracking>
  );
}

export default TrackedPost;
