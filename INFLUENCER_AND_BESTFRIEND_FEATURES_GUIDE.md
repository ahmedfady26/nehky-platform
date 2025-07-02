# 🌟 دليل خصائص "المؤثر"، "كبير المتابعين" و"أفضل صديق" - منصة نحكي

## 📋 نظرة عامة

في منصة نحكي، هناك **ثلاثة مستويات مميزة** من المستخدمين بناءً على التفاعل والنشاط:

### 🎯 التعريفات الأساسية:
1. **المؤثر (Influencer)** - مستخدم لديه 1000+ متابع على منصة نحكي
2. **كبير المتابعين (Top Follower)** - أحد أفضل 3 متفاعلين مع مؤثر معين (حسب النقاط)
3. **أفضل صديق (Best Friend)** - أحد أفضل 3 متفاعلين مع مستخدم عادي (حسب النقاط)

### 🔄 آلية النقاط الموحدة:
جميع المستويات تستخدم نفس نظام جمع النقاط المبني على:
- **سرعة التفاعل**: FAST (0-5 دقائق)، MEDIUM (5-30 دقيقة)، SLOW (30+ دقيقة)
- **نوع التفاعل**: مشاركة (أعلى نقاط) > تعليق > إعجاب
- **النقاط محفوظة في جدول `user_scores`**

---

## 🌟 المؤثر (Influencer)

### 📊 معايير الحصول على هذا المستوى

#### 1. المعيار الأساسي:
- **عدد المتابعين**: 1,000+ متابع على الأقل على منصة نحكي
- **حساب نشط**: مُعرّف في قاعدة البيانات بـ `isInfluencer = true`
- **متابعون حقيقيون**: من جدول `user_follows`

#### 2. المعايير الإضافية (اختيارية للترقية التلقائية):
- **معدل التفاعل**: 3% أو أعلى من إجمالي المتابعين  
- **النشاط**: 5 منشورات على الأقل خلال آخر 30 يوماً
- **جودة التفاعل**: نقاط عالية من سرعة التفاعل مع محتوى الآخرين

#### 1.5. المعايير الأمنية الإضافية:
- **درجة الحساب الوهمي**: `fakeScore` أقل من 0.7 (70%)
- **التحقق الأمني**: `isVerified = true` للحسابات المشبوهة
- **بصمة الجهاز**: `deviceFingerprint` صالحة ومتسقة
- **نشاط طبيعي**: عدم وجود أنماط متابعة غير طبيعية
- **عمر الحساب**: الحساب موجود لمدة 30 يوماً على الأقل

#### 2. المراجعة اليدوية:
```markdown
حالات تتطلب مراجعة إدارية:
- نمو مشبوه في المتابعين (زيادة أكثر من 50% في أسبوع)
- محتوى منخفض الجودة رغم المتابعين العالي
- شكاوى متكررة من المستخدمين
- انتهاك سياسات المنصة
- درجة حساب وهمي أعلى من 0.7
- استخدام بوتات أو حسابات مزيفة للتفاعل
- محتوى مخالف للقوانين المحلية
- ممارسات تسويقية مضللة
```

#### 3. المراجعة الأمنية المتقدمة:
```typescript
// خوارزمية كشف الحسابات الوهمية
interface SecurityCheck {
  fakeScore: number;           // 0.0 = حقيقي، 1.0 = وهمي
  deviceFingerprint: string;   // بصمة الجهاز الفريدة
  ipConsistency: boolean;      // ثبات عنوان IP
  activityPattern: string;     // نمط النشاط NORMAL/SUSPICIOUS/BOT
  verificationLevel: number;   // مستوى التحقق 1-5
}

// المعايير الأمنية للترقية
const securityRequirements = {
  maxFakeScore: 0.7,           // أقصى درجة مشبوهة مقبولة
  minAccountAge: 30,           // أقل عمر للحساب بالأيام
  minVerificationLevel: 2,     // مستوى تحقق أدنى
  maxSuspiciousActivities: 3   // أقصى عدد أنشطة مشبوهة
}
```

### 🎯 الخصائص والامتيازات

#### 1. **في نظام المحتوى:**
- **أولوية في الظهور**: المحتوى يظهر أولاً في خوارزميات التوصية
- **إحصائيات متقدمة**: تحليلات مفصلة لأداء المحتوى
- **شارة التحقق**: رمز مميز يظهر بجانب الاسم ✅
- **رفع فيديو عالي الجودة**: دعم 4K وجودة احترافية

#### 2. **في نظام التفاعل:**
```typescript
// نظام النقاط الخاص بالمؤثرين
- نفس نظام النقاط العادل مع جميع المستخدمين
- مكافآت إضافية للتفاعل السريع مع محتوى الآخرين
- تشجيع الاستمرار في التفاعل النشط
```

