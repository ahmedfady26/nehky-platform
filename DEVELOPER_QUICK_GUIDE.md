# دليل المطور السريع - منصة نحكي القابلة للتطوير

## مقدمة سريعة
تم تطوير منصة نحكي لتكون قابلة للتطوير بسهولة للتابلت والآيباد والأجهزة المستقبلية. هذا الدليل يوضح للمطورين كيفية البدء والتطوير بسرعة.

## 🚀 البدء السريع

### 1. تشغيل المشروع
```bash
cd nehky.com
npm install
npm run dev
```

### 2. مشاهدة التصميمات
- **الجوال**: http://localhost:3000 (أقل من 768px)
- **التابلت**: http://localhost:3000 (768px - 1024px)  
- **صفحة تجريبية للتابلت**: http://localhost:3000/tablet-demo
- **صفحة تجريبية قابلة للتطوير**: http://localhost:3000/scalable-demo

---

## 🗄️ الأنظمة المتوفرة (11 نظام)

### 1. 👥 نظام المستخدمين
- **الجداول:** `users`, `user_scores`, `user_signatures`, `user_blocks`
- **الميزات:** تسجيل، ملفات شخصية، نقاط، تقييمات، حظر
- **الملفات:** `src/lib/database.ts`, `prisma/schema.prisma`

### 2. 📝 نظام المنشورات
- **الجداول:** `posts`, `interactions`, `hashtags`, `post_hashtags`
- **الميزات:** إنشاء، عرض، تفاعل، هاشتاغات
- **الملفات:** `src/lib/post-attractiveness.ts`, `src/lib/content-classification.ts`

### 3. 🎥 نظام الفيديو
- **الجداول:** `video_channels`, `videos`, `playlists`, `playlist_items`
- **الميزات:** قنوات، مقاطع، قوائم تشغيل
- **API:** جاهز للتطوير

### 4. 💬 نظام الرسائل
- **الجداول:** `conversations`, `conversation_members`, `messages`
- **الميزات:** محادثات خاصة وجماعية
- **API:** جاهز للتطوير

### 5. 🔔 نظام الإشعارات
- **الجداول:** `notifications`
- **الميزات:** تنبيهات فورية للأنشطة
- **API:** جاهز للتطوير

### 6. 🛡️ نظام الإدارة
- **الجداول:** `admins`, `admin_permissions`
- **الميزات:** لوحة تحكم، صلاحيات متدرجة
- **API:** جاهز للتطوير

### 7. 📊 نظام التقارير
- **الجداول:** `reports`, `activity_logs`
- **الميزات:** شكاوى، مراجعة، سجل أنشطة
- **API:** جاهز للتطوير

### 8. 🏆 نظام النقاط
- **الجداول:** `user_scores`
- **الميزات:** تقييم المستخدمين، نقاط الأنشطة
- **API:** جاهز للتطوير

### 9. 🌟 نظام الترشيحات
- **الجداول:** `nominations`
- **الميزات:** اختيار المؤثرين، ترشيحات
- **API:** جاهز للتطوير

### 10. 🏷️ نظام الهاشتاغات
- **الجداول:** `hashtags`, `post_hashtags`, `trending_topics`, `keywords`
- **الميزات:** تصنيف المحتوى، الرائج
- **API:** جاهز للتطوير

### 11. 🔐 نظام الأمان
- **الجداول:** `login_sessions`, `user_security_settings`
- **الميزات:** جلسات آمنة، إعدادات الأمان
- **API:** جاهز للتطوير

---

## 📁 الملفات الأساسية للتطوير

### 🗃️ قاعدة البيانات
```
prisma/schema.prisma     # مخطط كامل (27 جدول)
src/lib/prisma.ts        # اتصال قاعدة البيانات
src/lib/database.ts      # دوال مساعدة (900 سطر)
```

### ⚙️ الإعدادات
```
src/lib/config.ts        # إعدادات التطبيق
next.config.js           # إعدادات Next.js
package.json            # تبعيات ومهام
```

### 🎨 الواجهة (فارغة - جاهزة للتطوير)
```
src/app/layout.tsx      # التخطيط العام
src/app/page.tsx        # الصفحة الرئيسية
src/types/index.ts      # أنواع البيانات
```

---

## 🛠️ الخطوات التالية للتطوير

### 1. إنشاء API Routes
```bash
mkdir -p src/app/api/users
mkdir -p src/app/api/posts
mkdir -p src/app/api/auth
# إنشاء endpoints للعمليات الأساسية
```

### 2. تطوير واجهة المستخدم
```bash
# صفحات المستخدمين
src/app/profile/page.tsx
src/app/login/page.tsx
src/app/register/page.tsx

# صفحات المحتوى
src/app/feed/page.tsx
src/app/posts/page.tsx
src/app/videos/page.tsx
```

### 3. ربط المصادقة
```bash
# تكوين NextAuth
src/app/api/auth/[...nextauth]/route.ts
src/lib/auth.ts
```

### 4. تطبيق التصميم
```bash
# مكونات UI
src/components/ui/
src/components/layout/
src/components/posts/
```

---

## 📊 إحصائيات سريعة

| المؤشر | القيمة |
|---------|--------|
| 🗄️ الجداول | 27 جدول |
| 🔧 الأنظمة | 11 نظام |
| 📁 الملفات البرمجية | 60 ملف |
| 💾 حجم المشروع | 524 MB |
| ✅ حالة المشروع | مستقر ومنظف |

---

## ⚡ أوامر مفيدة

```bash
# تطوير
npm run dev              # تشغيل خادم التطوير
npm run build           # بناء للإنتاج

# قاعدة البيانات  
npm run db:studio       # واجهة إدارة البيانات
npm run db:reset        # إعادة تعيين (تطوير فقط)
npm run db:seed         # زرع بيانات تجريبية

# جودة الكود
npm run lint:fix        # إصلاح أخطاء التنسيق
npm run type-check      # فحص TypeScript
```

---

**حالة المشروع:** جاهز للتطوير 100% ✅  
**آخر تحديث:** 27 يونيو 2025
