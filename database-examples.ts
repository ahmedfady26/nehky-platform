// أمثلة عملية لاستخدام قاعدة بيانات نحكي
import { dbAPI } from './database-api'
import { 
  searchUsers, 
  getUserStats, 
  createSmartPost, 
  getUserInterests,
  getRecommendedPosts,
  analyzeSocialNetwork
} from './src/lib/database'

// ========================================
// 📚 أمثلة الاستخدام الأساسي
// ========================================

console.log('🎯 أمثلة عملية لاستخدام قاعدة بيانات نحكي\n')

// مثال 1: البحث عن المستخدمين
async function exampleSearchUsers() {
  console.log('👥 مثال: البحث عن المستخدمين')
  
  const users = await searchUsers('أحمد', 5)
  console.log(`وُجد ${users.length} مستخدم:`)
  
  users.forEach(user => {
    console.log(`- ${user.fullName} (@${user.username})`)
    console.log(`  ${user.bio || 'لا يوجد وصف'}`)
    console.log(`  المتابعين: ${user.followersCount || 0}`)
    console.log('')
  })
}

// مثال 2: إحصائيات مستخدم معين
async function exampleUserStats() {
  console.log('📊 مثال: إحصائيات المستخدم')
  
  // الحصول على أول مستخدم
  const users = await dbAPI.getUsers({ limit: 1 })
  if (users.length === 0) {
    console.log('لا يوجد مستخدمين')
    return
  }
  
  const user = users[0]
  const stats = await getUserStats(user.id)
  
  if (stats) {
    console.log(`إحصائيات ${stats.user.fullName}:`)
    console.log(`- المنشورات: ${stats.stats.posts}`)
    console.log(`- التفاعلات: ${stats.stats.interactions}`)
    console.log(`- الإشعارات غير المقروءة: ${stats.stats.unreadNotifications}`)
    console.log(`- انضم منذ: ${stats.stats.joinedDaysAgo} يوم`)
    console.log('')
  }
}

// مثال 3: إنشاء منشور ذكي
async function exampleCreatePost() {
  console.log('📝 مثال: إنشاء منشور ذكي')
  
  const users = await dbAPI.getUsers({ limit: 1 })
  if (users.length === 0) return
  
  const userId = users[0].id
  const content = 'مرحباً بكم في منصة #نحكي! نحن نبني مجتمعاً للتفاعل والمشاركة 🚀 #تطوير #برمجة'
  
  try {
    const post = await createSmartPost(
      userId,
      content,
      'PUBLIC',
      ['منصة_نحكي', 'مجتمع']
    )
    
    console.log(`تم إنشاء منشور جديد:`)
    console.log(`- ID: ${post.id}`)
    console.log(`- المحتوى: ${content.substring(0, 50)}...`)
    console.log(`- الرؤية: ${post.visibility}`)
    console.log('')
  } catch (error: any) {
    console.log(`خطأ في إنشاء المنشور: ${error.message}`)
  }
}

// مثال 4: تحليل اهتمامات المستخدم
async function exampleUserInterests() {
  console.log('🎯 مثال: تحليل اهتمامات المستخدم')
  
  const users = await dbAPI.getUsers({ limit: 1 })
  if (users.length === 0) return
  
  const interests = await getUserInterests(users[0].id)
  
  if (interests) {
    console.log(`اهتمامات ${users[0].fullName}:`)
    console.log(`- نمط السلوك: ${interests.analysis.behaviorPattern}`)
    console.log(`- أسلوب التفاعل: ${interests.analysis.engagementStyle}`)
    console.log(`- درجة التنوع: ${interests.analysis.diversity}`)
    console.log(`- الثقة الإجمالية: ${interests.analysis.confidence}`)
    console.log(`- الاهتمامات الرئيسية: ${interests.topInterests.length}`)
    console.log('')
  } else {
    console.log('لم يتم تحليل اهتمامات هذا المستخدم بعد')
    console.log('')
  }
}

