"use client";

import { useState } from 'react';
import Logo from '@/components/Logo';
import AuthHelper from '@/lib/auth-helper';

// قائمة مفاتيح البلدان
const countryCodes = [
  { code: '+966', name: 'السعودية', flag: '🇸🇦' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭' },
  { code: '+974', name: 'قطر', flag: '🇶🇦' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼' },
  { code: '+968', name: 'عُمان', flag: '🇴🇲' },
  { code: '+20', name: 'مصر', flag: '🇪🇬' },
  { code: '+962', name: 'الأردن', flag: '🇯🇴' },
  { code: '+961', name: 'لبنان', flag: '🇱🇧' },
  { code: '+963', name: 'سوريا', flag: '🇸🇾' },
  { code: '+964', name: 'العراق', flag: '🇮🇶' },
  { code: '+967', name: 'اليمن', flag: '🇾🇪' },
  { code: '+212', name: 'المغرب', flag: '🇲🇦' },
  { code: '+213', name: 'الجزائر', flag: '🇩🇿' },
  { code: '+216', name: 'تونس', flag: '🇹🇳' },
  { code: '+218', name: 'ليبيا', flag: '🇱🇾' },
  { code: '+249', name: 'السودان', flag: '🇸🇩' },
  { code: '+1', name: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: '+44', name: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: '+33', name: 'فرنسا', flag: '🇫🇷' },
  { code: '+49', name: 'ألمانيا', flag: '🇩🇪' },
  { code: '+39', name: 'إيطاليا', flag: '🇮🇹' },
  { code: '+34', name: 'إسبانيا', flag: '🇪🇸' },
  { code: '+90', name: 'تركيا', flag: '🇹🇷' },
  { code: '+98', name: 'إيران', flag: '🇮🇷' },
];

interface FormData {
  identifier: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  otp?: string;
  rememberMe?: boolean;
  recoveryEmail?: string; // إيميل الاسترداد الجديد
}

type FormView = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-otp' | 'account-recovery';

const AuthPage = () => {
  const [formView, setFormView] = useState<FormView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
    confirmPassword: '',
    username: '',
    email: '',
    phone: '',
    countryCode: '+966', // السعودية كافتراضي
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    otp: '',
    rememberMe: false,
    recoveryEmail: '' // إيميل الاسترداد
  });

  // للتأكد من أن الصفحة تحملت بشكل صحيح
  console.log('تم تحميل صفحة التسجيل والدخول');
  console.log('الحالة الحالية:', formView);

  // دالة للتحقق من صحة كلمة المرور (إنجليزية فقط)
  const validatePassword = (password: string) => {
    if (!password) return { isValid: false, message: '' };
    
    // التحقق من أن كلمة المرور تحتوي على أحرف إنجليزية فقط
    const englishOnlyRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]*$/;
    if (!englishOnlyRegex.test(password)) {
      return { 
        isValid: false, 
        message: 'كلمة المرور يجب أن تكون باللغة الإنجليزية فقط' 
      };
    }
    
    return { isValid: true, message: '' };
  };

  // دالة للتحقق من قوة كلمة المرور
  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: '', color: '' };
    
    // التحقق أولاً من صحة كلمة المرور
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return { level: 0, text: 'غير صالحة', color: 'text-red-500' };
    }
    
    let score = 0;
    const checks = {
      length: password.length >= 6,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\\/~`]/.test(password)
    };

    score += checks.length ? 1 : 0;
    score += checks.hasLower ? 1 : 0;
    score += checks.hasUpper ? 1 : 0;
    score += checks.hasNumber ? 1 : 0;
    score += checks.hasSpecial ? 1 : 0;

    if (score <= 1) return { level: 1, text: 'ضعيفة', color: 'text-red-500' };
    if (score <= 3) return { level: 2, text: 'متوسطة', color: 'text-yellow-500' };
    if (score <= 4) return { level: 3, text: 'جيدة', color: 'text-blue-500' };
    return { level: 4, text: 'قوية جداً', color: 'text-green-500' };
  };

  // دالة للتحقق من صحة الاسم (كلمتين كحد أقصى)
  const validateName = (name: string) => {
    if (!name || typeof name !== 'string') return false;
    const words = name.trim().split(/\s+/);
    return words.length <= 2 && words.every(word => word.length >= 1);
  };

  // دالة للتحقق من العمر (أكبر من 7 سنوات)
  const validateAge = (birthDate: string) => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 > 7;
    }
    return age > 7;
  };

  // دالة للتحقق من رقم الهاتف
  const validatePhone = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) return false;
    
    // التحقق من أن الرقم يحتوي على أرقام فقط
    if (!/^\d+$/.test(phone)) return false;
    
    // التحقق من طول الرقم حسب كود البلد
    const phoneLength = phone.length;
    const expectedLengths: { [key: string]: number[] } = {
      '+966': [9], // السعودية
      '+971': [9], // الإمارات
      '+20': [10, 11], // مصر
      '+1': [10], // أمريكا
      '+44': [10, 11], // بريطانيا
    };
    
    const expectedLength = expectedLengths[countryCode];
    if (expectedLength) {
      return expectedLength.includes(phoneLength);
    }
    
    // للبلدان الأخرى، طول عام بين 8-15 رقم
    return phoneLength >= 8 && phoneLength <= 15;
  };

  // دالة للتحقق من فرادة اسم المستخدم والبريد الإلكتروني
  const checkUniqueness = async (field: 'username' | 'email' | 'phone', value: string) => {
    try {
      const response = await fetch('/api/auth/check-uniqueness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      
      const data = await response.json();
      return data.isUnique;
    } catch (error) {
      console.error('خطأ في التحقق من الفرادة:', error);
      return true; // في حالة الخطأ، نفترض أنه فريد
    }
  };

  // تحديث البيانات
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // مسح الرسائل عند الكتابة
    if (error) setError('');
    if (message) setMessage('');
  };

  // تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // التحقق من وجود كلمة المرور
      if (!formData.password) {
        setError('يرجى إدخال كلمة المرور');
        setIsLoading(false);
        return;
      }

      // تسجيل الدخول بكلمة المرور
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن وبيانات تسجيل الدخول
        AuthHelper.saveLoginData(data.token, formData.rememberMe || false);
        
        // تسجيل معلومات الجهاز
        try {
          await fetch('/api/user/device-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              userId: data.user.id
            })
          });
        } catch (deviceError) {
          console.warn('فشل في تسجيل معلومات الجهاز:', deviceError);
          // لا نتوقف عند فشل تسجيل معلومات الجهاز
        }
        
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'حدث خطأ في تسجيل الدخول');
      }
    } catch (error) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        // حفظ التوكن وبيانات تسجيل الدخول (7 أيام افتراضياً للمستخدمين الجدد)
        AuthHelper.saveLoginData(data.token, false);
        
        // تسجيل معلومات الجهاز
        try {
          await fetch('/api/user/device-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              userId: data.user.id
            })
          });
        } catch (deviceError) {
          console.warn('فشل في تسجيل معلومات الجهاز:', deviceError);
          // لا نتوقف عند فشل تسجيل معلومات الجهاز
        }
        
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'رمز التحقق غير صحيح');
      }
    } catch (error) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // التسجيل
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 بداية عملية التسجيل');
    console.log('📋 بيانات النموذج:', formData);
    
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // التحقق من الأسماء (جميعها مطلوبة الآن)
      if (!validateName(formData.firstName || '')) {
        setError('الاسم الأول يجب أن يكون كلمة أو كلمتين فقط');
        setIsLoading(false);
        return;
      }

      if (!validateName(formData.secondName || '')) {
        setError('الاسم الثاني مطلوب ويجب أن يكون كلمة أو كلمتين فقط');
        setIsLoading(false);
        return;
      }

      if (!validateName(formData.thirdName || '')) {
        setError('الاسم الثالث مطلوب ويجب أن يكون كلمة أو كلمتين فقط');
        setIsLoading(false);
        return;
      }

      if (!validateName(formData.lastName || '')) {
        setError('اسم العائلة يجب أن يكون كلمة أو كلمتين فقط');
        setIsLoading(false);
        return;
      }

      // التحقق من العمر
      if (!validateAge(formData.birthDate || '')) {
        setError('يجب أن تكون أكبر من 7 سنوات للتسجيل');
        setIsLoading(false);
        return;
      }

      // التحقق من رقم الهاتف
      if (!validatePhone(formData.phone || '', formData.countryCode || '')) {
        setError('رقم الهاتف غير صحيح للبلد المحدد');
        setIsLoading(false);
        return;
      }

      // التحقق من صحة كلمة المرور (إنجليزية فقط)
      const passwordValidation = validatePassword(formData.password || '');
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        setIsLoading(false);
        return;
      }

      // التحقق من تطابق كلمة المرور
      if (formData.password !== formData.confirmPassword) {
        setError('كلمتا المرور غير متطابقتان');
        setIsLoading(false);
        return;
      }

      // التحقق من صحة البريد الإلكتروني إذا تم إدخاله
      if (formData.email && formData.email.trim()) {
        if (!formData.email.endsWith('@nehky.com')) {
          setError('البريد الإلكتروني يجب أن يكون بصيغة user@nehky.com فقط');
          setIsLoading(false);
          return;
        }
      }

      // التحقق من فرادة البيانات (فقط إذا تم إدخال البريد الإلكتروني)
      console.log('🔍 بداية التحقق من فرادة البيانات');
      const usernameUnique = await checkUniqueness('username', formData.username || '');
      console.log('👤 فحص اسم المستخدم:', usernameUnique);
      if (!usernameUnique) {
        setError('اسم المستخدم غير متاح');
        setIsLoading(false);
        return;
      }

      // التحقق من فرادة البريد الإلكتروني فقط إذا تم إدخاله
      if (formData.email && formData.email.trim()) {
        const emailUnique = await checkUniqueness('email', formData.email || '');
        console.log('📧 فحص البريد الإلكتروني:', emailUnique);
        if (!emailUnique) {
          setError('البريد الإلكتروني مُستخدم من قبل');
          setIsLoading(false);
          return;
        }
      } else {
        console.log('📧 لم يتم إدخال بريد إلكتروني، سيتم توليده تلقائياً');
      }

      const phoneUnique = await checkUniqueness('phone', `${formData.countryCode}${formData.phone}`);
      console.log('📱 فحص رقم الهاتف:', phoneUnique);
      if (!phoneUnique) {
        setError('رقم الهاتف مستخدم من قبل');
        setIsLoading(false);
        return;
      }

      console.log('✅ انتهى التحقق من الفرادة، بداية إرسال طلب التسجيل');
      
      // تكوين الاسم الكامل
      const fullName = [
        formData.firstName,
        formData.secondName,
        formData.thirdName,
        formData.lastName
      ].filter(Boolean).join(' ');
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          password: formData.password,
          firstName: formData.firstName,
          secondName: formData.secondName,
          thirdName: formData.thirdName,
          lastName: formData.lastName,
          fullName: fullName, // إضافة الاسم الكامل
          birthDate: formData.birthDate,
          gender: formData.gender
        }),
      });

      console.log('📡 تم إرسال طلب التسجيل، انتظار الاستجابة...');
      const data = await response.json();
      console.log('📨 استجابة الخادم:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (response.ok) {
        console.log('✅ نجح التسجيل!');
        // التحقق معطل مؤقتاً - التوجه مباشرة للصفحة الرئيسية
        setMessage('تم إنشاء الحساب بنجاح! سيتم توجيهك للصفحة الرئيسية...');
        
        // حفظ معلومات المستخدم إذا لزم الأمر
        if (data.userId && data.username) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
        }
        
        // التوجه للصفحة الرئيسية بعد ثانيتين
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        console.log('❌ فشل التسجيل:', data.message || data.error);
        setError(data.message || data.error || 'حدث خطأ في التسجيل');
      }
    } catch (error: any) {
      console.error('💥 خطأ في عملية التسجيل:', error);
      setError('خطأ في الاتصال بالخادم: ' + error.message);
    } finally {
      console.log('🔚 انتهى التسجيل، إيقاف التحميل');
      setIsLoading(false);
    }
  };

  // نسيت كلمة المرور
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('تم إرسال رمز إعادة تعيين كلمة المرور');
        setFormView('reset-password');
      } else {
        setError(data.error || 'حدث خطأ في إرسال رمز إعادة التعيين');
      }
    } catch (error) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة تعيين كلمة المرور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // التحقق من صحة كلمة المرور (إنجليزية فقط)
      const passwordValidation = validatePassword(formData.password || '');
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('كلمتا المرور غير متطابقتان');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          otp: formData.otp,
          newPassword: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('تم تحديث كلمة المرور بنجاح');
        setFormView('login');
      } else {
        setError(data.error || 'حدث خطأ في تحديث كلمة المرور');
      }
    } catch (error) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // استعادة الحساب (محسن)
  const handleAccountRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // التحقق من رقم الهاتف
    if (!formData.phone || !formData.phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/account-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // رسالة مفصلة بناءً على الحالة
        let detailedMessage = data.message;
        
        if (data.data) {
          if (data.data.hasRecoveryEmail) {
            if (data.data.recoveryEmailSent) {
              detailedMessage += `\n\n✅ تم إرسال معلومات الحساب إلى: ${data.data.maskedRecoveryEmail}`;
            } else {
              detailedMessage += `\n\n⚠️ لم يتم إرسال إيميل الاسترداد إلى: ${data.data.maskedRecoveryEmail}`;
              if (data.data.recoveryEmailError) {
                detailedMessage += `\nالسبب: ${data.data.recoveryEmailError}`;
              }
            }
          } else {
            detailedMessage += '\n\n💡 لا يوجد إيميل استرداد مسجل لهذا الحساب. يمكنك إضافة واحد في إعدادات الحساب لاحقاً.';
          }
        }

        setMessage(detailedMessage);
        setFormView('verify-otp');
      } else {
        setError(data.message || 'حدث خطأ في استعادة الحساب');
      }
    } catch (error) {
      console.error('خطأ في استعادة الحساب:', error);
      setError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="max-w-md w-full">
        {/* الشعار */}
        <div className="text-center mb-8 animate-fadeIn">
          <Logo className="mx-auto mb-4" size="xl" />
        </div>
        
        {/* صندوق التسجيل / الدخول */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 border border-gray-100 animate-slideUp">
          
          {/* مؤشر الحالة */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => {
                  console.log('تبديل إلى تسجيل الدخول');
                  setFormView('login');
                  setError('');
                  setMessage('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 tab-button ${
                  formView === 'login' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('تبديل إلى إنشاء حساب');
                  setFormView('register');
                  setError('');
                  setMessage('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 tab-button ${
                  formView === 'register' 
                    ? 'bg-green-500 text-white shadow-md pulse-green' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                إنشاء حساب
              </button>
            </div>
          </div>
          {/* رسائل الخطأ والنجاح */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg text-sm animate-shake flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-lg text-sm animate-pulse flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>{message}</span>
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          {formView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">تسجيل الدخول</h2>
              </div>
              <div className="animate-slideIn">
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                  placeholder="رقم الهاتف أو البريد الإلكتروني أو اسم المستخدم"
                  required
                />
              </div>
              <div className="animate-slideIn" style={{animationDelay: '0.1s'}}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md pr-12"
                    placeholder="كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">⚠️ كلمة المرور باللغة الإنجليزية فقط</p>
              </div>
              <div className="flex justify-between items-center animate-slideIn" style={{animationDelay: '0.2s'}}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="text-blue-600"
                  />
                  <span className="mr-2 text-sm text-gray-600">تذكرني</span>
                </label>
                <div className="flex flex-col items-end space-y-1">
                  <button
                    type="button"
                    onClick={() => setFormView('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormView('account-recovery')}
                    className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium transition-colors duration-200"
                  >
                    استعادة الحساب
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none animate-slideIn"
                style={{animationDelay: '0.3s'}}
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
              
              {/* رابط نسيت كلمة المرور */}
              <div className="text-center mt-4 animate-slideIn" style={{animationDelay: '0.35s'}}>
                <a
                  href="/account-recovery"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm underline hover:no-underline transition-all duration-300"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              
              <div className="text-center animate-slideIn" style={{animationDelay: '0.4s'}}>
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔥 النقر على زر إنشاء حساب جديد - التحديث الجديد');
                    console.log('الحالة الحالية قبل التغيير:', formView);
                    setFormView('register');
                    setError('');
                    setMessage('');
                    console.log('تم تغيير الحالة إلى: register');
                    // تأكيد إضافي بعد تأخير قصير
                    setTimeout(() => {
                      console.log('تأكيد: الحالة الآن هي:', formView);
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden pulse-green"
                >
                  <span className="relative z-10">🚀 إنشاء حساب جديد</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                </button>
                <p className="text-sm text-gray-600 mt-2">انضم إلى منصة نحكي اليوم 🎉</p>
                
                {/* مؤشر حالة للتطوير */}
                <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-500">
                  الحالة الحالية: <strong>{formView}</strong>
                </div>
              </div>
            </form>
          )}

          {/* نموذج التسجيل */}
          {formView === 'register' && (
            <div className="animate-fadeIn form-transition">
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    🎉 أهلاً بك في نحكي!
                  </h2>
                  <p className="text-gray-600 text-lg">انضم إلى مجتمعنا المميز - الأمر سريع وسهل!</p>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">
                      ✨ ستحصل على حساب مميز للتواصل مع الأصدقاء ومشاركة أفكارك
                    </p>
                  </div>
                </div>
              
              {/* عنوان البيانات الشخصية */}
              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">البيانات الشخصية</h3>
              </div>

              {/* الاسم الأول */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="أدخل اسمك الأول"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">💡 مثال: أحمد أو محمد علي</p>
              </div>

              {/* الاسم الثاني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الثاني *</label>
                <input 
                  type="text" 
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="أدخل الاسم الثاني"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">💡 مثال: سالم أو عبد الله</p>
              </div>

              {/* الاسم الثالث */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الثالث *</label>
                <input 
                  type="text" 
                  name="thirdName"
                  value={formData.thirdName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="أدخل الاسم الثالث"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">💡 مثال: محمد أو عبد العزيز</p>
              </div>

              {/* اسم العائلة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم العائلة *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="أدخل اسم العائلة"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">💡 مثال: الأحمد أو آل سعود</p>
              </div>

              {/* تاريخ الميلاد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد *</label>
                <input 
                  type="date" 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  required
                />
                <p className="text-xs text-gray-500 mt-1">⚠️ يجب أن تكون أكبر من 7 سنوات</p>
              </div>

              {/* الجنس */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجنس *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  required
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              {/* عنوان بيانات الحساب */}
              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">بيانات الحساب</h3>
              </div>

              {/* اسم المستخدم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم *</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="اختر اسم مستخدم فريد"
                  required
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني (اختياري)
                  <span className="text-xs text-gray-500 ml-1">- يجب أن ينتهي بـ @nehky.com</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                  placeholder="username@nehky.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 إذا تُرك فارغاً، سيتم توليد البريد تلقائياً: <strong>{formData.username ? `${formData.username}@nehky.com` : 'اسم_المستخدم@nehky.com'}</strong>
                </p>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                <div className="flex gap-2">
                  <select 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all min-w-[120px]"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                    placeholder="123456789"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 أرقام فقط، مثال: 501234567</p>
              </div>

              {/* إيميل الاسترداد (جديد) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إيميل الاسترداد (اختياري) 
                  <span className="text-xs text-gray-500 ml-1">للمساعدة في استعادة الحساب</span>
                </label>
                <input 
                  type="email" 
                  name="recoveryEmail"
                  value={formData.recoveryEmail}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  placeholder="recovery@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔐 هذا الإيميل سيُستخدم فقط لاستعادة حسابك في حال نسيت كلمة المرور أو اسم المستخدم
                </p>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
                    placeholder="أدخل كلمة مرور قوية"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">⚠️ استخدم أحرف إنجليزية فقط (A-Z, a-z, 0-9, رموز)</p>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">قوة كلمة المرور:</span>
                      <span className={`text-xs font-medium ${getPasswordStrength(formData.password || '').color}`}>
                        {getPasswordStrength(formData.password || '').text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full border-2 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتان</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <p className="text-xs text-green-500 mt-1">✓ كلمتا المرور متطابقتان</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormView('login')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  لديك حساب بالفعل؟ سجل دخولك
                </button>
              </div>
            </form>
            </div>
          )}

          {/* نموذج التحقق من OTP */}
          {formView === 'verify-otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">تأكيد الهاتف</h2>
                <p className="text-gray-600 mb-6">أدخل الرمز المرسل إلى هاتفك</p>
              </div>
              <div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="أدخل رمز التحقق"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormView('register')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  ↩️ العودة للتسجيل
                </button>
              </div>
            </form>
          )}

          {/* نموذج نسيت كلمة المرور */}
          {formView === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">نسيت كلمة المرور</h2>
                <p className="text-gray-600 mb-6">أدخل بياناتك لإعادة تعيين كلمة المرور</p>
              </div>
              <div>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="رقم الهاتف أو البريد الإلكتروني أو اسم المستخدم"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? 'جاري الإرسال...' : 'إرسال رمز الإعادة'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormView('login')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  ↩️ العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* نموذج إعادة تعيين كلمة المرور */}
          {formView === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">إعادة تعيين كلمة المرور</h2>
                <p className="text-gray-600 mb-6">أدخل الرمز وكلمة المرور الجديدة</p>
              </div>
              <div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="رمز الإعادة"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="كلمة المرور الجديدة"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">⚠️ استخدم أحرف إنجليزية فقط</p>
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full border-2 rounded-lg p-4 text-lg pr-12 focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="تأكيد كلمة المرور الجديدة"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتان</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <p className="text-xs text-green-500 mt-1">✓ كلمتا المرور متطابقتان</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormView('forgot-password')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  ↩️ العودة
                </button>
              </div>
            </form>
          )}

          {/* نموذج استعادة الحساب (جديد) */}
          {formView === 'account-recovery' && (
            <form onSubmit={handleAccountRecovery} className="space-y-6">
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  استعادة الحساب
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  أدخل رقم هاتفك المرتبط بالحساب، وسنرسل لك رمز تحقق
                </p>
              </div>
              
              <div className="animate-slideIn">
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="+966501234567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔐 سنتحقق من هويتك قبل السماح باستعادة الحساب
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none animate-slideIn"
              >
                {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormView('login')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  ↩️ العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* كلمة "نحكي" بالتدرج اللوني أسفل الصندوق مع تحسينات */}
        <div className="text-center mt-8">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 bg-clip-text text-transparent animate-float drop-shadow-lg">
            نحكي
          </h1>
          <p className="text-gray-500 mt-2 text-sm animate-fadeIn" style={{animationDelay: '0.5s'}}>
            منصة التواصل الاجتماعي العربية
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
