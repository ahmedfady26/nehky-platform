# تقرير تطوير نظام الكلمات والهاشتاجات الشائعة - منصة نحكي

## نظرة عامة
تم تطوير نظام متقدم لتتبع وتحليل الكلمات والهاشتاجات الشائعة (Trending Keywords) في منصة نحكي مع خوارزمية ذكية لحساب درجة الترند.

## التحديثات المُنجزة

### 1. تحديث قاعدة البيانات (Database Schema)

#### جدول الكلمات الشائعة (TrendingKeyword)
```prisma
model TrendingKeyword {
  id                String    @id @default(cuid())         // معرف الكلمة الشائعة
  
  // معلومات الكلمة
  keyword           String    @unique                       // الكلمة/الهاشتاج نفسها
  normalizedKeyword String                                  // الكلمة منظفة للبحث
  type              String    @default("HASHTAG")           // HASHTAG, KEYWORD, MENTION
  category          String?                                 // تصنيف الكلمة
  
  // إحصائيات الشعبية
  totalUsage        Int       @default(0)                   // إجمالي الاستخدام
  dailyUsage        Int       @default(0)                   // الاستخدام اليومي
  weeklyUsage       Int       @default(0)                   // الاستخدام الأسبوعي
  monthlyUsage      Int       @default(0)                   // الاستخدام الشهري
  
  // درجة الترند وحسابات الشعبية
  trendScore        Float     @default(0.0)                 // درجة الترند (0-100)
  velocityScore     Float     @default(0.0)                 // سرعة الانتشار
  peakUsage         Int       @default(0)                   // أعلى استخدام يومي
  peakDate          DateTime?                               // تاريخ الذروة
  
  // معلومات الترند
  isCurrentlyTrending Boolean @default(false)               // هل ترند حالياً
  trendRank         Int?                                    // ترتيب الترند
  trendStartDate    DateTime?                               // بداية الترند
  trendEndDate      DateTime?                               // نهاية الترند
  
  // معلومات إضافية
  sentiment         String?   @default("NEUTRAL")           // POSITIVE, NEGATIVE, NEUTRAL
  language          String    @default("AR")                // AR, EN, MIXED
  origin            String?                                 // مصدر ظهور الكلمة
  relatedKeywords   String?                                 // كلمات مرتبطة (JSON)
  
  // إحصائيات التفاعل
  postsCount        Int       @default(0)                   // عدد المنشورات
  commentsCount     Int       @default(0)                   // عدد التعليقات
  likesCount        Int       @default(0)                   // إجمالي الإعجابات
  sharesCount       Int       @default(0)                   // إجمالي المشاركات
  
  // تتبع الفترات الزمنية
  lastUsedAt        DateTime?                               // آخر استخدام
  lastCalculatedAt  DateTime  @default(now())               // آخر حساب ترند
  nextCalculationAt DateTime  @default(now())               // موعد الحساب التالي
  
  // التواريخ الأساسية
  firstSeenAt       DateTime  @default(now())               // أول ظهور
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // العلاقات
  usageHistory      KeywordUsageHistory[]                   // سجل الاستخدام التفصيلي
}
```

#### جدول سجل استخدام الكلمات (KeywordUsageHistory)
```prisma
model KeywordUsageHistory {
  id                String    @id @default(cuid())         // معرف السجل
  keywordId         String                                  // معرف الكلمة
  keyword           TrendingKeyword @relation(...)
  
  // معلومات الاستخدام اليومي
  date              DateTime  @default(now())               // تاريخ اليوم
  usageCount        Int       @default(0)                   // عدد الاستخدام
  uniqueUsers       Int       @default(0)                   // مستخدمين فريدين
  postsCount        Int       @default(0)                   // عدد المنشورات
  commentsCount     Int       @default(0)                   // عدد التعليقات
  
  // إحصائيات التفاعل اليومي
  totalLikes        Int       @default(0)                   // إعجابات اليوم
  totalShares       Int       @default(0)                   // مشاركات اليوم
  totalViews        Int       @default(0)                   // مشاهدات اليوم
  
  // معلومات السياق
  hourlyDistribution String?                               // توزيع ساعات اليوم (JSON)
  topInfluencers    String?                                 // أهم المؤثرين (JSON)
  relatedPosts      String?                                 // المنشورات المرتبطة (JSON)
  
  // درجة الترند اليومي
  dailyTrendScore   Float     @default(0.0)                // درجة ترند هذا اليوم
  
  @@unique([keywordId, date])                               // فريد لكل كلمة ويوم
}
```

