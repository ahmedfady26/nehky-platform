const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('🔍 البحث عن المستخدم المنشأ...');
    
    const user = await prisma.user.findUnique({
      where: { username: 'test_auto_email_1750704140222' }
    });
    
    if (user) {
      console.log('✅ تم العثور على المستخدم:');
      console.log('🆔 ID:', user.id);
      console.log('👤 اسم المستخدم:', user.username);
      console.log('📧 البريد الإلكتروني:', user.email);
      console.log('📱 رقم الهاتف:', user.phone);
      console.log('👨 الاسم الكامل:', `${user.firstName} ${user.secondName} ${user.thirdName} ${user.lastName}`);
      
      // التحقق من أن البريد الإلكتروني تم توليده تلقائياً
      const expectedEmail = `${user.username}@nehky.com`;
      if (user.email === expectedEmail) {
        console.log('🎉 البريد الإلكتروني تم توليده تلقائياً بالصيغة الصحيحة!');
      } else {
        console.log('❌ البريد الإلكتروني لا يطابق الصيغة المتوقعة');
        console.log('المتوقع:', expectedEmail);
        console.log('الموجود:', user.email);
      }
    } else {
      console.log('❌ لم يتم العثور على المستخدم');
    }
    
  } catch (error) {
    console.error('🔥 خطأ في البحث:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
