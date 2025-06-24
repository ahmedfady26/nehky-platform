import { getTopFollowersForInfluencer } from '../src/lib/points-system'

async function testTopFollowers() {
  try {
    console.log('🔍 اختبار دالة جلب أفضل المتابعين...')
    
    // سارة أحمد
    const saraTopFollowers = await getTopFollowersForInfluencer('cmc4ykyps0002574ikfrnv7ve')
    console.log('أفضل متابعين لسارة أحمد:', saraTopFollowers)
    
    // علي السعدي  
    const aliTopFollowers = await getTopFollowersForInfluencer('cmc4ykyps0001574ixq2kvbmy')
    console.log('أفضل متابعين لعلي السعدي:', aliTopFollowers)
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error)
  }
}

testTopFollowers()
