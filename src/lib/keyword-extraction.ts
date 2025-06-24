import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ExtractedKeyword {
  keyword: string
  normalizedKeyword: string
  type: 'HASHTAG' | 'KEYWORD' | 'MENTION'
  position: number
  context: string
}

/**
 * استخراج الكلمات الشائعة من النص
 */
export function extractKeywordsFromText(text: string): ExtractedKeyword[] {
  const extracted: ExtractedKeyword[] = []
  
  // استخراج الهاشتاج
  const hashtagRegex = /#[\u0600-\u06FFa-zA-Z0-9_]+/g
  let match
  while ((match = hashtagRegex.exec(text)) !== null) {
    const keyword = match[0]
    const position = match.index
    const context = getContext(text, position, keyword.length)
    
    extracted.push({
      keyword,
      normalizedKeyword: keyword.substring(1).toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ''),
      type: 'HASHTAG',
      position,
      context
    })
  }
  
  // استخراج المنشن
  const mentionRegex = /@[\u0600-\u06FFa-zA-Z0-9_]+/g
  while ((match = mentionRegex.exec(text)) !== null) {
    const keyword = match[0]
    const position = match.index
    const context = getContext(text, position, keyword.length)
    
    extracted.push({
      keyword,
      normalizedKeyword: keyword.substring(1).toLowerCase(),
      type: 'MENTION',
      position,
      context
    })
  }
  
  // استخراج الكلمات المفتاحية المهمة
  const importantKeywords = [
    'نحكي', 'منصة', 'تقنية', 'برمجة', 'تطوير', 'ذكي', 'اصطناعي', 
    'تحدي', 'نجاح', 'مستقبل', 'تعليم', 'صحة', 'رياضة', 'سفر', 'طبخ'
  ]
  
  for (const keyword of importantKeywords) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi')
    while ((match = keywordRegex.exec(text)) !== null) {
      const position = match.index
      const context = getContext(text, position, keyword.length)
      
      extracted.push({
        keyword: match[0],
        normalizedKeyword: keyword.toLowerCase(),
        type: 'KEYWORD',
        position,
        context
      })
    }
  }
  
  return extracted
}

/**
 * الحصول على السياق المحيط بالكلمة
 */
function getContext(text: string, position: number, keywordLength: number): string {
  const contextLength = 50
  const start = Math.max(0, position - contextLength)
  const end = Math.min(text.length, position + keywordLength + contextLength)
  return text.substring(start, end)
}

/**
 * تحديد مشاعر الكلمة بناءً على السياق
 */
function determineSentiment(keyword: string, context: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
  const positiveWords = ['رائع', 'ممتاز', 'جميل', 'مذهل', 'نجح', 'تطور', 'فرح', 'سعيد', 'أحب']
  const negativeWords = ['سيء', 'فشل', 'خطأ', 'مشكلة', 'حزين', 'غضب', 'أكره', 'مرض']
  
  const lowerContext = context.toLowerCase()
  
  const positiveScore = positiveWords.reduce((score, word) => {
    return score + (lowerContext.includes(word) ? 1 : 0)
  }, 0)
  
  const negativeScore = negativeWords.reduce((score, word) => {
    return score + (lowerContext.includes(word) ? 1 : 0)
  }, 0)
  
  if (positiveScore > negativeScore) return 'POSITIVE'
  if (negativeScore > positiveScore) return 'NEGATIVE'
  return 'NEUTRAL'
}

/**
 * تحديد فئة الكلمة
 */
function determineCategory(keyword: string, normalizedKeyword: string): string {
  const categories = {
    'تقنية': ['تقنية', 'برمجة', 'ذكي', 'اصطناعي', 'AI', 'technology', 'programming'],
    'رياضة': ['رياضة', 'كرة', 'قدم', 'سباحة', 'جري', 'تمرين'],
    'تعليم': ['تعليم', 'مدرسة', 'جامعة', 'دراسة', 'كتاب', 'تعلم'],
    'صحة': ['صحة', 'طب', 'مرض', 'علاج', 'دواء', 'مستشفى'],
    'سفر': ['سفر', 'رحلة', 'طيران', 'فندق', 'سياحة'],
    'طبخ': ['طبخ', 'طعام', 'وصفة', 'مطبخ', 'أكل'],
    'منصة': ['نحكي', 'منصة', 'تطبيق', 'موقع']
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => normalizedKeyword.includes(kw.toLowerCase()))) {
      return category
    }
  }
  
  return 'عام'
}

