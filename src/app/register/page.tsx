'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Youtube, Hash, Facebook, Linkedin, Plus, X } from 'lucide-react'
import PhoneNumberInput from '@/components/PhoneNumberInput'
import PasswordStrengthChecker from '@/components/PasswordStrengthChecker'
import NameFields from '@/components/NameFields'
import NehkyEmailGenerator from '@/components/NehkyEmailGenerator'

// أنواع المنصات المتاحة
const PLATFORMS = [
  { id: 'INSTAGRAM', name: 'انستغرام', icon: Instagram, color: 'from-pink-500 to-purple-500' },
  { id: 'YOUTUBE', name: 'يوتيوب', icon: Youtube, color: 'from-red-500 to-red-600' },
  { id: 'TIKTOK', name: 'تيك توك', icon: Hash, color: 'from-black to-gray-800' },
  { id: 'FACEBOOK', name: 'فيسبوك', icon: Facebook, color: 'from-blue-500 to-blue-600' },
  { id: 'TWITTER', name: 'تويتر/X', icon: Hash, color: 'from-blue-400 to-blue-500' },
  { id: 'LINKEDIN', name: 'لينكد إن', icon: Linkedin, color: 'from-blue-600 to-blue-700' },
  { id: 'SNAPCHAT', name: 'سناب شات', icon: Hash, color: 'from-yellow-400 to-yellow-500' },
  { id: 'TELEGRAM', name: 'تيليغرام', icon: Hash, color: 'from-blue-400 to-blue-500' }
];

interface SocialAccount {
  platform: string;
  link: string;
  followersCount: number;
}

