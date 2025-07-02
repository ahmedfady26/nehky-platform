// 🌟 API لتسجيل المؤثرين والمستخدمين العاديين
// منصة نحكي - Nehky.com

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ExternalPlatform } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      secondName,
      thirdName,
      lastName,
      fullName,
      username,
      nehkyEmail,
      email,
      phone,
      password,
      isInfluencer = false,
      contentSpecialty,
      totalFollowersRange,
      socialAccounts = []
    } = body;

    // التحقق من البيانات المطلوبة
    if (!firstName || !lastName || !username || !nehkyEmail || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة: الاسم الأول، اسم العائلة، اسم المستخدم، البريد الإلكتروني، رقم الهاتف، وكلمة المرور' },
        { status: 400 }
      );
    }

    // التحقق من صحة رقم الهاتف
    if (!phone.match(/^\+\d{1,4}\d{7,15}$/)) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير صحيح، يجب أن يبدأ بمفتاح البلد ويحتوي على رقم مكتمل' },
        { status: 400 }
      );
    }

    // التحقق من طول رقم الهاتف (يجب ألا يكون مجرد كود البلد)
    if (phone.length < 10) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير مكتمل، يرجى إدخال الرقم كاملاً' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني المُولد
    const expectedNehkyEmail = `${username}@nehky.com`;
    if (nehkyEmail !== expectedNehkyEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني المُولد غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من قوة كلمة المرور
    const passwordValidation = {
      hasEnglishLetters: /[a-zA-Z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      minLength: password.length >= 8,
      noArabicCharacters: !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(password)
    };

    const isPasswordValid = Object.values(passwordValidation).every(condition => condition);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'كلمة المرور لا تحقق الشروط المطلوبة: يجب أن تحتوي على 8 أحرف على الأقل، حروف إنجليزية كبيرة وصغيرة، وأرقام' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { nehkyEmail: `${username}@nehky.com` },
          { externalEmail: email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      let errorMessage = 'المستخدم موجود مسبقاً';
      if (existingUser.username === username) {
        errorMessage = 'اسم المستخدم غير متاح';
      } else if (existingUser.externalEmail === email) {
        errorMessage = 'البريد الإلكتروني مستخدم مسبقاً';
      } else if (existingUser.phone === phone) {
        errorMessage = 'رقم الهاتف مستخدم مسبقاً';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 409 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const newUser = await prisma.user.create({
      data: {
        firstName,
        secondName: secondName || null,
        thirdName: thirdName || null,
        lastName,
        fullName,
        username,
        nehkyEmail,
        externalEmail: email,
        phone,
        passwordHash: hashedPassword,
        isInfluencer,
        // إضافة معلومات المؤثر إذا كان مؤثراً
        ...(isInfluencer && {
          bio: `مؤثر متخصص في ${getSpecialtyDisplayName(contentSpecialty)}`,
          interests: contentSpecialty ? [contentSpecialty] : []
        })
      }
    });

    // إضافة حسابات المؤثر على المنصات الاجتماعية
    if (isInfluencer && socialAccounts.length > 0) {
      const validSocialAccounts = socialAccounts.filter((account: any) => 
        account.platform && account.link && isValidPlatform(account.platform)
      );

      if (validSocialAccounts.length > 0) {
        await prisma.influencerAccount.createMany({
          data: validSocialAccounts.map((account: any) => ({
            userId: newUser.id,
            platformName: account.platform as ExternalPlatform,
            platformLink: account.link,
            followersCount: account.followersCount || 0,
            isVerified: false,
            isActive: true
          }))
        });
      }
    }

    // إرجاع النتيجة (بدون كلمة المرور)
    const userResponse = {
      id: newUser.id,
      fullName: newUser.fullName,
      username: newUser.username,
      nehkyEmail: newUser.nehkyEmail,
      externalEmail: newUser.externalEmail,
      phone: newUser.phone,
      isInfluencer: newUser.isInfluencer,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: isInfluencer 
        ? 'تم إنشاء حساب المؤثر بنجاح! سيتم مراجعة حساباتك الاجتماعية قريباً.' 
        : 'تم إنشاء الحساب بنجاح!',
      user: userResponse,
      socialAccountsAdded: isInfluencer ? socialAccounts.length : 0
    });

  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// دالة للتحقق من صحة نوع المنصة
function isValidPlatform(platform: string): platform is ExternalPlatform {
  const validPlatforms: ExternalPlatform[] = [
    'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'FACEBOOK', 
    'SNAPCHAT', 'LINKEDIN', 'TELEGRAM', 'WHATSAPP', 'CLUBHOUSE'
  ];
  return validPlatforms.includes(platform as ExternalPlatform);
}

// دالة لتحويل التخصص إلى اسم قابل للعرض
function getSpecialtyDisplayName(specialty: string): string {
  const specialties: Record<string, string> = {
    'technology': 'التكنولوجيا',
    'lifestyle': 'أسلوب الحياة',
    'education': 'التعليم',
    'entertainment': 'الترفيه',
    'sports': 'الرياضة',
    'cooking': 'الطبخ',
    'travel': 'السفر',
    'fashion': 'الموضة',
    'business': 'الأعمال',
    'other': 'أخرى'
  };
  return specialties[specialty] || specialty;
}
