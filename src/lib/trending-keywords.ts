import { prisma } from './prisma'

/**
 * استخراج وتحديث الكلمات الشائعة من المحتوى
 */
export async function extractAndUpdateKeywords(
  content: string,
  postId?: string,
  userId?: string
): Promise<string[]> {
  try {
    const extractedKeywords: string[] = []
    
    // استخراج الهاشتاج
    const hashtagRegex = /#[\u0600-\u06FFa-zA-Z0-9_\u0660-\u0669]+/g
    const hashtags = content.match(hashtagRegex) || []
    
    // استخراج المنشن
    const mentionRegex = /@[\u0600-\u06FFa-zA-Z0-9_\u0660-\u0669]+/g
    const mentions = content.match(mentionRegex) || []
    
    // استخراج الكلمات المفتاحية (كلمات أكثر من 3 أحرف)
    const wordRegex = /[\u0600-\u06FFa-zA-Z0-9\u0660-\u0669]{3,}/g
    const words = content.match(wordRegex) || []
    
    // معالجة الهاشتاج
    for (const hashtag of hashtags) {
      if (hashtag.length >= 3) {
        await updateKeywordUsage(hashtag, 'HASHTAG', postId, userId)
        extractedKeywords.push(hashtag)
      }
    }
    
    // معالجة المنشن
    for (const mention of mentions) {
      if (mention.length >= 3) {
        await updateKeywordUsage(mention, 'MENTION', postId, userId)
        extractedKeywords.push(mention)
      }
    }
    
    // معالجة الكلمات المفتاحية المهمة (أكثر من 4 أحرف لتجنب الكلمات الشائعة جداً)
    const importantWords = words.filter(word => 
      word.length >= 4 && 
      !isCommonWord(word) &&
      !hashtags.some(h => h.includes(word)) &&
      !mentions.some(m => m.includes(word))
    )
    
    for (const word of importantWords.slice(0, 5)) { // أخذ أول 5 كلمات مهمة فقط
      await updateKeywordUsage(word, 'KEYWORD', postId, userId)
      extractedKeywords.push(word)
    }
    
    return extractedKeywords
    
  } catch (error) {
    console.error('Error extracting keywords:', error)
    return []
  }
}

/**
 * تحديث استخدام كلمة معينة
 */
async function updateKeywordUsage(
  keyword: string,
  type: 'HASHTAG' | 'KEYWORD' | 'MENTION',
  postId?: string,
  userId?: string
): Promise<void> {
  try {
    const cleanKeyword = keyword.trim()
    const normalizedKeyword = cleanKeyword.toLowerCase().replace(/^[@#]/, '')
    
    // البحث عن الكلمة أو إنشاؤها
    const existingKeyword = await prisma.trendingKeyword.findUnique({
      where: { keyword: cleanKeyword }
    })
    
    let trendingKeyword
    
    if (existingKeyword) {
      // تحديث الكلمة الموجودة
      trendingKeyword = await prisma.trendingKeyword.update({
        where: { id: existingKeyword.id },
        data: {
          totalUsage: { increment: 1 },
          dailyUsage: { increment: 1 },
          weeklyUsage: { increment: 1 },
          monthlyUsage: { increment: 1 },
          lastUsedAt: new Date(),
          postsCount: postId ? { increment: 1 } : undefined
        }
      })
    } else {
      // إنشاء كلمة جديدة
      trendingKeyword = await prisma.trendingKeyword.create({
        data: {
          keyword: cleanKeyword,
          normalizedKeyword: normalizedKeyword,
          type: type,
          totalUsage: 1,
          dailyUsage: 1,
          weeklyUsage: 1,
          monthlyUsage: 1,
          postsCount: postId ? 1 : 0,
          lastUsedAt: new Date(),
          firstSeenAt: new Date(),
          origin: postId || null,
          language: detectLanguage(cleanKeyword)
        }
      })
    }
    
    // تحديث سجل الاستخدام اليومي
    await updateDailyUsageHistory(trendingKeyword.id, postId, userId)
    
    // حساب درجة الترند الأساسية
    const trendScore = calculateBasicTrendScore(trendingKeyword)
    
    // تحديث درجة الترند
    await prisma.trendingKeyword.update({
      where: { id: trendingKeyword.id },
      data: {
        trendScore: trendScore,
        isCurrentlyTrending: trendScore >= 20,
        lastCalculatedAt: new Date()
      }
    })
    
  } catch (error) {
    console.error('Error updating keyword usage:', error)
  }
}

/**
 * تحديث سجل الاستخدام اليومي
 */
async function updateDailyUsageHistory(
  keywordId: string,
  postId?: string,
  userId?: string
): Promise<void> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingHistory = await prisma.keywordUsageHistory.findUnique({
      where: {
        keywordId_date: {
          keywordId: keywordId,
          date: today
        }
      }
    })
    
    if (existingHistory) {
      await prisma.keywordUsageHistory.update({
        where: { id: existingHistory.id },
        data: {
          usageCount: { increment: 1 },
          postsCount: postId ? { increment: 1 } : undefined,
          uniqueUsers: userId ? { increment: 1 } : undefined
        }
      })
    } else {
      await prisma.keywordUsageHistory.create({
        data: {
          keywordId: keywordId,
          date: today,
          usageCount: 1,
          uniqueUsers: userId ? 1 : 0,
          postsCount: postId ? 1 : 0
        }
      })
    }
  } catch (error) {
    console.error('Error updating daily usage history:', error)
  }
}