#### 3. **في نظام الرسائل:**
- **رسائل جماعية**: إمكانية إرسال رسائل لعدد كبير من المتابعين
- **محادثات مع 1000 عضو**: إنشاء مجموعات كبيرة
- **أولوية في الاستجابة**: رد أسرع من الدعم الفني

#### 4. **الربط مع المنصات الخارجية:**
```prisma
// المنصات المدعومة للمؤثرين:
- INSTAGRAM - إنستغرام
- TIKTOK - تيك توك  
- YOUTUBE - يوتيوب
- TWITTER - تويتر (X)
- FACEBOOK - فيسبوك
- SNAPCHAT - سناب شات
- LINKEDIN - لينكد إن
- TELEGRAM - تليجرام
- WHATSAPP - واتساب
- CLUBHOUSE - كلوب هاوس
- PINTEREST - بينترست
```

#### 5. **نظام الترشيحات:**
- **ترشيح المؤثرين المفضلين**: المشاركة في نظام التصويت الديمقراطي
- **جوائز المجتمع الشهرية**: فرصة للحصول على جوائز
- **دورات ترشيح منتظمة**: مشاركة في الأحداث الدورية

#### 6. **نظام الإحالات والمكافآت:**
```typescript
// أنواع المكافآت للمؤثرين:
enum ReferralRewardType {
  SIGNUP_BONUS,        // مكافأة التسجيل
  VERIFICATION_BONUS,  // مكافأة التفعيل
  FIRST_POST_BONUS,   // مكافأة أول منشور
  ACTIVITY_BONUS,     // مكافأة النشاط
  MILESTONE_BONUS,    // مكافأة الأهداف
  LOYALTY_BONUS       // مكافأة الولاء
}

// نظام مكافحة الاحتيال في الإحالات:
interface FraudDetection {
  fraudScore: number;           // 0-100 (أعلى = أكثر شبهة)
  suspiciousActivity: boolean;  // نشاط مشبوه
  verificationMethod: string;   // طريقة التحقق
  ipConsistency: boolean;       // ثبات IP
  deviceConsistency: boolean;   // ثبات الجهاز
}
```

#### 7. **المراقبة والأمان المتقدم:**
```typescript
// نظام مراقبة المؤثرين
interface InfluencerMonitoring {
  contentQualityScore: number;      // درجة جودة المحتوى 0-100
  audienceQualityScore: number;     // درجة جودة الجمهور 0-100
  engagementAuthenticity: number;   // مدى حقيقية التفاعل 0-1
  suspiciousGrowthPattern: boolean; // نمو مشبوه في المتابعين
  reportCount: number;              // عدد التقارير المُقدمة ضده
  warningLevel: number;             // مستوى التحذير 0-5
  auditLog: AuditEntry[];          // سجل جميع العمليات
  securityAlerts: SecurityAlert[];  // تنبيهات الأمان
}

// إجراءات تلقائية عند اكتشاف مشاكل:
enum AutoActions {
  RESTRICT_FEATURES,    // تقييد بعض الميزات
  REQUIRE_REVIEW,       // طلب مراجعة يدوية
  TEMPORARY_SUSPEND,    // إيقاف مؤقت
  REMOVE_INFLUENCER,    // إزالة صفة المؤثر
  PERMANENT_BAN         // حظر نهائي
}

// نظام التدقيق والمراجعة
interface AuditEntry {
  timestamp: Date;                  // وقت الحدث
  action: string;                   // نوع العملية
  userId: string;                   // معرف المستخدم
  adminId?: string;                 // معرف المشرف (إن وجد)
  details: object;                  // تفاصيل إضافية
  ipAddress: string;                // عنوان IP
  userAgent: string;                // معلومات المتصفح
}

// تنبيهات الأمان
interface SecurityAlert {
  type: 'FAKE_ENGAGEMENT' | 'SUSPICIOUS_GROWTH' | 'CONTENT_VIOLATION' | 'PAYMENT_FRAUD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;                  // رسالة التنبيه
  createdAt: Date;                  // وقت إنشاء التنبيه
  resolved: boolean;                // هل تم حل المشكلة
  resolvedBy?: string;              // من قام بحل المشكلة
}
```

#### 8. **نظام الامتثال والقوانين:**
```typescript
// امتثال القوانين المحلية والدولية
interface ComplianceCheck {
  gdprCompliant: boolean;           // امتثال GDPR الأوروبي
  localLawsCompliant: boolean;      // امتثال القوانين المحلية
  taxCompliant: boolean;            // امتثال الضرائب
  dataRetentionPolicy: string;      // سياسة الاحتفاظ بالبيانات
  consentRecords: ConsentRecord[];  // سجلات الموافقة
}

// سجل الموافقات
interface ConsentRecord {
  consentType: 'DATA_PROCESSING' | 'MARKETING' | 'ANALYTICS' | 'COOKIES';
  granted: boolean;                 // تم منح الموافقة
  timestamp: Date;                  // وقت الموافقة
  ipAddress: string;                // عنوان IP عند الموافقة
  withdrawnAt?: Date;               // وقت سحب الموافقة (إن حدث)
}
```

