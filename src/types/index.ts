import { User, Post, Comment, Like, Point, Nomination, Message, Follow } from '@prisma/client'

// تعريفات المستخدم
export interface UserProfile extends User {
  followers: Follow[]
  following: Follow[]
  posts: Post[]
  _count: {
    followers: number
    following: number
    posts: number
  }
}

// تعريفات المنشور
export interface PostWithDetails extends Post {
  author: User
  publishedFor?: User
  comments: CommentWithAuthor[]
  likes: Like[]
  _count: {
    likes: number
    comments: number
  }
}

// تعريفات التعليق
export interface CommentWithAuthor extends Comment {
  author: User
}

// تعريفات النقاط
export interface PointWithDetails extends Point {
  user: User
  influencer: User
  post?: Post
  comment?: Comment
}

// تعريفات الترشيح
export interface NominationWithDetails extends Nomination {
  influencer: User
  nominated: User
}

// تعريفات الرسائل
export interface MessageWithUsers extends Message {
  sender: User
  receiver: User
}

// تعريفات نماذج الواجهة
export interface LoginForm {
  identifier: string // رقم الهاتف أو البريد أو اسم المستخدم
  otp?: string
}

export interface RegisterForm {
  username: string
  email?: string
  phone?: string
  recoveryEmail?: string // إيميل الاسترداد الاختياري
  fullName: string
  age?: number
  gender?: 'MALE' | 'FEMALE'
  nationality?: string
  birthCountry?: string
  currentCountry?: string
  graduationYear?: number
  degree?: string
  highSchool?: string
  hobbies?: string[]
  interests?: string[]
}

export interface PostForm {
  content: string
  images?: string[]
  videos?: string[]
  publishedForId?: string // لكبار المتابعين
}

export interface CommentForm {
  content: string
  postId: string
}

export interface MessageForm {
  content: string
  receiverId: string
  images?: string[]
  files?: string[]
}

// تعريفات الاستجابات
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// تعريفات الإحصائيات
export interface UserStats {
  totalPosts: number
  totalFollowers: number
  totalFollowing: number
  totalPoints: number
  pointsByInfluencer: {
    influencer: User
    points: number
  }[]
}

export interface PostStats {
  totalLikes: number
  totalComments: number
  totalShares: number
  engagementRate: number
}

// تعريفات الإشعارات
export interface Notification {
  id: string
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'NOMINATION' | 'MESSAGE'
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: any
}

// تعريفات Socket.IO
export interface SocketEvents {
  // الإشعارات
  notification: (notification: Notification) => void
  
  // الرسائل
  message: (message: MessageWithUsers) => void
  messageRead: (messageId: string) => void
  
  // التفاعلات اللحظية
  newLike: (like: Like & { user: User; post: Post }) => void
  newComment: (comment: CommentWithAuthor & { post: Post }) => void
  
  // الحالة
  userOnline: (userId: string) => void
  userOffline: (userId: string) => void
}

// تعريفات الأخطاء
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// تعريفات الثوابت
export const POINTS_VALUES = {
  POST: 20,
  COMMENT: 10,
  LIKE: 5
} as const

export const ROLES = {
  USER: 'USER',
  INFLUENCER: 'INFLUENCER',
  TOP_FOLLOWER: 'TOP_FOLLOWER'
} as const

export const NOMINATION_LIMITS = {
  MAX_NOMINATIONS_PER_PERIOD: 3,
  PERIOD_DAYS: 14,
  MAX_POSTS_PER_NOMINATION: 3,
  INFLUENCER_MIN_FOLLOWERS: 1000
} as const
