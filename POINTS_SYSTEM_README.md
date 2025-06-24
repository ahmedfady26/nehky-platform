# نظام النقاط الديناميكي - منصة نحكي 🎯

## نظرة عامة

تم تطبيق نظام نقاط ديناميكي متقدم في منصة "نحكي" يهدف إلى تحفيز التفاعل وتحسين تجربة المستخدمين مع المحتوى.

## ⚡ المميزات الرئيسية

### 🟦 نظام النقاط
- **إعجاب**: 5 نقاط لكل إعجاب مع منشور مؤثر
- **تعليق**: 10 نقاط لكل تعليق على منشور مؤثر  
- **نشر باسم مؤثر**: 20 نقطة لكل منشور
- **صلاحية محدودة**: كل نقطة صالحة لمدة 14 يوم فقط
- **حساب فردي**: النقاط تُحسب لكل مؤثر على حدة

### 🟢 الترشيحات اليومية
- **أفضل 3 متابعين**: يتم ترشيح أعلى 3 متفاعلين يومياً
- **عرض شخصي**: كل مستخدم يرى ترشيحاته فقط
- **انتهاء تلقائي**: الترشيحات تختفي بعد 24 ساعة
- **تحديث يومي**: النظام يعمل تلقائياً كل يوم

### ⭐ الواجهات التفاعلية
- **صفحة النقاط**: `/points` - عرض النقاط والترشيحات
- **صفحة الاختبار**: `/test-points-system` - تجربة النظام

## 🚀 كيفية الاستخدام

### تشغيل المشروع
```bash
npm run dev
```

### إنشاء بيانات تجريبية
```bash
npm run create-test-data
```

### تحديث الترشيحات اليومية
```bash
npm run update-daily-nominations
```

## 📊 هيكل قاعدة البيانات

### جدول النقاط (Point)
- `id`: معرف فريد
- `points`: عدد النقاط (5, 10, 20)
- `type`: نوع التفاعل (LIKE, COMMENT, POST)
- `userId`: المستخدم الحاصل على النقاط
- `influencerId`: المؤثر المرتبط
- `expiresAt`: تاريخ انتهاء الصلاحية (14 يوم)
- `isValid`: حالة الصلاحية
- `postId`, `commentId`, `likeId`: مراجع التفاعل

### جدول الترشيحات اليومية (DailyTopFollowerNomination)
- `id`: معرف فريد
- `userId`: المستخدم المرشح
- `influencerId`: المؤثر
- `totalPoints`: إجمالي النقاط
- `rank`: الترتيب (1, 2, 3)
- `nominationDate`: تاريخ الترشيح
- `isActive`: حالة النشاط
- `expiresAt`: تاريخ انتهاء العرض (24 ساعة)

## 🔧 APIs المتاحة

### إدارة النقاط
- `POST /api/points/add` - إضافة نقاط للتفاعل
- `GET /api/points/get` - جلب نقاط المستخدم
- `GET /api/points/top-followers` - أفضل متابعين لمؤثر

### إدارة الترشيحات
- `GET /api/nominations/daily` - جلب ترشيحات المستخدم اليومية
- `POST /api/nominations/update` - تحديث الترشيحات اليومية

### تفاعل المنشورات
- `POST /api/posts/like` - إعجاب/إلغاء إعجاب
- `POST /api/posts/comment` - إضافة تعليق

## 🎯 مثال على الاستخدام

### إضافة نقاط برمجياً
```javascript
import { usePointsSystem } from '@/shared/hooks/usePointsSystem'

const { addPointsForInteraction } = usePointsSystem(userId)

// عند الإعجاب
await addPointsForInteraction({
  influencerId: 'influencer_id',
  type: 'LIKE',
  activityRef: { postId: 'post_id', likeId: 'like_id' }
})
```

### استخدام مكون التفاعل
```jsx
<PostInteraction
  postId="post_id"
  authorId="author_id"
  isInfluencer={true}
  initialLikes={10}
  initialComments={5}
  isLiked={false}
  currentUserId="user_id"
  onLike={handleLike}
  onComment={handleComment}
/>
```

## 📅 الجدولة التلقائية

### Cron Job
```bash
# تحديث يومي في منتصف الليل
0 0 * * * cd /path/to/project && npm run update-daily-nominations
```

### PM2
```bash
pm2 start "npm run update-daily-nominations" --cron "0 0 * * *" --name "daily-nominations"
```

## 🧪 الاختبار

### الصفحات التجريبية
- `/points` - عرض النقاط والترشيحات الفعلية
- `/test-points-system` - تجربة النظام مع بيانات وهمية

### المستخدمين التجريبيين
- **أحمد محمد** (`ahmed_user`) - مستخدم عادي
- **سارة أحمد** (`sara_influencer`) - مؤثرة
- **علي السعدي** (`ali_influencer`) - مؤثر
- **فاطمة حسن** (`fatima_user`) - مستخدمة عادية

## 🔒 الأمان والأداء

### الحماية
- التحقق من صحة المستخدمين والمؤثرين
- منع التلاعب في النقاط
- حماية APIs من الوصول غير المصرح

### الأداء
- استعلامات محسنة مع فهرسة
- تنظيف تلقائي للبيانات المنتهية
- استخدام bigint لحساب النقاط الكبيرة

## 🐛 استكشاف الأخطاء

### مشاكل شائعة
```bash
# إعادة إنشاء قاعدة البيانات
npx prisma db push

# إعادة تشغيل الخادم
npm run dev
```

### فحص البيانات
```bash
# فتح Prisma Studio
npx prisma studio
```

## 📈 التطوير المستقبلي

### مقترحات التحسين
- إضافة مستويات المستخدمين
- نظام شارات الإنجاز
- تقارير مفصلة للنقاط
- إشعارات الترشيحات
- تصدير البيانات

### التوسع
- دعم عدد أكبر من المستخدمين
- تحسين الاستعلامات
- ذاكرة التخزين المؤقت
- قاعدة بيانات موزعة

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى مراجعة:
- الكود المصدري في المجلدات المذكورة
- ملفات الاختبار في `scripts/`
- صفحات الاختبار على الويب

---

**تم التطوير بواسطة فريق منصة نحكي** 🚀