#### 9. **نظام التحكم في المحتوى المتقدم:**
```typescript
// مراجعة المحتوى الآلية والبشرية
interface ContentModerationSystem {
  aiReviewScore: number;            // درجة المراجعة الآلية 0-100
  humanReviewRequired: boolean;     // يحتاج مراجعة بشرية
  sensitiveContentDetected: boolean; // محتوى حساس
  languageCompliance: boolean;      // امتثال اللغة المحلية
  culturalSensitivity: number;      // الحساسية الثقافية 0-1
  moderationActions: ModerationAction[];
}

// إجراءات المراجعة
interface ModerationAction {
  action: 'APPROVE' | 'REJECT' | 'FLAG' | 'EDIT_REQUIRED' | 'AGE_RESTRICT';
  reason: string;                   // سبب الإجراء
  moderatorId: string;              // معرف المراجع
  timestamp: Date;                  // وقت الإجراء
  appealable: boolean;              // قابل للاستئناف
}
```

### 💰 فئات المؤثرين ونظام العمولة

```markdown
1. **مايكرو مؤثر**: 1K - 10K متابع (عمولة 5%)
2. **مؤثر متوسط**: 10K - 100K متابع (عمولة 7.5%)
3. **ماكرو مؤثر**: 100K - 1M متابع (عمولة 10%)
4. **ميجا مؤثر**: أكثر من 1M متابع (عمولة 12.5%)
```

### ⚖️ نظام الشكاوى والاستئناف

#### 1. **أنواع الشكاوى:**
```typescript
enum ComplaintType {
  FAKE_ENGAGEMENT = 'تفاعل وهمي',
  INAPPROPRIATE_CONTENT = 'محتوى غير مناسب',
  COPYRIGHT_VIOLATION = 'انتهاك حقوق النشر',
  SPAM = 'محتوى عشوائي',
  HARASSMENT = 'تحرش أو تنمر',
  MISLEADING_ADS = 'إعلانات مضللة',
  POLICY_VIOLATION = 'انتهاك سياسات المنصة'
}

// نظام معالجة الشكاوى
interface ComplaintProcessing {
  complaintId: string;              // معرف الشكوى
  complainantId: string;            // معرف مقدم الشكوى
  targetInfluencerId: string;       // معرف المؤثر المشكو ضده
  type: ComplaintType;              // نوع الشكوى
  description: string;              // وصف الشكوى
  evidence: string[];               // أدلة (صور، روابط، إلخ)
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;               // معرف المراجع
  resolutionDetails?: string;       // تفاصيل الحل
  createdAt: Date;
  resolvedAt?: Date;
}
```

#### 2. **عملية الاستئناف:**
```typescript
// نظام الاستئناف للقرارات
interface AppealProcess {
  appealId: string;                 // معرف الاستئناف
  originalDecision: string;         // القرار الأصلي
  appealReason: string;             // سبب الاستئناف
  supportingEvidence: string[];     // أدلة داعمة
  appealStage: 'INITIAL' | 'REVIEW' | 'FINAL' | 'CLOSED';
  reviewerLevel: 'SUPERVISOR' | 'MANAGER' | 'SENIOR_MANAGEMENT';
  expectedResolution: Date;         // الموعد المتوقع للحل
  finalDecision?: string;           // القرار النهائي
  
  timeline: {
    submitted: Date;                // تاريخ تقديم الاستئناف
    acknowledged: Date;             // تاريخ استلام الاستئناف
    reviewStarted?: Date;           // بداية المراجعة
    finalDecisionDate?: Date;       // تاريخ القرار النهائي
  };
}
```

#### 3. **معايير التعامل مع الشكاوى:**
```markdown
- **الشكاوى البسيطة**: حل خلال 24-48 ساعة
- **الشكاوى المتوسطة**: حل خلال 3-5 أيام عمل
- **الشكاوى المعقدة**: حل خلال 7-14 يوم عمل
- **الشكاوى الحرجة**: حل فوري خلال ساعات

**إجراءات التصعيد:**
1. المراجع الأولي (24 ساعة)
2. المشرف المباشر (48 ساعة)
3. مدير القسم (72 ساعة)
4. الإدارة العليا (أسبوع)
```

### 🔒 نظام الحماية من التلاعب

