// بيانات تجريبية متقدمة للمنصة
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// بيانات المستخدمين المتنوعة
const sampleUsers = [
  {
    fullName: 'سارة أحمد',
    username: 'sara_tech',
    nehkyEmail: 'sara_tech@nehky.com',
    externalEmail: 'sara.ahmed@gmail.com',
    phone: '+201234567891',
    gender: 'FEMALE' as const,
    age: 28,
    bio: 'مطورة تطبيقات ومهتمة بالذكاء الاصطناعي',
    interests: ['البرمجة', 'الذكاء الاصطناعي', 'التصميم'],
    hobbies: ['القراءة', 'الرسم', 'اليوغا'],
  },
  {
    fullName: 'محمد علي',
    username: 'mohamed_writer',
    nehkyEmail: 'mohamed_writer@nehky.com',
    externalEmail: 'mohamed.ali@outlook.com',
    phone: '+201234567892',
    gender: 'MALE' as const,
    age: 32,
    bio: 'كاتب ومحرر محتوى، أحب الأدب والثقافة',
    interests: ['الأدب', 'الكتابة', 'التاريخ'],
    hobbies: ['الكتابة', 'الشطرنج', 'السفر'],
  },
  {
    fullName: 'فاطمة محمود',
    username: 'fatima_cook',
    nehkyEmail: 'fatima_cook@nehky.com',
    externalEmail: 'fatima.mahmoud@yahoo.com',
    phone: '+201234567893',
    gender: 'FEMALE' as const,
    age: 25,
    bio: 'شيف ومدونة طعام، أشارككم وصفاتي المفضلة',
    interests: ['الطبخ', 'التغذية', 'الصحة'],
    hobbies: ['الطبخ', 'التصوير', 'البستنة'],
  },
  {
    fullName: 'أحمد حسن',
    username: 'ahmed_fitness',
    nehkyEmail: 'ahmed_fitness@nehky.com',
    externalEmail: 'ahmed.hassan@gmail.com',
    phone: '+201234567894',
    gender: 'MALE' as const,
    age: 29,
    bio: 'مدرب لياقة بدنية وخبير تغذية',
    interests: ['الرياضة', 'اللياقة البدنية', 'التغذية'],
    hobbies: ['كمال الأجسام', 'الجري', 'السباحة'],
  },
  {
    fullName: 'نور الدين',
    username: 'nour_artist',
    nehkyEmail: 'nour_artist@nehky.com',
    externalEmail: 'nour.eldin@hotmail.com',
    phone: '+201234567895',
    gender: 'MALE' as const,
    age: 26,
    bio: 'فنان رقمي ومصمم جرافيك',
    interests: ['الفن', 'التصميم', 'الإبداع'],
    hobbies: ['الرسم', 'التصوير', 'الموسيقى'],
  },
]

// منشورات متنوعة
const samplePosts = [
  {
    content: 'بدأت اليوم مشروع جديد في تطوير تطبيق للذكاء الاصطناعي! متحمسة جداً لمشاركة التقدم معكم 🚀 #البرمجة #الذكاء_الاصطناعي',
    hashtags: ['البرمجة', 'الذكاء_الاصطناعي', 'مشروع_جديد'],
  },
  {
    content: 'قرأت اليوم رواية رائعة عن تاريخ الحضارة العربية. أنصح الجميع بقراءتها! 📚 #قراءة #أدب #تاريخ',
    hashtags: ['قراءة', 'أدب', 'تاريخ'],
  },
  {
    content: 'وصفة اليوم: كباب الدجاج المشوي مع الخضار 🍗 سأشارك المقادير والطريقة في التعليقات #طبخ #وصفات',
    hashtags: ['طبخ', 'وصفات', 'صحي'],
  },
  {
    content: 'انتهيت من تمرين مكثف اليوم! 💪 لا تنسوا أهمية النشاط البدني للصحة العامة #رياضة #لياقة_بدنية',
    hashtags: ['رياضة', 'لياقة_بدنية', 'صحة'],
  },
  {
    content: 'اكتملت لوحتي الجديدة! أحب استخدام الألوان الدافئة في أعمالي 🎨 #فن #رسم #إبداع',
    hashtags: ['فن', 'رسم', 'إبداع'],
  },
]