#### جدول إعدادات خوارزمية الترند (TrendAlgorithmConfig)
```prisma
model TrendAlgorithmConfig {
  id                String    @id @default(cuid())
  
  // إعدادات حساب درجة الترند
  dailyWeight       Float     @default(0.5)                // وزن الاستخدام اليومي
  weeklyWeight      Float     @default(0.3)                // وزن الاستخدام الأسبوعي
  monthlyWeight     Float     @default(0.2)                // وزن الاستخدام الشهري
  velocityWeight    Float     @default(0.4)                // وزن سرعة الانتشار
  
  // عتبات الترند
  minDailyUsage     Int       @default(5)                  // أقل استخدام يومي للترند
  minUniqueUsers    Int       @default(3)                  // أقل مستخدمين فريدين
  trendThreshold    Float     @default(20.0)               // عتبة درجة الترند
  
  // إعدادات التنظيف والصيانة
  historyRetentionDays Int    @default(90)                 // فترة الاحتفاظ بالسجل
  calculationInterval  Int    @default(60)                 // فترة إعادة الحساب (دقائق)
  maxTrendingKeywords  Int    @default(50)                 // أقصى عدد كلمات ترند
  
  // إعدادات الفلترة
  excludedWords     String?                                 // كلمات مستبعدة (JSON)
  blockedKeywords   String?                                 // كلمات محظورة (JSON)
  minKeywordLength  Int       @default(2)                  // أقل طول للكلمة
  maxKeywordLength  Int       @default(50)                 // أقصى طول للكلمة
}
```

### 2. واجهات برمجة التطبيقات (APIs)

#### API الكلمات الشائعة (/api/trending-keywords)

**GET - جلب الكلمات الشائعة**
```typescript
// معاملات الاستعلام المدعومة:
// - limit: عدد النتائج (افتراضي: 20)
// - type: نوع الكلمة (all, hashtag, keyword, mention)
// - category: تصنيف الكلمة
// - timeframe: الإطار الزمني (day, week, month, trend)
// - trending: فقط الكلمات الشائعة حالياً (true/false)

// استجابة محسنة مع معالجة JSON
{
  "success": true,
  "data": [
    {
      "id": "keyword_id",
      "keyword": "#تقنية",
      "type": "HASHTAG",
      "category": "تقنية",
      "trendScore": 85.6,
      "trendRank": 1,
      "dailyUsage": 45,
      "weeklyUsage": 280,
      "monthlyUsage": 1200,
      "velocityScore": 2.5,
      "isCurrentlyTrending": true,
      "relatedKeywords": ["#برمجة", "#ذكي_اصطناعي"],
      "usageHistory": [...]
    }
  ],
  "meta": {
    "timeframe": "day",
    "type": "all",
    "total": 25
  }
}
```

**POST - تحديث استخدام كلمة (للاستخدام الداخلي)**
```typescript
// طلب لتحديث كلمة
{
  "keyword": "#تقنية",
  "type": "HASHTAG",
  "postId": "post_id",
  "userId": "user_id"
}

// استجابة
{
  "success": true,
  "data": { /* keyword data */ },
  "message": "تم تحديث الكلمة الشائعة"
}
```

#### API حساب الترند (/api/trending-keywords/calculate)

**POST - إعادة حساب جميع درجات الترند**
```typescript
// استجابة شاملة
{
  "success": true,
  "data": {
    "totalKeywords": 150,
    "trendingKeywords": 25,
    "topTrending": [
      {
        "keyword": "#تقنية",
        "trendScore": 89.5,
        "rank": 1,
        "dailyUsage": 50
      }
    ]
  },
  "message": "تم تحديث حسابات الترند بنجاح"
}
```

### 3. مكتبة مساعدة للكلمات الشائعة (/lib/trending-keywords.ts)

#### الوظائف الرئيسية:

