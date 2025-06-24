"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Hash, 
  AtSign, 
  Eye, 
  EyeOff, 
  Users, 
  Lock,
  Save,
  Send,
  X,
  Plus
} from 'lucide-react';
import ResponsiveLayout, { useDeviceInfo } from '@/components/ResponsiveLayout';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useDataRefresh } from '@/lib/DataRefreshContext';

interface MediaFile {
  file: File;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  preview?: string;
}

interface CreatePostData {
  content: string;
  media: MediaFile[];
  hashtags: string[];
  keywords: string[];
  status: 'DRAFT' | 'PUBLISHED';
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  publishedForId?: string;
}

const EnhancedCreatePostPage = () => {
  const [formData, setFormData] = useState<CreatePostData>({
    content: '',
    media: [],
    hashtags: [],
    keywords: [],
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    publishedForId: undefined
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const router = useRouter();
  const { triggerMultipleRefresh } = useDataRefresh();
  const { isMobile } = useDeviceInfo();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData(prev => ({ ...prev, content }));
    
    // استخراج الهاشتاجات تلقائياً
    const autoHashtags = content.match(/#[\w\u0600-\u06FF]+/g) || [];
    const cleanHashtags = autoHashtags.map(tag => tag.replace('#', ''));
    
    // استخراج المنشنات تلقائياً  
    const autoMentions = content.match(/@[\w\u0600-\u06FF]+/g) || [];
    const cleanMentions = autoMentions.map(mention => mention.replace('@', ''));
    
    // دمج الهاشتاجات والكلمات المفتاحية
    const combinedKeywords = [...cleanHashtags, ...cleanMentions, ...formData.keywords];
    const uniqueKeywords = Array.from(new Set(combinedKeywords));
    
    setFormData(prev => ({
      ...prev,
      hashtags: cleanHashtags,
      keywords: uniqueKeywords
    }));
    
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newMedia: MediaFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('حجم الملف كبير جداً (الحد الأقصى 50MB)');
        return;
      }
      
      let type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' = 'DOCUMENT';
      
      if (file.type.startsWith('image/')) {
        type = 'IMAGE';
      } else if (file.type.startsWith('video/')) {
        type = 'VIDEO';
      }
      
      const mediaFile: MediaFile = {
        file,
        type
      };
      
      // إنشاء معاينة للصور
      if (type === 'IMAGE') {
        const reader = new FileReader();
        reader.onload = (e) => {
          mediaFile.preview = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            media: [...prev.media, mediaFile]
          }));
        };
        reader.readAsDataURL(file);
      } else {
        newMedia.push(mediaFile);
      }
    });
    
    if (newMedia.length > 0) {
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, ...newMedia]
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()],
        keywords: [...prev.keywords, hashtagInput.trim()]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag),
      keywords: prev.keywords.filter(k => k !== hashtag)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const uploadMediaFiles = async (): Promise<any[]> => {
    const uploadedMedia = [];
    
    for (const mediaFile of formData.media) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', mediaFile.file);
      formDataUpload.append('type', mediaFile.type);
      
      try {
        // هذا مجرد محاكاة - في التطبيق الحقيقي ستحتاج إلى API لرفع الملفات
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataUpload
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedMedia.push({
            type: mediaFile.type,
            url: uploadData.url,
            filename: mediaFile.file.name,
            size: mediaFile.file.size
          });
        }
      } catch (err) {
        console.error('خطأ في رفع الملف:', err);
        // استخدام URL مؤقت للاختبار
        uploadedMedia.push({
          type: mediaFile.type,
          url: `/uploads/${mediaFile.file.name}`,
          filename: mediaFile.file.name,
          size: mediaFile.file.size
        });
      }
    }
    
    return uploadedMedia;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.content.trim()) {
      setError('يرجى كتابة محتوى المنشور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      // رفع الملفات أولاً
      const uploadedMedia = await uploadMediaFiles();

      const postData = {
        content: formData.content,
        media: uploadedMedia,
        hashtags: formData.hashtags,
        keywords: formData.keywords,
        status: isDraft ? 'DRAFT' : formData.status,
        visibility: formData.visibility,
        publishedForId: formData.publishedForId
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        const successMessage = isDraft ? 'تم حفظ المسودة بنجاح! 📝' : 'تم نشر المنشور بنجاح! 🎉';
        setMessage(successMessage);
        
        // إعادة تعيين النموذج
        setFormData({
          content: '',
          media: [],
          hashtags: [],
          keywords: [],
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          publishedForId: undefined
        });
        
        // تشغيل تحديث البيانات
        console.log('🚀 تشغيل تحديث البيانات بعد إضافة منشور جديد');
        triggerMultipleRefresh(['posts', 'dashboard', 'trending']);
        
        // العودة للصفحة المناسبة
        setTimeout(() => {
          router.push('/feed');
        }, 2000);
      } else {
        setError(data.message || 'حدث خطأ في النشر');
      }
    } catch (error) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Create post error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <ResponsiveLayout title="إنشاء منشور جديد">
      <div className={`container mx-auto px-4 py-6 max-w-4xl ${isMobile ? 'mb-16' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push('/feed')}
            variant="ghost"
            size="md"
            className="flex items-center gap-2"
          >
            <ArrowRight size={20} />
            {!isMobile && 'العودة'}
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1">
            إنشاء منشور جديد
          </h1>
        </div>

        {/* رسائل النجاح والخطأ */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* محتوى المنشور */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                محتوى المنشور
              </label>
              <textarea
                value={formData.content}
                onChange={handleContentChange}
                placeholder="ماذا تريد أن تشارك اليوم؟ استخدم # للهاشتاجات و @ للإشارات..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
              />
              
              {/* عداد الأحرف */}
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{formData.content.length} حرف</span>
                <span className={formData.content.length > 2000 ? 'text-red-500' : ''}>
                  الحد الأقصى: 2000 حرف
                </span>
              </div>
            </div>

            {/* رفع الملفات */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                إضافة وسائط
              </label>
              
              {/* منطقة السحب والإفلات */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  اسحب وأفلت الملفات هنا أو
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="secondary" size="sm" className="cursor-pointer">
                    اختر الملفات
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  الصور، الفيديوهات، المستندات (حتى 50MB لكل ملف)
                </p>
              </div>

              {/* معاينة الملفات المرفوعة */}
              {formData.media.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-gray-700">الملفات المرفقة:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.media.map((media, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {media.type === 'IMAGE' && media.preview ? (
                              <img 
                                src={media.preview} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                {media.type === 'IMAGE' && <Image size={20} />}
                                {media.type === 'VIDEO' && <Video size={20} />}
                                {media.type === 'DOCUMENT' && <FileText size={20} />}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {media.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(media.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            onClick={() => removeMedia(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* الهاشتاجات والكلمات المفتاحية */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                الهاشتاجات والكلمات المفتاحية
              </label>
              
              {/* إضافة هاشتاج */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addHashtag)}
                      placeholder="إضافة هاشتاج"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <Button onClick={addHashtag} variant="secondary" size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* عرض الهاشتاجات */}
              {formData.hashtags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">الهاشتاجات:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                      >
                        <Hash size={12} />
                        {hashtag}
                        <button
                          onClick={() => removeHashtag(hashtag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* إضافة كلمة مفتاحية */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addKeyword)}
                      placeholder="إضافة كلمة مفتاحية"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <Button onClick={addKeyword} variant="secondary" size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* عرض الكلمات المفتاحية */}
              {formData.keywords.filter(k => !formData.hashtags.includes(k)).length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">الكلمات المفتاحية:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.filter(k => !formData.hashtags.includes(k)).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full"
                      >
                        <AtSign size={12} />
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* العمود الجانبي - الإعدادات */}
          <div className="space-y-6">
            
            {/* إعدادات النشر */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات النشر</h3>
              
              {/* حالة المنشور */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة المنشور
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="PUBLISHED">منشور</option>
                  <option value="DRAFT">مسودة</option>
                </select>
              </div>

              {/* مستوى الرؤية */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مستوى الرؤية
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="PUBLIC">عام</option>
                  <option value="FOLLOWERS">للمتابعين فقط</option>
                  <option value="PRIVATE">خاص</option>
                </select>
              </div>

              {/* الرموز التوضيحية */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                {formData.visibility === 'PUBLIC' && <><Eye size={16} /> مرئي للجميع</>}
                {formData.visibility === 'FOLLOWERS' && <><Users size={16} /> للمتابعين فقط</>}
                {formData.visibility === 'PRIVATE' && <><Lock size={16} /> خاص</>}
              </div>
            </div>

            {/* أزرار العمل */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading || !formData.content.trim()}
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send size={18} />
                      نشر المنشور
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading || !formData.content.trim()}
                  variant="secondary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  حفظ كمسودة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">معاينة سريعة</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>الأحرف: {formData.content.length}</div>
                <div>الهاشتاجات: {formData.hashtags.length}</div>
                <div>الكلمات المفتاحية: {formData.keywords.length}</div>
                <div>الملفات المرفقة: {formData.media.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default EnhancedCreatePostPage;