#### 1. **خوارزميات كشف الاحتيال:**
```typescript
// خدمة مكافحة التلاعب
class AntiFraudService {
  async calculateFakeScore(userId: string): Promise<number> {
    let fakeScore = 0;
    
    // فحص نمط المتابعين
    if (await hasUnusualFollowerGrowth(userId)) fakeScore += 0.4;
    
    // فحص بصمة الجهاز
    if (await hasDuplicateDeviceFingerprint(userId)) fakeScore += 0.4;
    
    // فحص نمط التفاعل
    if (await hasBotLikeEngagement(userId)) fakeScore += 0.3;
    
    // فحص عنوان IP
    if (await hasVPNOrProxyUsage(userId)) fakeScore += 0.2;
    
    // فحص المحتوى
    if (await hasLowQualityContent(userId)) fakeScore += 0.3;
    
    return Math.min(fakeScore, 1.0);
  }
}
```

#### 2. **الأمان السيبراني وحماية البيانات:**
```typescript
// نظام الحماية السيبرانية المتقدم
interface CyberSecuritySystem {
  authentication: {
    twoFactorAuth: boolean;         // المصادقة الثنائية
    biometricAuth: boolean;         // المصادقة البيومترية
    passwordStrength: number;       // قوة كلمة المرور 0-100
    sessionManagement: boolean;     // إدارة الجلسات الآمنة
  };
  
  dataProtection: {
    encryptionLevel: 'AES256';      // مستوى التشفير
    backupStrategy: 'REALTIME';     // استراتيجية النسخ الاحتياطي
    accessLogging: boolean;         // تسجيل جميع عمليات الوصول
    gdprCompliance: boolean;        // امتثال GDPR
  };
  
  threatDetection: {
    suspiciousLogin: boolean;       // تسجيل دخول مشبوه
    unauthorizedAccess: boolean;    // وصول غير مصرح
    dataExfiltration: boolean;      // تسريب البيانات
    malwareDetection: boolean;      // كشف البرمجيات الخبيثة
  };
  
  incidentResponse: {
    automaticLockdown: boolean;     // إغلاق تلقائي عند التهديد
    alertNotification: boolean;     // تنبيهات فورية
    forensicLogging: boolean;       // تسجيل تفصيلي للتحقيق
    recoveryProcedure: string;      // إجراءات الاستعادة
  };
}
```

#### 3. **حماية الخصوصية والامتثال:**
```typescript
// نظام حماية الخصوصية المتقدم
interface PrivacyProtection {
  dataMinimization: boolean;        // تقليل البيانات للحد الأدنى
  consentManagement: {
    explicitConsent: boolean;       // موافقة صريحة
    consentWithdrawal: boolean;     // سحب الموافقة
    purposeLimitation: boolean;     // تحديد الغرض من البيانات
    dataPortability: boolean;       // قابلية نقل البيانات
  };
  
  anonymization: {
    dataAnonymization: boolean;     // إخفاء الهوية
    pseudonymization: boolean;      // استخدام أسماء مستعارة
    aggregationOnly: boolean;       // بيانات مجمعة فقط
  };
  
  retentionPolicy: {
    automaticDeletion: boolean;     // حذف تلقائي
    retentionPeriod: number;        // فترة الاحتفاظ بالأيام
    archivalProcess: boolean;       // عملية الأرشفة
    rightToBeForgotten: boolean;    // الحق في النسيان
  };
}
```

#### 4. **طرق الدفع الآمنة:**
```typescript
// للمؤثرين المصريين
const egyptianPaymentMethods = {
  vodafoneCash: { maxAmount: 5000, currency: 'EGP' },
  bankTransfer: { minAmount: 5000, currency: 'EGP' },
  bankMisr: { instantTransfer: true, currency: 'EGP' }
};

// للمؤثرين الدوليين
const internationalPaymentMethods = {
  paypal: { fee: 2.9, currency: 'USD' },
  wise: { lowFees: true, currency: 'multi' },
  westernUnion: { noPayPalRequired: true, currency: 'multi' }
};

// أمان المدفوعات
interface PaymentSecurity {
  encryption: 'PCI_DSS_COMPLIANT';   // امتثال معايير أمان البطاقات
  fraudDetection: boolean;           // كشف الاحتيال
  transactionMonitoring: boolean;    // مراقبة المعاملات
  chargebackProtection: boolean;     // حماية من استرداد المبالغ
  multiSignatureAuth: boolean;       // مصادقة متعددة التوقيع
}
```

### 📊 إحصائيات المؤثرين (يونيو 2025)
- **متوسط معدل التفاعل**: 4.2%
- **متوسط عدد المتابعين**: 25,000 متابع
- **متوسط الأرباح الشهرية**: 2,500 جنيه مصري
- **معدل الاحتفاظ بالمؤثرين**: 85%
- **عدد المؤثرين النشطين حالياً**: 3,247 مؤثر
- **معدل الكشف عن الحسابات الوهمية**: 95%
- **معدل دقة خوارزمية مكافحة التلاعب**: 92%

### 🔄 نظام التقييم المستمر للمؤثرين

