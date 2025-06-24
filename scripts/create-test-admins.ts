import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestAdmins() {
  console.log('🛡️ إنشاء إداريين تجريبيين...')

  try {
    // الحصول على بعض المستخدمين الحاليين لتحويلهم لإداريين
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'INFLUENCER' },
          { verified: true },
          { followersCount: { gte: 1000 } }
        ]
      },
      take: 5,
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        verified: true,
        followersCount: true
      }
    })

    if (users.length === 0) {
      console.log('⚠️ لا يوجد مستخدمين مؤهلين. سننشئ مستخدم إداري جديد...')
      
      // إنشاء مستخدم إداري جديد
      const adminUser = await prisma.user.create({
        data: {
          username: 'admin_nehky',
          email: 'admin@nehky.com',
          phone: '+966500000001',
          password: 'admin123_secure',
          firstName: 'إداري',
          secondName: 'النظام',
          thirdName: 'الرئيسي',
          lastName: 'نحكي',
          fullName: 'إداري النظام الرئيسي نحكي',
          birthDate: new Date('1990-01-01'),
          gender: 'male',
          role: 'INFLUENCER',
          verified: true,
          followersCount: 100000
        }
      })
      
      users.push(adminUser)
    }

    console.log(`👥 تم العثور على ${users.length} مستخدمين مؤهلين`)

    // إنشاء ملفات إدارية
    const adminsData = [
      {
        userId: users[0].id,
        role: 'SUPER_ADMIN',
        permissions: JSON.stringify({
          keywordManagement: true,
          userManagement: true,
          contentModeration: true,
          systemAdmin: true,
          analytics: true,
          reports: true
        }),
        department: 'system',
        accessLevel: 5,
        notes: 'المدير العام للنظام - جميع الصلاحيات'
      },
      {
        userId: users[1]?.id || users[0].id,
        role: 'ADMIN',
        permissions: JSON.stringify({
          keywordManagement: true,
          userManagement: true,
          contentModeration: true,
          systemAdmin: false,
          analytics: true,
          reports: true
        }),
        department: 'content',
        accessLevel: 4,
        notes: 'إداري المحتوى والكلمات الشائعة'
      },
      {
        userId: users[2]?.id || users[0].id,
        role: 'MODERATOR',
        permissions: JSON.stringify({
          keywordManagement: true,
          userManagement: false,
          contentModeration: true,
          systemAdmin: false,
          analytics: false,
          reports: true
        }),
        department: 'keywords',
        accessLevel: 3,
        notes: 'مشرف الكلمات والاتجاهات'
      }
    ]

    // إدراج الإداريين
    for (const adminData of adminsData) {
      try {
        const admin = await prisma.admin.upsert({
          where: { userId: adminData.userId },
          update: adminData,
          create: adminData
        })
        
        const user = users.find(u => u.id === adminData.userId)
        console.log(`✅ تم إنشاء/تحديث إداري: ${user?.fullName} (${adminData.role})`)
      } catch (error) {
        console.error(`❌ خطأ في إنشاء إداري لـ ${adminData.userId}:`, error)
      }
    }

    // إحصائيات النهائية
    const adminCount = await prisma.admin.count()
    const activeAdminCount = await prisma.admin.count({
      where: { isActive: true }
    })

    console.log('\n📊 إحصائيات الإداريين:')
    console.log(`   👔 إجمالي الإداريين: ${adminCount}`)
    console.log(`   ✅ الإداريين النشطين: ${activeAdminCount}`)
    
    // عرض قائمة الإداريين
    const admins = await prisma.admin.findMany({
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            role: true,
            verified: true
          }
        }
      }
    })

    console.log('\n👥 قائمة الإداريين:')
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.user.fullName} (@${admin.user.username})`)
      console.log(`      الدور: ${admin.role} | القسم: ${admin.department}`)
      console.log(`      مستوى الوصول: ${admin.accessLevel} | نشط: ${admin.isActive ? '✅' : '❌'}`)
      console.log(`      الملاحظات: ${admin.notes}`)
      console.log('')
    })

    console.log('✅ تم إنشاء الإداريين التجريبيين بنجاح!')

  } catch (error) {
    console.error('❌ فشل إنشاء الإداريين التجريبيين:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الـ Script
createTestAdmins()
  .catch((error) => {
    console.error('❌ خطأ في سكريبت إنشاء الإداريين:', error)
    process.exit(1)
  })

export default createTestAdmins
