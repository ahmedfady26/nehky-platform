// التحقق من البريد الإلكتروني المولد في قاعدة البيانات
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGeneratedEmail() {
  try {
    // البحث عن المستخدم الذي تم إنشاؤه للتو
    const user = await prisma.user.findFirst({
      where: {
        username: {
          startsWith: 'test_auto_email_'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (user) {
      console.log('✅ تم العثور على المستخدم:');
      console.log('👤 اسم المستخدم:', user.username);
      console.log('📧 البريد الإلكتروني:', user.email);
      console.log('📱 رقم الهاتف:', user.phone);
      console.log('📝 الاسم الكامل:', user.fullName);
      console.log('🕐 تاريخ الإنشاء:', user.createdAt);
      
      // التحقق من أن البريد الإلكتروني تم توليده بشكل صحيح
      const expectedEmail = `${user.username}@nehky.com`;
      if (user.email === expectedEmail) {
        console.log('🎉 توليد البريد الإلكتروني التلقائي يعمل بشكل مثالي!');
      } else {
        console.log('❌ خطأ في توليد البريد الإلكتروني');
        console.log('المتوقع:', expectedEmail);
        console.log('الفعلي:', user.email);
      }
    } else {
      console.log('❌ لم يتم العثور على المستخدم');
    }
  } catch (error) {
    console.error('🔥 خطأ في الاستعلام:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGeneratedEmail();
