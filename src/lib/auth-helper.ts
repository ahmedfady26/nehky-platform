// مساعد للتعامل مع المصادقة والتوكن

export const AuthHelper = {
  // حفظ بيانات تسجيل الدخول
  saveLoginData: (token: string, rememberMe: boolean) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rememberMe', rememberMe.toString());
    
    // حساب تاريخ انتهاء الصلاحية
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (rememberMe ? 365 : 7));
    localStorage.setItem('tokenExpiry', expiryDate.getTime().toString());
  },

  // التحقق من صلاحية التوكن
  isTokenValid: (): boolean => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiryTime) {
      return false;
    }
    
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    
    return now < expiry;
  },

  // الحصول على التوكن إذا كان صالحاً
  getValidToken: (): string | null => {
    if (AuthHelper.isTokenValid()) {
      return localStorage.getItem('token');
    }
    
    // إذا انتهت صلاحية التوكن، احذف جميع البيانات
    AuthHelper.clearLoginData();
    return null;
  },

  // مسح بيانات تسجيل الدخول
  clearLoginData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('tokenExpiry');
  },

  // التحقق من حالة "تذكرني"
  isRememberMeEnabled: (): boolean => {
    return localStorage.getItem('rememberMe') === 'true';
  },

  // الحصول على أيام متبقية في التوكن
  getRemainingDays: (): number => {
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (!expiryTime) return 0;
    
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  },

  // تجديد التوكن إذا اقترب من انتهاء الصلاحية
  shouldRefreshToken: (): boolean => {
    const remainingDays = AuthHelper.getRemainingDays();
    // تجديد إذا بقي أقل من 3 أيام
    return remainingDays > 0 && remainingDays <= 3;
  }
};

export default AuthHelper;
