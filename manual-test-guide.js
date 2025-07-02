// 🧪 اختبار سريع لتسجيل مؤثر جديد

const testInfluencerForm = () => {
  console.log("🧪 بدء اختبار نموذج المؤثر...");
  
  const testData = {
    fullName: "سارة أحمد المؤثرة",
    username: "sarah_test_influencer", 
    email: "sarah.test@example.com",
    phone: "+201234567890",
    password: "TestPassword123!",
    confirmPassword: "TestPassword123!",
    isInfluencer: true,
    contentSpecialty: "lifestyle",
    totalFollowersRange: "50k-100k",
    socialAccounts: [
      {
        platform: "INSTAGRAM", 
        link: "https://instagram.com/sarah_lifestyle",
        followersCount: 75000
      },
      {
        platform: "TIKTOK",
        link: "https://tiktok.com/@sarah_life", 
        followersCount: 50000
      }
    ]
  };

  console.log("📋 بيانات الاختبار:", JSON.stringify(testData, null, 2));
  console.log("🔍 انتقل إلى http://localhost:3000/register لاختبار النموذج يدوياً");
  console.log("✅ تأكد من:");
  console.log("  - ظهور حقول المؤثر عند تحديد التشيك بوكس");
  console.log("  - عمل قوائم التخصص ونطاق المتابعين"); 
  console.log("  - إمكانية إضافة وحذف الحسابات الاجتماعية");
  console.log("  - منع اختيار نفس المنصة أكثر من مرة");
  console.log("  - التحقق من صحة الروابط");
};

testInfluencerForm();