// مثال 5: التوصيات الذكية
async function exampleRecommendations() {
  console.log('💡 مثال: التوصيات الذكية')
  
  const users = await dbAPI.getUsers({ limit: 1 })
  if (users.length === 0) return
  
  const userId = users[0].id
  const recommendations = await getRecommendedPosts(userId, 3)
  
  console.log(`توصيات لـ ${users[0].fullName}:`)
  console.log(`عدد المنشورات المُوصى بها: ${recommendations.length}`)
  
  recommendations.forEach((post, index) => {
    console.log(`${index + 1}. ${post.content.substring(0, 60)}...`)
    console.log(`   بواسطة: ${post.user.fullName}`)
    console.log('')
  })
}

// مثال 6: تحليل الشبكة الاجتماعية
async function exampleSocialNetwork() {
  console.log('🌐 مثال: تحليل الشبكة الاجتماعية')
  
  const users = await dbAPI.getUsers({ limit: 1 })
  if (users.length === 0) return
  
  const network = await analyzeSocialNetwork(users[0].id)
  
  console.log(`تحليل شبكة ${users[0].fullName}:`)
  console.log(`- إجمالي التفاعلات: ${network.totalInteractions}`)
  console.log(`- إجمالي المنشورات: ${network.totalPosts}`)
  console.log(`- شركاء التفاعل: ${network.topInteractionPartners.length}`)
  console.log(`- صحة الشبكة:`)
  console.log(`  * التنوع: ${network.networkHealth.diversity}`)
  console.log(`  * التفاعل: ${network.networkHealth.engagement}`)
  console.log(`  * متوسط التفاعل: ${network.networkHealth.avgInteractionsPerPartner.toFixed(2)}`)
  console.log('')
}

// مثال 7: البحث العام
async function exampleGlobalSearch() {
  console.log('🔍 مثال: البحث العام')
  
  const results = await dbAPI.globalSearch('تطوير', 5)
  
  console.log('نتائج البحث عن "تطوير":')
  console.log(`- المستخدمين: ${results.users.length}`)
  console.log(`- المنشورات: ${results.posts.length}`)
  console.log(`- الهاشتاج: ${results.hashtags.length}`)
  console.log(`- إجمالي النتائج: ${results.total}`)
  console.log('')
}

// مثال 8: الإحصائيات العامة
async function examplePlatformStats() {
  console.log('📊 مثال: إحصائيات المنصة')
  
  const stats = await dbAPI.getStatistics()
  
  console.log('إحصائيات المنصة:')
  console.log(`- إجمالي المستخدمين: ${stats.totals.users}`)
  console.log(`- إجمالي المنشورات: ${stats.totals.posts}`)
  console.log(`- إجمالي الهاشتاج: ${stats.totals.hashtags}`)
  console.log(`- المستخدمين النشطين اليوم: ${stats.activity.activeUsersToday}`)
  console.log(`- المنشورات هذا الأسبوع: ${stats.activity.postsThisWeek}`)
  console.log('')
  
  console.log('أشهر الهاشتاج:')
  stats.activity.topHashtags.forEach((hashtag, index) => {
    console.log(`${index + 1}. #${hashtag.name} (${hashtag.usageCount} استخدام)`)
  })
  console.log('')
}

// تشغيل جميع الأمثلة
async function runAllExamples() {
  try {
    await exampleSearchUsers()
    await exampleUserStats()
    await exampleCreatePost()
    await exampleUserInterests()
    await exampleRecommendations()
    await exampleSocialNetwork()
    await exampleGlobalSearch()
    await examplePlatformStats()
    
    console.log('✅ تم تشغيل جميع الأمثلة بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل الأمثلة:', error)
  }
}

// تشغيل الأمثلة إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  runAllExamples()
}

export {
  exampleSearchUsers,
  exampleUserStats,
  exampleCreatePost,
  exampleUserInterests,
  exampleRecommendations,
  exampleSocialNetwork,
  exampleGlobalSearch,
  examplePlatformStats,
  runAllExamples
}
