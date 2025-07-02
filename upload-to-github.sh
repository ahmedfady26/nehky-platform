#!/bin/bash

# 🚀 سكريبت رفع النسخة الصالحة إلى GitHub
# تاريخ: 2-7-2025
# ==============================================

echo "🚀 رفع منصة نحكي إلى GitHub"
echo "=========================="

# المتغيرات
GITHUB_READY_DIR="/Users/ahmedfady/Desktop/نسخه صالحه لجيت هب"
REPO_NAME="nehky-platform"
GITHUB_USERNAME="ahmedfady26"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "📁 مجلد المشروع: $GITHUB_READY_DIR"
echo "🌐 اسم المستودع: $REPO_NAME"
echo "👤 اسم المستخدم: $GITHUB_USERNAME"
echo ""

# الانتقال إلى مجلد النسخة الصالحة
cd "$GITHUB_READY_DIR"

# التحقق من وجود Git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

echo "✅ Git متاح"

# تهيئة Git repository
echo "🔧 تهيئة Git repository..."
git init

# إضافة جميع الملفات
echo "📦 إضافة جميع الملفات..."
git add .

# عمل commit أولي
echo "💾 عمل commit أولي..."
git commit -m "🎉 Initial commit: Nehky Platform

🌟 منصة نحكي - منصة اجتماعية متقدمة

✨ المميزات الرئيسية:
- نظام تسجيل آمن مع تحقق من البيانات
- نظام الأصدقاء المقربين (Best Friends)
- اقتراحات المتابعة الذكية
- مراقبة مباشرة لقاعدة البيانات
- تحليلات تفاعل متقدمة
- دعم كامل للأجهزة المحمولة واللوحية

🛠️ التقنيات:
- Next.js 14 + TypeScript
- Prisma ORM + SQLite
- Tailwind CSS
- NextAuth.js
- تصميم متجاوب

🎯 جاهز للإنتاج والتطوير
📱 دعم كامل للغة العربية

Made with ❤️ in Egypt"

# إعداد الفرع الرئيسي
echo "🌿 إعداد الفرع الرئيسي..."
git branch -M main

# إضافة remote origin
echo "🔗 ربط المشروع مع GitHub..."
git remote add origin "$REPO_URL"

echo ""
echo "✅ تم إعداد Git بنجاح!"
echo ""
echo "🚨 الخطوات التالية:"
echo "1️⃣ تأكد من إنشاء المشروع على GitHub:"
echo "   🌐 اذهب إلى: https://github.com/new"
echo "   📝 اسم المشروع: $REPO_NAME"
echo "   📄 الوصف: منصة نحكي - منصة اجتماعية متقدمة مبنية بـ Next.js"
echo "   ✅ اتركه Public"
echo "   ❌ لا تُضف README أو .gitignore أو LICENSE (موجودة بالفعل)"
echo ""
echo "2️⃣ بعد إنشاء المشروع، اختر:"
echo "   أ) رفع فوري: اضغط 'y'"
echo "   ب) رفع لاحق: اضغط 'n' ثم نفذ: git push -u origin main"
echo ""

read -p "🚀 هل تريد رفع المشروع الآن؟ [y/N]: " PUSH_NOW

if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 جاري رفع المشروع..."
    echo "🔐 ستحتاج لإدخال بيانات GitHub الخاصة بك"
    echo ""
    
    if git push -u origin main; then
        echo ""
        echo "🎉 تم رفع المشروع بنجاح!"
        echo "================================"
        echo ""
        echo "🌐 رابط المشروع:"
        echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo ""
        echo "📋 ما تم رفعه:"
        echo "   ✅ كامل كود المشروع"
        echo "   ✅ README.md مفصل وجذاب"
        echo "   ✅ ملفات التكوين"
        echo "   ✅ مخططات قاعدة البيانات"
        echo "   ✅ جميع المكونات والصفحات"
        echo "   ✅ .env.example للإعداد السريع"
        echo ""
        echo "🔗 الخطوات التالية:"
        echo "   1. زيارة رابط المشروع"
        echo "   2. إضافة وصف للمشروع"
        echo "   3. إضافة topics/tags مناسبة"
        echo "   4. تفعيل GitHub Pages (اختياري)"
        echo ""
        
        # فتح المشروع في المتصفح
        if command -v open &> /dev/null; then
            echo "📂 فتح المشروع في المتصفح..."
            open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        fi
        
    else
        echo ""
        echo "❌ فشل في رفع المشروع"
        echo ""
        echo "💡 الحلول المحتملة:"
        echo "   1. تأكد من إنشاء المشروع على GitHub أولاً"
        echo "   2. تحقق من صحة اسم المستخدم: $GITHUB_USERNAME"
        echo "   3. تأكد من اسم المشروع: $REPO_NAME"
        echo "   4. تحقق من بيانات تسجيل الدخول"
        echo ""
        echo "🔧 للمحاولة مرة أخرى:"
        echo "   git push -u origin main"
        echo ""
    fi
else
    echo ""
    echo "ℹ️  تم إعداد المشروع محلياً"
    echo ""
    echo "🔧 لرفع المشروع لاحقاً:"
    echo "   cd '$GITHUB_READY_DIR'"
    echo "   git push -u origin main"
    echo ""
fi

echo "✅ انتهت العملية!"