// هاشتاجات شائعة
const popularHashtags = [
  'البرمجة', 'الذكاء_الاصطناعي', 'تكنولوجيا', 'تطوير_الويب',
  'أدب', 'قراءة', 'كتابة', 'ثقافة', 'تاريخ',
  'طبخ', 'وصفات', 'صحة', 'تغذية',
  'رياضة', 'لياقة_بدنية', 'كمال_أجسام',
  'فن', 'تصميم', 'رسم', 'إبداع', 'تصوير',
  'سفر', 'طبيعة', 'استكشاف',
  'موسيقى', 'سينما', 'ترفيه',
  'تعليم', 'تطوير_ذاتي', 'نجاح',
  'عائلة', 'أطفال', 'تربية',
  'بيئة', 'استدامة', 'طاقة_متجددة'
]

// الكلمات المفتاحية مع الفئات
const keywordsByCategory = {
  'تكنولوجيا': ['برمجة', 'تطوير', 'ذكاء اصطناعي', 'تعلم آلي', 'بيانات', 'خوارزميات', 'تطبيقات', 'مواقع', 'أمن سيبراني'],
  'أدب وثقافة': ['كتب', 'روايات', 'شعر', 'أدب', 'ثقافة', 'تاريخ', 'فلسفة', 'نقد', 'مؤلفين'],
  'طبخ وطعام': ['وصفات', 'طبخ', 'مأكولات', 'حلويات', 'مشروبات', 'تغذية', 'دايت', 'صحي'],
  'رياضة وصحة': ['تمارين', 'لياقة', 'كمال أجسام', 'جري', 'سباحة', 'يوغا', 'صحة', 'طب'],
  'فن وإبداع': ['رسم', 'تصوير', 'تصميم', 'موسيقى', 'رقص', 'مسرح', 'سينما', 'نحت'],
}

