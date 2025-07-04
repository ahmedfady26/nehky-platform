# 🎯 منصة نحكي (Nehky Platform)

منصة اجتماعية متقدمة مبنية بتكنولوجيا Next.js مع نظام إدارة متطور ومميزات اجتماعية مبتكرة.

## 🌐 الروابط المهمة

- **🌟 الموقع المباشر**: [nehky-platform.github.io](https://ahmedfady26.github.io/nehky-platform/)
- **💻 الكود المصدري**: [github.com/ahmedfady26/nehky-platform](https://github.com/ahmedfady26/nehky-platform)
- **📚 التوثيق الكامل**: [DOCUMENTATION.md](DOCUMENTATION.md)
- **🔧 دليل المطور**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **🚀 دليل النشر**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## ✨ المميزات الرئيسية

### 🔐 نظام التسجيل والأمان
- نظام تسجيل آمن مع تحقق من البيانات
- تحقق من أرقام الجوال المصرية
- نظام OTP للتحقق الإضافي
- حماية من البريد المزعج والحسابات الوهمية

### 👥 النظام الاجتماعي
- نظام الأصدقاء المقربين (Best Friends)
- اقتراحات المتابعة الذكية
- نظام التفاعل المتقدم
- تتبع سرعة التفاعل

### 📊 التحليلات والمراقبة
- مراقبة مباشرة لقاعدة البيانات
- تحليلات متقدمة للتفاعل
- نظام تتبع شامل للأنشطة
- إحصائيات مفصلة للأداء

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: GitHub Pages (Static Export)

## 🚀 البدء السريع

### التثبيت
```bash
# نسخ المشروع
git clone https://github.com/ahmedfady26/nehky-platform.git

# الانتقال إلى مجلد المشروع
cd nehky-platform

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env

# تشغيل خادم التطوير
npm run dev
```

### الأوامر المتاحة
```bash
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل الخادم للإنتاج
npm run lint         # فحص الكود
npm run type-check   # فحص أنواع TypeScript
```

## 📁 هيكل المشروع

```
nehky-platform/
├── 📂 src/
│   ├── 📂 app/              # صفحات التطبيق
│   ├── 📂 components/       # المكونات المعاد استخدامها
│   └── 📂 lib/              # المكتبات والأدوات
├── 📂 prisma/               # قاعدة البيانات
├── 📂 public/               # الملفات العامة
├── 📂 .github/workflows/    # GitHub Actions
└── 📄 next.config.js        # إعدادات Next.js
```

## 🌟 الصفحات المتاحة

| الصفحة | الوصف | الرابط |
|---------|-------|---------|
| الرئيسية | صفحة الترحيب | `/` |
| التسجيل | إنشاء حساب جديد | `/register` |
| تسجيل الدخول | دخول المستخدم | `/login` |
| الاستكشاف | تصفح المحتوى | `/explore` |
| التحليلات | إحصائيات الموقع | `/analytics` |
| الإدارة | لوحة التحكم | `/admin` |

## 📚 التوثيق

### للمطورين
- 📖 **[التوثيق الكامل](DOCUMENTATION.md)** - دليل شامل للمشروع
- 🔧 **[دليل المطور](DEVELOPER_GUIDE.md)** - إرشادات التطوير والبرمجة
- 🚀 **[دليل النشر](DEPLOYMENT_GUIDE.md)** - خطوات النشر على مختلف المنصات

### للمستخدمين
- 📋 **[دليل الاستخدام](USER_GUIDE.md)** - كيفية استخدام المنصة
- ❓ **[الأسئلة الشائعة](FAQ.md)** - إجابات عن الأسئلة المتكررة
- 🆘 **[الدعم الفني](SUPPORT.md)** - كيفية الحصول على المساعدة

## 🔧 إعداد البيئة التطويرية

### متغيرات البيئة
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/nehky_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Environment
NODE_ENV="development"
```

### قاعدة البيانات
```bash
# إعداد Prisma
npx prisma migrate dev
npx prisma generate

# فتح Prisma Studio
npx prisma studio
```

## 📊 الإحصائيات والأداء

- ⚡ **سرعة التحميل**: أقل من 2 ثانية
- 📱 **متوافق مع الجوال**: 100% responsive
- 🔒 **أمان**: HTTPS + تشفير البيانات
- 🌍 **دعم اللغة العربية**: تصميم RTL محسن

## 🤝 المساهمة

نرحب بجميع المساهمات! يرجى اتباع هذه الخطوات:

1. **Fork المشروع**
2. **إنشاء branch جديد** (`git checkout -b feature/amazing-feature`)
3. **Commit التغييرات** (`git commit -m '✨ Add amazing feature'`)
4. **Push إلى Branch** (`git push origin feature/amazing-feature`)
5. **إنشاء Pull Request**

### إرشادات المساهمة
- استخدم TypeScript للأمان
- اتبع معايير ESLint
- اكتب تعليقات واضحة
- اختبر الكود قبل الإرسال

## 📄 الترخيص

هذا المشروع مرخص تحت [رخصة MIT](LICENSE) - راجع الملف للتفاصيل.

## 📞 التواصل والدعم

- **Issues**: [GitHub Issues](https://github.com/ahmedfady26/nehky-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ahmedfady26/nehky-platform/discussions)
- **Email**: [إضافة البريد الإلكتروني]

## 🎯 الخطط المستقبلية

- [ ] إضافة تطبيق الجوال
- [ ] نظام الدفع المتكامل
- [ ] الذكاء الاصطناعي للتوصيات
- [ ] دعم لغات متعددة
- [ ] API مفتوح للمطورين

---

**تم تطوير منصة نحكي بـ ❤️ للمجتمع العربي**

⭐ **إذا أعجبك المشروع، لا تنس إعطاءه نجمة!**
- تحليلات تفاعل المستخدمين
- نظام تتبع المشاهدات
- إحصائيات متقدمة

### 🎨 واجهة المستخدم
- تصميم متجاوب يدعم جميع الأجهزة
- واجهة محسنة للأجهزة اللوحية
- ألوان وتأثيرات بصرية جذابة
- دعم كامل للغة العربية

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite مع Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: مكونات مخصصة
- **Styling**: Tailwind CSS مع تخصيص كامل

## 🚀 التشغيل السريع

### 1. تحميل المشروع
```bash
git clone https://github.com/ahmedfady26/nehky-platform.git
cd nehky-platform
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد قاعدة البيانات
```bash
# انسخ ملف البيئة النموذجي
cp .env.example .env

# قم بتهيئة قاعدة البيانات
npx prisma generate
npx prisma db push
```

### 4. تشغيل المشروع
```bash
npm run dev
```

سيكون المشروع متاحاً على: [http://localhost:3000](http://localhost:3000)

## 📱 الصفحات الرئيسية

- **الصفحة الرئيسية**:  - عرض المنشورات والتفاعلات
- **التسجيل**:  - نظام تسجيل محسن
- **تسجيل الدخول**:  - واجهة تسجيل دخول
- **الاستكشاف**:  - اكتشاف محتوى جديد
- **الاقتراحات**:  - اقتراحات المتابعة
- **مراقب قاعدة البيانات**:  - مراقبة مباشرة

## 🔧 المكونات المتقدمة

### نظام الأصدقاء المقربين
- ترشيحات ذكية للأصدقاء
- نظام نقاط وامتيازات
- إشعارات خاصة
- تفاعل محسن

### نظام التتبع المتقدم
- تتبع تفاعل المستخدمين
- قياس سرعة التفاعل
- تحليل سلوك المستخدم
- إحصائيات مفصلة

### نظام الدفع المصري
- دعم طرق الدفع المحلية
- تكامل مع البنوك المصرية
- معالجة آمنة للمدفوعات

## 📊 قاعدة البيانات

المشروع يستخدم Prisma ORM مع SQLite وتصميم قاعدة بيانات متقدم:

- **المستخدمون**: معلومات شاملة ونظام أمان
- **المنشورات**: نظام منشورات متطور
- **التفاعلات**: تتبع جميع أنواع التفاعل
- **الأصدقاء**: علاقات اجتماعية معقدة
- **التحليلات**: بيانات تفصيلية للإحصائيات

## 🔒 الأمان

- حماية من CSRF
- تشفير كلمات المرور
- تحقق من صحة البيانات
- حماية من SQL Injection
- نظام Rate Limiting

## 📈 الأداء

- تحسين الصور التلقائي
- Lazy Loading للمكونات
- تخزين مؤقت ذكي
- تحسين حجم الحزم

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل إرسال Pull Request.

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## 📞 التواصل

- **المطور**: Ahmed Fady
- **GitHub**: [@ahmedfady26](https://github.com/ahmedfady26)

---

**مصنوع بـ ❤️ في مصر**
