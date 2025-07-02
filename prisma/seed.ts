// ملف بذور قاعدة البيانات - Nehky Platform Database Seed
import { PrismaClient } from '@prisma/client'
import { seedEgyptianPaymentMethods } from '../src/lib/egyptian-payment-methods'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء عملية زراعة بيانات قاعدة البيانات...')
  
  try {
    // زراعة بيانات طرق الدفع المصرية
    console.log('📱 زراعة بيانات طرق الدفع المصرية...')
    await seedEgyptianPaymentMethods()
    
    console.log('✅ تمت عملية زراعة البيانات بنجاح!')
  } catch (error) {
    console.error('❌ خطأ في عملية زراعة البيانات:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
