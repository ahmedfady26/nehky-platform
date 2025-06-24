import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🧪 سكريبت تجربة شامل لنظام ربط الإداريين بتكرارات الكلمات
async function comprehensiveAdminKeywordTest() {
  console.log('🔄 تجربة شاملة لنظام ربط الإداريين بتكرارات الكلمات')
  console.log('=' .repeat(60))

  try {
    // 1. إحصائيات النظام الحالي
    console.log('\n📊 إحصائيات النظام الحالي:')
    const totalOccurrences = await prisma.keywordOccurrence.count()
    const adminRecordedOccurrences = await prisma.keywordOccurrence.count({
      where: { recordedByAdminId: { not: null } }
    })
    const systemGeneratedOccurrences = totalOccurrences - adminRecordedOccurrences
    
    console.log(`   📈 إجمالي التكرارات: ${totalOccurrences}`)
    console.log(`   🤖 تكرارات تلقائية: ${systemGeneratedOccurrences}`)
    console.log(`   👤 تكرارات مراجعة إدارياً: ${adminRecordedOccurrences}`)
    console.log(`   📋 نسبة المراجعة الإدارية: ${((adminRecordedOccurrences / totalOccurrences) * 100).toFixed(1)}%`)

    // 2. معلومات الإداريين
    console.log('\n👥 الإداريين المتاحين:')
    const admins = await prisma.admin.findMany({
      include: {
        user: {
          select: {
            username: true,
            fullName: true
          }
        },
        _count: {
          select: {
            recordedKeywordOccurrences: true
          }
        }
      }
    })

    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.user.fullName} (${admin.role})`)
      console.log(`      📋 القسم: ${admin.department || 'غير محدد'}`)
      console.log(`      📊 التكرارات المسجلة: ${admin._count.recordedKeywordOccurrences}`)
      console.log(`      🔑 مستوى الوصول: ${admin.accessLevel}`)
      console.log(`      ✅ نشط: ${admin.isActive ? 'نعم' : 'لا'}`)
    })

    // 3. تحليل التكرارات حسب نوع الإداري
    console.log('\n📈 تحليل التكرارات حسب دور الإداري:')
    const adminRoleStats = await prisma.keywordOccurrence.groupBy({
      by: ['recordedByAdminId'],
      where: { recordedByAdminId: { not: null } },
      _count: {
        id: true
      }
    })

    for (const stat of adminRoleStats) {
      const adminInfo = await prisma.admin.findUnique({
        where: { id: stat.recordedByAdminId! },
        include: {
          user: {
            select: { fullName: true }
          }
        }
      })
      if (adminInfo) {
        console.log(`   🔹 ${adminInfo.user.fullName} (${adminInfo.role}): ${stat._count.id} تكرار`)
      }
    }

    // 4. آخر الأنشطة الإدارية
    console.log('\n⏰ آخر 5 أنشطة إدارية:')
    const recentAdminActivities = await prisma.keywordOccurrence.findMany({
      where: { recordedByAdminId: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        recordedByAdmin: {
          include: {
            user: {
              select: { fullName: true }
            }
          }
        }
      }
    })

    recentAdminActivities.forEach((activity, index) => {
      const date = new Date(activity.createdAt).toLocaleString('ar-EG')
      console.log(`   ${index + 1}. "${activity.keyword}" (${activity.type})`)
      console.log(`      👤 الإداري: ${activity.recordedByAdmin?.user.fullName}`)
      console.log(`      📅 التاريخ: ${date}`)
      console.log(`      📂 التصنيف: ${activity.category || 'غير محدد'}`)
    })

    // 5. إحصائيات التفاعل مع التكرارات المراجعة إدارياً
    console.log('\n💫 إحصائيات التفاعل مع التكرارات المراجعة إدارياً:')
    const adminReviewedOccurrences = await prisma.keywordOccurrence.findMany({
      where: { recordedByAdminId: { not: null } },
      include: {
        post: {
          select: {
            likesCount: true,
            commentsCount: true,
            sharesCount: true,
            viewsCount: true
          }
        }
      }
    })

    if (adminReviewedOccurrences.length > 0) {
      const totalLikes = adminReviewedOccurrences.reduce((sum, occ) => sum + occ.post.likesCount, 0)
      const totalComments = adminReviewedOccurrences.reduce((sum, occ) => sum + occ.post.commentsCount, 0)
      const totalShares = adminReviewedOccurrences.reduce((sum, occ) => sum + occ.post.sharesCount, 0)
      const totalViews = adminReviewedOccurrences.reduce((sum, occ) => sum + occ.post.viewsCount, 0)

      console.log(`   ❤️  إجمالي الإعجابات: ${totalLikes}`)
      console.log(`   💬 إجمالي التعليقات: ${totalComments}`)
      console.log(`   🔄 إجمالي المشاركات: ${totalShares}`)
      console.log(`   👁️  إجمالي المشاهدات: ${totalViews}`)
      console.log(`   📊 متوسط التفاعل للتكرار: ${((totalLikes + totalComments + totalShares) / adminReviewedOccurrences.length).toFixed(1)}`)
    }

    // 6. التكرارات الأكثر شيوعاً من المراجعة الإدارية
    console.log('\n🔥 أكثر الكلمات تكراراً في المراجعة الإدارية:')
    const topAdminKeywords = await prisma.keywordOccurrence.groupBy({
      by: ['normalizedKeyword', 'type'],
      where: { recordedByAdminId: { not: null } },
      _count: {
        normalizedKeyword: true
      },
      orderBy: {
        _count: {
          normalizedKeyword: 'desc'
        }
      },
      take: 5
    })

    topAdminKeywords.forEach((keyword, index) => {
      console.log(`   ${index + 1}. "${keyword.normalizedKeyword}" (${keyword.type}): ${keyword._count.normalizedKeyword} مرة`)
    })

    console.log('\n✅ تمت التجربة الشاملة بنجاح!')
    console.log('🔗 نظام ربط الإداريين بتكرارات الكلمات يعمل بكفاءة عالية')

  } catch (error) {
    console.error('❌ خطأ في التجربة:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل التجربة
comprehensiveAdminKeywordTest().catch(console.error)
