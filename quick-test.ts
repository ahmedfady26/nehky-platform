// اختبار سريع للتأكد من عمل المنصة
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickTest() {
  try {
    console.log("🔍 اختبار سريع للمنصة...")
    
    // Test basic models
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()
    const adminCount = await prisma.admin.count()
    
    console.log(`✅ Users: ${userCount}`)
    console.log(`✅ Posts: ${postCount}`)
    console.log(`✅ Admins: ${adminCount}`)
    
    console.log("🎉 المنصة تعمل بشكل طبيعي!")
    
  } catch (error) {
    console.error("❌ خطأ:", error)
  } finally {
    await prisma.$disconnect()
  }
}

quickTest()
