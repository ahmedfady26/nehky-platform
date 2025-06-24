import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // تشفير كلمة المرور الافتراضية للاختبار
  const defaultPassword = await bcrypt.hash('123456789', 10)
  
  // إنشاء مستخدمين للاختبار
  const user1 = await prisma.user.create({
    data: {
      username: 'ahmed_mohamed',
      email: 'ahmed@nehky.com',
      phone: '+966501234567',
      firstName: 'أحمد',
      secondName: 'محمد',
      thirdName: 'سالم',        // أصبح مطلوباً
      lastName: 'الأحمد',
      fullName: 'أحمد محمد سالم الأحمد',
      password: defaultPassword,
      birthDate: new Date('1996-01-15'), // عمر 28 سنة
      age: 28,
      gender: 'male',           // تغيير إلى القيم الجديدة
      nationality: 'سعودي',
      birthCountry: 'السعودية',
      currentCountry: 'السعودية',
      role: 'INFLUENCER',
      followersCount: 2500,
      followingCount: 150,
      verified: true,
      hobbies: JSON.stringify(['القراءة', 'الرياضة', 'البرمجة']),
      interests: JSON.stringify(['التكنولوجيا', 'الذكاء الاصطناعي', 'ريادة الأعمال'])
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'sara_ali',
      email: 'sara@nehky.com',
      phone: '+966509876543',
      firstName: 'سارة',
      secondName: 'أحمد',       // أصبح مطلوباً
      thirdName: 'محمد',        // أصبح مطلوباً
      lastName: 'علي',
      fullName: 'سارة أحمد محمد علي',
      password: defaultPassword,
      birthDate: new Date('1999-03-22'), // عمر 25 سنة
      age: 25,
      gender: 'female',         // تغيير إلى القيم الجديدة
      nationality: 'مصرية',
      birthCountry: 'مصر',
      currentCountry: 'الإمارات',
      role: 'USER',
      followersCount: 450,
      followingCount: 320,
      verified: true,
      hobbies: JSON.stringify(['الطبخ', 'السفر', 'التصوير']),
      interests: JSON.stringify(['الطعام', 'الثقافة', 'الفن'])
    }
  })

  const user3 = await prisma.user.create({
    data: {
      username: 'omar_hassan',
      email: 'omar@nehky.com',
      phone: '+966555666777',
      firstName: 'عمر',
      secondName: 'خالد',       // أصبح مطلوباً
      thirdName: 'عبدالله',     // أصبح مطلوباً
      lastName: 'حسن',
      fullName: 'عمر خالد عبدالله حسن',
      password: defaultPassword,
      birthDate: new Date('1994-07-10'), // عمر 30 سنة
      age: 30,
      gender: 'male',           // تغيير إلى القيم الجديدة
      nationality: 'لبناني',
      birthCountry: 'لبنان',
      currentCountry: 'قطر',
      role: 'USER',
      followersCount: 180,
      followingCount: 250,
      verified: true,
      hobbies: JSON.stringify(['كرة القدم', 'الموسيقى']),
      interests: JSON.stringify(['الرياضة', 'الموسيقى'])
    }
  })

  // إنشاء علاقات متابعة
  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: user3.id,
      followingId: user1.id
    }
  })

  // إنشاء منشورات
  const post1 = await prisma.post.create({
    data: {
      content: 'مرحباً بكم في منصة نحكي! 🎉 نسعى لبناء مجتمع عربي متفاعل ومفيد للجميع.',
      authorId: user1.id,
      likesCount: 25,
      commentsCount: 8
    }
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'تجربة رائعة مع نظام كبار المتابعين الجديد في نحكي! يمكن للمتابعين المميزين المشاركة في إنشاء المحتوى.',
      authorId: user1.id,
      likesCount: 42,
      commentsCount: 15
    }
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'شاركوني تجاربكم في التكنولوجيا والذكاء الاصطناعي! 🤖💻',
      authorId: user2.id,
      likesCount: 18,
      commentsCount: 6
    }
  })

  // إنشاء تعليقات
  await prisma.comment.create({
    data: {
      content: 'منصة رائعة! أتطلع لرؤية المزيد من الميزات الجديدة 👏',
      postId: post1.id,
      authorId: user2.id
    }
  })

  await prisma.comment.create({
    data: {
      content: 'فكرة نظام كبار المتابعين مبتكرة جداً! شكراً لكم 🙏',
      postId: post2.id,
      authorId: user3.id
    }
  })

  // إنشاء إعجابات
  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id
    }
  })

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post1.id
    }
  })

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post2.id
    }
  })

  // إنشاء نقاط
  const pointsExpiryDate = new Date()
  pointsExpiryDate.setDate(pointsExpiryDate.getDate() + 14) // 14 يوم من الآن

  await prisma.point.create({
    data: {
      points: 5,
      type: 'LIKE',
      userId: user2.id,
      influencerId: user1.id,
      postId: post1.id,
      expiresAt: pointsExpiryDate,
      isValid: true
    }
  })

  await prisma.point.create({
    data: {
      points: 10,
      type: 'COMMENT',
      userId: user2.id,
      influencerId: user1.id,
      postId: post1.id,
      expiresAt: pointsExpiryDate,
      isValid: true
    }
  })

  // إنشاء ترشيح
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

  await prisma.nomination.create({
    data: {
      influencerId: user1.id,
      nominatedId: user2.id,
      status: 'ACCEPTED',
      expiresAt: twoWeeksFromNow
    }
  })

  console.log('✅ تم إنشاء البيانات الأولية بنجاح!')
  console.log(`👤 مستخدم 1: ${user1.fullName} (@${user1.username}) - ${user1.role}`)
  console.log(`👤 مستخدم 2: ${user2.fullName} (@${user2.username}) - ${user2.role}`)
  console.log(`👤 مستخدم 3: ${user3.fullName} (@${user3.username}) - ${user3.role}`)
  console.log(`📝 تم إنشاء ${3} منشورات`)
  console.log(`💬 تم إنشاء ${2} تعليقات`)
  console.log(`❤️ تم إنشاء ${3} إعجابات`)
  console.log(`⭐ تم إنشاء ${2} نقاط`)
  console.log(`🏆 تم إنشاء ${1} ترشيح`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
