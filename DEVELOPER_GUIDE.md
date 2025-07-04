# 🔧 دليل المطور - منصة نحكي

## 📋 فهرس المحتويات
- [البيئة التطويرية](#البيئة-التطويرية)
- [إعداد المشروع](#إعداد-المشروع)
- [معمارية المشروع](#معمارية-المشروع)
- [أنماط الكود](#أنماط-الكود)
- [قاعدة البيانات](#قاعدة-البيانات)
- [اختبار التطبيق](#اختبار-التطبيق)
- [نصائح التطوير](#نصائح-التطوير)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

## 🖥️ البيئة التطويرية

### المتطلبات الأساسية
```bash
# Node.js (الإصدار 18+)
node --version

# npm أو yarn
npm --version

# Git
git --version

# PostgreSQL (للتطوير المحلي)
psql --version
```

### أدوات التطوير الموصى بها
- **VS Code**: محرر الكود الأساسي
- **Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prisma
  - TypeScript Importer
  - Auto Rename Tag
  - Prettier
  - ESLint

## ⚙️ إعداد المشروع

### 1. استنساخ المشروع
```bash
git clone https://github.com/ahmedfady26/nehky-platform.git
cd nehky-platform
```

### 2. إعداد متغيرات البيئة
```bash
# إنشاء ملف .env
cp .env.example .env

# تعديل متغيرات البيئة
nano .env
```

**محتوى .env المطلوب:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nehky_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Development
NODE_ENV="development"
```

### 3. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
createdb nehky_db

# تطبيق المخطط
npx prisma migrate dev

# إنشاء Prisma Client
npx prisma generate

# (اختياري) إضافة بيانات تجريبية
npx prisma db seed
```

### 4. تشغيل المشروع
```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم
npm run dev
```

## 🏗️ معمارية المشروع

### نمط App Router
```
src/app/
├── (auth)/                # Route Groups
│   ├── login/            # صفحة تسجيل الدخول
│   └── register/         # صفحة التسجيل
├── admin/                # صفحات الإدارة
├── api/                  # API Routes
├── globals.css           # أنماط عامة
├── layout.tsx            # التخطيط الرئيسي
└── page.tsx              # الصفحة الرئيسية
```

### نمط المكونات
```
src/components/
├── ui/                   # مكونات واجهة المستخدم الأساسية
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── forms/                # نماذج التطبيق
│   ├── login-form.tsx
│   └── register-form.tsx
└── layout/               # مكونات التخطيط
    ├── header.tsx
    └── footer.tsx
```

### نمط الخدمات
```
src/lib/
├── auth.ts              # إعدادات المصادقة
├── database.ts          # اتصال قاعدة البيانات
├── utils.ts             # دوال مساعدة
└── types.ts             # أنواع TypeScript
```

## 📝 أنماط الكود

### TypeScript Types
```typescript
// src/lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BestFriend {
  id: string;
  userId: string;
  friendId: string;
  points: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

### React Components
```typescript
// src/components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### API Routes
```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## 🗄️ قاعدة البيانات

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  bestFriends BestFriend[] @relation("UserBestFriends")
  friendOf    BestFriend[] @relation("FriendOf")
  analytics   Analytics[]

  @@map("users")
}

model BestFriend {
  id        String   @id @default(cuid())
  userId    String
  friendId  String
  points    Int      @default(0)
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user   User @relation("UserBestFriends", fields: [userId], references: [id])
  friend User @relation("FriendOf", fields: [friendId], references: [id])

  @@unique([userId, friendId])
  @@map("best_friends")
}
```

### Database Utilities
```typescript
// src/lib/database.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Helper functions
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      bestFriends: true,
      friendOf: true,
    },
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  phone?: string;
}) {
  return await prisma.user.create({
    data,
  });
}
```

## 🧪 اختبار التطبيق

### إعداد الاختبارات
```bash
# تثبيت أدوات الاختبار
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# إنشاء ملف jest.config.js
```

### اختبار المكونات
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });
});
```

### اختبار API Routes
```typescript
// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/users/route';

describe('/api/users', () => {
  it('returns users list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        users: expect.any(Array),
      })
    );
  });
});
```

## 💡 نصائح التطوير

### 1. استخدام Git بفعالية
```bash
# إنشاء branch جديد
git checkout -b feature/user-profile

# Commit مع رسالة واضحة
git commit -m "✨ feat: إضافة صفحة الملف الشخصي"

# Push إلى remote
git push origin feature/user-profile
```

### 2. تحسين الأداء
```typescript
// استخدام React.memo للمكونات
const UserCard = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});

// استخدام useMemo للعمليات المكلفة
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// استخدام useCallback للدوال
const handleClick = useCallback(() => {
  onClick(id);
}, [onClick, id]);
```

### 3. إدارة الحالة
```typescript
// استخدام useState للحالة المحلية
const [user, setUser] = useState<User | null>(null);

// استخدام useEffect للتأثيرات الجانبية
useEffect(() => {
  fetchUser().then(setUser);
}, []);

// استخدام useReducer للحالة المعقدة
const [state, dispatch] = useReducer(reducer, initialState);
```

### 4. التعامل مع الأخطاء
```typescript
// Error Boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 🔍 استكشاف الأخطاء

### أخطاء شائعة وحلولها

#### 1. مشكلة اتصال قاعدة البيانات
```bash
Error: Can't reach database server
```
**الحل:**
- تأكد من تشغيل PostgreSQL
- تحقق من صحة DATABASE_URL
- تأكد من وجود قاعدة البيانات

#### 2. مشكلة Prisma Client
```bash
Error: PrismaClient is not configured
```
**الحل:**
```bash
npx prisma generate
npx prisma migrate dev
```

#### 3. مشكلة TypeScript
```bash
Error: Type 'string' is not assignable to type 'number'
```
**الحل:**
- تحقق من أنواع البيانات
- استخدم type assertions إذا لزم الأمر
- راجع ملف types.ts

#### 4. مشكلة Tailwind CSS
```bash
Error: Class 'custom-class' not found
```
**الحل:**
- تأكد من إضافة الكلاس في tailwind.config.js
- استخدم الكلاسات المعرفة مسبقاً
- أعد تشغيل الخادم

### أدوات التشخيص

#### 1. مراقبة الأداء
```typescript
// src/lib/performance.ts
export function measurePerformance(fn: Function, name: string) {
  return async (...args: any[]) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
}
```

#### 2. تسجيل الأخطاء
```typescript
// src/lib/logger.ts
export const logger = {
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },
  info: (message: string) => {
    console.info(`[INFO] ${message}`);
  },
};
```

## 🔧 أدوات مساعدة

### VS Code Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

**هذا الدليل يساعدك في التطوير الفعال لمنصة نحكي** 🚀
