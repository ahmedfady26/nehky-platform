import { prisma } from '../src/lib/prisma'
import { addPoints } from '../src/lib/points-system'

async function createTestPointsData() {
  console.log('🌱 إنشاء بيانات تجريبية لنظام النقاط...')

  try {
    // إنشاء مستخدمين تجريبيين
    const testUsers = await Promise.all([
      prisma.user.upsert({
        where: { username: 'ahmed_user' },
        update: {},
        create: {
          username: 'ahmed_user',
          email: 'ahmed@test.com',
          phone: '+966501111111',
          password: 'hashed_password',
          firstName: 'أحمد',
          secondName: 'محمد',
          thirdName: 'سالم',
          lastName: 'الأحمد',
          fullName: 'أحمد محمد سالم الأحمد',
          birthDate: new Date('1995-01-01'),
          gender: 'male',
          role: 'USER',
          followersCount: 50
        }
      }),
      prisma.user.upsert({
        where: { username: 'sara_influencer' },
        update: {},
        create: {
          username: 'sara_influencer',
          email: 'sara@test.com',
          phone: '+966502222222',
          password: 'hashed_password',
          firstName: 'سارة',
          secondName: 'أحمد',
          thirdName: 'محمد',
          lastName: 'علي',
          fullName: 'سارة أحمد محمد علي',
          birthDate: new Date('1992-05-15'),
          gender: 'female',
          role: 'INFLUENCER',
          followersCount: 1500,
          verified: true
        }
      }),
      prisma.user.upsert({
        where: { username: 'ali_influencer' },
        update: {},
        create: {
          username: 'ali_influencer',
          email: 'ali@test.com',
          phone: '+966503333333',
          password: 'hashed_password',
          firstName: 'علي',
          secondName: 'محمد',
          thirdName: 'سالم',
          lastName: 'السعدي',
          fullName: 'علي محمد سالم السعدي',
          birthDate: new Date('1988-12-10'),
          gender: 'male',
          role: 'INFLUENCER',
          followersCount: 2200,
          verified: true
        }
      }),
      prisma.user.upsert({
        where: { username: 'fatima_user' },
        update: {},
        create: {
          username: 'fatima_user',
          email: 'fatima@test.com',
          phone: '+966504444444',
          password: 'hashed_password',
          firstName: 'فاطمة',
          secondName: 'عبدالله',
          thirdName: 'أحمد',
          lastName: 'حسن',
          fullName: 'فاطمة عبدالله أحمد حسن',
          birthDate: new Date('1997-03-20'),
          gender: 'female',
          role: 'USER',
          followersCount: 30
        }
      })
    ])

    const [ahmed, sara, ali, fatima] = testUsers
    console.log('✅ تم إنشاء المستخدمين التجريبيين')

    // إنشاء منشورات تجريبية
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          content: 'مرحباً بكم في منصة نحكي! نظام النقاط سيجعل التفاعل أكثر متعة 🎉',
          authorId: sara.id,
          likesCount: 0,
          commentsCount: 0
        }
      }),
      prisma.post.create({
        data: {
          content: 'أفكار جديدة لتطوير المنصة وتحسين تجربة المستخدمين 💡',
          authorId: ali.id,
          likesCount: 0,
          commentsCount: 0
        }
      })
    ])

    console.log('✅ تم إنشاء المنشورات التجريبية')

    // إنشاء تفاعلات وإعجابات
    const likes = await Promise.all([
      prisma.like.create({
        data: {
          userId: ahmed.id,
          postId: posts[0].id
        }
      }),
      prisma.like.create({
        data: {
          userId: fatima.id,
          postId: posts[0].id
        }
      }),
      prisma.like.create({
        data: {
          userId: ahmed.id,
          postId: posts[1].id
        }
      })
    ])

    console.log('✅ تم إنشاء الإعجابات التجريبية')

    // إنشاء تعليقات
    const comments = await Promise.all([
      prisma.comment.create({
        data: {
          content: 'فكرة رائعة! أتطلع لرؤية المزيد من الميزات 👏',
          authorId: ahmed.id,
          postId: posts[0].id
        }
      }),
      prisma.comment.create({
        data: {
          content: 'شكراً لك على المشاركة المفيدة 🙏',
          authorId: fatima.id,
          postId: posts[1].id
        }
      })
    ])

    console.log('✅ تم إنشاء التعليقات التجريبية')

    // إضافة نقاط للتفاعلات
    console.log('🔄 إضافة نقاط للتفاعلات...')

    // نقاط الإعجابات
    await addPoints(ahmed.id, sara.id, 'LIKE', { postId: posts[0].id, likeId: likes[0].id })
    await addPoints(fatima.id, sara.id, 'LIKE', { postId: posts[0].id, likeId: likes[1].id })
    await addPoints(ahmed.id, ali.id, 'LIKE', { postId: posts[1].id, likeId: likes[2].id })

    // نقاط التعليقات
    await addPoints(ahmed.id, sara.id, 'COMMENT', { postId: posts[0].id, commentId: comments[0].id })
    await addPoints(fatima.id, ali.id, 'COMMENT', { postId: posts[1].id, commentId: comments[1].id })

    // نقاط إضافية متنوعة لمحاكاة نشاط متنوع
    const additionalInteractions = [
      // أحمد مع سارة - المزيد من التفاعلات
      { userId: ahmed.id, influencerId: sara.id, type: 'LIKE' as const },
      { userId: ahmed.id, influencerId: sara.id, type: 'COMMENT' as const },
      { userId: ahmed.id, influencerId: sara.id, type: 'LIKE' as const },
      
      // فاطمة مع علي - تفاعلات متنوعة
      { userId: fatima.id, influencerId: ali.id, type: 'LIKE' as const },
      { userId: fatima.id, influencerId: ali.id, type: 'LIKE' as const },
      { userId: fatima.id, influencerId: ali.id, type: 'COMMENT' as const },
      
      // أحمد مع علي - تفاعلات إضافية
      { userId: ahmed.id, influencerId: ali.id, type: 'COMMENT' as const },
      { userId: ahmed.id, influencerId: ali.id, type: 'LIKE' as const },
    ]

    for (const interaction of additionalInteractions) {
      await addPoints(interaction.userId, interaction.influencerId, interaction.type)
      // انتظار قصير لتنويع الأوقات
      await new Date(Date.now() + Math.random() * 1000)
    }

    console.log('✅ تم إضافة نقاط للتفاعلات بنجاح!')

    // إحصائيات النقاط
    const pointsStats = await prisma.point.groupBy({
      by: ['userId', 'influencerId'],
      _sum: {
        points: true
      },
      _count: {
        id: true
      },
      where: {
        isValid: true,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    console.log('\n📊 إحصائيات النقاط:')
    for (const stat of pointsStats) {
      const user = await prisma.user.findUnique({ where: { id: stat.userId } })
      const influencer = await prisma.user.findUnique({ where: { id: stat.influencerId } })
      
      console.log(`👤 ${user?.fullName} -> 🌟 ${influencer?.fullName}: ${stat._sum.points} نقطة (${stat._count.id} تفاعل)`)
    }

    console.log('\n🎯 تم إنشاء جميع البيانات التجريبية بنجاح!')
    console.log('🔍 يمكن الآن اختبار النظام على: http://localhost:3002/points')

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات التجريبية:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestPointsData()