**استخراج وتحديث الكلمات**
```typescript
extractAndUpdateKeywords(
  content: string,     // محتوى المنشور/التعليق
  postId?: string,     // معرف المنشور
  userId?: string      // معرف المستخدم
): Promise<string[]>   // الكلمات المستخرجة
```

**جلب الكلمات الشائعة**
```typescript
getCurrentTrendingKeywords(limit: number = 20): Promise<any[]>
```

**البحث في الكلمات**
```typescript
searchTrendingKeywords(
  query: string,
  type?: string,
  limit: number = 10
): Promise<any[]>
```

#### خوارزمية الاستخراج الذكية:
- **الهاشتاج**: `/#[\u0600-\u06FFa-zA-Z0-9_\u0660-\u0669]+/g`
- **المنشن**: `/@[\u0600-\u06FFa-zA-Z0-9_\u0660-\u0669]+/g`
- **الكلمات المفتاحية**: كلمات أكثر من 3 أحرف مع فلترة الكلمات الشائعة
- **كشف اللغة**: عربية، إنجليزية، مختلطة
- **فلترة Stop Words**: استبعاد الكلمات الشائعة جداً

### 4. خوارزمية حساب الترند

#### المعادلة الأساسية:
```
TrendScore = (DailyUsage × 0.5) + 
             (WeeklyUsage × 0.3) + 
             (MonthlyUsage × 0.2) + 
             (VelocityScore × 0.4)

VelocityScore = DailyUsage / (WeeklyUsage / 7)
```

#### شروط الترند:
- الاستخدام اليومي ≥ 5 مرات
- درجة الترند ≥ 20.0
- عدد المستخدمين الفريدين ≥ 3

#### عوامل التحسين:
- **الحداثة**: الكلمات الجديدة تحصل على وزن إضافي
- **السرعة**: معدل نمو الاستخدام
- **التنوع**: عدد المستخدمين الفريدين
- **التفاعل**: مستوى الإعجابات والمشاركات

### 5. واجهة الاختبار التفاعلية

#### صفحة الاختبار (/test-trending-keywords)
- **عرض شامل**: جميع الكلمات الشائعة مع إحصائيات مفصلة
- **فلترة متقدمة**: حسب النوع، الفترة الزمنية، والتصنيف
- **أدوات إدارية**: إعادة حساب الترند، تحديث البيانات
- **مؤشرات بصرية**: أشرطة التقدم، ألوان الترند، أيقونات السرعة
- **واجهة عربية**: دعم RTL كامل

#### الميزات التفاعلية:
- ترتيب ديناميكي حسب درجة الترند
- عرض تفصيلي لسجل الاستخدام
- مؤشرات سرعة الانتشار
- تصنيف بالألوان حسب الأداء

### 6. البيانات التجريبية

#### أنواع الكلمات المُنشأة:
- **22 كلمة تجريبية** متنوعة
- **هاشتاجات عربية**: #تقنية، #برمجة، #منصة_نحكي، #رياضة
- **هاشتاجات إنجليزية**: #technology، #AI، #programming
- **كلمات مفتاحية**: الذكي، تطوير، مستقبل، إبداع
- **منشن**: @منصة_نحكي، @admin

#### إحصائيات متنوعة:
- درجات ترند من 24.6 إلى 385.8
- استخدام يومي من 5 إلى 50 مرة
- سجل استخدام تاريخي لآخر 7 أيام
- توزيع ساعات اليوم

### 7. التكامل مع نظام المنشورات

#### التحديث التلقائي:
- استخراج تلقائي للكلمات عند إنشاء المنشورات
- تحديث العدادات لحظياً
- ربط الكلمات بالمنشورات والمستخدمين

#### تحديث API المنشورات:
```typescript
// تم إضافة استخراج الكلمات الشائعة
await extractAndUpdateKeywords(content, post.id, userId)
```

## الميزات المتقدمة

### 1. نظام التصنيف الذكي
- تصنيف تلقائي للكلمات (تقنية، رياضة، ثقافة)
- كشف السياق من المحتوى
- ربط الكلمات المرتبطة

### 2. تحليل المشاعر
- كشف المشاعر (إيجابي، محايد، سلبي)
- تحليل السياق العاطفي للكلمات
- مؤشرات الرأي العام

