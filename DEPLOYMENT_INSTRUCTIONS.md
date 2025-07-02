🚀 خطوات رفع مشروع نحكي إلى GitHub وتفعيل GitHub Pages
====================================================================

## ✅ ما تم إنجازه:

1. ✅ إنشاء نسخة احتياطية كاملة في: `/Users/ahmedfady/Desktop/نسخه ٢-٧-٢٠٢٥`
2. ✅ إنشاء نسخة نظيفة صالحة للرفع في: `/Users/ahmedfady/Desktop/نسخه صالحه لجيت هب`
3. ✅ إعداد Next.js للعمل مع GitHub Pages (static export)
4. ✅ إضافة GitHub Actions للنشر التلقائي
5. ✅ حل مشكلة API routes (تم نقلها مؤقتاً لـ temp_api)
6. ✅ اختبار البناء محلياً - نجح بالكامل!

## 📋 الخطوات المتبقية:

### 1️⃣ إنشاء المستودع على GitHub:
- اذهب إلى: https://github.com/new (تم فتحها لك)
- اسم المستودع: `nehky-platform`
- اجعله Public ✅
- لا تضف README أو .gitignore أو License ❌
- اضغط "Create repository"

### 2️⃣ رفع المشروع:
بعد إنشاء المستودع، نفذ هذا الأمر في Terminal:

```bash
cd "/Users/ahmedfady/Desktop/نسخه صالحه لجيت هب"
git push -u origin main
```

### 3️⃣ تفعيل GitHub Pages:
- اذهب إلى إعدادات المستودع: Settings → Pages
- Source: "Deploy from a branch"  
- Branch: "gh-pages" (سيظهر بعد أول push)
- اضغط Save

## 🌐 رابط الموقع النهائي:
`https://ahmedfady26.github.io/nehky-platform/`

## 🛠️ ملاحظات مهمة:

1. **API Routes**: تم نقلها مؤقتاً لأن GitHub Pages يدعم فقط المواقع الثابتة
2. **Database**: ستحتاج لخدمة hosting منفصلة للـ backend (Vercel, Railway, إلخ)
3. **Environment Variables**: تم إنشاء .env.example بدلاً من .env الحقيقي
4. **Build**: سيحدث تلقائياً عبر GitHub Actions عند كل push

## 🎯 خطوات إضافية (اختيارية):

### لاستعادة API routes لاحقاً:
```bash
cd "/Users/ahmedfady/Desktop/نسخه صالحه لجيت هب"
mv temp_api/api src/app/
rm -rf temp_api
```

### لنشر إصدار كامل مع backend:
- استخدم Vercel أو Netlify بدلاً من GitHub Pages
- غيّر `output: 'export'` إلى standalone في next.config.js

---
📧 إذا واجهت أي مشاكل، راجع logs GitHub Actions في تبويب "Actions" بالمستودع.
