import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestPostsData() {
  try {
    console.log('🚀 بدء إنشاء بيانات تجريبية للمنشورات...')

    // البحث عن المستخدمين الموجودين
    const users = await prisma.user.findMany({
      take: 3,
      select: { id: true, username: true, fullName: true, role: true }
    })

    if (users.length === 0) {
      console.log('❌ لا توجد مستخدمون في قاعدة البيانات')
      return
    }

    console.log(`✅ تم العثور على ${users.length} مستخدمين`)

    // إنشاء منشورات تجريبية
    const testPosts = [
      {
        content: 'مرحباً بكم في منصة نحكي! 🎉 هذا أول منشور تجريبي يحتوي على #منصة_نحكي #اختبار',
        hashtags: ['#منصة_نحكي', '#اختبار', '#مرحباً'],
        keywords: ['منصة', 'نحكي', 'اختبار'],
        allowComments: true,
        allowLikes: true,
        allowShares: true
      },
      {
        content: 'تجربة المنشورات مع الصور والفيديوهات 📸🎥 #وسائط #تقنية #تطوير',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        videos: ['https://example.com/video1.mp4'],
        hashtags: ['#وسائط', '#تقنية', '#تطوير'],
        keywords: ['صور', 'فيديوهات', 'وسائط'],
        allowComments: true,
        allowLikes: true,
        allowShares: true
      },
      {
        content: 'منشور خاص للمتابعين فقط 🔒 #خاص #متابعين',
        hashtags: ['#خاص', '#متابعين'],
        visibility: 'FOLLOWERS_ONLY',
        allowComments: true,
        allowLikes: false,
        allowShares: false
      },
      {
        content: 'مشاركة مقال مفيد عن التقنية والبرمجة 💻 #برمجة #تعلم #مقالات',
        mediaUrls: ['https://example.com/article.pdf'],
        attachments: ['document.pdf'],
        hashtags: ['#برمجة', '#تعلم', '#مقالات'],
        keywords: ['برمجة', 'تقنية', 'تعلم'],
        location: 'الرياض، السعودية',
        allowComments: true,
        allowLikes: true,
        allowShares: true
      },
      {
        content: 'تجربة منشور مع علامات متنوعة 🏷️ #علامات #تصنيف #تنظيم',
        hashtags: ['#علامات', '#تصنيف', '#تنظيم'],
        tags: ['تجربة', 'اختبار', 'تطوير'],
        keywords: ['علامات', 'تصنيف', 'تنظيم'],
        allowComments: true,
        allowLikes: true,
        allowShares: true
      }
    ]

    // إنشاء المنشورات
    for (let i = 0; i < testPosts.length; i++) {
      const postData = testPosts[i]
      const author = users[i % users.length] // توزيع المنشورات على المستخدمين

      const post = await prisma.post.create({
        data: {
          content: postData.content,
          images: postData.images ? JSON.stringify(postData.images) : null,
          videos: postData.videos ? JSON.stringify(postData.videos) : null,
          attachments: postData.attachments ? JSON.stringify(postData.attachments) : null,
          mediaUrls: postData.mediaUrls ? JSON.stringify(postData.mediaUrls) : null,
          hashtags: JSON.stringify(postData.hashtags),
          keywords: postData.keywords ? JSON.stringify(postData.keywords) : null,
          tags: postData.tags ? JSON.stringify(postData.tags) : null,
          authorId: author.id,
          status: 'PUBLISHED',
          visibility: postData.visibility || 'PUBLIC',
          allowComments: postData.allowComments,
          allowLikes: postData.allowLikes,
          allowShares: postData.allowShares,
          location: postData.location || null,
          publishedAt: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: 'Test Script'
        }
      })

      console.log(`✅ تم إنشاء منشور: ${post.id} بواسطة ${author.fullName}`)

      // إضافة بعض الإعجابات والتعليقات التجريبية
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const liker = users[j % users.length]
        if (liker.id !== author.id) {
          try {
            await prisma.like.create({
              data: {
                userId: liker.id,
                postId: post.id
              }
            })

            // تحديث عداد الإعجابات
            await prisma.post.update({
              where: { id: post.id },
              data: { likesCount: { increment: 1 } }
            })

            console.log(`  👍 إعجاب من ${liker.fullName}`)
          } catch (error) {
            // تجاهل الأخطاء (مثل الإعجاب المكرر)
          }
        }
      }

      // إضافة تعليقات
      for (let k = 0; k < Math.floor(Math.random() * 2) + 1; k++) {
        const commenter = users[k % users.length]
        const comments = [
          'منشور رائع! 👍',
          'شكراً لك على المشاركة 🙏',
          'مفيد جداً، استمر 💪',
          'أحب هذا المحتوى ❤️',
          'رائع، في انتظار المزيد 🔥'
        ]

        const comment = await prisma.comment.create({
          data: {
            content: comments[Math.floor(Math.random() * comments.length)],
            postId: post.id,
            authorId: commenter.id
          }
        })

        // تحديث عداد التعليقات
        await prisma.post.update({
          where: { id: post.id },
          data: { commentsCount: { increment: 1 } }
        })

        console.log(`  💬 تعليق من ${commenter.fullName}`)
      }

      // إضافة مشاهدات
      for (let l = 0; l < Math.floor(Math.random() * 5) + 2; l++) {
        const viewer = users[l % users.length]
        
        await prisma.postView.create({
          data: {
            userId: viewer.id,
            postId: post.id,
            viewType: 'VIEW',
            duration: Math.floor(Math.random() * 60) + 10, // 10-70 ثانية
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Test Browser'
          }
        })

        // تحديث عداد المشاهدات
        await prisma.post.update({
          where: { id: post.id },
          data: { viewsCount: { increment: 1 } }
        })
      }

      console.log(`  👁️ تم إضافة مشاهدات للمنشور`)
    }

    // إنشاء منشور نيابة عن مؤثر (إذا وُجد)
    const influencer = users.find(u => u.role === 'INFLUENCER')
    const topFollower = users.find(u => u.role === 'TOP_FOLLOWER')

    if (influencer && topFollower) {
      const influencerPost = await prisma.post.create({
        data: {
          content: 'منشور من كبير المتابعين نيابة عن المؤثر 🌟 #مؤثر #كبير_متابعين #نيابة',
          hashtags: JSON.stringify(['#مؤثر', '#كبير_متابعين', '#نيابة']),
          authorId: topFollower.id,
          publishedForId: influencer.id,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          allowComments: true,
          allowLikes: true,
          allowShares: true,
          publishedAt: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: 'Test Script'
        }
      })

      console.log(`✅ تم إنشاء منشور نيابة عن المؤثر: ${influencerPost.id}`)

      // إضافة النقاط
      await prisma.point.create({
        data: {
          points: 20,
          type: 'POST',
          userId: topFollower.id,
          influencerId: influencer.id,
          postId: influencerPost.id,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 يوم
          isValid: true
        }
      })

      console.log(`  🎯 تم إضافة 20 نقطة لكبير المتابعين`)
    }

    console.log('\n🎉 تم إنشاء البيانات التجريبية بنجاح!')
    console.log('يمكنك الآن زيارة /test-posts-api لاختبار النظام')

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات التجريبية:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestPostsData()
