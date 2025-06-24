// خدمة API مجردة - قابلة للاستخدام في Web/Mobile
import { APP_CONFIG } from '../constants/app';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'USER' | 'INFLUENCER' | 'TOP_FOLLOWER';
  followersCount: number;
  followingCount: number;
  postsCount: number;
  totalPoints: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  images?: string[];
  authorId: string;
  author: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'avatar' | 'isVerified'>;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'avatar'>;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  identifier: string; // username, email, or phone
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
}

export interface OTPRequest {
  identifier: string;
  type: 'email' | 'sms';
}

export interface OTPVerification {
  identifier: string;
  otp: string;
  type: 'email' | 'sms';
}

// فئة خدمة API الأساسية
export class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'حدث خطأ غير متوقع',
          message: data.message,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الاتصال',
      };
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOTP(data: OTPRequest): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyOTP(data: OTPVerification): Promise<ApiResponse> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(identifier: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // User methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/user/profile');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Posts methods
  async getPosts(page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[]; total: number }>> {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async getPost(id: string): Promise<ApiResponse<Post>> {
    return this.request(`/posts/${id}`);
  }

  async createPost(content: string, images?: string[]): Promise<ApiResponse<Post>> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, images }),
    });
  }

  async likePost(postId: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    return this.request(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

// مثيل الخدمة العامة
export const apiService = new ApiService();
