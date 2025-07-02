# 🏗️ خطة تطوير نظام "الصديق الأفضل" الكامل - مراحل التنفيذ

**📅 تاريخ التخطيط:** 30 يونيو 2025  
**🎯 الهدف:** تطوير نظام "الصديق الأفضل" التبادلي بآلية الترشيح والموافقات

---

## 📋 خريطة المراحل

### 🔵 **المرحلة 1: البنية التحتية وقاعدة البيانات** *(اليوم 1)*
- [ ] إنشاء جدول `BestFriendRelation` الجديد
- [ ] إضافة Enums اللازمة للحالات والأنواع
- [ ] إنشاء الفهارس والقيود المطلوبة
- [ ] تحديث العلاقات في جدول `User`
- [ ] إجراء Migration وتجربة قاعدة البيانات

**⏱️ الوقت المقدر:** 2-3 ساعات  
**📊 نسبة الإنجاز بعد هذه المرحلة:** 25%

---

### 🟡 **المرحلة 2: النظام الأساسي للنقاط التبادلية** *(اليوم 2)*
- [ ] تطوير دوال حساب النقاط التبادلية بين الطرفين
- [ ] إنشاء آلية جمع نقاط التفاعل المشترك
- [ ] تطوير خوارزمية تحديد أفضل الأصدقاء المرشحين
- [ ] إنشاء دوال المساعدة والتحقق من الشروط
- [ ] اختبار النظام الأساسي

**⏱️ الوقت المقدر:** 4-5 ساعات  
**📊 نسبة الإنجاز بعد هذه المرحلة:** 50%

---

### 🟠 **المرحلة 3: نظام الترشيح الدوري** *(اليوم 3)*
- [ ] تطوير نظام الترشيح كل أسبوعين
- [ ] إنشاء آلية اتخاذ القرار (تلقائي/يدوي)
- [ ] تطبيق حدود الترشيح (واحد يومياً، 24 ساعة بين الترشيحات)
- [ ] إنشاء نظام إشعارات الترشيح
- [ ] تطوير واجهات الموافقة والرفض

**⏱️ الوقت المقدر:** 3-4 ساعات  
**📊 نسبة الإنجاز بعد هذه المرحلة:** 75%

---

### 🟢 **المرحلة 4: المميزات والصلاحيات المقيدة** *(اليوم 4)*
- [ ] تطبيق شارة "💚 الصديق الأفضل"
- [ ] نظام النشر المحدود (منشور واحد بموافقة)
- [ ] نظام التعليقات المحدود (10 تعليقات)
- [ ] آلية طلب الموافقات للأنشطة
- [ ] نظام انتهاء الصلاحية التلقائي (أسبوعين)

**⏱️ الوقت المقدر:** 4-5 ساعات  
**📊 نسبة الإنجاز بعد هذه المرحلة:** 90%

---

### 🔴 **المرحلة 5: الاختبار النهائي والتوثيق** *(اليوم 5)*
- [ ] اختبار شامل لجميع الوظائف
- [ ] اختبار السيناريوهات المختلفة
- [ ] معالجة الأخطاء والحالات الاستثنائية
- [ ] كتابة التوثيق النهائي والأمثلة
- [ ] إنشاء دليل المطور والمستخدم

**⏱️ الوقت المقدر:** 2-3 ساعات  
**📊 نسبة الإنجاز بعد هذه المرحلة:** 100%

---

## 🎯 **تفاصيل كل مرحلة**

### 🔵 **المرحلة 1: البنية التحتية وقاعدة البيانات**

#### 📋 **المتطلبات التقنية:**
```prisma
// 1. جدول العلاقات الثنائية
model BestFriendRelation {
  id String @id @default(uuid())
  
  // الطرفان في العلاقة
  user1Id String @map("user_1_id")
  user2Id String @map("user_2_id")
  
  // النقاط والإحصائيات
  totalPoints      Float @default(0) @map("total_points")
  user1Points     Float @default(0) @map("user_1_points")
  user2Points     Float @default(0) @map("user_2_points")
  
  // تواريخ العلاقة
  startDate       DateTime @map("start_date")
  endDate         DateTime @map("end_date")
  nominatedAt     DateTime @default(now()) @map("nominated_at")
  
  // حالة العلاقة
  status          BestFriendStatus @default(PENDING)
  
  // إعدادات الصلاحيات
  postsUsed       Int @default(0) @map("posts_used")
  commentsUsed    Int @default(0) @map("comments_used")
  approvalsRequired Boolean @default(true) @map("approvals_required")
  
  // معلومات النظام
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}

// 2. الحالات المختلفة
enum BestFriendStatus {
  PENDING        // في انتظار الموافقة
  ACTIVE         // نشط
  EXPIRED        // منتهي الصلاحية
  REJECTED       // مرفوض
  CANCELLED      // ملغي
}

// 3. أنواع الطلبات
enum BestFriendPermissionType {
  POST_ON_PROFILE    // نشر على الصفحة
  COMMENT_SPECIAL    // تعليق خاص
}
```

