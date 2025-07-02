// 📱 مكون التتبع المتقدم لسلوك المستخدم
// منصة نحكي - Nehky.com

'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AdvancedTrackingProps {
  postId: string;
  isVideo?: boolean;
  videoDuration?: number;
  children: React.ReactNode;
}

export function AdvancedTracking({ 
  postId, 
  isVideo = false, 
  videoDuration = 0, 
  children 
}: AdvancedTrackingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // بيانات التتبع
  const trackingData = useRef({
    postId,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    lastScrollTime: Date.now(),
    scrollStartPosition: 0,
    totalPauseTime: 0,
    pauseStartTime: 0,
    isVisible: false,
    maxScrollDepth: 0,
    videoStartTime: 0,
    videoPlayCount: 0,
    videoPauseCount: 0,
    videoSeekCount: 0,
    lastVideoTime: 0
  });

  // 📊 تتبع التمرير
  const trackScrollBehavior = useCallback(async (data: {
    scrollDepth: number;
    timeOnPost: number;
    scrollSpeed: number;
    pauseTime: number;
    isVisible: boolean;
    viewportHeight: number;
    postHeight: number;
  }) => {
    try {
      await fetch('/api/tracking/scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          postId,
          sessionId: trackingData.current.sessionId
        })
      });
    } catch (error) {
      console.error('خطأ في إرسال بيانات التمرير:', error);
    }
  }, [postId]);

  // 🎬 تتبع الفيديو
  const trackVideoWatching = useCallback(async (data: {
    videoDuration: number;
    watchedDuration: number;
    watchedPercentage: number;
    playCount: number;
    pauseCount: number;
    seekCount: number;
    isCompleted: boolean;
    exitPoint: number;
  }) => {
    try {
      await fetch('/api/tracking/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          postId,
          sessionId: trackingData.current.sessionId
        })
      });
    } catch (error) {
      console.error('خطأ في إرسال بيانات الفيديو:', error);
    }
  }, [postId]);

  // 👍 تتبع التفاعل
  const trackInteraction = useCallback(async (
    interactionType: 'LIKE' | 'COMMENT' | 'SHARE' | 'PASSIVE_VIEW' | 'ACTIVE_VIEW',
    clickPosition?: { x: number; y: number }
  ) => {
    try {
      const now = Date.now();
      const timeToInteract = (now - trackingData.current.startTime) / 1000;

      await fetch('/api/tracking/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          interactionType,
          timeToInteract,
          scrollPosition: window.pageYOffset,
          clickPosition: clickPosition || { x: 0, y: 0 },
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          sessionId: trackingData.current.sessionId
        })
      });
    } catch (error) {
      console.error('خطأ في إرسال بيانات التفاعل:', error);
    }
  }, [postId]);

  // مراقب التقاطع (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          const currentTime = Date.now();
          
          if (isVisible && !trackingData.current.isVisible) {
            // بدء المشاهدة
            trackingData.current.isVisible = true;
            trackingData.current.startTime = currentTime;
            
            // تتبع المشاهدة
            trackInteraction('PASSIVE_VIEW');
          } else if (!isVisible && trackingData.current.isVisible) {
            // انتهاء المشاهدة
            trackingData.current.isVisible = false;
            
            // حساب البيانات وإرسالها
            const timeOnPost = (currentTime - trackingData.current.startTime) / 1000;
            const element = entry.target as HTMLElement;
            const rect = element.getBoundingClientRect();
            const scrollDepth = trackingData.current.maxScrollDepth;
            
            trackScrollBehavior({
              scrollDepth,
              timeOnPost,
              scrollSpeed: calculateScrollSpeed(),
              pauseTime: trackingData.current.totalPauseTime,
              isVisible: false,
              viewportHeight: window.innerHeight,
              postHeight: rect.height
            });
          }
        });
      },
      { threshold: [0.1, 0.5, 0.9] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [trackScrollBehavior, trackInteraction]);

  // مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (!trackingData.current.isVisible) return;

      const now = Date.now();
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementBottom = elementTop + rect.height;
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + window.innerHeight;

      // حساب عمق التمرير
      const visibleTop = Math.max(elementTop, viewportTop);
      const visibleBottom = Math.min(elementBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const scrollDepth = Math.min(100, (visibleHeight / rect.height) * 100);

      trackingData.current.maxScrollDepth = Math.max(
        trackingData.current.maxScrollDepth,
        scrollDepth
      );

      // حساب سرعة التمرير
      const timeDiff = now - trackingData.current.lastScrollTime;
      const scrollDiff = Math.abs(window.pageYOffset - trackingData.current.scrollStartPosition);
      
      if (timeDiff > 100) { // تحديث كل 100ms
        trackingData.current.lastScrollTime = now;
        trackingData.current.scrollStartPosition = window.pageYOffset;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // مراقبة الفيديو (إذا كان فيديو)
  useEffect(() => {
    if (!isVideo) return;

    const video = containerRef.current?.querySelector('video');
    if (!video) return;

    videoRef.current = video;

    const handlePlay = () => {
      trackingData.current.videoPlayCount++;
      trackingData.current.videoStartTime = Date.now();
    };

    const handlePause = () => {
      trackingData.current.videoPauseCount++;
      const watchedDuration = video.currentTime;
      const watchedPercentage = (watchedDuration / video.duration) * 100;
      
      trackVideoWatching({
        videoDuration: video.duration,
        watchedDuration,
        watchedPercentage,
        playCount: trackingData.current.videoPlayCount,
        pauseCount: trackingData.current.videoPauseCount,
        seekCount: trackingData.current.videoSeekCount,
        isCompleted: video.ended,
        exitPoint: video.currentTime
      });
    };

    const handleSeeked = () => {
      trackingData.current.videoSeekCount++;
    };

    const handleEnded = () => {
      const watchedDuration = video.duration;
      const watchedPercentage = 100;
      
      trackVideoWatching({
        videoDuration: video.duration,
        watchedDuration,
        watchedPercentage,
        playCount: trackingData.current.videoPlayCount,
        pauseCount: trackingData.current.videoPauseCount,
        seekCount: trackingData.current.videoSeekCount,
        isCompleted: true,
        exitPoint: video.duration
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVideo, trackVideoWatching]);

  // حساب سرعة التمرير
  const calculateScrollSpeed = () => {
    const timeDiff = Date.now() - trackingData.current.lastScrollTime;
    const scrollDiff = Math.abs(window.pageYOffset - trackingData.current.scrollStartPosition);
    return timeDiff > 0 ? (scrollDiff / timeDiff) * 1000 : 0; // px/second
  };

  // إضافة مستمعات للتفاعل
  const handleClick = (event: React.MouseEvent, interactionType: 'LIKE' | 'COMMENT' | 'SHARE') => {
    const clickPosition = {
      x: event.clientX,
      y: event.clientY
    };
    trackInteraction(interactionType, clickPosition);
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={(e) => {
          // تحديد نوع التفاعل بناءً على العنصر المنقور
          const target = e.target as HTMLElement;
          if (target.closest('[data-interaction="like"]')) {
            handleClick(e, 'LIKE');
          } else if (target.closest('[data-interaction="comment"]')) {
            handleClick(e, 'COMMENT');
          } else if (target.closest('[data-interaction="share"]')) {
            handleClick(e, 'SHARE');
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Hook للاستخدام السهل
export function useAdvancedTracking(postId: string) {
  return {
    trackInteraction: async (
      interactionType: 'LIKE' | 'COMMENT' | 'SHARE' | 'PASSIVE_VIEW' | 'ACTIVE_VIEW',
      clickPosition?: { x: number; y: number }
    ) => {
      try {
        await fetch('/api/tracking/interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            interactionType,
            timeToInteract: 0,
            scrollPosition: window.pageYOffset,
            clickPosition: clickPosition || { x: 0, y: 0 },
            deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            sessionId: `hook_session_${Date.now()}`
          })
        });
      } catch (error) {
        console.error('خطأ في تتبع التفاعل:', error);
      }
    }
  };
}
