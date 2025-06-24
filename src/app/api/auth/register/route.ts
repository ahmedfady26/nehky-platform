import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tempOTPs } from '@/lib/temp-storage'
import bcrypt from 'bcryptjs'

// تحديد أن هذا الـ route ديناميكي
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('🔥 وصل طلب تسجيل جديد إلى API');
  
  try {
    const body = await request.json();
    console.log('📋 بيانات الطلب المستلمة:', body);
    
    const { username, email, phone, firstName, secondName, thirdName, lastName, fullName, password, birthDate, gender, age, nationality, birthCountry, currentCountry, graduationYear, degree, highSchool, interests, hobbies, recoveryEmail } = body;

    // التحقق من البيانات المطلوبة حسب البنية الجديدة
    console.log('🔍 التحقق من البيانات المطلوبة...');
    if (!username || !firstName || !secondName || !thirdName || !lastName || !phone || !password || !birthDate || !gender) {
      console.log('❌ بيانات ناقصة:', {
        username: !!username,
        firstName: !!firstName,
        secondName: !!secondName,   // أصبح مطلوب
        thirdName: !!thirdName,     // أصبح مطلوب
        lastName: !!lastName,
        phone: !!phone,
        password: !!password,
        birthDate: !!birthDate,
        gender: !!gender
      });
      return NextResponse.json({
        success: false,
        message: 'البيانات المطلوبة ناقصة: اسم المستخدم، الاسم الأول، الاسم الثاني، الاسم الثالث، اسم العائلة، رقم الهاتف، كلمة المرور، تاريخ الميلاد، والنوع'
      }, { status: 400 })
    }
    console.log('✅ جميع البيانات المطلوبة موجودة');

    // التحقق من فرادة اسم المستخدم
    console.log('🔍 التحقق من فرادة اسم المستخدم...');
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUsername) {
      console.log('❌ اسم المستخدم مُستخدم من قبل');
      return NextResponse.json({
        success: false,
        message: 'اسم المستخدم غير متاح'
      }, { status: 400 })
    }
    console.log('✅ اسم المستخدم متاح');

    // التحقق من فرادة رقم الهاتف
    console.log('🔍 التحقق من فرادة رقم الهاتف...');
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    });
    
    if (existingPhone) {
      console.log('❌ رقم الهاتف مُستخدم من قبل');
      return NextResponse.json({
        success: false,
        message: 'رقم الهاتف مستخدم من قبل'
      }, { status: 400 })
    }
    console.log('✅ رقم الهاتف متاح');

    // معالجة البريد الإلكتروني
    let finalEmail: string;
    
    if (email && email.trim()) {
      // التحقق من أن البريد الإلكتروني ينتهي بـ @nehky.com
      const emailTrimmed = email.trim();
      if (!emailTrimmed.endsWith('@nehky.com')) {
        console.log('❌ البريد الإلكتروني لا ينتهي بـ @nehky.com');
        return NextResponse.json({
          success: false,
          message: 'البريد الإلكتروني يجب أن يكون بصيغة user@nehky.com فقط'
        }, { status: 400 })
      }
      
      // التحقق من فرادة البريد الإلكتروني
      console.log('🔍 التحقق من فرادة البريد الإلكتروني...');
      const existingEmail = await prisma.user.findUnique({
        where: { email: emailTrimmed }
      });
      
      if (existingEmail) {
        console.log('❌ البريد الإلكتروني مُستخدم من قبل');
        return NextResponse.json({
          success: false,
          message: 'البريد الإلكتروني مُستخدم من قبل'
        }, { status: 400 })
      }
      
      finalEmail = emailTrimmed;
      console.log('✅ البريد الإلكتروني المدخل صحيح ومتاح:', finalEmail);
    } else {
      // توليد البريد الإلكتروني تلقائياً
      finalEmail = `${username}@nehky.com`;
      console.log('🔄 تم توليد البريد الإلكتروني تلقائياً:', finalEmail);
      
      // التحقق من أن البريد المولد غير موجود (احتياط إضافي)
      const existingGeneratedEmail = await prisma.user.findUnique({
        where: { email: finalEmail }
      });
      
      if (existingGeneratedEmail) {
        console.log('❌ البريد الإلكتروني المولد موجود بالفعل');
        return NextResponse.json({
          success: false,
          message: 'اسم المستخدم يولد بريد إلكتروني مكرر. يرجى اختيار اسم مستخدم آخر'
        }, { status: 400 })
      }
    }

    // التحقق من صحة النوع (Gender)
    const validGenders = ['male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return NextResponse.json({
        success: false,
        message: 'النوع يجب أن يكون "ذكر" أو "أنثى" فقط'
      }, { status: 400 })
    }

    // التحقق من صحة رقم الهاتف
    if (phone && !/^\+\d{1,4}\d{7,15}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        message: 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ويحتوي على مفتاح البلد والرقم'
      }, { status: 400 })
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      }, { status: 400 })
    }

    // التحقق من أن كلمة المرور تحتوي على أحرف إنجليزية فقط
    const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]*$/
    if (!englishOnlyRegex.test(password)) {
      return NextResponse.json({
        success: false,
        message: 'كلمة المرور يجب أن تكون باللغة الإنجليزية فقط (أحرف، أرقام، ورموز إنجليزية)'
      }, { status: 400 })
    }

    // التحقق من صحة إيميل الاسترداد إذا تم إدخاله
    if (recoveryEmail && recoveryEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(recoveryEmail)) {
        return NextResponse.json({
          success: false,
          message: 'إيميل الاسترداد غير صحيح'
        }, { status: 400 })
      }
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    // حساب العمر من تاريخ الميلاد
    const birthDateObj = new Date(birthDate)
    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      calculatedAge--
    }

    // التحقق من الحد الأدنى للعمر
    if (calculatedAge < 7) {
      return NextResponse.json({
        success: false,
        message: `عذراً، يجب أن يكون عمرك 7 سنوات أو أكثر للتسجيل في منصة نحكي. عمرك الحالي: ${calculatedAge} سنة`
      }, { status: 400 })
    }

    // تكوين الاسم الكامل التلقائي (مطلوب)
    const completFullName = [firstName, secondName, thirdName, lastName].join(' ');
    console.log('📝 الاسم الكامل المُكون تلقائياً:', completFullName);

    // إنشاء المستخدم حسب البنية الجديدة
    console.log('📝 إنشاء مستخدم جديد في قاعدة البيانات...');
    console.log('📧 البريد الإلكتروني النهائي:', finalEmail);
    
    const user = await prisma.user.create({
      data: {
        username,               // VARCHAR UNIQUE - مطلوب
        email: finalEmail,      // VARCHAR UNIQUE - مطلوب (مُولد تلقائياً أو مُدخل)
        phone,                  // VARCHAR UNIQUE - مطلوب (phone_number)
        password: hashedPassword, // TEXT - مطلوب (password_hash)
        firstName,              // VARCHAR - مطلوب (first_name)
        secondName,             // VARCHAR - مطلوب (middle_name)
        thirdName,              // VARCHAR - مطلوب (third_name)
        lastName,               // VARCHAR - مطلوب (last_name)
        fullName: completFullName, // TEXT - يُولد تلقائياً (غير فريد)
        birthDate: new Date(birthDate), // DATE - مطلوب (birth_date)
        gender: gender.toLowerCase(), // ENUM - مطلوب (male/female)
        age: calculatedAge,     // العمر المحسوب (اختياري)
        
        // حقول إضافية للمنصة (اختيارية)
        nationality: nationality || null,
        birthCountry: birthCountry || null,
        currentCountry: currentCountry || null,
        graduationYear: graduationYear || null,
        degree: degree || null,
        highSchool: highSchool || null,
        hobbies: hobbies ? JSON.stringify(hobbies) : null,
        interests: interests ? JSON.stringify(interests) : null,
        recoveryEmail: recoveryEmail && recoveryEmail.trim() ? recoveryEmail.trim() : null,
        verified: true, // تعطيل التحقق مؤقتاً
        role: 'USER'
        // createdAt و updatedAt يتم إنشاؤهما تلقائياً
      }
    })
    console.log('✅ تم إنشاء المستخدم بنجاح:', { userId: user.id, username: user.username });

    // تعطيل OTP مؤقتاً للاختبار - التسجيل مباشرة
    console.log('⚡ التحقق معطل مؤقتاً - التسجيل مكتمل مباشرة');
    
    /* 
    // إنشاء OTP - معطل مؤقتاً
    console.log('🔐 إنشاء رمز التحقق OTP...');
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const otp = randomNum.toString()
    console.log('✅ تم إنشاء OTP:', otp);
    
    // حفظ OTP مؤقتاً
    const identifier = email || phone
    if (identifier) {
      tempOTPs[identifier] = {
        otp,
        userId: user.id,
        expires: Date.now() + 5 * 60 * 1000 // 5 دقائق
      }
      console.log('✅ تم حفظ OTP في التخزين المؤقت');
    }
    */

    console.log('🎉 تم التسجيل بنجاح! إرسال الاستجابة...');
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول',
      userId: user.id,
      username: user.username
    })

  } catch (error) {
    console.error('خطأ في التسجيل:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
