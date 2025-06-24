import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAdminKeywordOccurrenceConnection() {
  console.log('🧪 اختبار ربط تكرارات الكلمات مع الإداريين...')

  try {
    // الحصول على إداري متاح
    const admin = await prisma.admin.findFirst({
      where: { isActive: true },
      include: {
        user: {
          select: {
            username: true,
            fullName: true
          }
        }
      }
    })

    if (!admin) {
      throw new Error('لا يوجد إداريين متاحين للاختبار')
    }

    console.log(`👤 الإداري المختار: ${admin.user.fullName} (${admin.role})`)

    // الحصول على بعض تكرارات الكلمات الحالية
    const existingOccurrences = await prisma.keywordOccurrence.findMany({
      take: 5,
      include: {
        post: {
          select: {
            content: true
          }
        },
        user: {
          select: {
            fullName: true
          }
        }
      }
    })

    console.log(`📝 تم العثور على ${existingOccurrences.length} تكرار كلمة موجود`)

    // تحديث بعض التكرارات لربطها بالإداري
    let updatedCount = 0
    for (const occurrence of existingOccurrences.slice(0, 3)) {
      await prisma.keywordOccurrence.update({
        where: { id: occurrence.id },
        data: {
          recordedByAdminId: admin.id,
          extractedBy: 'ADMIN_REVIEW'
        }
      })
      updatedCount++
      
      console.log(`✅ تم ربط التكرار "${occurrence.keyword}" بالإداري ${admin.user.fullName}`)
    }

    // إنشاء تكرار جديد مرتبط بالإداري من البداية
    const newPost = await prisma.post.findFirst({
      where: {
        content: {
          contains: '#'
        }
      }
    })

    if (newPost) {
      const newOccurrence = await prisma.keywordOccurrence.create({
        data: {
          keyword: '#تجربة_الربط_الإداري',
          normalizedKeyword: 'تجربةالربطالإداري',
          type: 'HASHTAG',
          position: 0,
          context: 'تجربة ربط الإداريين مع تكرارات الكلمات #تجربة_الربط_الإداري',
          postId: newPost.id,
          userId: newPost.authorId,
          sentiment: 'POSITIVE',
          language: 'ar',
          category: 'اختبار',
          extractedBy: 'ADMIN_MANUAL',
          recordedByAdminId: admin.id
        },
        include: {
          recordedByAdmin: {
            include: {
              user: {
                select: {
                  fullName: true,
                  username: true
                }
              }
            }
          }
        }
      })

      console.log(`🆕 تم إنشاء تكرار جديد مرتبط بالإداري: "${newOccurrence.keyword}"`)
    }

    // اختبار الاستعلامات الجديدة
    console.log('\n🔍 اختبار الاستعلامات الجديدة:')

    // 1. الحصول على جميع التكرارات المرتبطة بهذا الإداري
    const adminOccurrences = await prisma.keywordOccurrence.findMany({
      where: {
        recordedByAdminId: admin.id
      },
      include: {
        recordedByAdmin: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    console.log(`   📊 التكرارات المرتبطة بالإداري ${admin.user.fullName}: ${adminOccurrences.length}`)

    // 2. إحصائيات التكرارات حسب الإداريين
    const adminStats = await prisma.keywordOccurrence.groupBy({
      by: ['recordedByAdminId'],
      where: {
        recordedByAdminId: {
          not: null
        }
      },
      _count: {
        recordedByAdminId: true
      }
    })

    console.log(`   📈 إحصائيات الإداريين:`)
    for (const stat of adminStats) {
      if (stat.recordedByAdminId) {
        const adminInfo = await prisma.admin.findUnique({
          where: { id: stat.recordedByAdminId },
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        })
        console.log(`      - ${adminInfo?.user.fullName}: ${stat._count.recordedByAdminId} تكرار`)
      }
    }

    // 3. التكرارات التلقائية مقابل المراجعة الإدارية
    const [autoCount, adminReviewedCount] = await Promise.all([
      prisma.keywordOccurrence.count({
        where: {
          recordedByAdminId: null
        }
      }),
      prisma.keywordOccurrence.count({
        where: {
          recordedByAdminId: {
            not: null
          }
        }
      })
    ])

    console.log(`\n📊 إحصائيات شاملة:`)
    console.log(`   🤖 التكرارات التلقائية: ${autoCount}`)
    console.log(`   👤 التكرارات المراجعة إدارياً: ${adminReviewedCount}`)
    console.log(`   📈 نسبة المراجعة الإدارية: ${((adminReviewedCount / (autoCount + adminReviewedCount)) * 100).toFixed(1)}%`)

    // 4. اختبار تتبع الأنشطة الإدارية
    const recentAdminActivity = await prisma.keywordOccurrence.findMany({
      where: {
        recordedByAdminId: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        recordedByAdmin: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    console.log(`\n⚡ آخر الأنشطة الإدارية:`)
    recentAdminActivity.forEach((activity, index) => {
      console.log(`   ${index + 1}. "${activity.keyword}" - ${activity.recordedByAdmin?.user.fullName} (${new Date(activity.createdAt).toLocaleString('ar')})`)
    })

    console.log('\n✅ تم اختبار ربط الإداريين مع تكرارات الكلمات بنجاح!')
    console.log('🔗 العلاقة تعمل بشكل صحيح ويمكن تتبع جميع الأنشطة الإدارية')

  } catch (error) {
    console.error('❌ فشل اختبار ربط الإداريين:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الاختبار
testAdminKeywordOccurrenceConnection()
  .catch((error) => {
    console.error('❌ خطأ في اختبار الربط:', error)
    process.exit(1)
  })

export default testAdminKeywordOccurrenceConnection
