import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // حذف المستخدم التجريبي إذا كان موجوداً
    await prisma.user.deleteMany({
      where: {
        OR: [
          { username: 'testuser' },
          { email: 'test@external.com' },
          { phone: '+966501234567' },
          { internalEmail: 'testuser@nehky.com' }
        ]
      }
    })

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash('testpassword', 10)

    // إنشاء مستخدم تجريبي
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@nehky.com',  // تغيير إلى نطاق nehky.com
        phone: '+966501234567',
        firstName: 'اختبار',
        secondName: 'محمد',      // إضافة الحقول المطلوبة
        thirdName: 'سالم',       // إضافة الحقول المطلوبة  
        lastName: 'المستخدم',
        fullName: 'اختبار محمد سالم المستخدم',
        password: hashedPassword,
        birthDate: new Date('1990-01-01'),
        age: 34,
        gender: 'male',           // تغيير إلى القيم الجديدة
        recoveryEmail: 'recovery@example.com', // إيميل الاسترداد
        internalEmail: 'testuser@nehky.com', // البريد الداخلي
        verified: true,
        role: 'USER'
      }
    })

    console.log('✅ تم إنشاء المستخدم التجريبي بنجاح:')
    console.log(`- اسم المستخدم: ${user.username}`)
    console.log(`- البريد الخارجي: ${user.email}`)
    console.log(`- البريد الداخلي: ${user.internalEmail}`)
    console.log(`- إيميل الاسترداد: ${user.recoveryEmail}`)
    console.log(`- رقم الهاتف: ${user.phone}`)
    console.log(`- كلمة المرور: testpassword`)
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
