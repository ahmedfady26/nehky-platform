// إعدادات ثابتة للتطبيق

export const APP_CONFIG = {
  name: 'منصة نحكي',
  description: 'منصة التواصل الاجتماعي العربية',
  url: process.env.APP_URL || 'http://localhost:3000',
  defaultAvatar: '/uploads/avatars/default-avatar.svg'
}

export const LIMITS = {
  post: {
    maxLength: 2000,
    maxMedia: 10
  },
  comment: {
    maxLength: 500
  },
  bio: {
    maxLength: 160
  },
  username: {
    minLength: 3,
    maxLength: 30
  }
}

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm'],
  avatarSize: { width: 200, height: 200 },
  postImageSize: { width: 1080, height: 1080 }
}

export const PAGINATION = {
  postsPerPage: 20,
  commentsPerPage: 50,
  usersPerPage: 30
}
