import { saveDailyTopFollowerNominations, cleanupExpiredNominations } from '../src/lib/points-system'

async function updateDailyNominations() {
  console.log('🔄 تحديث الترشيحات اليومية...')
  
  try {
    // تنظيف الترشيحات المنتهية الصلاحية
    await cleanupExpiredNominations()
    
    // حفظ الترشيحات الجديدة
    await saveDailyTopFollowerNominations()
    
    console.log('✅ تم تحديث الترشيحات اليومية بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في تحديث الترشيحات:', error)
  }
}

updateDailyNominations()
