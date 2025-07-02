// بيانات طرق الدفع المصرية الأساسية
import { PrismaClient } from '@prisma/client'

// تعريف محلي لطرق الدفع (حيث أن enum غير مُصدر من Prisma Client لعدم استخدامه)
enum InfluencerPaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_WALLET = 'MOBILE_WALLET',
  PAYPAL = 'PAYPAL',
  WISE = 'WISE',
  WESTERN_UNION = 'WESTERN_UNION',
  VODAFONE_CASH = 'VODAFONE_CASH',
  ORANGE_MONEY = 'ORANGE_MONEY',
  FAWRY = 'FAWRY',
  CHECK = 'CHECK',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
  OTHER = 'OTHER'
}

const prisma = new PrismaClient()

// جدول طرق الدفع المصرية (تم إنشاؤه كـ static data لحين إضافة الجدول الفعلي)
export const egyptianPaymentMethods = [
  {
    method: InfluencerPaymentMethod.VODAFONE_CASH,
    nameAr: 'فودافون كاش',
    nameEn: 'Vodafone Cash',
    description: 'محفظة موبايل من فودافون مصر للمدفوعات الإلكترونية',
    minAmount: 1.00,
    maxAmount: 50000.00,
    dailyLimit: 20000.00,
    fixedFee: 0.00,
    percentageFee: 0.0000, // مجاني للتحويلات
    isActive: true,
    isForInfluencers: true,
    processingTime: 'فوري - خلال دقائق',
    customerService: '16555',
    website: 'https://vodafonecash.vodafone.com.eg',
    mobileApp: 'Vodafone Cash',
    requiresKYC: true,
    requiresPhone: true,
    requiresBankAccount: false
  },
  {
    method: InfluencerPaymentMethod.ORANGE_MONEY,
    nameAr: 'أورانج موني',
    nameEn: 'Orange Money',
    description: 'محفظة رقمية من أورانج مصر للمدفوعات والتحويلات',
    minAmount: 1.00,
    maxAmount: 30000.00,
    dailyLimit: 15000.00,
    fixedFee: 0.00,
    percentageFee: 0.0000,
    isActive: true,
    isForInfluencers: true,
    processingTime: 'فوري - خلال دقائق',
    customerService: '2510',
    website: 'https://www.orange.eg/orangemoney',
    mobileApp: 'Orange Money',
    requiresKYC: true,
    requiresPhone: true,
    requiresBankAccount: false
  },
  {
    method: InfluencerPaymentMethod.FAWRY,
    nameAr: 'فوري',
    nameEn: 'Fawry',
    description: 'شبكة مدفوعات رقمية رائدة في مصر',
    minAmount: 5.00,
    maxAmount: 100000.00,
    dailyLimit: 50000.00,
    fixedFee: 2.00,
    percentageFee: 0.0150, // 1.5%
    isActive: true,
    isForInfluencers: true,
    processingTime: 'فوري إلى 24 ساعة',
    customerService: '16049',
    website: 'https://www.fawry.com',
    mobileApp: 'Fawry',
    requiresKYC: false,
    requiresPhone: true,
    requiresBankAccount: false
  },
  {
    method: InfluencerPaymentMethod.BANK_TRANSFER,
    nameAr: 'تحويل بنكي',
    nameEn: 'Bank Transfer',
    description: 'تحويل مباشر للحساب البنكي عبر البنوك المصرية',
    minAmount: 100.00,
    maxAmount: 500000.00,
    dailyLimit: 100000.00,
    fixedFee: 5.00,
    percentageFee: 0.0025, // 0.25%
    isActive: true,
    isForInfluencers: true,
    processingTime: '1-3 أيام عمل',
    customerService: 'حسب البنك',
    website: null,
    mobileApp: null,
    requiresKYC: true,
    requiresPhone: false,
    requiresBankAccount: true
  },
  {
    method: InfluencerPaymentMethod.PAYPAL,
    nameAr: 'باي بال',
    nameEn: 'PayPal',
    description: 'منصة دفع دولية - متاحة للمؤثرين خارج مصر',
    minAmount: 25.00, // بالدولار
    maxAmount: 10000.00,
    dailyLimit: 5000.00,
    fixedFee: 1.50,
    percentageFee: 0.0290, // 2.9%
    isActive: true,
    isForInfluencers: true,
    processingTime: 'فوري إلى 24 ساعة',
    customerService: '+1-402-935-2050',
    website: 'https://www.paypal.com',
    mobileApp: 'PayPal',
    requiresKYC: true,
    requiresPhone: false,
    requiresBankAccount: false
  },
  {
    method: InfluencerPaymentMethod.WISE,
    nameAr: 'وايز',
    nameEn: 'Wise (TransferWise)',
    description: 'تحويلات دولية بأسعار صرف حقيقية ورسوم منخفضة',
    minAmount: 50.00,
    maxAmount: 25000.00,
    dailyLimit: 10000.00,
    fixedFee: 3.00,
    percentageFee: 0.0080, // 0.8%
    isActive: true,
    isForInfluencers: true,
    processingTime: '1-4 أيام عمل',
    customerService: '+44 20 3695 8080',
    website: 'https://wise.com',
    mobileApp: 'Wise',
    requiresKYC: true,
    requiresPhone: true,
    requiresBankAccount: true
  },
  {
    method: InfluencerPaymentMethod.WESTERN_UNION,
    nameAr: 'ويسترن يونيون',
    nameEn: 'Western Union',
    description: 'تحويلات نقدية دولية - يمكن استلامها من فروع البنوك',
    minAmount: 50.00,
    maxAmount: 15000.00,
    dailyLimit: 5000.00,
    fixedFee: 15.00,
    percentageFee: 0.0500, // 5%
    isActive: true,
    isForInfluencers: true,
    processingTime: 'فوري - خلال 15 دقيقة',
    customerService: '16990',
    website: 'https://www.westernunion.com',
    mobileApp: 'Western Union',
    requiresKYC: true,
    requiresPhone: true,
    requiresBankAccount: false
  }
]

// دالة لإدراج البيانات في قاعدة البيانات
// مُعطلة مؤقتاً حتى يتم إنشاء جدول EgyptianPaymentMethod في schema
export async function seedEgyptianPaymentMethods() {
  console.log('🏦 إدراج طرق الدفع المصرية...')
  console.log('⚠️  هذه الدالة معطلة مؤقتاً - جدول EgyptianPaymentMethod غير موجود في schema')
  
  // TODO: إضافة جدول EgyptianPaymentMethod إلى schema.prisma
  // ثم تفعيل الكود التالي:
  
  /*
  try {
    for (const method of egyptianPaymentMethods) {
      await prisma.egyptianPaymentMethod.upsert({
        where: { method: method.method },
        update: method,
        create: method,
      })
      console.log(`✅ تم إدراج: ${method.nameAr}`)
    }
    
    console.log(`🎉 تم إدراج ${egyptianPaymentMethods.length} طريقة دفع مصرية`)
  } catch (error) {
    console.error('❌ خطأ في إدراج طرق الدفع المصرية:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
  */
  
  return true // تم تعطيل الدالة مؤقتاً
}

// تشغيل البذر إذا تم استدعاء الملف مباشرة
if (require.main === module) {  // ← هذا السطر تم تغييره
  seedEgyptianPaymentMethods()
    .then(() => {
      console.log('✅ تم إدراج البيانات بنجاح')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ فشل في إدراج البيانات:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}