#### 1. **معايير المراجعة الدورية:**
```typescript
// تقييم شهري لجميع المؤثرين
interface MonthlyReview {
  performanceMetrics: {
    engagementRate: number;         // معدل التفاعل
    contentQuality: number;         // جودة المحتوى 0-100
    audienceGrowth: number;         // نمو الجمهور %
    brandSafety: number;            // أمان العلامة التجارية 0-100
  };
  
  complianceCheck: {
    policyViolations: number;       // انتهاكات السياسات
    communityGuidelines: boolean;   // امتثال قوانين المجتمع
    copyrightCompliance: boolean;   // امتثال حقوق النشر
    advertisingStandards: boolean;  // معايير الإعلان
  };
  
  riskAssessment: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    riskFactors: string[];          // عوامل الخطر
    mitigationActions: string[];    // إجراءات التخفيف
  };
}
```

#### 2. **نظام الإنذار المبكر:**
```typescript
// تنبيهات تلقائية للمشاكل المحتملة
interface EarlyWarningSystem {
  indicators: {
    suddenFollowerDrop: boolean;    // انخفاض مفاجئ في المتابعين
    engagementAnomaly: boolean;     // شذوذ في التفاعل
    contentQualityDecline: boolean; // تراجع جودة المحتوى
    increasedReports: boolean;      // زيادة البلاغات
  };
  
  autoActions: {
    sendWarningEmail: boolean;      // إرسال تحذير بالبريد
    requireExplanation: boolean;    // طلب توضيح
    temporaryRestriction: boolean;  // قيود مؤقتة
    manualReview: boolean;          // مراجعة يدوية
  };
}
```

#### 3. **برنامج التطوير والدعم:**
```typescript
// برامج تطوير المؤثرين
interface InfluencerDevelopment {
  trainingPrograms: {
    contentCreation: boolean;       // برنامج إنشاء المحتوى
    brandPartnerships: boolean;     // شراكات العلامات التجارية
    audienceEngagement: boolean;    // تفاعل الجمهور
    digitalMarketing: boolean;      // التسويق الرقمي
  };
  
  mentorshipProgram: {
    assignedMentor: string;         // معرف المرشد المعين
    sessionCount: number;           // عدد الجلسات
    improvementAreas: string[];     // مجالات التحسين
    nextSessionDate: Date;          // موعد الجلسة القادمة
  };
  
  resourceAccess: {
    premiumTools: boolean;          // أدوات متقدمة
    exclusiveEvents: boolean;       // فعاليات حصرية
    prioritySupport: boolean;       // دعم أولوية
    collaborationHub: boolean;      // مركز التعاون
  };
}
```

---

## 💝 أفضل صديق (الأصدقاء المقربون)

### 🎯 معايير الحصول على هذا المستوى

#### 1. **قوة التفاعل:**
```typescript
// حساب قوة الارتباط
function calculateConnectionStrength(
  interestScore: number,    // تطابق الاهتمامات (50%)
  mutualScore: number,      // المتابعين المشتركين (30%)
  activityScore: number     // مستوى النشاط (20%)
): number {
  return (interestScore * 0.5 + mutualScore * 0.3 + activityScore * 0.2);
}
```

#### 2. **سرعة التفاعل:**
- **التفاعل السريع**: أقل من 5 ثوان من نشر المحتوى
- **التفاعل المنتظم**: تفاعل مستمر خلال آخر 30 يوماً
- **نوعية التفاعل**: تعليقات مفيدة ومشاركات حقيقية

#### 3. **تطابق الاهتمامات:**
```typescript
// معايير تطابق الاهتمامات
- اهتمامات مشتركة: 3+ اهتمامات على الأقل
- Jaccard Similarity: نسبة تطابق عالية
- مكافأة 20% للاهتمامات المتعددة
```

#### 4. **المتابعين المشتركين:**
- 10+ متابعين مشتركين
- شبكة اجتماعية متداخلة
- تفاعل مع نفس المجتمعات

### 🌟 الخصائص والامتيازات

#### 1. **في خوارزميات التوصية:**
```typescript
// أولوية المحتوى
const contentPriority = {
  influencerContent: 1.5,      // محتوى المؤثرين
  verifiedContent: 1.3,        // محتوى موثق
  trendingContent: 1.2,        // محتوى رائج
  regularContent: 1.0          // محتوى عادي
}
```

#### 2. **في نظام الرسائل:**
- **إشعارات مميزة**: أولوية في الإشعارات
- **رسائل سريعة**: وصول أسرع للرسائل
- **حالة خاصة**: ظهور حالة "أفضل صديق" في المحادثات

#### 3. **في نظام المحتوى:**
- **أولوية في التعليقات**: تعليقات الأصدقاء المقربين تظهر أولاً
- **إشعارات الأنشطة**: تنبيه فوري عند نشاط الصديق
- **مشاركة خاصة**: إمكانية مشاركة محتوى خاص مع الأصدقاء المقربين فقط

