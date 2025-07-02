# 🔗 نظام الإحالات والمكافآت الآلي للمؤثرين - Nehky Platform

**التاريخ:** 29 يونيو 2025  
**المطور:** Ahmed Fady  
**الهدف:** نظام شامل لتتبع الإحالات ومكافأة المؤثرين تلقائياً

---

## 📋 **مفهوم النظام**

نظام متكامل يتيح للمؤثرين الحصول على روابط إحالة فريدة، وتتبع المستخدمين الجدد الذين ينضمون عبر هذه الروابط، ومكافأتهم تلقائياً عند استيفاء شروط معينة.

---

## 🏗️ **هيكل قاعدة البيانات المقترح**

### 1. **جدول الإحالات الرئيسي**
```prisma
model InfluencerReferral {
  id           String   @id @default(uuid())
  influencerId String   @map("influencer_id")
  referralCode String   @unique @map("referral_code") // كود فريد مثل: AHMED123
  referralLink String   @unique @map("referral_link") // الرابط الكامل
  
  // إحصائيات الإحالة
  totalClicks      Int @default(0) @map("total_clicks")      // مجموع النقرات
  totalSignups     Int @default(0) @map("total_signups")     // مجموع التسجيلات
  totalVerified    Int @default(0) @map("total_verified")    // المفعّلة
  totalActive      Int @default(0) @map("total_active")      // النشطة
  totalEarnings    Decimal @default(0) @map("total_earnings") @db.Decimal(10, 2)
  
  // إعدادات المكافآت
  signupReward     Decimal? @map("signup_reward") @db.Decimal(10, 2)     // مكافأة التسجيل
  verificationReward Decimal? @map("verification_reward") @db.Decimal(10, 2) // مكافأة التفعيل
  activityReward   Decimal? @map("activity_reward") @db.Decimal(10, 2)   // مكافأة النشاط
  
  // حالة الرابط
  isActive    Boolean   @default(true) @map("is_active")
  expiresAt   DateTime? @map("expires_at") // تاريخ انتهاء الصلاحية
  
  // الطوابع الزمنية
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // العلاقات
  influencer User                    @relation("InfluencerReferrals", fields: [influencerId], references: [id])
  referrals  UserReferral[]          @relation("ReferralSource")
  clicks     ReferralClick[]         @relation("ReferralClicks")
  rewards    ReferralReward[]        @relation("ReferralRewards")
  
  // فهارس
  @@index([influencerId])
  @@index([referralCode])
  @@index([isActive])
  @@index([createdAt])
  @@map("influencer_referrals")
}
```

### 2. **جدول المستخدمين المُحالين**
```prisma
model UserReferral {
  id           String   @id @default(uuid())
  referralId   String   @map("referral_id")      // الإحالة المصدر
  influencerId String   @map("influencer_id")     // المؤثر المُحيل
  referredId   String   @map("referred_id")       // المستخدم الجديد
  
  // معلومات الإحالة
  ipAddress    String?  @map("ip_address")        // عنوان IP
  userAgent    String?  @map("user_agent")       // معلومات المتصفح
  referrerUrl  String?  @map("referrer_url")     // الصفحة المصدر
  
  // حالة التقدم
  hasSignedUp    Boolean @default(false) @map("has_signed_up")
  hasVerified    Boolean @default(false) @map("has_verified")
  hasPosted      Boolean @default(false) @map("has_posted")
  hasInteracted  Boolean @default(false) @map("has_interacted")
  isActiveUser   Boolean @default(false) @map("is_active_user")
  
  // مقاييس النشاط
  postsCount      Int @default(0) @map("posts_count")
  interactionsCount Int @default(0) @map("interactions_count")
  daysActive      Int @default(0) @map("days_active")
  
  // حالة المكافآت
  signupRewardPaid      Boolean @default(false) @map("signup_reward_paid")
  verificationRewardPaid Boolean @default(false) @map("verification_reward_paid")
  activityRewardPaid    Boolean @default(false) @map("activity_reward_paid")
  
  // معلومات مكافحة الاحتيال
  suspiciousActivity  Boolean @default(false) @map("suspicious_activity")
  fraudScore         Int     @default(0) @map("fraud_score") // 0-100
  verificationMethod String? @map("verification_method")
  
  // الطوابع الزمنية
  clickedAt    DateTime? @map("clicked_at")     // وقت النقر على الرابط
  signedUpAt   DateTime? @map("signed_up_at")   // وقت التسجيل
  verifiedAt   DateTime? @map("verified_at")    // وقت التفعيل
  lastActiveAt DateTime? @map("last_active_at") // آخر نشاط
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  
  // العلاقات
  referral   InfluencerReferral @relation("ReferralSource", fields: [referralId], references: [id])
  influencer User               @relation("InfluencerReferrals", fields: [influencerId], references: [id])
  referred   User               @relation("ReferredUsers", fields: [referredId], references: [id])
  rewards    ReferralReward[]   @relation("UserReferralRewards")
  
  // فهارس
  @@unique([referralId, referredId]) // منع الإحالة المتكررة
  @@index([influencerId])
  @@index([referredId])
  @@index([hasSignedUp])
  @@index([hasVerified])
  @@index([isActiveUser])
  @@index([fraudScore])
  @@index([createdAt])
  @@map("user_referrals")
}
```

