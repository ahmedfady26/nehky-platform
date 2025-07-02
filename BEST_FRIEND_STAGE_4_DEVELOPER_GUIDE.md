# 👨‍💻 دليل المطور - نظام الصلاحيات والامتيازات

## 📚 نظرة عامة
هذا الدليل يوضح كيفية استخدام وتطوير المرحلة الرابعة من نظام "الصديق الأفضل" - نظام الصلاحيات والامتيازات.

---

## 🔧 Backend APIs

### 1. نظام الصلاحيات (`permissions.ts`)

#### فحص الصلاحيات المتاحة
```typescript
import { checkBestFriendPermissions } from '@/lib/bestfriend/permissions'

const permissions = await checkBestFriendPermissions(
  userId,      // معرف المستخدم الطالب
  targetUserId // معرف الصديق المستهدف
)

// النتيجة
{
  canRequestPost: boolean,
  canSendMessage: boolean,
  canTagInPost: boolean,
  canShareContent: boolean,
  remainingPostSlots: number,
  remainingMessageSlots: number,
  // ... المزيد
}
```

#### طلب إذن جديد
```typescript
import { requestPermission } from '@/lib/bestfriend/permissions'

const request = await requestPermission(
  requesterId,  // معرف الطالب
  targetUserId, // معرف المستهدف
  'POST_ON_PROFILE', // نوع الصلاحية
  'أريد نشر تهنئة بعيد ميلادك!', // رسالة
  'محتوى المنشور...' // محتوى اختياري
)
```

#### معالجة الموافقة/الرفض
```typescript
import { processPermissionRequest } from '@/lib/bestfriend/permissions'

const response = await processPermissionRequest(
  requestId,   // معرف الطلب
  targetUserId, // معرف المجيب
  'APPROVED',  // أو 'REJECTED'
  'موافق!' // رسالة اختيارية
)
```

### 2. نظام الامتيازات (`privileges.ts`)

#### جلب الشارة والامتيازات
```typescript
import { 
  getBestFriendBadge, 
  getBestFriendPrivileges 
} from '@/lib/bestfriend/privileges'

// جلب الشارة
const badge = await getBestFriendBadge(userId, friendId)
console.log(badge.displayName) // "صديق مميز"
console.log(badge.color) // "#FFD700"

// جلب الامتيازات
const privileges = await getBestFriendPrivileges(userId, friendId)
console.log(privileges.canPostOnProfile) // true/false
console.log(privileges.hasCommentPriority) // true/false
```

#### إحصائيات المستخدم
```typescript
import { getUserPrivilegeStats } from '@/lib/bestfriend/privileges'

const stats = await getUserPrivilegeStats(userId)
console.log(stats.totalBestFriends) // عدد الأصدقاء
console.log(stats.badgeDistribution) // توزيع الشارات
```

---

## 🌐 API Endpoints

### 1. Permissions API (`/api/bestfriend/permissions`)

#### GET - جلب الطلبات
```javascript
// جلب الطلبات المعلقة
const response = await fetch('/api/bestfriend/permissions?action=pending', {
  headers: { 'user-id': userId }
})

// جلب جميع الطلبات
const response = await fetch('/api/bestfriend/permissions?action=all', {
  headers: { 'user-id': userId }
})

// فحص الصلاحيات مع صديق معين
const response = await fetch(`/api/bestfriend/permissions?action=check&targetUserId=${friendId}`, {
  headers: { 'user-id': userId }
})
```

#### POST - إنشاء طلب جديد
```javascript
const response = await fetch('/api/bestfriend/permissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId
  },
  body: JSON.stringify({
    action: 'request',
    targetUserId: friendId,
    permissionType: 'POST_ON_PROFILE',
    message: 'أريد نشر تهنئة!',
    content: 'كل عام وأنت بخير!'
  })
})
```

#### PUT - معالجة الطلب
```javascript
const response = await fetch('/api/bestfriend/permissions', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId
  },
  body: JSON.stringify({
    action: 'respond',
    requestId: 'request-123',
    response: 'APPROVED', // أو 'REJECTED'
    message: 'موافق!'
  })
})
```

