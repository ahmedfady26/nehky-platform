#!/usr/bin/env node

// سكريبت جدولة لتحديث الترشيحات اليومية
// يمكن تشغيله عبر cron job يومياً

import { saveDailyTopFollowerNominations, cleanupExpiredNominations } from '../src/lib/points-system'

async function runDailyNominationsUpdate() {
  const startTime = Date.now()
  console.log(`🌅 بدء التحديث اليومي للترشيحات - ${new Date().toLocaleString('ar-SA')}`)
  
  try {
    // تنظيف الترشيحات المنتهية الصلاحية
    console.log('🧹 تنظيف الترشيحات المنتهية...')
    const cleanedCount = await cleanupExpiredNominations()
    
    // إنشاء ترشيحات جديدة
    console.log('🏆 إنشاء ترشيحات جديدة...')
    const newNominations = await saveDailyTopFollowerNominations()
    
    const duration = Date.now() - startTime
    
    console.log('✅ تم التحديث اليومي بنجاح!')
    console.log(`📊 الإحصائيات:`)
    console.log(`   - تم تنظيف: ${cleanedCount} ترشيح منتهي`)
    console.log(`   - تم إنشاء: ${newNominations} ترشيح جديد`)
    console.log(`   - المدة: ${duration}ms`)
    console.log(`🕐 انتهى في: ${new Date().toLocaleString('ar-SA')}`)
    
    // إرسال تقرير (يمكن إضافة إشعار أو email هنا)
    if (newNominations > 0) {
      console.log(`📢 تم إنشاء ${newNominations} ترشيح جديد لكبار المتابعين`)
    }
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ فشل التحديث اليومي:', error)
    
    // إرسال تنبيه خطأ (يمكن إضافة إشعار أو email هنا)
    console.error('🚨 يجب التحقق من النظام!')
    
    process.exit(1)
  }
}

// التحقق من المتغيرات المطلوبة
if (!process.env.DATABASE_URL && !process.env.SQLITE_URL) {
  console.error('❌ متغير قاعدة البيانات غير محدد')
  process.exit(1)
}

// تشغيل التحديث
runDailyNominationsUpdate()

/* 
   لجدولة هذا السكريبت ليعمل يومياً في الساعة 00:00:
   
   1. إضافة إلى crontab:
   0 0 * * * cd /path/to/project && npm run update-daily-nominations
   
   2. أو إضافة إلى package.json:
   "scripts": {
     "update-daily-nominations": "tsx scripts/daily-nominations-scheduler.ts"
   }
   
   3. أو استخدام PM2:
   pm2 start "npm run update-daily-nominations" --cron "0 0 * * *" --name "daily-nominations"
*/