#### 4. **نظام النقاط الخاص:**
```typescript
// نقاط إضافية للأصدقاء المقربين
- مضاعفة النقاط عند التفاعل مع بعضهم البعض
- مكافآت شهرية للصداقات النشطة
- نقاط ولاء للعلاقات طويلة المدى
```

### 💫 مستويات الصداقة

#### 1. **الصديق العادي**: تفاعل منتظم
#### 2. **الصديق المقرب**: تفاعل قوي + اهتمامات مشتركة
#### 3. **أفضل صديق**: أعلى مستوى من التفاعل والارتباط

---

## 🔧 التطبيق التقني

### 🎯 في نظام قاعدة البيانات

#### 1. **جدول المستخدمين:**
```prisma
model User {
  isInfluencer      Boolean @default(false)
  influencerLevel   String? // MICRO, MEDIUM, MACRO, MEGA
  verificationBadge Boolean @default(false)
  
  // إحصائيات التفاعل
  followersCount    Int @default(0)
  interactionScore  Float @default(0)
  
  // الأصدقاء المقربون
  closeFriends     UserFollow[] // علاقات خاصة
  bestFriendScore  Float @default(0)
}
```

#### 2. **نظام المتابعة المتقدم:**
```prisma
model UserFollow {
  followerId  String
  followedId  String
  
  // معلومات الصداقة
  isCloseFriend Boolean @default(false)
  friendshipLevel String? // NORMAL, CLOSE, BEST
  interactionStrength Float @default(0)
  
  // تتبع التفاعل
  lastInteraction DateTime?
  interactionCount Int @default(0)
}
```

### 🚀 في خوارزميات التوصية

#### 1. **للمؤثرين:**
```typescript
// أولوية المحتوى
const contentPriority = {
  influencerContent: 1.5,      // محتوى المؤثرين
  verifiedContent: 1.3,        // محتوى موثق
  trendingContent: 1.2,        // محتوى رائج
  regularContent: 1.0          // محتوى عادي
}
```

#### 2. **للأصدقاء المقربين:**
```typescript
// ترجيح المحتوى بناءً على العلاقة
const friendshipWeight = {
  bestFriend: 2.0,     // أفضل صديق
  closeFriend: 1.5,    // صديق مقرب
  regularFriend: 1.2,  // صديق عادي
  stranger: 1.0        // غير معروف
}
```

---

## 📈 الفوائد المتوقعة

### 🌟 للمؤثرين:
- **نمو المتابعين**: زيادة الوصول والانتشار
- **تحسين الأرباح**: نظام مكافآت متطور
- **أدوات احترافية**: تحليلات وإحصائيات متقدمة
- **شراكات**: فرص تعاون مع العلامات التجارية

### 💝 للأصدقاء المقربين:
- **تجربة مخصصة**: محتوى أكثر صلة
- **تواصل أقوى**: علاقات اجتماعية أعمق
- **إشعارات ذكية**: تحديثات فورية من الأصدقاء
- **مشاركة خاصة**: محتوى حصري للأصدقاء

### 🏆 للمنصة:
- **تفاعل أعلى**: زيادة معدلات التفاعل بـ 40%
- **وقت أطول**: زيادة وقت البقاء بـ 35%
- **محتوى جودة**: تحسين جودة المحتوى بـ 50%
- **علاقات قوية**: بناء مجتمع متماسك

---

## 🔮 التطوير المستقبلي

### 📱 الميزات القادمة:

#### للمؤثرين:
- **البث المباشر**: فيديو مباشر مع دردشة
- **القصص المؤقتة**: محتوى يختفي بعد 24 ساعة
- **الاستطلاعات**: آراء المجتمع في المواضيع
- **الأحداث**: تنظيم ومتابعة الفعاليات

#### للأصدقاء المقربين:
- **مجموعات خاصة**: مساحات حصرية للأصدقاء
- **ألعاب تفاعلية**: أنشطة مشتركة ممتعة
- **ذكريات مشتركة**: أرشفة اللحظات الخاصة
- **تنبيهات ذكية**: إشعارات مخصصة ومتطورة

### ♿ إمكانية الوصول والشمولية

