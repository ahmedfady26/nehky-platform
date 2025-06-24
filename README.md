# 🌟 نحكي - منصة التواصل الاجتماعي العربية

<div align="center">
  <img src="public/nehky_logo.webp" alt="شعار نحكي" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.0-blueviolet)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.15-darkgreen)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
</div>

## 📋 نظرة عامة

**نحكي** هي منصة تواصل اجتماعي عربية مبتكرة مصممة خصيصاً لأجهزة الكمبيوتر. تهدف المنصة إلى تعزيز العلاقة بين المؤثرين والمتابعين من خلال نظام "كبار المتابعين" ونظام النقاط التفاعلي.

## ✨ الميزات الرئيسية

### 🎯 **نظام كبار المتابعين**
- يمكن للمؤثرين (أكثر من 1000 متابع) ترشيح 3 متابعين كحد أقصى كل أسبوعين
- كبار المتابعين يمكنهم النشر/التعديل في صفحة المؤثر بموافقته
- صلاحية محدودة: أسبوعين أو 3 منشورات (أيهما أولاً)

### ⭐ **نظام النقاط**
- **20 نقطة**: نشر منشور باسم المؤثر
- **10 نقاط**: كتابة تعليق
- **5 نقاط**: إعجاب
- النقاط تُحسب لكل مؤثر منفصلاً

### 🔐 **نظام التسجيل**
- التسجيل باستخدام رقم الهاتف أو البريد الإلكتروني أو اسم المستخدم
- التحقق عبر OTP (SMS/Email)
- توليد تلقائي للبريد الإلكتروني بصيغة `username@nehky.com`

### 📈 **مراقبة الترندات**
- رصد الكلمات والهاشتاجات الرائجة
- تحليل المشاعر والإحصائيات
- نظام مراجعة المحتوى من قبل الإدارة

### 🔔 **نظام الإشعارات**
- إشعارات فورية للتفاعلات
- إشعارات الترشيحات والنقاط
- دعم Socket.IO للإشعارات اللحظية

## 🛠️ التقنيات المستخدمة

### **Frontend**
- **Next.js 14** - إطار العمل الرئيسي
- **TypeScript** - لضمان جودة الكود
- **Tailwind CSS** - للتصميم والتنسيق
- **Socket.IO Client** - للإشعارات اللحظية

### **Backend**
- **Next.js API Routes** - واجهات برمجة التطبيقات
- **Node.js** - بيئة التشغيل
- **Socket.IO** - للتواصل اللحظي

### **قاعدة البيانات**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma ORM** - لإدارة قاعدة البيانات

### **أدوات إضافية**
- **bcryptjs** - لتشفير كلمات المرور
- **jsonwebtoken** - للمصادقة
- **ua-parser-js** - لتحليل معلومات الأجهزة
- **nodemailer** - لإرسال الرسائل الإلكترونية

## 🚀 التثبيت والتشغيل

### **المتطلبات الأساسية**
- Node.js 18.0 أو أحدث
- PostgreSQL 14 أو أحدث
- npm أو yarn

### **خطوات التثبيت**

1. **استنساخ المشروع**
```bash
git clone https://github.com/[your-username]/nehky.com.git
cd nehky.com
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد قاعدة البيانات**
```bash
# إنشاء ملف .env
cp .env.example .env

# تحديث متغيرات البيئة في .env
# DATABASE_URL="postgresql://username:password@localhost:5432/nehky"

# تطبيق مخطط قاعدة البيانات
npx prisma db push

# (اختياري) إضافة بيانات تجريبية
npx prisma db seed
```

4. **تشغيل المشروع**
```bash
npm run dev
```

المشروع سيعمل على: `http://localhost:3000`

## 📁 هيكل المشروع

```
nehky.com/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # صفحات الإدارة
│   │   ├── api/            # واجهات برمجة التطبيقات
│   │   ├── auth/           # صفحات التحقق
│   │   └── ...             # صفحات المستخدمين
│   ├── components/         # مكونات React قابلة للإعادة
│   ├── lib/               # مكتبات مساعدة
│   ├── types/             # تعريفات TypeScript
│   └── styles/            # ملفات التصميم
├── prisma/
│   ├── schema.prisma      # مخطط قاعدة البيانات
│   └── seed.ts           # بيانات أولية
├── public/               # الملفات العامة
└── server/              # خادم الإشعارات
```

## 🌐 الصفحات المتاحة

### **👤 صفحات المستخدمين**
- `/` - الصفحة الرئيسية
- `/auth` - تسجيل الدخول والتسجيل
- `/dashboard` - لوحة التحكم الشخصية
- `/feed` - التغذية الرئيسية
- `/profile` - الملف الشخصي
- `/messages` - الرسائل
- `/notifications` - الإشعارات
- `/points` - نظام النقاط

### **👨‍💼 صفحات الإدارة**
- `/admin` - لوحة تحكم الإدارة
- `/admin/user-management` - إدارة المستخدمين
- `/admin/keyword-management` - إدارة الكلمات المفتاحية
- `/trend-monitoring` - مراقبة الترندات

### **🧪 صفحات الاختبار**
- `/test-email-generation` - اختبار توليد البريد الإلكتروني
- `/test-points-system` - اختبار نظام النقاط
- `/components-showcase` - معرض المكونات
- [المزيد...](http://localhost:3000/site-map)

## 🔧 الأوامر المفيدة

```bash
# تطوير
npm run dev                    # تشغيل في وضع التطوير
npm run build                  # بناء للإنتاج
npm run start                  # تشغيل الإنتاج

# قاعدة البيانات
npx prisma studio              # فتح واجهة Prisma Studio
npx prisma migrate dev         # تطبيق التغييرات على قاعدة البيانات
npx prisma generate           # توليد Prisma Client

# أدوات أخرى
npm run lint                   # فحص الكود
```

## 🎨 التصميم والواجهة

- **دعم RTL كامل** للغة العربية
- **تدرج ألوان ناعم** بين الأزرق والأخضر
- **تصميم متجاوب** يعمل على جميع أحجام الشاشات
- **خطوط عربية جميلة** (Cairo, Tajawal)
- **رموز تعبيرية** لتحسين تجربة المستخدم

## 🔒 الأمان

- **تشفير كلمات المرور** باستخدام bcrypt
- **JWT Tokens** للمصادقة
- **تحقق OTP** عبر SMS/Email
- **حماية CSRF** مدمجة في Next.js
- **تسجيل معلومات الأجهزة** لمراقبة الأمان

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) لمزيد من التفاصيل.

## 📞 التواصل

- **البريد الإلكتروني**: contact@nehky.com
- **موقع الويب**: [nehky.com](https://nehky.com)
- **GitHub Issues**: [قائمة المشاكل](https://github.com/[your-username]/nehky.com/issues)

## 🙏 شكر وتقدير

شكر خاص لجميع المساهمين والمطورين الذين ساعدوا في بناء هذه المنصة.

---

<div align="center">
  <strong>صُنع بـ ❤️ من أجل المجتمع العربي</strong>
</div>
