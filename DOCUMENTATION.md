# 📚 توثيق مشروع منصة نحكي

## 📖 فهرس المحتويات
- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [هيكل المشروع](#هيكل-المشروع)
- [التثبيت والتشغيل](#التثبيت-والتشغيل)
- [قاعدة البيانات](#قاعدة-البيانات)
- [الصفحات والمسارات](#الصفحات-والمسارات)
- [المكونات](#المكونات)
- [API Routes](#api-routes)
- [النشر](#النشر)
- [المساهمة](#المساهمة)

## 🎯 نظرة عامة

منصة نحكي هي شبكة اجتماعية حديثة مصممة للمجتمع العربي، تتميز بواجهة مستخدم سهلة وأنيقة ونظام تفاعل متقدم.

**الروابط المهمة:**
- 🌐 **الموقع المباشر**: https://ahmedfady26.github.io/nehky-platform/
- 💻 **الكود المصدري**: https://github.com/ahmedfady26/nehky-platform
- 📊 **لوحة المراقبة**: GitHub Actions للنشر التلقائي

## ✨ المميزات

### 👥 النظام الاجتماعي
- **نظام الأصدقاء المقربين**: تصنيف الأصدقاء حسب درجة القرب
- **نظام النقاط**: تقييم التفاعل والمشاركة
- **اقتراحات المتابعة**: خوارزمية ذكية لاقتراح الأصدقاء
- **تتبع سرعة التفاعل**: قياس مدى تفاعل المستخدمين

### 🔐 الأمان والحماية
- **تسجيل آمن**: نظام تشفير متقدم
- **حماية من البريد المزعج**: فلاتر متقدمة
- **تحقق من الهوية**: نظام OTP للجوال
- **حماية البيانات**: GDPR compliant

### 📊 التحليلات والإحصائيات
- **تحليلات مباشرة**: إحصائيات فورية للتفاعل
- **مراقبة قاعدة البيانات**: أدوات مراقبة متقدمة
- **تقارير مفصلة**: تحليلات شاملة للمحتوى
- **تتبع الأداء**: مؤشرات الأداء الرئيسية

### 🎨 التصميم والواجهة
- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **واجهة حديثة**: باستخدام Tailwind CSS
- **دعم اللغة العربية**: تصميم محسن للغة العربية
- **سهولة الاستخدام**: واجهة بديهية

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 15**: إطار عمل React للتطبيقات الحديثة
- **React 19**: مكتبة JavaScript للواجهات
- **TypeScript**: لغة برمجة مع نظام أنواع قوي
- **Tailwind CSS**: إطار عمل CSS للتصميم السريع

### Backend & Database
- **Prisma ORM**: أداة قاعدة البيانات الحديثة
- **PostgreSQL**: قاعدة البيانات الرئيسية
- **NextAuth.js**: نظام المصادقة والتفويض
- **API Routes**: واجهات برمجة التطبيقات المدمجة

### DevOps & Deployment
- **GitHub Actions**: CI/CD للنشر التلقائي
- **GitHub Pages**: استضافة مجانية للموقع
- **ESLint**: أداة فحص الكود
- **Prettier**: أداة تنسيق الكود

## 📁 هيكل المشروع

```
nehky-platform/
├── 📂 src/
│   ├── 📂 app/                    # صفحات التطبيق (App Router)
│   │   ├── 📂 (auth)/             # مجموعة صفحات المصادقة
│   │   ├── 📂 admin/              # لوحة الإدارة
│   │   ├── 📂 analytics/          # صفحات التحليلات
│   │   ├── 📂 api/                # API Routes (مؤقتاً في temp_api)
│   │   └── 📄 page.tsx            # الصفحة الرئيسية
│   ├── 📂 components/             # المكونات المعاد استخدامها
│   │   ├── 📂 ui/                 # مكونات واجهة المستخدم
│   │   └── 📂 forms/              # نماذج التطبيق
│   ├── 📂 lib/                    # المكتبات والأدوات
│   │   ├── 📄 auth.ts             # إعدادات المصادقة
│   │   ├── 📄 database.ts         # اتصال قاعدة البيانات
│   │   └── 📄 utils.ts            # دوال مساعدة
│   └── 📂 styles/                 # ملفات التصميم
├── 📂 prisma/                     # قاعدة البيانات
│   ├── 📄 schema.prisma           # مخطط قاعدة البيانات
│   └── 📂 migrations/             # تحديثات قاعدة البيانات
├── 📂 public/                     # الملفات العامة
├── 📂 .github/workflows/          # GitHub Actions
├── 📂 temp_api/                   # API Routes (مؤقتاً)
├── 📄 next.config.js              # إعدادات Next.js
├── 📄 tailwind.config.js          # إعدادات Tailwind
├── 📄 tsconfig.json               # إعدادات TypeScript
└── 📄 package.json                # تبعيات المشروع
```

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18 أو أحدث
- npm أو yarn
- PostgreSQL (للتطوير المحلي)

### خطوات التثبيت

1. **استنسخ المشروع**:
```bash
git clone https://github.com/ahmedfady26/nehky-platform.git
cd nehky-platform
```

2. **تثبيت التبعيات**:
```bash
npm install
```

3. **إعداد متغيرات البيئة**:
```bash
cp .env.example .env
# قم بتعديل .env وإضافة معلومات قاعدة البيانات
```

4. **إعداد قاعدة البيانات**:
```bash
npx prisma migrate dev
npx prisma generate
```

5. **تشغيل الخادم**:
```bash
npm run dev
```

الموقع سيكون متاحاً على: http://localhost:3000

### أوامر مفيدة

```bash
# تشغيل الخادم للتطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل الخادم للإنتاج
npm run start

# فحص الكود
npm run lint

# إصلاح مشاكل الكود
npm run lint:fix

# فحص الأنواع
npm run type-check
```

## 💾 قاعدة البيانات

### الجداول الرئيسية

#### 👤 Users - المستخدمون
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 🤝 BestFriends - الأصدقاء المقربون
```prisma
model BestFriend {
  id           String   @id @default(cuid())
  userId       String
  friendId     String
  points       Int      @default(0)
  status       String   @default("pending")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### 📊 Analytics - التحليلات
```prisma
model Analytics {
  id        String   @id @default(cuid())
  userId    String
  action    String
  data      Json?
  createdAt DateTime @default(now())
}
```

### أوامر Prisma

```bash
# إنشاء migration جديد
npx prisma migrate dev --name "اسم_التحديث"

# تطبيق التحديثات
npx prisma db push

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset

# فتح Prisma Studio
npx prisma studio
```

## 🗺️ الصفحات والمسارات

### الصفحات العامة
| المسار | الوصف | المكونات |
|--------|-------|-----------|
| `/` | الصفحة الرئيسية | عرض المنصة والترحيب |
| `/register` | التسجيل | نموذج إنشاء حساب جديد |
| `/login` | تسجيل الدخول | نموذج دخول المستخدم |
| `/explore` | الاستكشاف | تصفح المحتوى والأصدقاء |

### الصفحات المحمية
| المسار | الوصف | الصلاحيات |
|--------|-------|-----------|
| `/dashboard` | لوحة التحكم | مستخدم مسجل |
| `/profile` | الملف الشخصي | مستخدم مسجل |
| `/friends` | الأصدقاء | مستخدم مسجل |
| `/messages` | الرسائل | مستخدم مسجل |

### صفحات الإدارة
| المسار | الوصف | الصلاحيات |
|--------|-------|-----------|
| `/admin` | لوحة الإدارة | مدير |
| `/admin/users` | إدارة المستخدمين | مدير |
| `/admin/analytics` | التحليلات | مدير |
| `/admin/database-monitor` | مراقبة قاعدة البيانات | مدير |

## 🧩 المكونات

### مكونات واجهة المستخدم
```typescript
// src/components/ui/
- Button.tsx        // أزرار التطبيق
- Input.tsx         // حقول الإدخال
- Card.tsx          // البطاقات
- Modal.tsx         // النوافذ المنبثقة
- Loading.tsx       // شاشات التحميل
- Avatar.tsx        // صور المستخدمين
```

### مكونات النماذج
```typescript
// src/components/forms/
- LoginForm.tsx     // نموذج تسجيل الدخول
- RegisterForm.tsx  // نموذج التسجيل
- ProfileForm.tsx   // نموذج الملف الشخصي
- ContactForm.tsx   // نموذج التواصل
```

### مكونات التخطيط
```typescript
// src/components/layout/
- Header.tsx        // رأس الصفحة
- Footer.tsx        // تذييل الصفحة
- Sidebar.tsx       // الشريط الجانبي
- Navigation.tsx    // شريط التنقل
```

## 🔌 API Routes

### نقاط النهاية المتاحة

#### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل دخول المستخدم
- `POST /api/auth/logout` - تسجيل خروج المستخدم

#### الأصدقاء
- `GET /api/friends` - قائمة الأصدقاء
- `POST /api/friends/add` - إضافة صديق
- `DELETE /api/friends/remove` - إزالة صديق

#### التحليلات
- `GET /api/analytics/dashboard` - إحصائيات الملف الشخصي
- `POST /api/analytics/track` - تتبع الإجراءات

> **ملاحظة**: API Routes متوفرة حالياً في مجلد `temp_api` بسبب قيود GitHub Pages. للاستخدام الكامل، يُنصح بنشر المشروع على منصة تدعم Server-side rendering مثل Vercel.

## 🚀 النشر

### GitHub Pages (الحالي)
المشروع منشور حالياً على GitHub Pages:
- **الرابط**: https://ahmedfady26.github.io/nehky-platform/
- **النشر**: تلقائي عند push إلى branch main
- **القيود**: Static site only (لا يدعم API routes)

### منصات أخرى للنشر

#### Vercel (موصى به)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel

# ربط بقاعدة البيانات
vercel env add DATABASE_URL
```

#### Netlify
```bash
# بناء المشروع
npm run build

# رفع مجلد out إلى Netlify
```

#### Railway
```bash
# إنشاء مشروع جديد
railway login
railway init
railway up
```

## 📋 المساهمة

### إرشادات المساهمة

1. **Fork المشروع**
2. **إنشاء branch جديد**:
   ```bash
   git checkout -b feature/اسم-الميزة
   ```
3. **إجراء التغييرات والاختبار**
4. **Commit مع رسالة واضحة**:
   ```bash
   git commit -m "✨ إضافة ميزة جديدة: اسم الميزة"
   ```
5. **Push إلى branch**:
   ```bash
   git push origin feature/اسم-الميزة
   ```
6. **إنشاء Pull Request**

### معايير الكود
- استخدام TypeScript للأمان
- اتباع معايير ESLint
- كتابة تعليقات واضحة بالعربية
- إجراء اختبارات قبل الإرسال

### نمط Commit Messages
```
✨ feat: إضافة ميزة جديدة
🐛 fix: إصلاح خطأ
📚 docs: تحديث التوثيق
💄 style: تحسينات التصميم
♻️ refactor: إعادة هيكلة الكود
⚡ perf: تحسين الأداء
✅ test: إضافة اختبارات
🔧 chore: مهام صيانة
```

## 📞 الدعم والتواصل

- **Issues**: https://github.com/ahmedfady26/nehky-platform/issues
- **Discussions**: https://github.com/ahmedfady26/nehky-platform/discussions
- **Email**: [إضافة البريد الإلكتروني]

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

**تم إنشاء هذا التوثيق بـ ❤️ لمجتمع المطورين العرب**
