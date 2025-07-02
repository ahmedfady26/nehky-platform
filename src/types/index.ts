// أنواع البيانات المخصصة للمشروع

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  bio?: string
  avatarUrl?: string
  isVerified: boolean
  accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR'
  privacyLevel: 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  content: string
  mediaUrls: string[]
  authorId: string
  author: User
  likesCount: number
  commentsCount: number
  sharesCount: number
  viewsCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  author: User
  likesCount: number
  repliesCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