/**
 * حساب درجة الترند الأساسية
 */
function calculateBasicTrendScore(keyword: any): number {
  const dailyWeight = 0.5
  const weeklyWeight = 0.3
  const velocityWeight = 0.2
  
  // حساب سرعة الانتشار
  const velocity = keyword.dailyUsage / Math.max(keyword.weeklyUsage / 7, 1)
  
  // حساب الدرجة
  const score = (
    keyword.dailyUsage * dailyWeight +
    keyword.weeklyUsage * weeklyWeight +
    velocity * velocityWeight
  )
  
  return Math.min(Math.round(score * 100) / 100, 100)
}

/**
 * كشف لغة الكلمة
 */
function detectLanguage(keyword: string): string {
  const arabicRegex = /[\u0600-\u06FF]/
  const englishRegex = /[a-zA-Z]/
  
  if (arabicRegex.test(keyword) && englishRegex.test(keyword)) {
    return 'MIXED'
  } else if (arabicRegex.test(keyword)) {
    return 'AR'
  } else if (englishRegex.test(keyword)) {
    return 'EN'
  } else {
    return 'OTHER'
  }
}

/**
 * فحص ما إذا كانت الكلمة شائعة جداً (كلمات stop words)
 */
function isCommonWord(word: string): boolean {
  const commonArabicWords = [
    'في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي',
    'كان', 'كانت', 'يكون', 'تكون', 'هو', 'هي', 'أن', 'أنه', 'أنها',
    'ما', 'لا', 'لم', 'لن', 'قد', 'بعد', 'قبل', 'عند', 'عندما', 'حيث',
    'مع', 'ضد', 'بين', 'تحت', 'فوق', 'أمام', 'وراء', 'يمين', 'يسار'
  ]
  
  const commonEnglishWords = [
    'the', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may',
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'
  ]
  
  const normalizedWord = word.toLowerCase()
  
  return commonArabicWords.includes(normalizedWord) || 
         commonEnglishWords.includes(normalizedWord)
}

/**
 * جلب الكلمات الشائعة الحالية
 */
export async function getCurrentTrendingKeywords(limit: number = 20): Promise<any[]> {
  try {
    return await prisma.trendingKeyword.findMany({
      where: { isCurrentlyTrending: true },
      orderBy: { trendRank: 'asc' },
      take: limit,
      select: {
        id: true,
        keyword: true,
        type: true,
        trendScore: true,
        trendRank: true,
        dailyUsage: true,
        weeklyUsage: true,
        category: true
      }
    })
  } catch (error) {
    console.error('Error getting trending keywords:', error)
    return []
  }
}

/**
 * بحث في الكلمات الشائعة
 */
export async function searchTrendingKeywords(
  query: string,
  type?: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const where: any = {
      OR: [
        { keyword: { contains: query, mode: 'insensitive' } },
        { normalizedKeyword: { contains: query.toLowerCase() } }
      ]
    }
    
    if (type) {
      where.type = type
    }
    
    return await prisma.trendingKeyword.findMany({
      where,
      orderBy: { trendScore: 'desc' },
      take: limit,
      select: {
        id: true,
        keyword: true,
        type: true,
        trendScore: true,
        dailyUsage: true,
        totalUsage: true
      }
    })
  } catch (error) {
    console.error('Error searching trending keywords:', error)
    return []
  }
}