### 2. Privileges API (`/api/bestfriend/privileges`)

#### GET - جلب الامتيازات
```javascript
// جلب امتيازات صديق معين
const response = await fetch(`/api/bestfriend/privileges?action=privileges&targetUserId=${friendId}`, {
  headers: { 'user-id': userId }
})

// جلب الإحصائيات
const response = await fetch('/api/bestfriend/privileges?action=stats', {
  headers: { 'user-id': userId }
})

// جلب جميع الأصدقاء مع امتيازاتهم
const response = await fetch('/api/bestfriend/privileges?action=all', {
  headers: { 'user-id': userId }
})
```

#### POST - ترقية الشارة
```javascript
const response = await fetch('/api/bestfriend/privileges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId
  },
  body: JSON.stringify({
    targetUserId: friendId,
    currentBadge: 'SILVER_FRIEND'
  })
})
```

---

## 🎨 Frontend Components

### 1. مكون الشارة (`BestFriendBadge`)

#### الاستخدام الأساسي
```tsx
import BestFriendBadge from '@/components/bestfriend/BestFriendBadge'

<BestFriendBadge
  relationshipStrength="STRONG"
  username="ahmad_test"
  size="md"
  showLabel={true}
  animated={true}
  onClick={() => console.log('Badge clicked!')}
/>
```

#### أنواع مختلفة
```tsx
import { 
  SimpleBestFriendBadge, 
  CompactBestFriendBadge 
} from '@/components/bestfriend/BestFriendBadge'

// شارة مبسطة
<SimpleBestFriendBadge relationshipStrength="MODERATE" />

// شارة مضغوطة للتعليقات
<CompactBestFriendBadge relationshipStrength="VERY_STRONG" />
```

### 2. طلبات الصلاحيات (`PermissionRequest`)

#### طلب واحد
```tsx
import PermissionRequestCard from '@/components/bestfriend/PermissionRequest'

<PermissionRequestCard
  request={requestData}
  onApprove={async (id, message) => {
    // معالجة الموافقة
  }}
  onReject={async (id, reason) => {
    // معالجة الرفض
  }}
  isProcessing={false}
/>
```

#### قائمة الطلبات
```tsx
import { PermissionRequestsList } from '@/components/bestfriend/PermissionRequest'

<PermissionRequestsList
  requests={requestsArray}
  onApprove={handleApprove}
  onReject={handleReject}
  isLoading={false}
/>
```

### 3. لوحة التحكم (`BestFriendDashboard`)

#### الاستخدام الكامل
```tsx
import BestFriendDashboard from '@/components/bestfriend/BestFriendDashboard'

<BestFriendDashboard
  userId={currentUserId}
  className="max-w-6xl mx-auto"
/>
```

---

## 📱 أمثلة التطبيق