### 3. **جدول تتبع النقرات**
```prisma
model ReferralClick {
  id           String   @id @default(uuid())
  referralId   String   @map("referral_id")
  
  // معلومات النقرة
  ipAddress    String   @map("ip_address")
  userAgent    String   @map("user_agent")
  referrerUrl  String?  @map("referrer_url")
  location     String?  // الموقع الجغرافي
  device       String?  // نوع الجهاز
  
  // معلومات إضافية
  isUnique     Boolean  @default(false) @map("is_unique")     // نقرة فريدة
  convertedToSignup Boolean @default(false) @map("converted_to_signup")
  
  // الطوابع الزمنية
  clickedAt DateTime @default(now()) @map("clicked_at")
  
  // العلاقات
  referral InfluencerReferral @relation("ReferralClicks", fields: [referralId], references: [id])
  
  // فهارس
  @@index([referralId])
  @@index([ipAddress])
  @@index([clickedAt])
  @@map("referral_clicks")
}
```

### 4. **جدول المكافآت**
```prisma
model ReferralReward {
  id             String   @id @default(uuid())
  referralId     String   @map("referral_id")
  userReferralId String?  @map("user_referral_id")
  influencerId   String   @map("influencer_id")
  
  // تفاصيل المكافأة
  rewardType   ReferralRewardType @map("reward_type")
  amount       Decimal            @db.Decimal(10, 2)
  currency     String             @default("EGP")
  description  String?
  
  // معلومات الحدث المؤدي للمكافأة
  triggeredBy  String? @map("triggered_by")   // ID المستخدم أو النشاط
  eventType    String  @map("event_type")     // signup, verification, post, etc.
  eventData    Json?   @map("event_data")     // بيانات إضافية
  
  // حالة المكافأة
  status       ReferralRewardStatus @default(PENDING)
  isProcessed  Boolean              @default(false) @map("is_processed")
  processedAt  DateTime?            @map("processed_at")
  
  // ربط بنظام الأرباح
  earningId    String? @map("earning_id") // ربط مع InfluencerEarning
  
  // الطوابع الزمنية
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // العلاقات
  referral     InfluencerReferral @relation("ReferralRewards", fields: [referralId], references: [id])
  userReferral UserReferral?      @relation("UserReferralRewards", fields: [userReferralId], references: [id])
  influencer   User               @relation("InfluencerRewards", fields: [influencerId], references: [id])
  earning      InfluencerEarning? @relation("ReferralEarnings", fields: [earningId], references: [id])
  
  // فهارس
  @@index([referralId])
  @@index([influencerId])
  @@index([rewardType])
  @@index([status])
  @@index([createdAt])
  @@map("referral_rewards")
}

// أنواع المكافآت
enum ReferralRewardType {
  SIGNUP_BONUS        // مكافأة التسجيل
  VERIFICATION_BONUS  // مكافأة التفعيل
  FIRST_POST_BONUS   // مكافأة أول منشور
  ACTIVITY_BONUS     // مكافأة النشاط
  MILESTONE_BONUS    // مكافأة الأهداف
  LOYALTY_BONUS      // مكافأة الولاء
}

// حالات المكافآت
enum ReferralRewardStatus {
  PENDING     // في الانتظار
  APPROVED    // موافق عليها
  PROCESSED   // تم صرفها
  REJECTED    // مرفوضة
  EXPIRED     // منتهية الصلاحية
}
```

