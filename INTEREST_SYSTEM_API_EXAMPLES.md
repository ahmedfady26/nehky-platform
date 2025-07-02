# مثال API لنظام الاهتمامات التلقائي

## تسجيل نشاط المستخدم

```typescript
// API: POST /api/interests/track-activity
interface TrackActivityRequest {
  userId: string;
  activityType: 'VIEW' | 'LIKE' | 'COMMENT' | 'SHARE' | 'SAVE' | 'SEARCH' | 'FOLLOW';
  contentId?: string; // Post ID, User ID, etc.
  contentType: 'POST' | 'USER' | 'HASHTAG' | 'SEARCH';
  duration?: number; // For view activities
  keywords?: string[]; // Extracted keywords
  context?: {
    source: string;
    category?: string;
    sentiment?: number;
  };
}

// مثال استخدام
const trackActivity = async (activity: TrackActivityRequest) => {
  const response = await fetch('/api/interests/track-activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity)
  });
  return response.json();
};

// تسجيل مشاهدة منشور
await trackActivity({
  userId: "user123",
  activityType: "VIEW",
  contentId: "post456",
  contentType: "POST",
  duration: 45000, // 45 seconds
  keywords: ["تكنولوجيا", "برمجة", "ذكاء اصطناعي"],
  context: {
    source: "FEED",
    category: "technology",
    sentiment: 0.8
  }
});
```

## حساب وتحديث الاهتمامات

```typescript
// API: POST /api/interests/calculate-interests
interface CalculateInterestsRequest {
  userId: string;
  timeRange?: {
    from: Date;
    to: Date;
  };
  forceRecalculate?: boolean;
}

interface InterestScore {
  name: string;
  score: number;
  confidence: number;
  trend: 'RISING' | 'STABLE' | 'DECLINING';
  sources: string[];
  lastActivity: Date;
}

interface CalculateInterestsResponse {
  userId: string;
  topInterests: InterestScore[];
  behaviorPattern: string;
  engagementStyle: string;
  contentPreference: string;
  confidence: number;
  lastCalculated: Date;
  nextUpdateDue: Date;
}

// مثال تحديث الاهتمامات
const updateInterests = async (userId: string) => {
  const response = await fetch('/api/interests/calculate-interests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, forceRecalculate: true })
  });
  return response.json() as CalculateInterestsResponse;
};
```

## الحصول على التوصيات

```typescript
// API: GET /api/interests/recommendations
interface RecommendationsRequest {
  userId: string;
  contentType: 'POSTS' | 'USERS' | 'HASHTAGS' | 'MIXED';
  limit?: number;
  excludeSeen?: boolean;
  diversityLevel?: number; // 0-1, 0=focused, 1=diverse
}

interface Recommendation {
  id: string;
  type: 'POST' | 'USER' | 'HASHTAG';
  title: string;
  relevanceScore: number;
  matchingInterests: string[];
  reason: string;
  metadata?: any;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
  explanation: string;
  confidence: number;
  diversity: number;
}

// مثال للحصول على توصيات
const getRecommendations = async (userId: string) => {
  const params = new URLSearchParams({
    userId,
    contentType: 'MIXED',
    limit: '20',
    excludeSeen: 'true',
    diversityLevel: '0.7'
  });
  
  const response = await fetch(`/api/interests/recommendations?${params}`);
  return response.json() as RecommendationsResponse;
};
```

## إدارة الاهتمامات

```typescript
// API: GET /api/interests/profile/:userId
interface UserInterestProfile {
  userId: string;
  topInterests: InterestScore[];
  categories: {
    name: string;
    score: number;
    interests: string[];
  }[];
  behaviorAnalysis: {
    pattern: string;
    style: string;
    preference: string;
    confidence: number;
  };
  statistics: {
    totalInteractions: number;
    uniqueInterests: number;
    profileCompleteness: number;
    dataQuality: number;
  };
  trends: {
    emerging: string[];
    fading: string[];
    stable: string[];
  };
}

// API: PUT /api/interests/profile/:userId
interface UpdateProfileRequest {
  manualInterests?: {
    name: string;
    weight: number; // -1 to suppress, 0 to neutral, 1+ to boost
  }[];
  settings?: {
    autoUpdateEnabled: boolean;
    updateFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    diversityPreference: number;
  };
}

// مثال إدارة الملف الشخصي
const getUserProfile = async (userId: string) => {
  const response = await fetch(`/api/interests/profile/${userId}`);
  return response.json() as UserInterestProfile;
};

const updateUserProfile = async (userId: string, updates: UpdateProfileRequest) => {
  const response = await fetch(`/api/interests/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return response.json();
};
```

## تكامل مع مكونات React

```tsx
// Hook لاستخدام نظام الاهتمامات
import { useState, useEffect } from 'react';