/**
 * إضافة تكرارات الكلمات لمنشور معين
 */
export async function addKeywordOccurrencesForPost(
  postId: string,
  userId: string,
  content: string,
  postData?: any
): Promise<number> {
  try {
    // استخراج الكلمات من النص
    const extractedKeywords = extractKeywordsFromText(content)
    
    if (extractedKeywords.length === 0) {
      return 0
    }
    
    // الحصول على معلومات المنشور والمستخدم
    const [post, user] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          status: true,
          visibility: true,
          createdAt: true,
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
          viewsCount: true
        }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          verified: true,
          followersCount: true
        }
      })
    ])
    
    if (!post || !user) {
      throw new Error('المنشور أو المستخدم غير موجود')
    }
    
    // البحث عن الكلمات الشائعة الموجودة
    const normalizedKeywords = extractedKeywords.map(k => k.normalizedKeyword)
    const trendingKeywords = await prisma.trendingKeyword.findMany({
      where: {
        normalizedKeyword: {
          in: normalizedKeywords
        }
      }
    })
    
    // تحضير البيانات للإدراج
    const occurrencesData = extractedKeywords.map(extracted => {
      const relatedTrendingKeyword = trendingKeywords.find(tk => 
        tk.normalizedKeyword === extracted.normalizedKeyword
      )
      
      const sentiment = determineSentiment(extracted.keyword, extracted.context)
      const category = determineCategory(extracted.keyword, extracted.normalizedKeyword)
      const language = /[\u0600-\u06FF]/.test(extracted.keyword) ? 'AR' : 'EN'
      
      return {
        keyword: extracted.keyword,
        normalizedKeyword: extracted.normalizedKeyword,
        type: extracted.type,
        position: extracted.position,
        context: extracted.context,
        postId: post.id,
        userId: user.id,
        trendingKeywordId: relatedTrendingKeyword?.id || null,
        sentiment,
        language,
        category,
        postStatus: post.status,
        postVisibility: post.visibility,
        authorRole: user.role,
        authorVerified: user.verified,
        authorFollowers: user.followersCount,
        extractedBy: 'SYSTEM',
        occurredAt: postData?.createdAt || post.createdAt,
        isOriginalPost: true,
        interactionData: JSON.stringify({
          likes: post.likesCount,
          comments: post.commentsCount,
          shares: post.sharesCount,
          views: post.viewsCount
        })
      }
    })
    
    // إدراج التكرارات في قاعدة البيانات
    await prisma.keywordOccurrence.createMany({
      data: occurrencesData
    })
    
    console.log(`✅ تم إضافة ${occurrencesData.length} تكرار كلمة للمنشور ${postId}`)
    
    return occurrencesData.length
    
  } catch (error) {
    console.error('خطأ في إضافة تكرارات الكلمات:', error)
    throw error
  }
}

/**
 * حفظ تكرارات الكلمات في قاعدة البيانات
 */
