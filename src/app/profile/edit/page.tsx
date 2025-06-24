'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import InputWithLogo from '@/components/InputWithLogo';
import TextareaWithLogo from '@/components/TextareaWithLogo';
import { User } from '@prisma/client';

interface EditProfileForm {
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  recoveryEmail?: string; // إيميل الاسترداد
  nationality?: string;
  birthCountry?: string;
  currentCountry?: string;
  graduationYear?: number;
  degree?: string;
  highSchool?: string;
  hobbies?: string[];
  interests?: string[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<EditProfileForm>({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    recoveryEmail: '',
    nationality: '',
    birthCountry: '',
    currentCountry: '',
    graduationYear: undefined,
    degree: '',
    highSchool: '',
    hobbies: [],
    interests: []
  });

  // تحميل بيانات المستخدم عند بداية التحميل
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success && data.user) {
        setUserData(data.user);
        setFormData({
          fullName: data.user.fullName || '',
          username: data.user.username || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          recoveryEmail: data.user.recoveryEmail || '',
          nationality: data.user.nationality || '',
          birthCountry: data.user.birthCountry || '',
          currentCountry: data.user.currentCountry || '',
          graduationYear: data.user.graduationYear || undefined,
          degree: data.user.degree || '',
          highSchool: data.user.highSchool || '',
          hobbies: data.user.hobbies || [],
          interests: data.user.interests || []
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات المستخدم:', error);
      alert('فشل في تحميل بيانات الملف الشخصي');
    }
  };

  const handleInputChange = (field: keyof EditProfileForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'hobbies' | 'interests', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.fullName.trim()) {
      alert('الاسم الكامل مطلوب');
      return;
    }

    if (!formData.username.trim()) {
      alert('اسم المستخدم مطلوب');
      return;
    }

    // التحقق من إيميل الاسترداد إذا تم إدخاله
    if (formData.recoveryEmail && !validateEmail(formData.recoveryEmail)) {
      alert('إيميل الاسترداد غير صالح');
      return;
    }

    // التحقق من الإيميل الرئيسي إذا تم إدخاله
    if (formData.email && !validateEmail(formData.email)) {
      alert('البريد الإلكتروني غير صالح');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم تحديث الملف الشخصي بنجاح');
        router.push('/profile');
      } else {
        alert(data.message || 'فشل في تحديث الملف الشخصي');
      }
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      alert('حدث خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-nehky-primary font-cairo text-right p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => router.back()}
          >
            ← العودة
          </Button>
          <h1 className="text-4xl font-bold text-white animate-fadeInUp">
            تعديل الملف الشخصي
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <Card title="المعلومات الأساسية" gradient="blue" className="animate-slideInRight">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWithLogo
                type="text"
                placeholder="الاسم الكامل *"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
              
              <InputWithLogo
                type="text"
                placeholder="اسم المستخدم *"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
              
              <InputWithLogo
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              
              <InputWithLogo
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </Card>

          {/* إعدادات الأمان */}
          <Card title="إعدادات الأمان" gradient="green" className="animate-slideInLeft">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إيميل الاسترداد (اختياري)
                </label>
                <InputWithLogo
                  type="email"
                  placeholder="أدخل إيميل مختلف لاستعادة الحساب في حالة فقدانه"
                  value={formData.recoveryEmail}
                  onChange={(e) => handleInputChange('recoveryEmail', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  سيتم استخدام هذا الإيميل لإرسال روابط استعادة الحساب في حالة نسيان كلمة المرور أو اسم المستخدم
                </p>
              </div>
            </div>
          </Card>

          {/* المعلومات الشخصية */}
          <Card title="المعلومات الشخصية" gradient="purple" className="animate-slideInRight">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWithLogo
                type="text"
                placeholder="الجنسية"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
              
              <InputWithLogo
                type="text"
                placeholder="بلد الميلاد"
                value={formData.birthCountry}
                onChange={(e) => handleInputChange('birthCountry', e.target.value)}
              />
              
              <InputWithLogo
                type="text"
                placeholder="البلد الحالي"
                value={formData.currentCountry}
                onChange={(e) => handleInputChange('currentCountry', e.target.value)}
              />
              
              <InputWithLogo
                type="number"
                placeholder="سنة التخرج"
                value={formData.graduationYear?.toString() || ''}
                onChange={(e) => handleInputChange('graduationYear', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              
              <InputWithLogo
                type="text"
                placeholder="الدرجة العلمية"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
              />
              
              <InputWithLogo
                type="text"
                placeholder="اسم المدرسة الثانوية"
                value={formData.highSchool}
                onChange={(e) => handleInputChange('highSchool', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الهوايات (مفصولة بفواصل)
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="القراءة، الرياضة، السفر"
                  value={formData.hobbies?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('hobbies', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاهتمامات (مفصولة بفواصل)
                </label>
                <InputWithLogo
                  type="text"
                  placeholder="التقنية، الفن، الطبخ"
                  value={formData.interests?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* أزرار الحفظ */}
          <div className="flex gap-4 justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.back()}
              disabled={loading}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