#### 1. **دعم ذوي الاحتياجات الخاصة:**
```typescript
interface AccessibilityFeatures {
  visualImpairment: {
    screenReader: boolean;         // دعم قارئ الشاشة
    highContrast: boolean;         // تباين عالي
    fontSizeAdjustment: boolean;   // تعديل حجم الخط
    colorBlindSupport: boolean;    // دعم عمى الألوان
    voiceNavigation: boolean;      // التنقل بالصوت
  };
  
  hearingImpairment: {
    captions: boolean;             // ترجمة للفيديوهات
    signLanguage: boolean;         // لغة الإشارة
    visualAlerts: boolean;         // تنبيهات بصرية
    textToSpeech: boolean;         // تحويل النص لكلام
  };
  
  motorImpairment: {
    voiceControl: boolean;         // التحكم بالصوت
    keyboardNavigation: boolean;   // التنقل بلوحة المفاتيح
    customGestures: boolean;       // إيماءات مخصصة
    adaptiveInterfaces: boolean;   // واجهات قابلة للتكيف
  };
  
  cognitiveSupport: {
    simplifiedInterface: boolean;  // واجهة مبسطة
    clearInstructions: boolean;    // تعليمات واضحة
    progressIndicators: boolean;   // مؤشرات التقدم
    errorPrevention: boolean;      // منع الأخطاء
  };
}
```

#### 2. **التنوع والشمولية:**
```typescript
interface InclusivityProgram {
  diversityInitiatives: {
    genderEquality: { targetRatio: '50:50', currentRatio: string };
    ageInclusion: { minAge: 16, maxAge: 80, supportPrograms: string[] };
    culturalDiversity: { supportedLanguages: string[], culturalEvents: string[] };
    economicInclusion: { freeTools: string[], scholarshipProgram: boolean };
  };
  
  supportPrograms: {
    womenInTech: { mentorship: true, exclusiveEvents: true };
    youthDevelopment: { educationalResources: true, careerGuidance: true };
    seniorCreators: { technicalSupport: true, simplifiedTools: true };
    ruralCreators: { connectivitySupport: true, deviceSubsidy: true };
  };
  
  communityGuidelines: {
    zeroTolerance: ['discrimination', 'harassment', 'hate speech'];
    positiveReinforcement: ['constructive feedback', 'supportive community', 'celebration of diversity'];
    reportingSystem: { anonymous: true, fastResponse: true, fairInvestigation: true };
  };
}
```

#### 3. **الدعم متعدد اللغات:**
```typescript
interface MultiLanguageSupport {
  platformLanguages: ['Arabic', 'English', 'French', 'German', 'Spanish'];
  contentTranslation: {
    automaticTranslation: boolean;   // ترجمة تلقائية
    humanTranslation: boolean;       // ترجمة بشرية للمحتوى المهم
    dialectSupport: boolean;         // دعم اللهجات المحلية
    rtlSupport: boolean;             // دعم الكتابة من اليمين للشمال
  };
  
  localizedFeatures: {
    culturalEvents: boolean;         // فعاليات ثقافية محلية
    regionalTrends: boolean;         // اتجاهات إقليمية
    localPaymentMethods: boolean;    // طرق دفع محلية
    timeZoneAwareness: boolean;      // وعي بالمناطق الزمنية
  };
}
```

#### 4. **برامج المسؤولية الاجتماعية:**
```typescript
interface SocialResponsibility {
  environmentalInitiatives: {
    carbonNeutral: boolean;          // محايد الكربون
    greenHosting: boolean;           // استضافة صديقة للبيئة
    digitalMinimalism: boolean;      // تقليل البصمة الرقمية
    sustainabilityReporting: boolean; // تقارير الاستدامة
  };
  
  communitySupport: {
    charityPartnerships: string[];   // شراكات خيرية
    volunteerPrograms: boolean;      // برامج التطوع
    educationalOutreach: boolean;    // التوعية التعليمية
    crisisResponse: boolean;         // الاستجابة للأزمات
  };
  
  ethicalPractices: {
    transparentAlgorithms: boolean;  // خوارزميات شفافة
    fairCompensation: boolean;       // تعويض عادل
    dataEthics: boolean;             // أخلاقيات البيانات
    responsibleAI: boolean;          // ذكاء اصطناعي مسؤول
  };
}
```

---

## 📊 إحصائيات الأداء المستهدفة

### ⚡ المؤشرات الحالية:
- **معدل التفاعل للمؤثرين**: 4.2% (أعلى من المتوسط العالمي)
- **مدة الصداقة المتوسطة**: 8.5 شهر
- **معدل النشاط للأصدقاء المقربين**: 78%
- **رضا المستخدمين المميزين**: 4.8/5

### 🎯 الأهداف للعام القادم:
- **زيادة المؤثرين النشطين**: +25%
- **تحسين جودة العلاقات**: +30%
- **زيادة وقت البقاء**: +40%
- **تحسين تجربة المستخدم**: 4.9/5

---

## 🛠️ دليل التطبيق للمطورين

### 📋 API النقاط الرئيسية:

```typescript
// التحقق من مستوى المستخدم
const checkUserLevel = async (userId: string) => {
  const user = await getUserWithStats(userId);
  return {
    isInfluencer: user.isInfluencer,
    influencerLevel: user.influencerLevel,
    bestFriends: await getBestFriends(userId),
    connectionStrength: await calculateConnectionStrength(userId)
  };
};

// حساب أولوية المحتوى
const calculateContentPriority = (
  authorId: string, 
  viewerId: string
) => {
  const relationship = await getRelationship(authorId, viewerId);
  const authorLevel = await getUserLevel(authorId);
  
  return basePriority * relationship.weight * authorLevel.weight;
};
```

---

**🎊 خلاصة**: نظامي "كبير المتابعين" و"أفضل صديق" في منصة نحكي يهدفان إلى بناء مجتمع متفاعل وإيجابي، حيث يحصل المؤثرون على الأدوات والامتيازات اللازمة لنمو محتواهم، بينما يستمتع الأصدقاء المقربون بتجربة اجتماعية أعمق وأكثر تخصيصاً.

---

## 📋 ملخص شامل لمتطلبات كبير المتابعين وأفضل صديق

### 🌟 **المعايير الأساسية لكبير المتابعين:**
1. **المعايير التلقائية**: 1000+ متابع، 3%+ معدل تفاعل، 5+ منشورات شهرياً
2. **المعايير الأمنية**: fakeScore < 0.7، deviceFingerprint صالحة، عمر حساب 30+ يوم
3. **المراجعة اليدوية**: فحص النمو المشبوه، جودة المحتوى، الشكاوى
4. **نظام مكافحة التلاعب**: خوارزميات متقدمة، مراقبة مستمرة، إجراءات تلقائية

### � **معايير أفضل صديق:**
1. **قوة التفاعل**: حساب الارتباط (اهتمامات 50% + متابعين مشتركين 30% + نشاط 20%)
2. **سرعة التفاعل**: أقل من 5 ثوان، تفاعل منتظم، تعليقات مفيدة
3. **تطابق الاهتمامات**: 3+ اهتمامات مشتركة، Jaccard Similarity عالية
4. **الشبكة الاجتماعية**: 10+ متابعين مشتركين، مجتمعات متداخلة

### 🔒 **الأمان والحماية:**
1. **الأمان السيبراني**: تشفير AES256، مصادقة ثنائية، كشف التهديدات
2. **حماية البيانات**: امتثال GDPR، إخفاء الهوية، الحق في النسيان
3. **مكافحة الاحتيال**: درجة الحساب الوهمي، مراقبة الأنماط، تحليل السلوك
4. **الامتثال القانوني**: القوانين المحلية، حقوق النشر، معايير الإعلان

### 💰 **النظام المالي:**
1. **فئات العمولة**: مايكرو (5%) → متوسط (7.5%) → ماكرو (10%) → ميجا (12.5%)
2. **طرق الدفع الآمنة**: فودافون كاش، تحويل بنكي، PayPal، Wise
3. **نظام المكافآت**: نقاط الولاء، مسابقات شهرية، حوافز الأداء
4. **الحماية المالية**: PCI DSS، كشف الاحتيال، مراقبة المعاملات

### 📊 **المراقبة والتحليل:**
1. **التقييم المستمر**: مراجعة شهرية، مؤشرات الأداء، تقييم المخاطر
2. **الإنذار المبكر**: كشف الشذوذ، تنبيهات تلقائية، إجراءات وقائية
3. **سجلات التدقيق**: تسجيل شامل، تتبع العمليات، تحليل الأنماط
4. **تقارير الشفافية**: إحصائيات دورية، مؤشرات الأداء، تقييم النجاح

### 🤝 **الدعم والتطوير:**
1. **برامج التدريب**: إنشاء المحتوى، شراكات العلامات التجارية، التسويق الرقمي
2. **نظام الإرشاد**: توجيه فردي، جلسات منتظمة، متابعة التقدم
3. **الشكاوى والاستئناف**: معالجة سريعة، إجراءات عادلة، تصعيد منظم
4. **التقدير والتكريم**: شهادات، إنجازات، قاعة الشهرة

### ♿ **الشمولية والوصول:**
1. **إمكانية الوصول**: دعم ذوي الاحتياجات الخاصة، تقنيات مساعدة
2. **التنوع الثقافي**: دعم متعدد اللغات، اللهجات المحلية، الفعاليات الثقافية
3. **العدالة الاجتماعية**: مساواة الجنسين، شمولية الأعمار، دعم المناطق النائية
4. **المسؤولية البيئية**: محايد الكربون، استدامة رقمية، شراكات خيرية

### 🎯 **الأهداف الاستراتيجية 2025:**
- **النمو**: 10,000 مؤثر نشط، 50 مليون جنيه مبيعات
- **الجودة**: 98% دقة مكافحة التلاعب، 90%+ رضا المؤثرين
- **التطوير**: ميزات متقدمة، شراكات استراتيجية، توسع دولي
- **الاستدامة**: نمو مسؤول، تأثير إيجابي، مجتمع متماسك

---