### 5. **إضافات لجدول المستخدمين**
```prisma
// إضافة هذه الحقول لجدول User الموجود
model User {
  // ...existing fields...
  
  // نظام الإحالة
  referralCode    String? @unique @map("referral_code")     // كود الإحالة الخاص
  referredBy      String? @map("referred_by")               // مَن أحاله
  totalReferrals  Int     @default(0) @map("total_referrals") // عدد الإحالات الناجحة
  
  // مقاييس مكافحة الاحتيال
  isVerifiedUser    Boolean @default(false) @map("is_verified_user")
  trustScore        Int     @default(50) @map("trust_score")        // 0-100
  accountAge        Int     @default(0) @map("account_age")         // عمر الحساب بالأيام
  
  // العلاقات الجديدة
  influencerReferrals InfluencerReferral[] @relation("InfluencerReferrals")
  referredUsers       UserReferral[]       @relation("InfluencerReferrals")
  myReferral          UserReferral?        @relation("ReferredUsers")
  referralRewards     ReferralReward[]     @relation("InfluencerRewards")
  
  // ...existing relations...
}
```

---

## 🛡️ **آليات مكافحة الحسابات الوهمية**

### 1. **التحقق الأولي**
```typescript
interface FraudDetectionRules {
  // فحص عنوان IP
  maxAccountsPerIP: 3;           // حد أقصى 3 حسابات لكل IP
  blockVPN: true;                // منع شبكات VPN
  
  // فحص الجهاز
  deviceFingerprinting: true;    // بصمة الجهاز
  maxAccountsPerDevice: 2;       // حد أقصى حسابين لكل جهاز
  
  // فحص البريد الإلكتروني
  requireEmailVerification: true;
  blockDisposableEmails: true;   // منع الإيميلات المؤقتة
  
  // فحص رقم الهاتف
  requirePhoneVerification: true;
  blockVoipNumbers: true;        // منع أرقام VOIP
}
```

### 2. **نظام التقييم التلقائي**
```typescript
interface UserTrustScore {
  baseScore: 50;
  emailVerified: +15;      // إيميل مفعّل
  phoneVerified: +20;      // هاتف مفعّل
  profileComplete: +10;    // ملف شخصي مكتمل
  hasProfilePicture: +5;   // صورة شخصية
  
  // نشاط طبيعي
  dailyLogin: +2;          // تسجيل دخول يومي
  organicPosts: +3;        // منشورات طبيعية
  genuineInteractions: +2; // تفاعلات حقيقية
  
  // علامات مشبوهة
  rapidSignup: -10;        // تسجيل سريع بعد النقر
  noActivity: -15;         // لا يوجد نشاط
  suspiciousPattern: -20;  // نمط مشبوه
  reportedAsSpam: -30;     // تم الإبلاغ عنه
}
```

### 3. **شروط المكافآت التدريجية**
```typescript
interface RewardCriteria {
  signupBonus: {
    amount: 5;           // 5 جنيه
    requirements: [
      'emailVerified',
      'phoneVerified',
      'profileComplete'
    ];
    minimumTrustScore: 60;
  };
  
  verificationBonus: {
    amount: 10;          // 10 جنيه
    requirements: [
      'accountAge >= 7',      // عمر الحساب 7 أيام
      'hasProfilePicture',
      'trustScore >= 70'
    ];
  };
  
  activityBonus: {
    amount: 15;          // 15 جنيه
    requirements: [
      'postsCount >= 3',      // 3 منشورات على الأقل
      'interactionsCount >= 10', // 10 تفاعلات
      'daysActive >= 14',     // نشط لمدة 14 يوم
      'trustScore >= 80'
    ];
  };
}
```

---

## ⚙️ **آلية العمل التلقائية**