#### 📁 **الملفات المتأثرة:**
- `prisma/schema.prisma` - إضافة الجداول والعلاقات
- `prisma/migrations/` - ملف Migration جديد

#### ✅ **مخرجات المرحلة 1:**
- جدول `best_friend_relations` جاهز وقابل للاستخدام
- Enums محددة للحالات والأنواع
- علاقات صحيحة مع جدول `users`
- فهارس للأداء المحسن

---

### 🟡 **المرحلة 2: النظام الأساسي للنقاط التبادلية**

#### 📋 **الوظائف المطلوبة:**
```typescript
// 1. حساب النقاط التبادلية
async function calculateMutualScore(user1Id: string, user2Id: string)

// 2. العثور على المرشحين
async function findBestFriendCandidates(userId: string)

// 3. تحليل العلاقة
async function analyzeRelationshipStrength(user1Id: string, user2Id: string)

// 4. التحقق من الشروط
async function checkEligibilityForBestFriend(user1Id: string, user2Id: string)
```

#### 📁 **الملفات المطلوبة:**
- `src/lib/best-friend-system.ts` - النظام الأساسي الجديد
- `src/lib/mutual-scoring.ts` - نظام النقاط التبادلية

#### ✅ **مخرجات المرحلة 2:**
- خوارزمية حساب النقاط التبادلية
- تحديد المرشحين بدقة
- تحليل قوة العلاقة بين الطرفين

---

### 🟠 **المرحلة 3: نظام الترشيح الدوري**

#### 📋 **الوظائف المطلوبة:**
```typescript
// 1. الترشيح الدوري
async function runBiWeeklyNomination()

// 2. اتخاذ القرار
async function decideNominationMethod(candidates: Candidate[])

// 3. إدارة الحدود
async function checkNominationLimits(userId: string)

// 4. الإشعارات
async function sendNominationNotification(relationId: string)
```

#### 📁 **الملفات المطلوبة:**
- `src/lib/nomination-scheduler.ts` - المجدولة الدورية
- `src/lib/decision-engine.ts` - محرك اتخاذ القرار

#### ✅ **مخرجات المرحلة 3:**
- ترشيح تلقائي كل أسبوعين
- قرارات ذكية حسب التفوق أو التساوي
- احترام حدود الترشيح

---

### 🟢 **المرحلة 4: المميزات والصلاحيات المقيدة**

#### 📋 **الوظائف المطلوبة:**
```typescript
// 1. إدارة الشارات
async function assignBestFriendBadge(relationId: string)

// 2. صلاحيات النشر
async function requestPostPermission(relationId: string, content: string)

// 3. صلاحيات التعليق
async function checkCommentLimit(relationId: string)

// 4. انتهاء الصلاحية
async function scheduleRelationExpiry(relationId: string)
```

#### 📁 **الملفات المطلوبة:**
- `src/lib/best-friend-permissions.ts` - إدارة الصلاحيات
- `src/lib/expiry-scheduler.ts` - نظام انتهاء الصلاحية

#### ✅ **مخرجات المرحلة 4:**
- شارات وهويات بصرية
- صلاحيات محدودة ومراقبة
- انتهاء تلقائي للعلاقات

---

## 🎮 **هل تريد البدء بالمرحلة الأولى؟**

**المرحلة 1** تتضمن:
1. ✅ إضافة جدول `BestFriendRelation` 
2. ✅ إضافة Enums للحالات
3. ✅ تحديث العلاقات في جدول `User`
4. ✅ إنشاء Migration وتجربتها

**⏱️ وقت متوقع:** 2-3 ساعات  
**🔧 تعقيد:** منخفض إلى متوسط

---

**💬 أخبرني عندما تكون جاهزاً لبدء المرحلة الأولى، أم تريد تعديل أي شيء في الخطة؟**