export default function RegisterPage() {
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [contentSpecialty, setContentSpecialty] = useState('');
  const [totalFollowersRange, setTotalFollowersRange] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [nameData, setNameData] = useState({
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    fullName: ''
  });
  const [username, setUsername] = useState('');
  const [nehkyEmail, setNehkyEmail] = useState('');

  useEffect(() => {
    document.title = 'إنشاء حساب - نحكي'
  }, [])

  // مسح رسالة الخطأ عند تغيير اسم المستخدم
  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    // مسح أي رسالة خطأ موجودة عند تعديل اسم المستخدم
    if (message && message.type === 'error') {
      setMessage(null);
    }
    // التأكد من أن النموذج غير محجوب
    setIsLoading(false);
  };

  // مسح رسائل الخطأ عند تعديل الحقول
  const clearErrorIfRelevant = (fieldText: string) => {
    if (message && message.type === 'error' && message.text.includes(fieldText)) {
      setMessage(null);
    }
    // التأكد من أن النموذج غير محجوب عند التعديل
    setIsLoading(false);
  };

  // مسح جميع رسائل الخطأ عند التفاعل مع النموذج
  const handleFormInteraction = () => {
    if (message && message.type === 'error') {
      setMessage(null);
    }
    setIsLoading(false);
  };

  const addSocialAccount = () => {
    setSocialAccounts([...socialAccounts, { platform: '', link: '', followersCount: 0 }]);
  };

  const removeSocialAccount = (index: number) => {
    setSocialAccounts(socialAccounts.filter((_, i) => i !== index));
  };

  const updateSocialAccount = (index: number, field: keyof SocialAccount, value: string | number) => {
    const updated = [...socialAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setSocialAccounts(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: nameData.firstName,
      secondName: nameData.secondName,
      thirdName: nameData.thirdName,
      lastName: nameData.lastName,
      fullName: nameData.fullName,
      username: username,
      nehkyEmail: nehkyEmail,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: password,
      confirmPassword: confirmPassword,
      isInfluencer,
      contentSpecialty: isInfluencer ? contentSpecialty : undefined,
      totalFollowersRange: isInfluencer ? totalFollowersRange : undefined,
      socialAccounts: isInfluencer ? socialAccounts : []
    };

    // التحقق من الحقول المطلوبة
    if (!nameData.firstName.trim()) {
      setMessage({type: 'error', text: 'الاسم الأول مطلوب'});
      setIsLoading(false);
      return;
    }

    if (!nameData.lastName.trim()) {
      setMessage({type: 'error', text: 'اسم العائلة مطلوب'});
      setIsLoading(false);
      return;
    }

    if (!username.trim()) {
      setMessage({type: 'error', text: 'اسم المستخدم مطلوب'});
      setIsLoading(false);
      return;
    }

    if (!nehkyEmail) {
      setMessage({type: 'error', text: 'البريد الإلكتروني لم يتم توليده، تأكد من اسم المستخدم'});
      setIsLoading(false);
      return;
    }

    // التحقق من كلمة المرور
    if (!isPasswordValid) {
      setMessage({type: 'error', text: 'كلمة المرور لا تحقق الشروط المطلوبة'});
      setIsLoading(false);
      return;
    }

    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      setMessage({type: 'error', text: 'كلمات المرور غير متطابقة'});
      setIsLoading(false);
      return;
    }

    // التحقق من بيانات المؤثر
    if (isInfluencer) {
      if (!contentSpecialty) {
        setMessage({type: 'error', text: 'يرجى اختيار تخصص المحتوى'});
        setIsLoading(false);
        return;
      }
      
      if (socialAccounts.length > 0) {
        const invalidAccounts = socialAccounts.filter(acc => !acc.platform || !acc.link);
        if (invalidAccounts.length > 0) {
          setMessage({type: 'error', text: 'يرجى إكمال بيانات جميع الحسابات الاجتماعية أو حذف الفارغة منها'});
          setIsLoading(false);
          return;
        }
      }
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success', 
          text: result.message || 'تم إنشاء الحساب بنجاح!'
        });
        
        // إعادة تعيين النموذج
        (e.target as HTMLFormElement).reset();
        setIsInfluencer(false);
        setSocialAccounts([]);
        setContentSpecialty('');
        setTotalFollowersRange('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setNehkyEmail('');
        setNameData({
          firstName: '',
          secondName: '',
          thirdName: '',
          lastName: '',
          fullName: ''
        });
        
        // توجيه المستخدم لصفحة تسجيل الدخول بعد 2 ثانية
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage({
          type: 'error', 
          text: result.error || 'حدث خطأ أثناء إنشاء الحساب'
        });
        
        // إذا كان الخطأ متعلق باسم المستخدم، إعطاء تركيز لحقل اسم المستخدم
        if (result.error && result.error.includes('اسم المستخدم')) {
          setTimeout(() => {
            const usernameInput = document.getElementById('username') as HTMLInputElement;
            if (usernameInput) {
              usernameInput.focus();
              usernameInput.select();
            }
          }, 100);
        }
        
        // إذا كان الخطأ متعلق بالبريد الإلكتروني، إعطاء تركيز لحقل البريد
        else if (result.error && result.error.includes('البريد الإلكتروني')) {
          setTimeout(() => {
            const emailInput = document.getElementById('email') as HTMLInputElement;
            if (emailInput) {
              emailInput.focus();
              emailInput.select();
            }
          }, 100);
        }
        
        // إذا كان الخطأ متعلق برقم الهاتف، إعطاء تركيز لحقل الهاتف
        else if (result.error && result.error.includes('رقم الهاتف')) {
          setTimeout(() => {
            const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
            if (phoneInput) {
              phoneInput.focus();
              phoneInput.select();
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error', 
        text: 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // منع إضافة حسابات مكررة لنفس المنصة
  const canAddPlatform = (platformId: string) => {
    return !socialAccounts.some(account => account.platform === platformId);
  };

  // التحقق من صحة الرابط
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="nehky-card p-8">
          {/* الشعار والعنوان */}
          <div className="text-center mb-8">
            <Image
              src="/assets/nehky_logo.webp"
              alt="شعار نحكي"
              width={200}
              height={150}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold nehky-text-gradient mb-2">
              انضم إلى مجتمع نحكي
            </h1>
            <p className="text-gray-600">
              أنشئ حسابك وابدأ في مشاركة قصصك مع العالم
            </p>
          </div>

          {/* نموذج التسجيل */}
          <form className="space-y-6" onSubmit={handleSubmit} onClick={handleFormInteraction}>
            {/* رسائل النجاح والخطأ */}
            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {message.type === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              </div>
            )}
            {/* حقول الاسم */}
            <NameFields 
              onNameChange={(fullName, nameDataUpdate) => setNameData(nameDataUpdate)}
              className="mb-6"
            />

            {/* اسم المستخدم والبريد الإلكتروني */}
            <NehkyEmailGenerator
              username={username}
              onUsernameChange={handleUsernameChange}
              onEmailGenerated={setNehkyEmail}
              className="mb-6"
            />

            <div>
              <label htmlFor="email" className="block text-sm font-medium nehky-text-primary mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="nehky-input w-full"
                placeholder="example@domain.com"
                required
                onChange={() => clearErrorIfRelevant('البريد الإلكتروني')}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium nehky-text-primary mb-2">
                رقم الهاتف
              </label>
              <PhoneNumberInput
                name="phone"
                className="w-full"
                placeholder="ادخل رقم الهاتف"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium nehky-text-primary mb-2">
                كلمة المرور
              </label>
              <PasswordStrengthChecker
                value={password}
                onChange={setPassword}
                name="password"
                placeholder="أدخل كلمة مرور قوية"
                required
                onValidationChange={setIsPasswordValid}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium nehky-text-primary mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="nehky-input w-full"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  dir="ltr"
                />
              </div>
              {/* عرض حالة التطابق */}
              {confirmPassword && (
                <div className={`flex items-center gap-2 mt-2 text-sm ${
                  password === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {password === confirmPassword ? (
                    <>
                      <span className="text-green-500">✓</span>
                      <span>كلمات المرور متطابقة</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500">✗</span>
                      <span>كلمات المرور غير متطابقة</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-nehky-primary focus:ring-nehky-primary"
                  required
                />
                <span className="mr-2 text-sm text-gray-600">
                  أوافق على{' '}
                  <Link href="/terms" className="nehky-text-primary hover:text-nehky-primary-light">
                    شروط الاستخدام
                  </Link>
                  {' '}و{' '}
                  <Link href="/privacy" className="nehky-text-primary hover:text-nehky-primary-light">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>

              {/* خيار المؤثر */}
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={isInfluencer}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsInfluencer(checked);
                    if (!checked) {
                      setSocialAccounts([]);
                      setContentSpecialty('');
                      setTotalFollowersRange('');
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="mr-2 text-sm">
                  <span className="font-medium text-purple-700">🌟 أنا شخص مؤثر</span>
                  <span className="block text-xs text-gray-500 mt-1">
                    لدي متابعين كثر على المنصات الاجتماعية وأريد الاستفادة من ميزات المؤثرين
                  </span>
                </span>
              </label>
            </div>

            {/* قسم بيانات المؤثر */}
            {isInfluencer && (
              <div className="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-purple-700 mb-2">
                    🎯 بيانات المؤثر
                  </h3>
                  <p className="text-sm text-purple-600">
                    أضف حساباتك على المنصات الاجتماعية للحصول على مزايا المؤثرين
                  </p>
                  {(contentSpecialty || totalFollowersRange) && (
                    <div className="mt-3 p-2 bg-white rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600">
                        {contentSpecialty && (
                          <span>📋 التخصص: {contentSpecialty === 'technology' ? 'التكنولوجيا' : 
                                          contentSpecialty === 'lifestyle' ? 'أسلوب الحياة' : 
                                          contentSpecialty === 'education' ? 'التعليم' : 
                                          contentSpecialty === 'entertainment' ? 'الترفيه' : 
                                          contentSpecialty === 'sports' ? 'الرياضة' : 
                                          contentSpecialty === 'cooking' ? 'الطبخ' : 
                                          contentSpecialty === 'travel' ? 'السفر' : 
                                          contentSpecialty === 'fashion' ? 'الموضة' : 
                                          contentSpecialty === 'business' ? 'الأعمال' : 'أخرى'}</span>
                        )}
                        {contentSpecialty && totalFollowersRange && <span> • </span>}
                        {totalFollowersRange && (
                          <span>👥 المتابعون: {totalFollowersRange}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* معلومات إضافية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      تخصص المحتوى
                    </label>
                    <select 
                      className="nehky-input w-full border-purple-200 focus:border-purple-500 focus:ring-purple-500" 
                      name="contentSpecialty"
                      value={contentSpecialty}
                      onChange={(e) => setContentSpecialty(e.target.value)}
                    >
                      <option value="">اختر تخصصك</option>
                      <option value="technology">التكنولوجيا</option>
                      <option value="lifestyle">أسلوب الحياة</option>
                      <option value="education">التعليم</option>
                      <option value="entertainment">الترفيه</option>
                      <option value="sports">الرياضة</option>
                      <option value="cooking">الطبخ</option>
                      <option value="travel">السفر</option>
                      <option value="fashion">الموضة</option>
                      <option value="business">الأعمال</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      إجمالي المتابعين التقريبي
                    </label>
                    <select 
                      className="nehky-input w-full border-purple-200 focus:border-purple-500 focus:ring-purple-500" 
                      name="totalFollowersRange"
                      value={totalFollowersRange}
                      onChange={(e) => setTotalFollowersRange(e.target.value)}
                    >
                      <option value="">اختر النطاق</option>
                      <option value="1k-10k">1K - 10K متابع</option>
                      <option value="10k-50k">10K - 50K متابع</option>
                      <option value="50k-100k">50K - 100K متابع</option>
                      <option value="100k-500k">100K - 500K متابع</option>
                      <option value="500k-1m">500K - 1M متابع</option>
                      <option value="1m+">أكثر من 1M متابع</option>
                    </select>
                  </div>
                </div>

                {/* الحسابات الاجتماعية */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-purple-700">
                      حساباتك الاجتماعية
                    </label>
                    <button
                      type="button"
                      onClick={addSocialAccount}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                      <Plus size={16} />
                      إضافة حساب
                    </button>
                  </div>

                  {socialAccounts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Hash size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm">لم تضف أي حسابات بعد</p>
                      <p className="text-xs">اضغط "إضافة حساب" لبدء إضافة حساباتك</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {socialAccounts.map((account, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-purple-700">حساب #{index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeSocialAccount(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                المنصة
                              </label>
                              <select
                                value={account.platform}
                                onChange={(e) => updateSocialAccount(index, 'platform', e.target.value)}
                                className="nehky-input w-full text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                              >
                                <option value="">اختر المنصة</option>
                                {PLATFORMS.map((platform) => {
                                  const isCurrentlySelected = account.platform === platform.id;
                                  const isAlreadyUsed = socialAccounts.some(acc => acc.platform === platform.id && socialAccounts.indexOf(acc) !== index);
                                  
                                  return (
                                    <option 
                                      key={platform.id} 
                                      value={platform.id} 
                                      disabled={isAlreadyUsed}
                                      style={isAlreadyUsed ? { color: '#ccc' } : {}}
                                    >
                                      {platform.name} {isAlreadyUsed ? '(مُستخدم)' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                رابط الحساب
                              </label>
                              <input
                                type="url"
                                value={account.link}
                                onChange={(e) => updateSocialAccount(index, 'link', e.target.value)}
                                placeholder="https://..."
                                className={`nehky-input w-full text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${
                                  account.link && !isValidUrl(account.link) ? 'border-red-300 focus:border-red-500' : ''
                                }`}
                              />
                              {account.link && !isValidUrl(account.link) && (
                                <p className="text-xs text-red-500 mt-1">رابط غير صحيح</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                عدد المتابعين
                              </label>
                              <input
                                type="number"
                                value={account.followersCount || ''}
                                onChange={(e) => updateSocialAccount(index, 'followersCount', parseInt(e.target.value) || 0)}
                                placeholder="1000"
                                min="0"
                                className="nehky-input w-full text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                          </div>

                          {/* معاينة المنصة المحددة */}
                          {account.platform && (
                            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                              {(() => {
                                const platform = PLATFORMS.find(p => p.id === account.platform);
                                if (!platform) return null;
                                const IconComponent = platform.icon;
                                return (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className={`w-6 h-6 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center`}>
                                      <IconComponent size={12} className="text-white" />
                                    </div>
                                    <span className="font-medium">{platform.name}</span>
                                    {account.followersCount > 0 && (
                                      <span className="text-gray-500">
                                        ({account.followersCount.toLocaleString()} متابع)
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ملاحظة للمؤثرين */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⭐</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800 mb-1">مزايا المؤثرين في نحكي</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• شارة تحقق مميزة تظهر أنك مؤثر معتمد</li>
                        <li>• أولوية في الظهور والاقتراحات</li>
                        <li>• أدوات تحليل متقدمة لقياس التفاعل</li>
                        <li>• إمكانية الربح من المحتوى</li>
                        <li>• دعم فني مخصص ومتقدم</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : isInfluencer 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                    : 'nehky-btn-primary'
              }`}
            >
              {isLoading 
                ? '⏳ جاري الإنشاء...' 
                : isInfluencer 
                  ? '🌟 إنشاء حساب مؤثر' 
                  : 'إنشاء الحساب'
              }
            </button>
          </form>

          {/* رابط تسجيل الدخول */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="nehky-text-primary hover:text-nehky-primary-light font-medium"
              >
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>

        {/* ملاحظة أمنية */}
        <div className="nehky-alert-success mt-6 text-center text-sm">
          🛡️ نحكي يحمي خصوصيتك ويؤمن بياناتك باستخدام أحدث تقنيات الأمان
        </div>
      </div>
    </div>
  )
}