### 1. **إنشاء رابط الإحالة**
```typescript
async function createReferralLink(influencerId: string) {
  const referralCode = generateUniqueCode(influencerId);
  const referralLink = `https://nehky.com/join/${referralCode}`;
  
  const referral = await prisma.influencerReferral.create({
    data: {
      influencerId,
      referralCode,
      referralLink,
      signupReward: 5.00,
      verificationReward: 10.00,
      activityReward: 15.00
    }
  });
  
  return referral;
}
```

### 2. **تتبع النقرات والتسجيل**
```typescript
async function trackReferralClick(referralCode: string, request: Request) {
  // تسجيل النقرة
  await prisma.referralClick.create({
    data: {
      referralId: referral.id,
      ipAddress: getClientIP(request),
      userAgent: request.headers['user-agent'],
      referrerUrl: request.headers.referer
    }
  });
  
  // حفظ معلومات الإحالة في session
  setReferralCookie(referralCode);
}
```

### 3. **معالجة التسجيل الجديد**
```typescript
async function processNewUserSignup(userData: any, referralCode?: string) {
  const user = await createUser(userData);
  
  if (referralCode) {
    const referral = await findReferralByCode(referralCode);
    
    if (referral) {
      // إنشاء سجل الإحالة
      const userReferral = await prisma.userReferral.create({
        data: {
          referralId: referral.id,
          influencerId: referral.influencerId,
          referredId: user.id,
          hasSignedUp: true,
          signedUpAt: new Date(),
          ipAddress: userData.ipAddress,
          userAgent: userData.userAgent
        }
      });
      
      // فحص الاحتيال
      const fraudScore = await calculateFraudScore(userReferral);
      
      if (fraudScore < 30) { // نتيجة مقبولة
        // إضافة مكافأة التسجيل (مؤجلة)
        await scheduleSignupReward(userReferral);
      }
    }
  }
}
```

### 4. **معالجة المكافآت التلقائية**
```typescript
async function processAutomaticRewards() {
  // فحص مكافآت التفعيل
  const pendingVerifications = await prisma.userReferral.findMany({
    where: {
      hasSignedUp: true,
      hasVerified: false,
      signupRewardPaid: true // تم صرف مكافأة التسجيل
    },
    include: { referred: true }
  });
  
  for (const referral of pendingVerifications) {
    if (referral.referred.isVerified && isEligibleForVerificationReward(referral)) {
      await createVerificationReward(referral);
    }
  }
  
  // فحص مكافآت النشاط
  await processActivityRewards();
}
```

---

## 📊 **مقاييس ولوحة التحكم**

### 1. **إحصائيات للمؤثر**
```typescript
interface InfluencerReferralStats {
  totalClicks: number;
  totalSignups: number;
  conversionRate: number;      // معدل التحويل
  totalEarnings: number;
  pendingRewards: number;
  
  // تفصيلي
  last30Days: {
    clicks: number;
    signups: number;
    earnings: number;
  };
  
  // جودة الإحالات
  averageTrustScore: number;
  activeUsersPercentage: number;
  fraudDetectionRate: number;
}
```

### 2. **تقارير الإدارة**
```typescript
interface AdminReferralReports {
  totalReferrals: number;
  totalRewards: number;
  fraudPrevention: {
    blockedAccounts: number;
    suspiciousActivity: number;
    savedAmount: number;
  };
  
  topInfluencers: InfluencerReferralStats[];
  systemHealth: {
    averageConversionRate: number;
    userRetentionRate: number;
    rewardROI: number;
  };
}
```

---

## 🎯 **فوائد النظام المقترح**

### ✅ **للمؤثرين:**
- روابط إحالة مخصصة وسهلة الاستخدام
- مكافآت متدرجة ومجزية
- إحصائيات مفصلة وفورية
- حماية من الاحتيال

### ✅ **للمنصة:**
- نمو المستخدمين بطريقة عضوية
- تقليل تكلفة الاستحواذ
- مراقبة جودة المستخدمين الجدد
- منع إساءة الاستخدام

### ✅ **للمستخدمين الجدد:**
- تجربة سلسة للانضمام
- حوافز للاستمرار والنشاط
- اتصال مع مؤثرين موثوقين

---

## 🚀 **خطة التطبيق**

1. **المرحلة الأولى:** إضافة الجداول الأساسية
2. **المرحلة الثانية:** تطوير آليات تتبع النقرات والتسجيل
3. **المرحلة الثالثة:** تطبيق أنظمة مكافحة الاحتيال
4. **المرحلة الرابعة:** تطوير لوحة التحكم والإحصائيات
5. **المرحلة الخامسة:** الاختبار والتحسين

**النظام جاهز للتطبيق ومتوافق مع البنية الحالية!** 🎉
