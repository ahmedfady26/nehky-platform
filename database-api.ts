// API مساعد للاستعلامات السريعة على قاعدة البيانات
import { prisma } from './src/lib/prisma'

interface QueryOptions {
  search?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

class DatabaseAPI {
  
  // ========================================
  // 👥 استعلامات المستخدمين
  // ========================================
  
  async getUsers(options: QueryOptions = {}) {
    const { search, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = options
    
    return await prisma.user.findMany({
      where: search ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        followersCount: true,
        isActive: true,
        createdAt: true,
        lastSeenAt: true,
        _count: {
          select: {
            posts: { where: { isDeleted: false } },
            interactions: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: offset,
      take: limit
    })
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: { where: { isDeleted: false } },
            interactions: true,
            notifications: { where: { isRead: false } }
          }
        }
      }
    })
  }

  // ========================================
  // 📝 استعلامات المنشورات
  // ========================================

  async getPosts(options: QueryOptions = {}) {
    const { search, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = options

    return await prisma.post.findMany({
      where: {
        isDeleted: false,
        visibility: 'PUBLIC',
        ...(search && {
          content: { contains: search, mode: 'insensitive' }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePicture: true,
            isVerified: true
          }
        },
        hashtags: {
          include: {
            hashtag: {
              select: { name: true, usageCount: true }
            }
          }
        },
        _count: {
          select: {
            interactions: true,
            userScores: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: offset,
      take: limit
    })
  }

  async getPostById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePicture: true,
            isVerified: true
          }
        },
        hashtags: {
          include: { hashtag: true }
        },
        interactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                profilePicture: true
              }
            }
          }
        },
        userScores: true
      }
    })
  }

  // ========================================
  // 🏷️ استعلامات الهاشتاج
  // ========================================

  async getHashtags(options: QueryOptions = {}) {
    const { search, limit = 50, sortBy = 'usageCount', sortOrder = 'desc' } = options

    return await prisma.hashtag.findMany({
      where: search ? {
        name: { contains: search, mode: 'insensitive' }
      } : undefined,
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit
    })
  }

  // ========================================
  // 🔑 استعلامات الكلمات المفتاحية
  // ========================================

  async getKeywords(options: QueryOptions & { category?: string } = {}) {
    const { search, category, limit = 50, sortBy = 'usageCount', sortOrder = 'desc' } = options

    return await prisma.keyword.findMany({
      where: {
        ...(search && {
          keyword: { contains: search, mode: 'insensitive' }
        }),
        ...(category && { category })
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit
    })
  }

  // ========================================
  // 📊 استعلامات الإحصائيات
  // ========================================

  async getStatistics() {
    const [users, posts, hashtags, keywords, interactions, notifications] = await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { isDeleted: false } }),
      prisma.hashtag.count(),
      prisma.keyword.count(),
      prisma.interaction.count(),
      prisma.notification.count()
    ])

    const [activeUsers, recentPosts, topHashtags] = await Promise.all([
      prisma.user.count({
        where: {
          lastSeenAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
          }
        }
      }),
      prisma.post.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // آخر أسبوع
          },
          isDeleted: false
        }
      }),
      prisma.hashtag.findMany({
        orderBy: { usageCount: 'desc' },
        take: 5,
        select: { name: true, usageCount: true }
      })
    ])

    return {
      totals: {
        users,
        posts,
        hashtags,
        keywords,
        interactions,
        notifications
      },
      activity: {
        activeUsersToday: activeUsers,
        postsThisWeek: recentPosts,
        topHashtags
      },
      timestamp: new Date().toISOString()
    }
  }

  // ========================================
  // 🔍 البحث المتقدم
  // ========================================

  async globalSearch(query: string, limit = 20) {
    const [users, posts, hashtags] = await Promise.all([
      // البحث في المستخدمين
      prisma.user.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } }
          ],
          isActive: true
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          bio: true,
          profilePicture: true,
          isVerified: true
        },
        take: Math.floor(limit / 3)
      }),

      // البحث في المنشورات
      prisma.post.findMany({
        where: {
          content: { contains: query, mode: 'insensitive' },
          isDeleted: false,
          visibility: 'PUBLIC'
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePicture: true
            }
          }
        },
        take: Math.floor(limit / 3)
      }),

      // البحث في الهاشتاج
      prisma.hashtag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        include: {
          _count: { select: { posts: true } }
        },
        take: Math.floor(limit / 3)
      })
    ])

    return {
      users: users.map(u => ({ ...u, type: 'user' })),
      posts: posts.map(p => ({ ...p, type: 'post' })),
      hashtags: hashtags.map(h => ({ ...h, type: 'hashtag' })),
      total: users.length + posts.length + hashtags.length
    }
  }

  // ========================================
  // 🎯 استعلامات الاهتمامات
  // ========================================

  async getUserInterests(userId: string) {
    const [profile, scores] = await Promise.all([
      prisma.userInterestProfile.findUnique({
        where: { userId }
      }),
      prisma.userInterestScore.findMany({
        where: { userId },
        orderBy: { currentScore: 'desc' },
        take: 10
      })
    ])

    return { profile, interests: scores }
  }

  async getInterestAnalytics() {
    const [topInterests, interestCategories] = await Promise.all([
      prisma.userInterestScore.groupBy({
        by: ['interestName'],
        _avg: { currentScore: true },
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: 20
      }),
      prisma.userInterestScore.groupBy({
        by: ['category'],
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } }
      })
    ])

    return {
      topInterests: topInterests.map(item => ({
        name: item.interestName,
        avgScore: item._avg.currentScore,
        userCount: item._count.userId
      })),
      categories: interestCategories.map(item => ({
        category: item.category,
        userCount: item._count.userId
      }))
    }
  }
}

export const dbAPI = new DatabaseAPI()

// تصدير الكلاس أيضاً للاستخدام المباشر
export default DatabaseAPI

// مثال لاستخدام المكتبة
if (require.main === module) {
  const demo = async () => {
    console.log('🚀 تشغيل عرض توضيحي لمكتبة قاعدة البيانات...\n')

    try {
      // عرض الإحصائيات العامة
      const stats = await dbAPI.getStatistics()
      console.log('📊 إحصائيات المنصة:')
      console.log(JSON.stringify(stats, null, 2))
      console.log()

      // عرض المستخدمين
      const users = await dbAPI.getUsers({ limit: 3 })
      console.log(`👥 أول ${users.length} مستخدمين:`)
      users.forEach(user => {
        console.log(`- ${user.fullName} (@${user.username}) - ${user._count.posts} منشور`)
      })
      console.log()

      // البحث العام
      const searchResults = await dbAPI.globalSearch('تقنية', 5)
      console.log('🔍 نتائج البحث عن "تقنية":')
      console.log(`- المستخدمين: ${searchResults.users.length}`)
      console.log(`- المنشورات: ${searchResults.posts.length}`)
      console.log(`- الهاشتاج: ${searchResults.hashtags.length}`)

    } catch (error) {
      console.error('❌ خطأ:', error)
    } finally {
      await prisma.$disconnect()
    }
  }

  demo()
}
