# 🚀 دليل النشر والاستضافة - منصة نحكي

## 📋 فهرس المحتويات
- [نظرة عامة](#نظرة-عامة)
- [GitHub Pages (الحالي)](#github-pages-الحالي)
- [Vercel (موصى به)](#vercel-موصى-به)
- [Netlify](#netlify)
- [Railway](#railway)
- [استضافة مخصصة](#استضافة-مخصصة)
- [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات)
- [متغيرات البيئة](#متغيرات-البيئة)
- [إعداد النطاق المخصص](#إعداد-النطاق-المخصص)
- [مراقبة الأداء](#مراقبة-الأداء)

## 🎯 نظرة عامة

منصة نحكي تدعم أساليب نشر متعددة حسب احتياجاتك:

| المنصة | التكلفة | الأداء | API Support | قاعدة البيانات |
|---------|----------|---------|-------------|------------------|
| GitHub Pages | مجاني | جيد | ❌ Static Only | ❌ |
| Vercel | مجاني/مدفوع | ممتاز | ✅ Full | ✅ |
| Netlify | مجاني/مدفوع | ممتاز | ✅ Functions | ✅ |
| Railway | مدفوع | ممتاز | ✅ Full | ✅ |

## 🌐 GitHub Pages (الحالي)

### المميزات
- ✅ مجاني بالكامل
- ✅ نشر تلقائي من GitHub
- ✅ HTTPS مجاني
- ✅ سهولة الإعداد

### القيود
- ❌ Static sites only
- ❌ لا يدعم API routes
- ❌ لا يدعم قاعدة البيانات
- ❌ لا يدعم server-side rendering

### الإعداد الحالي
```yaml
# .github/workflows/deploy.yml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
      with:
        path: ./out
```

### الرابط الحالي
🌐 **https://ahmedfady26.github.io/nehky-platform/**

## ⚡ Vercel (موصى به)

### المميزات
- ✅ أداء ممتاز
- ✅ دعم كامل لـ Next.js
- ✅ API routes
- ✅ قاعدة بيانات مدمجة
- ✅ CDN عالمي
- ✅ Analytics مدمج

### خطوات النشر

#### 1. إعداد المشروع
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel
```

#### 2. ربط قاعدة البيانات
```bash
# إضافة قاعدة بيانات PostgreSQL
vercel postgres create

# إضافة متغيرات البيئة
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

#### 3. إعداد النطاق
```bash
# إضافة نطاق مخصص
vercel domains add yourdomain.com
```

### ملف vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

## 🎨 Netlify

### المميزات
- ✅ سهولة الاستخدام
- ✅ Netlify Functions
- ✅ Form handling
- ✅ CDN عالمي

### خطوات النشر

#### 1. إعداد Build
```bash
# إنشاء ملف netlify.toml
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

#### 2. إعداد Functions
```javascript
// netlify/functions/api.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const { path, httpMethod } = event;
  
  try {
    // Handle API routes
    if (path.startsWith('/api/users')) {
      if (httpMethod === 'GET') {
        const users = await prisma.user.findMany();
        return {
          statusCode: 200,
          body: JSON.stringify(users),
        };
      }
    }
    
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

## 🚄 Railway

### المميزات
- ✅ أداء ممتاز
- ✅ دعم كامل للـ backend
- ✅ قاعدة بيانات PostgreSQL
- ✅ Auto-scaling

### خطوات النشر

#### 1. إعداد المشروع
```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init

# نشر المشروع
railway up
```

#### 2. إعداد قاعدة البيانات
```bash
# إضافة PostgreSQL
railway add postgresql

# الحصول على connection string
railway variables
```

#### 3. إعداد متغيرات البيئة
```bash
# إضافة متغيرات البيئة
railway variables set DATABASE_URL=your-database-url
railway variables set NEXTAUTH_SECRET=your-secret
```

### ملف railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🏢 استضافة مخصصة

### متطلبات الخادم
```
- Node.js 18+
- PostgreSQL 13+
- Nginx (للـ reverse proxy)
- PM2 (لإدارة العمليات)
- SSL Certificate
```

### إعداد الخادم
```bash
# تثبيت التبعيات
sudo apt update
sudo apt install nodejs npm postgresql nginx

# إعداد PostgreSQL
sudo -u postgres createdb nehky_platform

# إعداد PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start npm --name "nehky-platform" -- start
pm2 startup
pm2 save
```

### إعداد Nginx
```nginx
# /etc/nginx/sites-available/nehky-platform
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ إعداد قاعدة البيانات

### PostgreSQL المحلي
```bash
# تثبيت PostgreSQL
sudo apt install postgresql postgresql-contrib

# إنشاء قاعدة البيانات
sudo -u postgres createdb nehky_platform

# إنشاء مستخدم
sudo -u postgres createuser --interactive
```

### قواعد البيانات السحابية

#### Supabase
```bash
# إنشاء مشروع على Supabase
# الحصول على connection string
DATABASE_URL="postgresql://username:password@db.xxx.supabase.co:5432/postgres"
```

#### Railway PostgreSQL
```bash
# إضافة قاعدة البيانات
railway add postgresql

# الحصول على connection string
railway variables
```

#### Vercel Postgres
```bash
# إنشاء قاعدة بيانات
vercel postgres create

# ربط بالمشروع
vercel postgres connect
```

## 🔑 متغيرات البيئة

### Production Environment
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key"

# OAuth (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Environment
NODE_ENV="production"

# Monitoring (اختياري)
SENTRY_DSN="your-sentry-dsn"
```

### إعداد المتغيرات

#### Vercel
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

#### Netlify
```bash
# في dashboard أو CLI
netlify env:set DATABASE_URL "your-database-url"
```

#### Railway
```bash
railway variables set DATABASE_URL=your-url
railway variables set NEXTAUTH_SECRET=your-secret
```

## 🌍 إعداد النطاق المخصص

### إعداد DNS
```
# A Record
@ -> IP Address of your server

# CNAME Record
www -> yourdomain.com

# For GitHub Pages
CNAME -> username.github.io
```

### إعداد SSL

#### Let's Encrypt (مجاني)
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة
sudo certbot --nginx -d yourdomain.com
```

#### Cloudflare (مجاني)
```
1. إضافة النطاق إلى Cloudflare
2. تغيير name servers
3. تفعيل SSL/TLS
```

## 📊 مراقبة الأداء

### أدوات المراقبة

#### Vercel Analytics
```javascript
// pages/_app.js
import { Analytics } from '@vercel/analytics/react';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

#### Google Analytics
```javascript
// lib/gtag.js
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

#### Sentry (Error Tracking)
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Health Checks
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

## 🔧 أدوات CI/CD

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📋 Checklist ما قبل النشر

### ✅ الكود
- [ ] اختبار جميع الوظائف
- [ ] إزالة console.log
- [ ] تحسين الصور
- [ ] تحسين الأداء

### ✅ الأمان
- [ ] إعداد متغيرات البيئة
- [ ] تشفير البيانات الحساسة
- [ ] إعداد HTTPS
- [ ] إعداد rate limiting

### ✅ قاعدة البيانات
- [ ] تطبيق migrations
- [ ] إعداد النسخ الاحتياطي
- [ ] اختبار الاتصال
- [ ] إعداد monitoring

### ✅ الأداء
- [ ] تحسين الصور
- [ ] تمكين caching
- [ ] إعداد CDN
- [ ] اختبار سرعة التحميل

---

**دليل شامل لنشر منصة نحكي على مختلف المنصات** 🚀
