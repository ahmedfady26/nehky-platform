// إدارة المصادقة والجلسات في منصة نحكي

export interface UserSession {
  email: string
  isLoggedIn: boolean
  rememberMe: boolean
  loginTime: string
  expiryTime?: string
}

// مدة البقاء للذاكرة الدائمة (30 يوم)
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 أيام بالميللي ثانية

export class AuthManager {
  
  // حفظ جلسة المستخدم
  static saveUserSession(email: string, rememberMe: boolean = false): void {
    const loginTime = new Date().toISOString()
    const session: UserSession = {
      email,
      isLoggedIn: true,
      rememberMe,
      loginTime
    }

    if (rememberMe) {
      // حفظ في localStorage للذاكرة الدائمة
      const expiryTime = new Date(Date.now() + REMEMBER_ME_DURATION).toISOString()
      session.expiryTime = expiryTime
      
      localStorage.setItem('nehky_user_session', JSON.stringify(session))
      localStorage.setItem('nehky_remember_me', 'true')
      localStorage.setItem('nehky_user_email', email)
      
      console.log('✅ تم حفظ الجلسة للذاكرة الدائمة (30 يوم)')
    } else {
      // حفظ في sessionStorage للجلسة المؤقتة فقط
      sessionStorage.setItem('nehky_user_session', JSON.stringify(session))
      sessionStorage.setItem('nehky_session_active', 'true')
      
      console.log('✅ تم إنشاء جلسة مؤقتة')
    }
  }

  // استرجاع جلسة المستخدم
  static getUserSession(): UserSession | null {
    try {
      // البحث في localStorage أولاً (للذاكرة الدائمة)
      let sessionData = localStorage.getItem('nehky_user_session')
      
      if (sessionData) {
        const session: UserSession = JSON.parse(sessionData)
        
        // التحقق من انتهاء الصلاحية
        if (session.expiryTime && new Date() > new Date(session.expiryTime)) {
          console.log('⏰ انتهت صلاحية الجلسة المحفوظة')
          this.clearUserSession()
          return null
        }
        
        console.log('✅ تم استرجاع الجلسة من الذاكرة الدائمة')
        return session
      }
      
      // البحث في sessionStorage للجلسة المؤقتة
      sessionData = sessionStorage.getItem('nehky_user_session')
      if (sessionData) {
        console.log('✅ تم استرجاع الجلسة المؤقتة')
        return JSON.parse(sessionData)
      }
      
      return null
    } catch (error) {
      console.error('❌ خطأ في استرجاع بيانات الجلسة:', error)
      return null
    }
  }

  // التحقق من حالة تسجيل الدخول
  static isLoggedIn(): boolean {
    const session = this.getUserSession()
    return session?.isLoggedIn || false
  }

  // تسجيل الخروج
  static logout(): void {
    // حذف جميع بيانات الجلسة
    localStorage.removeItem('nehky_user_session')
    localStorage.removeItem('nehky_remember_me')
    localStorage.removeItem('nehky_user_email')
    
    sessionStorage.removeItem('nehky_user_session')
    sessionStorage.removeItem('nehky_session_active')
    
    console.log('✅ تم تسجيل الخروج وحذف جميع بيانات الجلسة')
  }

  // مسح بيانات الجلسة (عند انتهاء الصلاحية)
  static clearUserSession(): void {
    this.logout()
  }

  // الحصول على البريد الإلكتروني المحفوظ
  static getRememberedEmail(): string | null {
    return localStorage.getItem('nehky_user_email')
  }

  // التحقق من حالة "تذكرني"
  static isRememberMeEnabled(): boolean {
    return localStorage.getItem('nehky_remember_me') === 'true'
  }
}
