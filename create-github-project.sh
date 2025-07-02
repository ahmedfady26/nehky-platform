#!/bin/bash

# 🚀 سكريبت لإنشاء مشروع GitHub جديد
# استخدم هذا السكريبت لإنشاء مشروع جديد بسرعة

echo "🚀 معالج إنشاء مشروع GitHub جديد"
echo "=================================="

# طلب المعلومات من المستخدم
read -p "📝 اسم المشروع الجديد: " PROJECT_NAME
read -p "📄 وصف المشروع (اختياري): " PROJECT_DESC
read -p "🌐 هل تريد المشروع عام (public) أم خاص (private)? [public/private]: " VISIBILITY

# التأكد من وجود اسم المشروع
if [ -z "$PROJECT_NAME" ]; then
    echo "❌ يجب إدخال اسم المشروع!"
    exit 1
fi

# تعيين الرؤية الافتراضية
if [ -z "$VISIBILITY" ]; then
    VISIBILITY="public"
fi

echo ""
echo "📋 ملخص المشروع الجديد:"
echo "   📛 الاسم: $PROJECT_NAME"
echo "   📄 الوصف: ${PROJECT_DESC:-'بدون وصف'}"
echo "   👁️ الرؤية: $VISIBILITY"
echo ""

read -p "✅ هل تريد المتابعة؟ [y/N]: " CONFIRM

if [[ $CONFIRM =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔧 خطوات إنشاء المشروع:"
    echo ""
    echo "1️⃣ اذهب إلى: https://github.com/new"
    echo ""
    echo "2️⃣ املأ النموذج:"
    echo "   - Repository name: $PROJECT_NAME"
    echo "   - Description: $PROJECT_DESC"
    echo "   - Visibility: $VISIBILITY"
    echo ""
    echo "3️⃣ بعد إنشاء المشروع، نفذ هذه الأوامر:"
    echo ""
    echo "# إنشاء مجلد المشروع"
    echo "mkdir $PROJECT_NAME"
    echo "cd $PROJECT_NAME"
    echo ""
    echo "# تهيئة Git"
    echo "git init"
    echo "echo '# $PROJECT_NAME' >> README.md"
    echo "git add README.md"
    echo "git commit -m 'Initial commit'"
    echo "git branch -M main"
    echo ""
    echo "# ربط بـ GitHub (استبدل YOUR_USERNAME باسم المستخدم)"
    echo "git remote add origin https://github.com/YOUR_USERNAME/$PROJECT_NAME.git"
    echo "git push -u origin main"
    echo ""
else
    echo "❌ تم إلغاء العملية"
fi
