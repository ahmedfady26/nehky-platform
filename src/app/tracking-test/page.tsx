// 🧪 صفحة تجريبية لنظام التتبع المتقدم
// منصة نحكي - Nehky.com

import TrackedPost from '@/components/TrackedPost';

export default function TrackingTestPage() {
  const samplePosts = [
    {
      postId: '1',
      content: 'مرحباً بكم في منصة نحكي! هذا منشور تجريبي لاختبار نظام التتبع المتقدم. يمكنكم التفاعل معه عبر الإعجاب والتعليق والمشاركة.',
      author: 'أحمد محمد',
      mediaType: 'IMAGE' as const,
      mediaUrl: 'https://via.placeholder.com/600x400/3B82F6/ffffff?text=صورة+تجريبية'
    },
    {
      postId: '2',
      content: 'هذا مثال على منشور فيديو. النظام يتتبع مدة المشاهدة، عدد مرات التشغيل، والتفاعل مع عناصر التحكم.',
      author: 'سارة أحمد',
      mediaType: 'VIDEO' as const,
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoDuration: 596
    },
    {
      postId: '3',
      content: 'منشور نصي بسيط لاختبار تتبع التمرير والوقت المقضي في القراءة. النظام يحلل سرعة التمرير، الوقت المقضي، ونقاط التوقف أثناء القراءة. هذا المحتوى الطويل يساعد في فهم سلوك المستخدم أثناء التصفح والقراءة.',
      author: 'محمد علي',
    },
    {
      postId: '4',
      content: '🎯 اختبار نظام التتبع المتقدم:\n\n• تتبع التمرير والوقت المقضي\n• تحليل مشاهدة الفيديو\n• رصد التفاعل (إعجاب، تعليق، مشاركة)\n• تحديث الاهتمامات تلقائياً\n• إنشاء ملف المستخدم الذكي',
      author: 'فريق نحكي',
      mediaType: 'IMAGE' as const,
      mediaUrl: 'https://via.placeholder.com/600x300/10B981/ffffff?text=نظام+التتبع+المتقدم'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            🔍 اختبار نظام التتبع المتقدم
          </h1>
          <p className="text-gray-600 text-center mt-2">
            تفاعل مع المنشورات واختبر النظام المتطور لتحليل سلوك المستخدم
          </p>
        </div>
      </header>

      {/* معلومات النظام */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            🚀 ميزات النظام المتقدم
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">📱 تتبع التمرير</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• عمق التمرير والوقت المقضي</li>
                <li>• سرعة التمرير ونقاط التوقف</li>
                <li>• تحليل سلوك القراءة</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">🎬 تتبع الفيديو</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• نسبة المشاهدة والإكمال</li>
                <li>• عدد مرات التشغيل والإيقاف</li>
                <li>• تفاعل مع عناصر التحكم</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">👍 تتبع التفاعل</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• الإعجاب والتعليق والمشاركة</li>
                <li>• وقت التفاعل وموقع النقر</li>
                <li>• تحليل نوع الجهاز</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">🧠 الذكاء الاصطناعي</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• تحديث الاهتمامات تلقائياً</li>
                <li>• إنشاء ملف المستخدم الذكي</li>
                <li>• اقتراحات محتوى مخصصة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* تعليمات الاستخدام */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">
            📋 كيفية الاختبار
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-green-800 mb-2">اختبار التمرير:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• مرر ببطء عبر المنشورات</li>
                <li>• توقف عند محتوى مثير للاهتمام</li>
                <li>• لاحظ كيف يتتبع النظام سلوكك</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-2">اختبار الفيديو:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• شغل الفيديو وأوقفه</li>
                <li>• جرب التقديم والتأخير</li>
                <li>• راقب تتبع نسبة المشاهدة</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-2">اختبار التفاعل:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• اضغط على أزرار الإعجاب</li>
                <li>• اكتب تعليقات وشارك المحتوى</li>
                <li>• لاحظ تتبع موقع النقر</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-2">مراقبة البيانات:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• افتح أدوات المطور (F12)</li>
                <li>• راقب Network tab للمكالمات</li>
                <li>• تحقق من Console للرسائل</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* المنشورات التجريبية */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-8">
          {samplePosts.map((post) => (
            <TrackedPost
              key={post.postId}
              postId={post.postId}
              content={post.content}
              author={post.author}
              mediaUrl={post.mediaUrl}
              mediaType={post.mediaType}
              videoDuration={post.videoDuration}
            />
          ))}
        </div>

        {/* ملاحظة */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            💡 النظام يعمل في الخلفية لتحليل سلوكك وتحسين تجربة التصفح
          </p>
        </div>
      </main>
    </div>
  );
}