export const useUserInterests = (userId: string) => {
  const [interests, setInterests] = useState<UserInterestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const profile = await getUserProfile(userId);
        setInterests(profile);
      } catch (err) {
        setError('Failed to load interests');
      } finally {
        setLoading(false);
      }
    };

    loadInterests();
  }, [userId]);

  const trackActivity = async (activity: Omit<TrackActivityRequest, 'userId'>) => {
    try {
      await trackActivity({ userId, ...activity });
    } catch (err) {
      console.error('Failed to track activity:', err);
    }
  };

  const updateInterests = async () => {
    try {
      setLoading(true);
      const updated = await updateInterests(userId);
      setInterests(current => current ? { ...current, ...updated } : null);
    } catch (err) {
      setError('Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  return {
    interests,
    loading,
    error,
    trackActivity,
    updateInterests
  };
};

// مكون عرض الاهتمامات
export const InterestsProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { interests, loading, error } = useUserInterests(userId);

  if (loading) return <div>جاري تحميل الاهتمامات...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!interests) return <div>لم يتم العثور على اهتمامات</div>;

  return (
    <div className="interests-profile">
      <h2>اهتماماتك</h2>
      
      <div className="top-interests">
        <h3>الاهتمامات الرئيسية</h3>
        {interests.topInterests.slice(0, 10).map((interest, index) => (
          <div key={interest.name} className="interest-item">
            <span className="name">{interest.name}</span>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${interest.score}%` }}
              />
            </div>
            <span className="score">{Math.round(interest.score)}%</span>
            <span className={`trend ${interest.trend.toLowerCase()}`}>
              {interest.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="behavior-analysis">
        <h3>تحليل السلوك</h3>
        <p>نمط السلوك: {interests.behaviorAnalysis.pattern}</p>
        <p>أسلوب التفاعل: {interests.behaviorAnalysis.style}</p>
        <p>تفضيل المحتوى: {interests.behaviorAnalysis.preference}</p>
      </div>

      <div className="categories">
        <h3>الفئات</h3>
        {interests.categories.map(category => (
          <div key={category.name} className="category">
            <h4>{category.name}</h4>
            <div className="category-interests">
              {category.interests.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## خوارزمية حساب درجة الاهتمام

```typescript
interface ActivityWeight {
  VIEW: number;
  LIKE: number;
  COMMENT: number;
  SHARE: number;
  SAVE: number;
  SEARCH: number;
  FOLLOW: number;
}

const ACTIVITY_WEIGHTS: ActivityWeight = {
  VIEW: 1,
  LIKE: 3,
  COMMENT: 5,
  SHARE: 7,
  SAVE: 8,
  SEARCH: 4,
  FOLLOW: 6
};

const calculateInterestScore = (
  activities: Activity[],
  timeDecay: number = 0.98
): number => {
  let totalScore = 0;
  const now = new Date();

  activities.forEach(activity => {
    // حساب الوزن الأساسي
    const baseWeight = ACTIVITY_WEIGHTS[activity.type];
    
    // حساب التحلل الزمني
    const daysSince = (now.getTime() - activity.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const timeWeight = Math.pow(timeDecay, daysSince);
    
    // حساب وزن المدة (للمشاهدة)
    let durationWeight = 1;
    if (activity.type === 'VIEW' && activity.duration) {
      durationWeight = Math.min(activity.duration / 30000, 3); // Max 3x for 30+ seconds
    }
    
    // حساب وزن السياق
    const contextWeight = activity.context?.sentiment || 1;
    
    // الدرجة النهائية
    const score = baseWeight * timeWeight * durationWeight * contextWeight;
    totalScore += score;
  });

  return Math.min(totalScore, 100); // Cap at 100
};

const identifyBehaviorPattern = (interests: InterestScore[]): BehaviorPattern => {
  const topScore = interests[0]?.score || 0;
  const diversity = interests.length;
  const concentration = interests.slice(0, 5).reduce((sum, i) => sum + i.score, 0) / 
                       interests.reduce((sum, i) => sum + i.score, 0);

  if (concentration > 0.8) return 'FOCUSED';
  if (diversity > 50) return 'DIVERSE';
  if (interests.filter(i => i.trend === 'RISING').length > diversity * 0.3) return 'EXPLORER';
  if (interests.filter(i => i.trend === 'STABLE').length > diversity * 0.7) return 'CONSISTENT';
  
  return 'BALANCED';
};
```

هذا مثال شامل يوضح كيفية تطبيق نظام الاهتمامات التلقائي في الكود الفعلي!