export async function saveKeywordOccurrencesToDb(
  extractedKeywords: ExtractedKeyword[],
  postId: string,
  userId: string,
  extractedBy = 'AUTO_POST_CREATION'
): Promise<void> {
  try {
    console.log(`🔄 حفظ ${extractedKeywords.length} تكرار كلمة للمنشور ${postId}`)

    // الحصول على معلومات المستخدم والمنشور
    const [user, post] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          verified: true,
          followersCount: true
        }
      }),
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          content: true,
          createdAt: true
        }
      })
    ])

    if (!user || !post) {
      throw new Error('المستخدم أو المنشور غير موجود')
    }

    // إعداد البيانات للحفظ
    const keywordOccurrences = extractedKeywords.map(kw => ({
      keyword: kw.keyword,
      normalizedKeyword: kw.normalizedKeyword,
      type: kw.type,
      position: kw.position,
      context: kw.context,
      sentiment: determineSentiment(kw.keyword, kw.context),
      language: 'ar',
      category: determineCategory(kw.keyword, kw.normalizedKeyword),
      authorRole: user.role,
      authorVerified: user.verified,
      authorFollowers: user.followersCount,
      extractedBy: extractedBy,
      occurredAt: post.createdAt,
      postId: postId,
      userId: userId
    }))

    // حفظ البيانات في دفعات
    const batchSize = 50
    for (let i = 0; i < keywordOccurrences.length; i += batchSize) {
      const batch = keywordOccurrences.slice(i, i + batchSize)
      await prisma.keywordOccurrence.createMany({
        data: batch
      })
    }

    console.log(`✅ تم حفظ ${keywordOccurrences.length} تكرار كلمة بنجاح`)

    // تحديث الكلمات الشائعة
    await updateTrendingKeywordsFromOccurrences()

  } catch (error) {
    console.error('خطأ في حفظ تكرارات الكلمات:', error)
    throw error
  }
}

/**
 * إعادة معالجة تكرارات الكلمات لجميع المنشورات
 */
export async function reprocessAllPostsKeywords(): Promise<void> {
  try {
    console.log('🔄 بدء إعادة معالجة تكرارات الكلمات لجميع المنشورات...')
    
    // حذف جميع التكرارات الموجودة
    await prisma.keywordOccurrence.deleteMany({})
    console.log('🗑️  تم حذف جميع التكرارات الموجودة')
    
    // الحصول على جميع المنشورات
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        content: true,
        authorId: true,
        createdAt: true
      }
    })
    
    console.log(`📄 تم العثور على ${posts.length} منشور`)
    
    let totalOccurrences = 0
    
    // معالجة كل منشور
    for (const post of posts) {
      const occurrencesCount = await addKeywordOccurrencesForPost(
        post.id,
        post.authorId,
        post.content,
        { createdAt: post.createdAt }
      )
      totalOccurrences += occurrencesCount
    }
    
    console.log(`✅ تم معالجة ${posts.length} منشور وإضافة ${totalOccurrences} تكرار كلمة`)
    
  } catch (error) {
    console.error('خطأ في إعادة معالجة تكرارات الكلمات:', error)
    throw error
  }
}

/**
 * تحديث الكلمات الشائعة بناءً على التكرارات
 */
export async function updateTrendingKeywordsFromOccurrences(): Promise<void> {
  try {
    console.log('📈 تحديث الكلمات الشائعة بناءً على التكرارات...')
    
    // إحصائيات التكرارات حسب الكلمة
    const keywordStats = await prisma.keywordOccurrence.groupBy({
      by: ['normalizedKeyword', 'type', 'category'],
      _count: {
        id: true
      },
      _max: {
        occurredAt: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })
    
    console.log(`📊 تم العثور على ${keywordStats.length} كلمة فريدة`)
    
    // تحديث أو إنشاء الكلمات الشائعة
    for (const stat of keywordStats.slice(0, 50)) { // أفضل 50 كلمة
      const keyword = stat.type === 'HASHTAG' ? `#${stat.normalizedKeyword}` : stat.normalizedKeyword
      
      await prisma.trendingKeyword.upsert({
        where: {
          keyword: keyword
        },
        update: {
          totalUsage: stat._count.id,
          lastUsedAt: stat._max.occurredAt,
          lastCalculatedAt: new Date()
        },
        create: {
          keyword: keyword,
          normalizedKeyword: stat.normalizedKeyword,
          type: stat.type,
          category: stat.category || 'عام',
          totalUsage: stat._count.id,
          lastUsedAt: stat._max.occurredAt,
          firstSeenAt: stat._max.occurredAt || new Date()
        }
      })
    }
    
    console.log('✅ تم تحديث الكلمات الشائعة بنجاح')
    
  } catch (error) {
    console.error('خطأ في تحديث الكلمات الشائعة:', error)
    throw error
  }
}
