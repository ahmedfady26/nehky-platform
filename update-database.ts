// تحديث وتنظيف قاعدة البيانات ونظام ترقية المؤثرين
import { prisma } from './src/lib/prisma'

async function updateDatabase() {
  console.log('🔄 بدء تحديث قاعدة البيانات...')

  try {
    // 1. تحديث إحصائيات المستخدمين
    console.log('👥 تحديث إحصائيات المستخدمين...')
    const users = await prisma.user.findMany({
      select: { id: true, username: true }
    })

    for (const user of users) {
      const [postsCount, interactionsCount] = await Promise.all([
        prisma.post.count({ where: { userId: user.id, isDeleted: false } }),
        prisma.interaction.count({ where: { userId: user.id } })
      ])

      console.log(`- تحديث ${user.username}: ${postsCount} منشور، ${interactionsCount} تفاعل`)
    }

    console.log(`✅ تم تحديث ${users.length} مستخدم\n`)

    // 2. نظام ترقية المؤثرين التلقائية
    console.log('🌟 فحص وترقية المؤثرين...')
    
    // البحث عن المستخدمين غير المؤثرين
    const nonInfluencers = await prisma.user.findMany({
      where: { isInfluencer: false },
      select: { 
        id: true, 
        username: true,
        createdAt: true
      }
    })

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    let promotedCount = 0
    
    for (const user of nonInfluencers) {
      console.log(`\n🔍 فحص المستخدم: ${user.username}`)
      
      // عدد المتابعين (من UserSignature)
      const followersCount = await prisma.userSignature.count({
        where: { influencerId: user.id, isActive: true }
      })
      
      // عدد المنشورات الحديثة
      const recentPostsCount = await prisma.post.count({
        where: {
          userId: user.id,
          createdAt: { gte: thirtyDaysAgo },
          isDeleted: false
        }
      })
      
      // حساب معدل التفاعل
      const userPosts = await prisma.post.findMany({
        where: {
          userId: user.id,
          isDeleted: false
        },
        select: {
          id: true,
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
          viewsCount: true
        }
      })
      
      let totalViews = 0
      let totalEngagements = 0
      
      userPosts.forEach(post => {
        totalViews += post.viewsCount
        totalEngagements += post.likesCount + post.commentsCount + post.sharesCount
      })
      
      const engagementRate = totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0
      
      console.log(`  📊 المتابعين: ${followersCount}`)
      console.log(`  📝 المنشورات الحديثة: ${recentPostsCount}`)
      console.log(`  💫 معدل التفاعل: ${engagementRate.toFixed(2)}%`)
      
      // فحص المعايير
      const meetsFollowersCriteria = followersCount >= 1000
      const meetsEngagementCriteria = engagementRate >= 3.0
      const meetsPostsCriteria = recentPostsCount >= 5
      
      if (meetsFollowersCriteria && meetsEngagementCriteria && meetsPostsCriteria) {
        console.log(`  🎉 ${user.username} يستوفي معايير المؤثر!`)
        
        // ترقية المستخدم إلى مؤثر
        await prisma.user.update({
          where: { id: user.id },
          data: { isInfluencer: true }
        })
        
        // إنشاء سجل أداء المؤثر - مُعطل مؤقتاً حتى تفعيل جدول InfluencerPerformance
        console.log(`  ⚠️  تم تخطي إنشاء سجل الأداء - جدول InfluencerPerformance معطل`)
        /*
        await prisma.influencerPerformance.create({
          data: {
            influencerId: user.id,
            reportMonth: new Date().getMonth() + 1,
            reportYear: new Date().getFullYear(),
            totalPosts: recentPostsCount,
            totalViews: totalViews,
            totalLikes: userPosts.reduce((sum, post) => sum + post.likesCount, 0),
            totalComments: userPosts.reduce((sum, post) => sum + post.commentsCount, 0),
            totalShares: userPosts.reduce((sum, post) => sum + post.sharesCount, 0),
            engagementRate: engagementRate / 100 // تحويل إلى كسر عشري
          }
        })
        */
        
        promotedCount++
        console.log(`  ✅ تم ترقية ${user.username} إلى مؤثر!`)
      } else {
        const missingCriteria = []
        if (!meetsFollowersCriteria) missingCriteria.push(`المتابعين (${followersCount}/1000)`)
        if (!meetsEngagementCriteria) missingCriteria.push(`التفاعل (${engagementRate.toFixed(2)}%/3%)`)
        if (!meetsPostsCriteria) missingCriteria.push(`المنشورات (${recentPostsCount}/5)`)
        
        console.log(`  ❌ لا يستوفي المعايير: ${missingCriteria.join(', ')}`)
      }
    }
    
    console.log(`\n🌟 تم ترقية ${promotedCount} مستخدم جديد إلى مؤثر`)

    // 3. تحديث إحصائيات الهاشتاج
    console.log('\n🏷️ تحديث إحصائيات الهاشتاج...')
    const hashtags = await prisma.hashtag.findMany()
    
    for (const hashtag of hashtags) {
      const postsCount = await prisma.postHashtag.count({
        where: { hashtagId: hashtag.id }
      })
      
      if (postsCount > 0) {
        await prisma.hashtag.update({
          where: { id: hashtag.id },
          data: {
            usageCount: postsCount,
            trendScore: postsCount * 0.1, // حساب بسيط للاتجاه
          }
        })
      }
    }

    console.log(`✅ تم تحديث ${hashtags.length} هاشتاج`)

    // 4. تنظيف البيانات القديمة
    console.log('\n🧹 تنظيف البيانات القديمة...')
    
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        readAt: { lt: thirtyDaysAgo }
      }
    })

    const deletedSessions = await prisma.loginSession.deleteMany({
      where: {
        loginTime: { lt: thirtyDaysAgo },
        isActive: false
      }
    })

    console.log(`✅ تم حذف ${deletedNotifications.count} إشعار و ${deletedSessions.count} جلسة قديمة`)

    // 5. إحصائيات نهائية
    console.log('\n📊 إحصائيات قاعدة البيانات النهائية:')
    const [
      totalUsers, 
      totalInfluencers, 
      totalPosts, 
      totalHashtags, 
      totalKeywords,
      activeInfluencers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isInfluencer: true } }),
      prisma.post.count(),
      prisma.hashtag.count(),
      prisma.keyword.count(),
      prisma.user.count({ 
        where: { 
          isInfluencer: true,
          posts: { 
            some: { 
              createdAt: { gte: thirtyDaysAgo },
              isDeleted: false 
            } 
          }
        } 
      })
    ])

    console.log(`👥 المستخدمين: ${totalUsers}`)
    console.log(`🌟 المؤثرين: ${totalInfluencers} (${activeInfluencers} نشط)`)
    console.log(`📝 المنشورات: ${totalPosts}`)
    console.log(`🏷️ الهاشتاج: ${totalHashtags}`)
    console.log(`🔑 الكلمات المفتاحية: ${totalKeywords}`)

    const influencerPercentage = totalUsers > 0 ? ((totalInfluencers / totalUsers) * 100).toFixed(2) : 0
    console.log(`📈 نسبة المؤثرين: ${influencerPercentage}%`)

    console.log('\n🎉 تم تحديث قاعدة البيانات ونظام المؤثرين بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في تحديث قاعدة البيانات:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل التحديث
updateDatabase().catch(console.error)
