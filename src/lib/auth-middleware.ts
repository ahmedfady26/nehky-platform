// نظام التحقق من الهوية للـ APIs
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  role: string;
}

// دالة التحقق من صحة JWT token
export async function verifyAuthToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET غير محدد في متغيرات البيئة');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    if (!decoded.userId) {
      return null;
    }

    // التحقق من وجود المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        verified: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role
    };

  } catch (error) {
    console.error('خطأ في التحقق من الرمز المميز:', error);
    return null;
  }
}

// دالة للتحقق من الأدوار المطلوبة
export function hasRequiredRole(user: AuthUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

// دالة للتحقق من صلاحية المؤثر
export function isInfluencer(user: AuthUser): boolean {
  return user.role === 'INFLUENCER';
}

// دالة للتحقق من صلاحية كبير المتابعين
export function isTopFollower(user: AuthUser): boolean {
  return user.role === 'TOP_FOLLOWER';
}

// دالة إنشاء JWT token
export function createAuthToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET غير محدد في متغيرات البيئة');
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: '7d', // صالح لمدة أسبوع
      issuer: 'nehky.com'
    }
  );
}

// دالة استخراج معلومات المستخدم من الطلب (helper)
export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  return await verifyAuthToken(request);
}

// دالة التحقق من حق الوصول للمنشور
export async function canAccessPost(userId: string, postId: string): Promise<boolean> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        publishedFor: true
      }
    });

    if (!post) {
      return false;
    }

    // صاحب المنشور يمكنه الوصول دائماً
    if (post.authorId === userId) {
      return true;
    }

    // إذا كان المنشور منشور باسم شخص آخر، يمكن لذلك الشخص الوصول أيضاً
    if (post.publishedFor && post.publishedFor.id === userId) {
      return true;
    }

    // المنشورات العامة متاحة للجميع
    // يمكن إضافة منطق أكثر تعقيداً هنا للخصوصية
    return true;

  } catch (error) {
    console.error('خطأ في التحقق من حق الوصول للمنشور:', error);
    return false;
  }
}
