import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testNewTables() {
  console.log('🧪 اختبار الجداول الجديدة...\n')

  try {
    // 1. اختبار جدول الأجهزة
    console.log('📱 اختبار جدول معلومات الأجهزة...')
    
    // العثور على مستخدم للاختبار
    const testUser = await prisma.user.findFirst()
    if (!testUser) {
      console.log('❌ لا يوجد مستخدمون للاختبار')
      return
    }

    // إضافة جهاز جديد
    const testDevice = await prisma.userDevice.create({
      data: {
        userId: testUser.id,
        deviceType: 'DESKTOP',
        os: 'Windows 11',
        browser: 'Chrome',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: '192.168.1.100',
        isFirstTime: true
      }
    })
    console.log('✅ تم إنشاء سجل جهاز:', {
      id: testDevice.id,
      deviceType: testDevice.deviceType,
      os: testDevice.os,
      browser: testDevice.browser
    })

    // 2. اختبار جدول الإداريين والترندات
    console.log('\n👑 اختبار نظام الإداريين...')
    
    // إنشاء إداري للاختبار
    const testAdmin = await prisma.admin.create({
      data: {
        userId: testUser.id,
        role: 'ADMIN',
        department: 'content',
        accessLevel: 3
      }
    })
    console.log('✅ تم إنشاء إداري:', {
      id: testAdmin.id,
      role: testAdmin.role,
      department: testAdmin.department
    })

    // 3. اختبار جدول الكلمات الشائعة وسجلات المراجعة
    console.log('\n🔥 اختبار نظام الترندات...')
    
    // إنشاء كلمة شائعة للاختبار
    const testKeyword = await prisma.trendingKeyword.create({
      data: {
        keyword: '#اختبار_الجداول_الجديدة',
        normalizedKeyword: 'اختبار_الجداول_الجديدة',
        type: 'HASHTAG',
        category: 'تقنية',
        dailyUsage: 25,
        weeklyUsage: 150,
        monthlyUsage: 500,
        trendScore: 85.5,
        isCurrentlyTrending: true,
        trendRank: 3
      }
    })
    console.log('✅ تم إنشاء كلمة شائعة:', {
      keyword: testKeyword.keyword,
      trendScore: testKeyword.trendScore,
      isCurrentlyTrending: testKeyword.isCurrentlyTrending
    })

    // إنشاء سجل مراجعة ترند
    const testReviewLog = await prisma.trendReviewLog.create({
      data: {
        adminId: testAdmin.id,
        keywordId: testKeyword.id,
        actionTaken: 'PIN',
        notes: 'تثبيت هذه الكلمة لأهميتها التقنية',
        reason: 'محتوى تقني مفيد',
        previousStatus: 'false',
        newStatus: 'true'
      }
    })
    console.log('✅ تم إنشاء سجل مراجعة ترند:', {
      id: testReviewLog.id,
      actionTaken: testReviewLog.actionTaken,
      notes: testReviewLog.notes
    })

    // 4. اختبار جدول الإشعارات الإدارية
    console.log('\n📢 اختبار نظام الإشعارات الإدارية...')
    
    const testNotification = await prisma.adminNotification.create({
      data: {
        adminId: testAdmin.id,
        receiverUserId: testUser.id,
        title: 'إشعار اختبار',
        message: 'هذا إشعار تجريبي لاختبار النظام الجديد',
        type: 'INFO',
        priority: 'NORMAL',
        category: 'system'
      }
    })
    console.log('✅ تم إنشاء إشعار إداري:', {
      id: testNotification.id,
      title: testNotification.title,
      type: testNotification.type,
      priority: testNotification.priority
    })

    // 5. اختبار الاستعلامات مع العلاقات
    console.log('\n🔍 اختبار الاستعلامات مع العلاقات...')
    
    // جلب بيانات شاملة للإداري
    const adminWithRelations = await prisma.admin.findUnique({
      where: { id: testAdmin.id },
      include: {
        user: true,
        trendReviews: {
          include: {
            keyword: true
          }
        },
        sentNotifications: {
          include: {
            receiverUser: true
          }
        }
      }
    })

    console.log('✅ بيانات الإداري مع العلاقات:', {
      adminName: adminWithRelations?.user.fullName,
      reviewsCount: adminWithRelations?.trendReviews.length,
      notificationsCount: adminWithRelations?.sentNotifications.length
    })

    // جلب بيانات المستخدم مع الأجهزة والإشعارات
    const userWithDevicesAndNotifications = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        devices: true,
        receivedAdminNotifications: {
          include: {
            admin: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    console.log('✅ بيانات المستخدم مع الأجهزة والإشعارات:', {
      userName: userWithDevicesAndNotifications?.fullName,
      devicesCount: userWithDevicesAndNotifications?.devices.length,
      notificationsCount: userWithDevicesAndNotifications?.receivedAdminNotifications.length
    })

    // 6. اختبار الفهارس والأداء
    console.log('\n⚡ اختبار الفهارس والأداء...')
    
    const performanceTests = await Promise.all([
      // البحث في الأجهزة حسب النوع
      prisma.userDevice.findMany({
        where: { deviceType: 'DESKTOP' },
        take: 5
      }),
      
      // البحث في سجلات المراجعة حسب الإجراء
      prisma.trendReviewLog.findMany({
        where: { actionTaken: 'PIN' },
        include: {
          admin: { include: { user: true } },
          keyword: true
        },
        take: 5
      }),
      
      // البحث في الإشعارات غير المقروءة
      prisma.adminNotification.findMany({
        where: { isRead: false },
        include: {
          admin: { include: { user: true } },
          receiverUser: true
        },
        take: 5
      })
    ])

    console.log('✅ نتائج اختبار الأداء:', {
      desktopDevices: performanceTests[0].length,
      pinReviews: performanceTests[1].length,
      unreadNotifications: performanceTests[2].length
    })

    console.log('\n🎉 جميع الاختبارات تمت بنجاح!')
    
    // تنظيف البيانات التجريبية
    console.log('\n🧹 تنظيف البيانات التجريبية...')
    await prisma.adminNotification.delete({ where: { id: testNotification.id } })
    await prisma.trendReviewLog.delete({ where: { id: testReviewLog.id } })
    await prisma.trendingKeyword.delete({ where: { id: testKeyword.id } })
    await prisma.admin.delete({ where: { id: testAdmin.id } })
    await prisma.userDevice.delete({ where: { id: testDevice.id } })
    
    console.log('✅ تم تنظيف البيانات التجريبية')

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNewTables()