async function createAdvancedSeedData() {
  console.log('🌱 بدء إنشاء البيانات التجريبية المتقدمة...')

  try {
    // إنشاء المستخدمين
    const createdUsers = []
    for (const userData of sampleUsers) {
      try {
        const user = await prisma.user.create({
          data: {
            ...userData,
            passwordHash: '$2b$10$examplehashedpassword',
            graduationYear: 2020,
            certificate: 'بكالوريوس',
            nationality: 'مصري',
            countryOfOrigin: 'مصر',
            countryOfResidence: 'مصر',
            role: 'NORMAL',
            isVerified: Math.random() > 0.5, // 50% من المستخدمين مُوثقين
          },
        })
        createdUsers.push(user)
        console.log(`✅ تم إنشاء المستخدم: ${user.username}`)
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`⚠️ المستخدم ${userData.username} موجود بالفعل`)
          const existingUser = await prisma.user.findUnique({
            where: { username: userData.username }
          })
          if (existingUser) createdUsers.push(existingUser)
        } else {
          throw error
        }
      }
    }

    // إنشاء الهاشتاجات الشائعة
    console.log('📌 إنشاء الهاشتاجات...')
    for (const hashtagName of popularHashtags) {
      await prisma.hashtag.upsert({
        where: { name: hashtagName },
        update: { usageCount: { increment: 1 } },
        create: {
          name: hashtagName,
          usageCount: Math.floor(Math.random() * 100) + 1,
          trendScore: Math.random() * 10,
          dailyUsage: Math.floor(Math.random() * 20),
          weeklyUsage: Math.floor(Math.random() * 100),
        },
      })
    }

    // إنشاء الكلمات المفتاحية
    console.log('🔑 إنشاء الكلمات المفتاحية...')
    for (const [category, keywords] of Object.entries(keywordsByCategory)) {
      for (const keyword of keywords) {
        try {
          // التحقق من وجود الكلمة المفتاحية أولاً
          const existingKeyword = await prisma.keyword.findFirst({
            where: { keyword, category }
          })

          if (existingKeyword) {
            // تحديث الكلمة المفتاحية الموجودة
            await prisma.keyword.update({
              where: { id: existingKeyword.id },
              data: { usageCount: { increment: 1 } }
            })
            console.log(`🔄 تحديث الكلمة المفتاحية: ${keyword}`)
          } else {
            // إنشاء كلمة مفتاحية جديدة
            await prisma.keyword.create({
              data: {
                keyword,
                weight: Math.random() * 2 + 0.5, // وزن بين 0.5 و 2.5
                category,
                sentiment: (Math.random() - 0.5) * 2, // قيمة بين -1 و 1
                language: 'ar',
                usageCount: Math.floor(Math.random() * 50) + 1,
              }
            })
            console.log(`✅ إنشاء الكلمة المفتاحية: ${keyword}`)
          }
        } catch (error: any) {
          console.log(`⚠️ خطأ في إنشاء الكلمة المفتاحية ${keyword}: ${error.message}`)
        }
      }
    }

    // إنشاء المنشورات
    console.log('📝 إنشاء المنشورات...')
    const createdPosts = []
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i]
      const author = createdUsers[i % createdUsers.length]

      const post = await prisma.post.create({
        data: {
          content: postData.content,
          userId: author.id,
          visibility: 'PUBLIC',
          likesCount: Math.floor(Math.random() * 50),
          commentsCount: Math.floor(Math.random() * 20),
          sharesCount: Math.floor(Math.random() * 10),
          viewsCount: Math.floor(Math.random() * 200) + 50,
        },
      })

      // ربط الهاشتاجات بالمنشور
      for (const hashtagName of postData.hashtags) {
        const hashtag = await prisma.hashtag.findUnique({
          where: { name: hashtagName }
        })
        
        if (hashtag) {
          await prisma.postHashtag.create({
            data: {
              postId: post.id,
              hashtagId: hashtag.id,
            },
          })
        }
      }

      createdPosts.push(post)
      console.log(`✅ تم إنشاء المنشور: ${post.content.substring(0, 30)}...`)
    }

    // إنشاء ملفات الاهتمامات للمستخدمين
    console.log('🎯 إنشاء ملفات الاهتمامات...')
    for (const user of createdUsers) {
      // إنشاء ملف الاهتمامات الأساسي
      const profile = await prisma.userInterestProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          profileVersion: 1,
          nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          overallConfidence: Math.random() * 0.5 + 0.5,
          dataQuality: Math.random() * 0.3 + 0.7,
          profileCompleteness: Math.random() * 0.4 + 0.6,
          totalInteractions: Math.floor(Math.random() * 100) + 10,
          uniqueInterests: user.interests.length,
          dominantCategories: ['تكنولوجيا', 'أدب', 'رياضة'].slice(0, Math.floor(Math.random() * 3) + 1),
          topInterests: {
            interests: user.interests.map((interest, index) => ({
              name: interest,
              score: 90 - index * 10,
              confidence: 0.8 + Math.random() * 0.2,
              trend: ['RISING', 'STABLE', 'EMERGING'][Math.floor(Math.random() * 3)]
            }))
          },
          interestCategories: {
            categories: Object.keys(keywordsByCategory).slice(0, 3).map(cat => ({
              name: cat,
              score: Math.floor(Math.random() * 40) + 60,
              count: Math.floor(Math.random() * 5) + 1
            }))
          },
          interestTrends: {
            emerging: user.interests.slice(0, 2),
            rising: user.interests.slice(1, 3),
            stable: user.interests.slice(0, 1),
            declining: []
          },
          behaviorPattern: ['FOCUSED', 'DIVERSE', 'EXPLORER', 'BALANCED'][Math.floor(Math.random() * 4)] as any,
          engagementStyle: ['ACTIVE', 'PASSIVE', 'CREATOR', 'SOCIAL'][Math.floor(Math.random() * 4)] as any,
          contentPreference: ['MIXED', 'TEXT_HEAVY', 'VISUAL'][Math.floor(Math.random() * 3)] as any,
          recommendationWeight: Math.random() * 0.5 + 0.5,
          exploreVsExploit: Math.random() * 0.4 + 0.5,
          diversityScore: Math.random() * 0.5 + 0.3,
          stabilityScore: Math.random() * 0.4 + 0.6,
          updateFrequency: 'WEEKLY',
          autoUpdateEnabled: true,
        },
      })

      // إنشاء درجات الاهتمامات التفصيلية
      for (const interest of user.interests) {
        await prisma.userInterestScore.upsert({
          where: {
            userId_interestName: {
              userId: user.id,
              interestName: interest,
            },
          },
          update: {},
          create: {
            userId: user.id,
            interestName: interest,
            currentScore: Math.floor(Math.random() * 40) + 60,
            rawScore: Math.floor(Math.random() * 40) + 60,
            normalizedScore: (Math.random() * 0.4 + 0.6),
            weightedScore: Math.floor(Math.random() * 40) + 60,
            category: Object.keys(keywordsByCategory)[Math.floor(Math.random() * Object.keys(keywordsByCategory).length)],
            subcategory: 'عام',
            keywords: [interest, ...user.hobbies.slice(0, 2)],
            confidence: Math.random() * 0.3 + 0.7,
            sources: ['INTERACTION', 'PROFILE', 'HASHTAG'],
            sourceWeights: { 'INTERACTION': 1.0, 'PROFILE': 0.8, 'HASHTAG': 0.6 },
            primarySource: 'INTERACTION',
            totalInteractions: Math.floor(Math.random() * 30) + 5,
            recentInteractions: Math.floor(Math.random() * 10) + 1,
            trendDirection: ['RISING', 'STABLE', 'EMERGING'][Math.floor(Math.random() * 3)] as any,
            trendStrength: Math.random() * 0.5,
            momentum: Math.random() * 0.3,
            volatility: Math.random() * 0.2,
            status: 'ACTIVE',
            isCore: Math.random() > 0.7,
            isEmerging: Math.random() > 0.8,
            isFading: false,
            relatedPosts: createdPosts.slice(0, 2).map(p => p.id),
            relatedUsers: createdUsers.slice(0, 2).map(u => u.id),
            relatedHashtags: [interest],
            nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }

      console.log(`✅ تم إنشاء ملف الاهتمامات للمستخدم: ${user.username}`)
    }

    // إنشاء بعض التفاعلات
    console.log('❤️ إنشاء التفاعلات...')
    for (const post of createdPosts) {
      const randomUsers = createdUsers.sort(() => 0.5 - Math.random()).slice(0, 3)
      
      for (const user of randomUsers) {
        if (user.id !== post.userId) { // لا يمكن للمستخدم التفاعل مع منشوره
          await prisma.interaction.create({
            data: {
              postId: post.id,
              userId: user.id,
              type: ['LIKE', 'COMMENT', 'SHARE'][Math.floor(Math.random() * 3)] as any,
              content: Math.random() > 0.7 ? 'تعليق رائع! شكراً للمشاركة 👍' : null,
            },
          })
        }
      }
    }

    // إنشاء بعض الإشعارات
    console.log('🔔 إنشاء الإشعارات...')
    for (const user of createdUsers.slice(0, 3)) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'LIKE',
          title: 'إعجاب جديد',
          message: 'أعجب أحدهم بمنشورك الأخير!',
          dataJson: JSON.stringify({ postId: createdPosts[0].id }),
        },
      })

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'FOLLOW',
          title: 'متابع جديد',
          message: 'انضم إليك متابع جديد!',
        },
      })
    }

    console.log('🎉 تم إنشاء البيانات التجريبية المتقدمة بنجاح!')
    console.log(`👥 المستخدمون: ${createdUsers.length}`)
    console.log(`📝 المنشورات: ${createdPosts.length}`)
    console.log(`📌 الهاشتاجات: ${popularHashtags.length}`)
    console.log(`🔑 الكلمات المفتاحية: ${Object.values(keywordsByCategory).flat().length}`)

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات:', error)
    throw error
  }
}

// تشغيل السكريبت إذا تم استدعاؤه مباشرة
if (require.main === module) {
  createAdvancedSeedData()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}

export { createAdvancedSeedData }
