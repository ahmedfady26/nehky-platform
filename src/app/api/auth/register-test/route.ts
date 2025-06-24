import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('🔥 [TEST] وصل طلب تسجيل اختباري');
  
  try {
    const body = await request.json();
    console.log('📋 [TEST] البيانات المستلمة:', JSON.stringify(body, null, 2));
    
    const { 
      username, 
      email, 
      phone, 
      firstName, 
      lastName, 
      password, 
      birthDate, 
      gender,
      fullName 
    } = body;

    // التحقق من البيانات الأساسية فقط
    if (!username || !firstName || !lastName || !password) {
      console.log('❌ [TEST] بيانات أساسية مفقودة');
      return NextResponse.json({
        success: false,
        message: 'بيانات أساسية مفقودة: اسم المستخدم، الاسم الأول، اسم العائلة، كلمة المرور'
      }, { status: 400 });
    }

    console.log('✅ [TEST] البيانات الأساسية موجودة');

    // تشفير كلمة المرور
    console.log('🔐 [TEST] تشفير كلمة المرور...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [TEST] تم تشفير كلمة المرور');

    // تكوين الاسم الكامل
    const completFullName = fullName || `${firstName} ${lastName}`;
    console.log('📝 [TEST] الاسم الكامل:', completFullName);

    // إنشاء المستخدم
    console.log('💾 [TEST] محاولة إنشاء المستخدم...');
    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        phone: phone || null,
        firstName,
        secondName: 'محمد', // اسم ثاني افتراضي للاختبار
        thirdName: 'أحمد',  // اسم ثالث افتراضي للاختبار
        lastName,
        fullName: completFullName,
        password: hashedPassword,
        birthDate: new Date(birthDate || '2000-01-01'),
        gender: gender || 'MALE',
        verified: false,
        role: 'USER'
      }
    });

    console.log('🎉 [TEST] تم إنشاء المستخدم بنجاح!', {
      id: user.id,
      username: user.username,
      fullName: user.fullName
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح (اختبار)',
      userId: user.id,
      username: user.username
    });

  } catch (error: any) {
    console.error('💥 [TEST] خطأ في التسجيل:', error);
    
    // تفصيل أكثر للخطأ
    if (error.code === 'P2002') {
      console.error('💥 [TEST] خطأ فرادة البيانات:', error.meta);
      return NextResponse.json({
        success: false,
        message: `البيانات مكررة: ${error.meta?.target || 'غير محدد'}`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم: ' + error.message,
      error: error.message
    }, { status: 500 });
  }
}