### مثال 1: عرض الشارة في الملف الشخصي
```tsx
function UserProfile({ user, currentUserId }) {
  const [badge, setBadge] = useState(null)
  
  useEffect(() => {
    if (currentUserId !== user.id) {
      fetch(`/api/bestfriend/privileges?action=privileges&targetUserId=${user.id}`, {
        headers: { 'user-id': currentUserId }
      })
      .then(res => res.json())
      .then(data => setBadge(data.badge))
    }
  }, [])
  
  return (
    <div className="flex items-center space-x-4">
      <img src={user.avatar} className="w-16 h-16 rounded-full" />
      <div>
        <div className="flex items-center space-x-2">
          <h2>{user.name}</h2>
          {badge && (
            <BestFriendBadge
              relationshipStrength={badge.relationshipStrength}
              username={user.username}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

### مثال 2: طلب صلاحية النشر
```tsx
function PostCreator({ targetUserId }) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  
  const requestPostPermission = async () => {
    setIsRequesting(true)
    
    const response = await fetch('/api/bestfriend/permissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({
        action: 'request',
        targetUserId,
        permissionType: 'POST_ON_PROFILE',
        message: 'أريد نشر محتوى في ملفك الشخصي'
      })
    })
    
    if (response.ok) {
      alert('تم إرسال الطلب! في انتظار الموافقة.')
    }
    
    setIsRequesting(false)
  }
  
  return (
    <div>
      {!hasPermission ? (
        <button 
          onClick={requestPostPermission}
          disabled={isRequesting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isRequesting ? 'جاري الإرسال...' : 'طلب صلاحية النشر'}
        </button>
      ) : (
        <textarea 
          placeholder="اكتب منشورك هنا..."
          className="w-full p-4 border rounded"
        />
      )}
    </div>
  )
}
```

### مثال 3: عرض الطلبات المعلقة
```tsx
function NotificationBadge({ userId }) {
  const [pendingCount, setPendingCount] = useState(0)
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      const response = await fetch('/api/bestfriend/permissions?action=pending', {
        headers: { 'user-id': userId }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingCount(data.data.length)
      }
    }
    
    fetchPendingRequests()
    
    // تحديث كل 30 ثانية
    const interval = setInterval(fetchPendingRequests, 30000)
    return () => clearInterval(interval)
  }, [userId])
  
  if (pendingCount === 0) return null
  
  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {pendingCount}
      </span>
    </div>
  )
}
```

---

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ: "لم يتم العثور على علاقة صداقة"
```typescript
// تأكد من وجود علاقة نشطة أولاً
const relation = await prisma.bestFriendRelation.findFirst({
  where: {
    OR: [
      { user1Id: userId, user2Id: targetId, status: 'ACTIVE' },
      { user1Id: targetId, user2Id: userId, status: 'ACTIVE' }
    ]
  }
})

if (!relation) {
  return { success: false, message: 'لستما أصدقاء مؤكدين' }
}
```

#### 2. مشكلة: الصلاحيات لا تظهر
```typescript
// تحقق من قوة العلاقة
const privileges = await getBestFriendPrivileges(userId, friendId)
console.log('Relationship strength:', privileges.relationshipLevel)

// قد تحتاج لترقية العلاقة أولاً
const upgrade = await upgradeBadgeIfEligible(userId, friendId)
```

#### 3. خطأ: "تجاوز الحد الأقصى للطلبات"
```typescript
// فحص العدادات الحالية
const permissions = await checkBestFriendPermissions(userId, targetId)
console.log('Remaining slots:', permissions.remainingPostSlots)

// إعادة تعيين العدادات إذا لزم الأمر (للمشرفين)
await resetPermissionCounters(userId, targetId)
```

---

## 🧪 اختبار المكونات

### اختبار نظام الصلاحيات
```bash
# تشغيل اختبار تكاملي
npm run test:integration

# اختبار APIs
npm run test:api

# اختبار المكونات
npm run test:components
```

### اختبار يدوي للواجهة
1. إنشاء علاقة صداقة جديدة
2. طلب صلاحية نشر
3. قبول/رفض الطلب من الطرف الآخر
4. التحقق من تحديث الامتيازات

---

## 📈 مراقبة الأداء

### مؤشرات مهمة
- عدد طلبات الصلاحيات المعلقة
- معدل الموافقة على الطلبات
- توزيع أنواع الشارات
- نشاط استخدام الامتيازات

### تحسين الاستعلامات
```typescript
// استعلام محسن لجلب الامتيازات
const privileges = await prisma.bestFriendRelation.findFirst({
  where: { /* ... */ },
  include: {
    user1: { select: { id: true, username: true } },
    user2: { select: { id: true, username: true } }
  }
})
```

---

## 🔒 الأمان

### أفضل الممارسات
1. **التحقق من الهوية:** تأكد من `user-id` في جميع الطلبات
2. **فلترة البيانات:** فحص جميع المدخلات
3. **حدود المعدل:** منع إساءة الاستخدام
4. **تسجيل الأنشطة:** تتبع العمليات الحساسة

### مثال التحقق
```typescript
export async function authenticatedApiCall(request: NextRequest) {
  const userId = request.headers.get('user-id')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    )
  }
  
  // باقي المنطق...
}
```

---

**آخر تحديث:** 1 يوليو 2025  
**الإصدار:** 4.0.0  
**المطور:** GitHub Copilot
