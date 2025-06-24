import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createKeywordOccurrencesTestData() {
  console.log('🔗 إنشاء بيانات اختبار لجدول تكرارات الكلمات...')

  try {
    // احصل على بعض المنشورات والمستخدمين والكلمات الشائعة الموجودة
    const posts = await prisma.post.findMany({
      take: 10,
      include: {
        author: true
      }
    })

    const trendingKeywords = await prisma.trendingKeyword.findMany({
      take: 20
    })

    console.log(`📄 تم العثور على ${posts.length} منشورات`)
    console.log(`🔥 تم العثور على ${trendingKeywords.length} كلمة شائعة`)

    const keywordOccurrences = []

    for (const post of posts) {
      // استخرج الكلمات من محتوى المنشور
      const content = post.content
      const words = content.split(/\s+/)
      
      // ابحث عن الهاشتاج والكلمات المفتاحية
      const hashtags = content.match(/#[\u0600-\u06FFa-zA-Z0-9_]+/g) || []
      const mentions = content.match(/@[\u0600-\u06FFa-zA-Z0-9_]+/g) || []
      
      // معالجة الهاشتاج
      for (const hashtag of hashtags) {
        const position = content.indexOf(hashtag)
        const contextStart = Math.max(0, position - 50)
        const contextEnd = Math.min(content.length, position + hashtag.length + 50)
        const context = content.substring(contextStart, contextEnd)
        
        // ابحث عن الكلمة الشائعة المقابلة
        const relatedKeyword = trendingKeywords.find(tk => 
          tk.keyword.toLowerCase() === hashtag.toLowerCase() ||
          tk.normalizedKeyword === hashtag.substring(1).toLowerCase()
        )

        keywordOccurrences.push({
          keyword: hashtag,
          normalizedKeyword: hashtag.substring(1).toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ''),
          type: 'HASHTAG',
          position: position,
          context: context,
          postId: post.id,
          userId: post.authorId,
          trendingKeywordId: relatedKeyword?.id || null,
          sentiment: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'][Math.floor(Math.random() * 3)],
          language: /[\u0600-\u06FF]/.test(hashtag) ? 'AR' : 'EN',
          category: relatedKeyword?.category || 'عام',
          postStatus: post.status,
          postVisibility: post.visibility,
          authorRole: post.author.role,
          authorVerified: post.author.verified,
          authorFollowers: post.author.followersCount,
          extractedBy: 'SYSTEM',
          occurredAt: post.createdAt,
          isOriginalPost: true,
          interactionData: JSON.stringify({
            likes: post.likesCount,
            comments: post.commentsCount,
            shares: post.sharesCount,
            views: post.viewsCount
          })
        })
      }

      // معالجة المنشن (mentions)
      for (const mention of mentions) {
        const position = content.indexOf(mention)
        const contextStart = Math.max(0, position - 50)
        const contextEnd = Math.min(content.length, position + mention.length + 50)
        const context = content.substring(contextStart, contextEnd)

        keywordOccurrences.push({
          keyword: mention,
          normalizedKeyword: mention.substring(1).toLowerCase(),
          type: 'MENTION',
          position: position,
          context: context,
          postId: post.id,
          userId: post.authorId,
          trendingKeywordId: null,
          sentiment: 'NEUTRAL',
          language: /[\u0600-\u06FF]/.test(mention) ? 'AR' : 'EN',
          category: 'منشن',
          postStatus: post.status,
          postVisibility: post.visibility,
          authorRole: post.author.role,
          authorVerified: post.author.verified,
          authorFollowers: post.author.followersCount,
          extractedBy: 'SYSTEM',
          occurredAt: post.createdAt,
          isOriginalPost: true
        })
      }

      // إضافة بعض الكلمات المفتاحية من النص
      const importantWords = ['نحكي', 'منصة', 'تقنية', 'برمجة', 'تطوير', 'ذكي', 'اصطناعي', 'تحدي', 'نجاح', 'مستقبل']
      for (const word of importantWords) {
        if (content.includes(word)) {
          const position = content.indexOf(word)
          const contextStart = Math.max(0, position - 50)
          const contextEnd = Math.min(content.length, position + word.length + 50)
          const context = content.substring(contextStart, contextEnd)

          const relatedKeyword = trendingKeywords.find(tk => 
            tk.normalizedKeyword === word.toLowerCase()
          )

          keywordOccurrences.push({
            keyword: word,
            normalizedKeyword: word.toLowerCase(),
            type: 'KEYWORD',
            position: position,
            context: context,
            postId: post.id,
            userId: post.authorId,
            trendingKeywordId: relatedKeyword?.id || null,
            sentiment: ['POSITIVE', 'NEUTRAL'][Math.floor(Math.random() * 2)],
            language: 'AR',
            category: relatedKeyword?.category || 'عام',
            postStatus: post.status,
            postVisibility: post.visibility,
            authorRole: post.author.role,
            authorVerified: post.author.verified,
            authorFollowers: post.author.followersCount,
            extractedBy: 'SYSTEM',
            occurredAt: post.createdAt,
            isOriginalPost: true
          })
        }
      }
    }

    console.log(`💾 إنشاء ${keywordOccurrences.length} تكرار كلمة...`)

    // إدراج البيانات في دفعات
    const batchSize = 50
    for (let i = 0; i < keywordOccurrences.length; i += batchSize) {
      const batch = keywordOccurrences.slice(i, i + batchSize)
      await prisma.keywordOccurrence.createMany({
        data: batch
      })
      console.log(`✅ تم إدراج دفعة ${Math.floor(i / batchSize) + 1} (${batch.length} عنصر)`)
    }

    // إحصائيات نهائية
    const totalOccurrences = await prisma.keywordOccurrence.count()
    const hashtags = await prisma.keywordOccurrence.count({
      where: { type: 'HASHTAG' }
    })
    const keywords = await prisma.keywordOccurrence.count({
      where: { type: 'KEYWORD' }
    })
    const mentions = await prisma.keywordOccurrence.count({
      where: { type: 'MENTION' }
    })

    console.log('📊 إحصائيات تكرارات الكلمات:')
    console.log(`   💫 إجمالي التكرارات: ${totalOccurrences}`)
    console.log(`   🏷️  الهاشتاج: ${hashtags}`)
    console.log(`   🔑 الكلمات المفتاحية: ${keywords}`)
    console.log(`   📢 المنشن: ${mentions}`)

    console.log('✅ تم إنشاء بيانات اختبار تكرارات الكلمات بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في إنشاء بيانات اختبار تكرارات الكلمات:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الـ Script
createKeywordOccurrencesTestData()
  .catch((error) => {
    console.error('❌ فشل إنشاء بيانات اختبار تكرارات الكلمات:', error)
    process.exit(1)
  })

export default createKeywordOccurrencesTestData