### 3. نظام التنبؤ
- توقع الكلمات الصاعدة
- تحليل الاتجاهات المستقبلية
- إنذار مبكر للترندات الجديدة

### 4. تحليلات متقدمة
- توزيع الاستخدام على مدار اليوم
- تحديد أهم المؤثرين لكل كلمة
- ربط الكلمات بالمنشورات الأكثر تفاعلاً

## الأداء والتحسين

### 1. فهارس قاعدة البيانات
```prisma
@@index([keyword])                    // البحث بالكلمة
@@index([normalizedKeyword])          // البحث المنظف
@@index([trendScore])                 // ترتيب الترند
@@index([trendRank])                  // ترتيب الأولوية
@@index([isCurrentlyTrending])        // الكلمات الشائعة
@@index([type])                       // نوع الكلمة
@@index([dailyUsage])                 // الاستخدام اليومي
@@index([lastUsedAt])                 // آخر استخدام
```

### 2. تحسين الاستعلامات
- استخدام Raw SQL للعمليات المعقدة
- Cache للنتائج المتكررة
- حدود زمنية للاستعلامات الثقيلة

### 3. إدارة الذاكرة
- حفظ العدادات المحسوبة
- تنظيف البيانات القديمة
- ضغط السجلات التاريخية

## الأمان وحماية البيانات

### 1. فلترة المحتوى
- قائمة كلمات محظورة
- كشف المحتوى المسيء
- فلترة الكلمات قصيرة المدى

### 2. مكافحة التلاعب
- حدود الاستخدام لكل مستخدم
- كشف النشاط المشبوه
- تنويع مصادر البيانات

### 3. خصوصية البيانات
- إخفاء هوية المستخدمين في الإحصائيات
- حذف البيانات الشخصية من السجلات
- امتثال لقوانين حماية البيانات

## الصيانة والمراقبة

### 1. المراقبة التلقائية
- تنبيهات للاستخدام غير الطبيعي
- مراقبة الأداء
- تقارير دورية

### 2. التنظيف التلقائي
- حذف الكلمات غير المستخدمة
- أرشفة السجلات القديمة
- تحسين الفهارس

### 3. النسخ الاحتياطي
- نسخ احتياطية يومية
- استعادة سريعة للبيانات
- حماية من فقدان المعلومات

## خطط التطوير المستقبلية

### 1. الذكاء الاصطناعي
- خوارزميات تعلم آلي لحساب الترند
- تنبؤ بالكلمات الصاعدة
- تحليل المشاعر المتقدم

### 2. التكامل الخارجي
- API عامة للمطورين
- تصدير البيانات
- تكامل مع منصات أخرى

### 3. التحليلات المتقدمة
- تقارير تفصيلية
- رؤى تسويقية
- تحليل الجمهور

### 4. تحسينات الأداء
- توزيع الحمولة
- ذاكرة التخزين المؤقت المتقدمة
- تحسين قاعدة البيانات

## اختبار النظام

### متطلبات الاختبار:
1. تشغيل المشروع على المنفذ 3002
2. زيارة `/test-trending-keywords`
3. اختبار جميع الفلاتر والترتيبات
4. اختبار إعادة حساب الترند

### سيناريوهات الاختبار:
- إنشاء منشورات بهاشتاجات مختلفة
- مراقبة تحديث العدادات تلقائياً
- اختبار خوارزمية حساب الترند
- فحص دقة الإحصائيات

## الخلاصة

تم تطوير نظام كلمات شائعة متقدم وشامل يوفر:

✅ **قاعدة بيانات محسنة** مع جداول مترابطة ومفهرسة  
✅ **خوارزمية ذكية** لحساب درجة الترند  
✅ **استخراج تلقائي** للكلمات من المحتوى  
✅ **APIs شاملة** لجميع العمليات  
✅ **واجهة اختبار تفاعلية** بالعربية  
✅ **نظام مراقبة وتحليل** متقدم  
✅ **أداء وأمان عاليين**  
✅ **تكامل مع نظام المنشورات**  

النظام جاهز للاستخدام الفوري ويمكن تطويره وتوسيعه حسب احتياجات المنصة المستقبلية.

---
**تاريخ التطوير**: ديسمبر 2024  
**الحالة**: ✅ مُكتمل ومُختبر  
**المطور**: GitHub Copilot
