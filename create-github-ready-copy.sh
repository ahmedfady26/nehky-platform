#!/bin/bash

# 🚀 إنشاء نسخة صالحة للرفع على GitHub
# تاريخ: 2-7-2025
# ================================================

echo "🚀 إنشاء نسخة صالحة للرفع على GitHub..."
echo "============================================="

# المتغيرات
SOURCE_DIR="/Users/ahmedfady/nehky.com"
GITHUB_READY_DIR="/Users/ahmedfady/Desktop/نسخه صالحه لجيت هب"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "📁 المصدر: $SOURCE_DIR"
echo "🎯 الوجهة: $GITHUB_READY_DIR"
echo ""

# إنشاء مجلد النسخة الصالحة للـ GitHub
echo "📁 إنشاء مجلد النسخة الصالحة..."
mkdir -p "$GITHUB_READY_DIR"

if [ ! -d "$GITHUB_READY_DIR" ]; then
    echo "❌ خطأ: فشل في إنشاء المجلد"
    exit 1
fi

echo "✅ تم إنشاء المجلد: $GITHUB_READY_DIR"

# نسخ الملفات المهمة فقط (بدون الملفات الحساسة والثقيلة)
echo ""
echo "📋 نسخ الملفات الصالحة للـ GitHub..."

rsync -av --progress \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.vercel' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env.production' \
    --exclude='*.log' \
    --exclude='*.tmp' \
    --exclude='.DS_Store' \
    --exclude='dev.db' \
    --exclude='*.db' \
    --exclude='backup*' \
    --exclude='*backup*' \
    --exclude='BACKUP_*' \
    --exclude='DELETE*' \
    --exclude='delete*' \
    --exclude='test-*' \
    --exclude='temp*' \
    --exclude='create_backup.sh' \
    --exclude='delete-github*' \
    --exclude='upload-to-github.sh' \
    "$SOURCE_DIR/" "$GITHUB_READY_DIR/"

if [ $? -eq 0 ]; then
    echo "✅ تم نسخ الملفات بنجاح"
else
    echo "❌ خطأ في نسخ الملفات"
    exit 1
fi

# إنشاء ملف .env.example (نموذجي)
echo ""
echo "🔧 إنشاء ملف .env.example..."

cat > "$GITHUB_READY_DIR/.env.example" << EOF
# ملف متغيرات البيئة النموذجي لمشروع نحكي
# انسخ هذا الملف إلى .env وقم بتعديل القيم

# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# إعدادات إضافية
NODE_ENV="development"
EOF

# إنشاء README.md محسن
echo ""
echo "📄 إنشاء README.md محسن..."

cat > "$GITHUB_READY_DIR/README.md" << EOF
# 🎯 منصة نحكي (Nehky Platform)

منصة اجتماعية متقدمة مبنية بتكنولوجيا Next.js مع نظام إدارة متطور ومميزات اجتماعية مبتكرة.

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
\`\`\`bash
git clone https://github.com/ahmedfady26/nehky-platform.git
cd nehky-platform
\`\`\`

### 2. تثبيت التبعيات
\`\`\`bash
npm install
\`\`\`

### 3. إعداد قاعدة البيانات
\`\`\`bash
# انسخ ملف البيئة النموذجي
cp .env.example .env

# قم بتهيئة قاعدة البيانات
npx prisma generate
npx prisma db push
\`\`\`

### 4. تشغيل المشروع
\`\`\`bash
npm run dev
\`\`\`

سيكون المشروع متاحاً على: [http://localhost:3000](http://localhost:3000)

## 📱 الصفحات الرئيسية

- **الصفحة الرئيسية**: `/` - عرض المنشورات والتفاعلات
- **التسجيل**: `/register` - نظام تسجيل محسن
- **تسجيل الدخول**: `/login` - واجهة تسجيل دخول
- **الاستكشاف**: `/explore` - اكتشاف محتوى جديد
- **الاقتراحات**: `/suggestions` - اقتراحات المتابعة
- **مراقب قاعدة البيانات**: `/admin/database-monitor` - مراقبة مباشرة

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
EOF

# إنشاء ملف .gitignore محسن
echo ""
echo "🚫 إنشاء ملف .gitignore محسن..."

cat > "$GITHUB_READY_DIR/.gitignore" << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/.next/
/out/
/dist/
/build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
dev.db
prisma/dev.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Backup files
backup*/
*backup*
BACKUP_*

# Test files
test-*
*.test.js
*.test.ts

# Scripts
create_backup.sh
delete-github*
upload-to-github.sh

# Vercel
.vercel

# TypeScript build info
*.tsbuildinfo

# Sentry
.sentryclirc
EOF

# إنشاء ملف LICENSE
echo ""
echo "📜 إنشاء ملف LICENSE..."

cat > "$GITHUB_READY_DIR/LICENSE" << EOF
MIT License

Copyright (c) $(date +%Y) Ahmed Fady

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# تنظيف الملفات غير المرغوب فيها
echo ""
echo "🧹 تنظيف الملفات غير المرغوب فيها..."

# حذف ملفات التقارير والاختبار
find "$GITHUB_READY_DIR" -name "*.md" -path "*REPORT*" -delete 2>/dev/null || true
find "$GITHUB_READY_DIR" -name "*_REPORT.md" -delete 2>/dev/null || true
find "$GITHUB_READY_DIR" -name "*COMPLETION*" -delete 2>/dev/null || true
find "$GITHUB_READY_DIR" -name "test-*" -delete 2>/dev/null || true
find "$GITHUB_READY_DIR" -name "*backup*" -delete 2>/dev/null || true

# حذف ملفات مؤقتة
find "$GITHUB_READY_DIR" -name "temp*" -delete 2>/dev/null || true
find "$GITHUB_READY_DIR" -name "*.tmp" -delete 2>/dev/null || true

# إحصائيات النسخة النهائية
TOTAL_FILES=$(find "$GITHUB_READY_DIR" -type f | wc -l)
TOTAL_DIRS=$(find "$GITHUB_READY_DIR" -type d | wc -l)
DIR_SIZE=$(du -sh "$GITHUB_READY_DIR" | cut -f1)

echo ""
echo "🎉 تم إنشاء النسخة الصالحة للـ GitHub بنجاح!"
echo "================================================="
echo "📍 المكان: $GITHUB_READY_DIR"
echo "📊 الإحصائيات:"
echo "   📄 عدد الملفات: $TOTAL_FILES"
echo "   📁 عدد المجلدات: $TOTAL_DIRS"
echo "   💾 الحجم: $DIR_SIZE"
echo ""
echo "📋 الملفات المُضافة:"
echo "   ✅ README.md محسن ومفصل"
echo "   ✅ .env.example (نموذجي وآمن)"
echo "   ✅ .gitignore شامل"
echo "   ✅ LICENSE (MIT)"
echo ""
echo "🚫 الملفات المستثناة:"
echo "   ❌ ملفات البيئة الحساسة (.env)"
echo "   ❌ قواعد البيانات (*.db)"
echo "   ❌ ملفات النسخ الاحتياطي"
echo "   ❌ ملفات الاختبار"
echo "   ❌ التقارير والوثائق الداخلية"
echo ""
echo "🚀 النسخة جاهزة للرفع على GitHub!"
echo ""

# فتح المجلد
if command -v open &> /dev/null; then
    echo "📂 فتح مجلد النسخة الصالحة..."
    open "$GITHUB_READY_DIR"
fi

echo "✅ انتهت العملية بنجاح!"
