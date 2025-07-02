/**
 * نظام كشف الحسابات الوهمية ومنع إساءة استخدام الإحالات
 * Anti-Fake Account & Referral Abuse Detection System
 * 
 * يوفر:
 * - كشف التسجيل من نفس IP/جهاز
 * - تحليل السلوك المشبوه
 * - منع منح مكافآت للحسابات الوهمية
 * - تسجيل مفصل لعمليات الإحالة
 */

import { PrismaClient } from '@prisma/client';

export interface AntiAbuseConfig {
  maxAccountsPerIp: number;        // أقصى عدد حسابات من نفس IP (افتراضي: 3)
  maxAccountsPerDevice: number;    // أقصى عدد حسابات من نفس جهاز (افتراضي: 3)
  timeWindowHours: number;         // النافذة الزمنية بالساعات (افتراضي: 24)
  minimumActiveHours: number;      // الحد الأدنى للنشاط بالساعات (افتراضي: 48)
  minimumInteractions: number;     // الحد الأدنى للتفاعلات (افتراضي: 3)
  fakeScoreThreshold: number;      // حد درجة الحساب الوهمي (افتراضي: 0.7)
  rewardDelayHours: number;        // تأخير منح المكافأة بالساعات (افتراضي: 48)
}

export const DEFAULT_ANTIABUSE_CONFIG: AntiAbuseConfig = {
  maxAccountsPerIp: 3,
  maxAccountsPerDevice: 3,
  timeWindowHours: 24,
  minimumActiveHours: 48,
  minimumInteractions: 3,
  fakeScoreThreshold: 0.7,
  rewardDelayHours: 48,
};

export interface UserRegistrationData {
  userId: string;
  phoneNumber: string;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  geoLocation?: string;
  referrerId?: string;
}

export interface FakeDetectionResult {
  isSuspicious: boolean;
  fakeScore: number;           // 0.0 = حقيقي، 1.0 = وهمي
  suspiciousFactors: string[];
  canGetReward: boolean;
  recommendedAction: 'approve' | 'manual_review' | 'reject';
  reason: string;
}

export class AntiAbuseService {
  private prisma: PrismaClient;
  private config: AntiAbuseConfig;

  constructor(prisma: PrismaClient, config: AntiAbuseConfig = DEFAULT_ANTIABUSE_CONFIG) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * فحص التسجيل الجديد للتأكد من عدم وجود إساءة استخدام
   */
  async checkRegistrationAbuse(data: UserRegistrationData): Promise<FakeDetectionResult> {
    const suspiciousFactors: string[] = [];
    let fakeScore = 0;

    try {
      // 1. فحص عدد الحسابات من نفس IP
      const ipAccountsCount = await this.getAccountsCountFromIp(
        data.ipAddress, 
        this.config.timeWindowHours
      );

      if (ipAccountsCount >= this.config.maxAccountsPerIp) {
        suspiciousFactors.push(`تم إنشاء ${ipAccountsCount} حسابات من نفس IP خلال ${this.config.timeWindowHours} ساعة`);
        fakeScore += 0.4;
      }

      // 2. فحص عدد الحسابات من نفس الجهاز
      if (data.deviceFingerprint) {
        const deviceAccountsCount = await this.getAccountsCountFromDevice(
          data.deviceFingerprint,
          this.config.timeWindowHours
        );

        if (deviceAccountsCount >= this.config.maxAccountsPerDevice) {
          suspiciousFactors.push(`تم إنشاء ${deviceAccountsCount} حسابات من نفس الجهاز خلال ${this.config.timeWindowHours} ساعة`);
          fakeScore += 0.4;
        }
      }

      // 3. فحص أنماط الـ User Agent المشبوهة
      if (this.isSuspiciousUserAgent(data.userAgent)) {
        suspiciousFactors.push('User Agent مشبوه (قد يكون بوت أو أتمتة)');
        fakeScore += 0.3;
      }

      // 4. فحص الموقع الجغرافي المشبوه
      if (data.geoLocation) {
        const isSuspiciousLocation = await this.checkSuspiciousLocation(
          data.geoLocation,
          data.referrerId
        );
        if (isSuspiciousLocation) {
          suspiciousFactors.push('موقع جغرافي مشبوه أو غير متوقع');
          fakeScore += 0.2;
        }
      }

      // 5. فحص نمط رقم الهاتف
      if (this.isSuspiciousPhonePattern(data.phoneNumber)) {
        suspiciousFactors.push('نمط رقم هاتف مشبوه');
        fakeScore += 0.3;
      }

      // تحديد النتيجة النهائية
      const isSuspicious = fakeScore > this.config.fakeScoreThreshold;
      const canGetReward = !isSuspicious && suspiciousFactors.length === 0;

      let recommendedAction: 'approve' | 'manual_review' | 'reject' = 'approve';
      let reason = 'التسجيل طبيعي';

      if (fakeScore >= 0.8) {
        recommendedAction = 'reject';
        reason = 'احتمالية عالية جداً للحساب الوهمي';
      } else if (fakeScore >= this.config.fakeScoreThreshold) {
        recommendedAction = 'manual_review';
        reason = 'يحتاج مراجعة يدوية';
      } else if (suspiciousFactors.length > 0) {
        recommendedAction = 'manual_review';
        reason = 'عوامل مشبوهة تتطلب المراجعة';
      }

      return {
        isSuspicious,
        fakeScore: Math.round(fakeScore * 100) / 100, // تقريب لرقمين عشريين
        suspiciousFactors,
        canGetReward,
        recommendedAction,
        reason,
      };

    } catch (error) {
      console.error('خطأ في فحص إساءة الاستخدام:', error);
      
      // في حالة الخطأ، نرفض منح المكافأة احتياطاً
      return {
        isSuspicious: true,
        fakeScore: 1.0,
        suspiciousFactors: ['خطأ في النظام - تم الرفض احتياطاً'],
        canGetReward: false,
        recommendedAction: 'manual_review',
        reason: 'خطأ تقني يتطلب مراجعة يدوية',
      };
    }
  }

  /**
   * تسجيل عملية إحالة في جدول التدقيق
   */
  async logReferralAudit(
    data: UserRegistrationData,
    detectionResult: FakeDetectionResult
  ): Promise<void> {
    if (!data.referrerId) return;

    try {
      await this.prisma.referralAuditLog.create({
        data: {
          referredUserId: data.userId,
          referrerId: data.referrerId,
          ipAddress: data.ipAddress,
          deviceFingerprint: data.deviceFingerprint || data.userAgent,
          userAgent: data.userAgent,
          geoLocation: data.geoLocation,
          isVerified: false, // سيتم التحديث لاحقاً
          phoneVerified: false, // سيتم التحديث بعد تحقق OTP
          behaviorVerified: false, // سيتم التحديث بعد مراقبة السلوك
          fakeScore: detectionResult.fakeScore,
          suspiciousFactors: detectionResult.suspiciousFactors,
          rewardGranted: detectionResult.canGetReward,
          reviewStatus: detectionResult.recommendedAction === 'approve' ? 'approved' : 'pending',
          totalInteractions: 0,
          activeDays: 0,
        }
      });

      console.log(`تم تسجيل عملية إحالة: ${data.userId} من ${data.referrerId}`);
    } catch (error) {
      console.error('خطأ في تسجيل عملية الإحالة:', error);
    }
  }

  /**
   * تحديث حالة التحقق بعد تأكيد رقم الهاتف
   */
  async updatePhoneVerificationStatus(userId: string): Promise<void> {
    try {
      await this.prisma.referralAuditLog.updateMany({
        where: { referredUserId: userId },
        data: { phoneVerified: true }
      });

      console.log(`تم تحديث حالة تحقق الهاتف للمستخدم: ${userId}`);
    } catch (error) {
      console.error('خطأ في تحديث حالة تحقق الهاتف:', error);
    }
  }

  /**
   * مراقبة سلوك المستخدم وتحديث درجة الوهمية
   */
  async monitorUserBehavior(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          createdAt: true,
          interactions: {
            select: { id: true, createdAt: true }
          },
          posts: {
            select: { id: true, createdAt: true }
          }
        }
      });

      if (!user) return;

      const now = new Date();
      const registrationTime = user.createdAt;
      const hoursSinceRegistration = (now.getTime() - registrationTime.getTime()) / (1000 * 60 * 60);
      const totalInteractions = user.interactions.length + user.posts.length;

      // حساب الأيام النشطة
      const activeDays = this.calculateActiveDays(user.interactions, user.posts, registrationTime);

      // تحديث سجل التدقيق
      await this.prisma.referralAuditLog.updateMany({
        where: { referredUserId: userId },
        data: {
          totalInteractions,
          activeDays,
          behaviorVerified: hoursSinceRegistration >= this.config.minimumActiveHours && 
                           totalInteractions >= this.config.minimumInteractions,
        }
      });

      // إذا كان المستخدم قد حقق الشروط، يمكن منح المكافأة
      if (hoursSinceRegistration >= this.config.rewardDelayHours && 
          totalInteractions >= this.config.minimumInteractions) {
        await this.approveReferralReward(userId);
      }

    } catch (error) {
      console.error('خطأ في مراقبة سلوك المستخدم:', error);
    }
  }

  /**
   * الموافقة على منح مكافأة الإحالة
   */
  private async approveReferralReward(userId: string): Promise<void> {
    try {
      const auditLog = await this.prisma.referralAuditLog.findFirst({
        where: { 
          referredUserId: userId,
          rewardGranted: false,
          fakeScore: { lt: this.config.fakeScoreThreshold }
        }
      });

      if (auditLog) {
        await this.prisma.referralAuditLog.update({
          where: { id: auditLog.id },
          data: {
            rewardGranted: true,
            rewardAmount: 10, // مثال - يمكن تخصيصها
            rewardType: 'points',
            reviewStatus: 'approved',
            reviewedAt: new Date(),
            reviewNotes: 'تمت الموافقة تلقائياً بعد تحقق الشروط'
          }
        });

        console.log(`تمت الموافقة على مكافأة الإحالة للمستخدم: ${userId}`);
      }
    } catch (error) {
      console.error('خطأ في الموافقة على مكافأة الإحالة:', error);
    }
  }

  /**
   * حساب عدد الحسابات من نفس IP
   */
  private async getAccountsCountFromIp(ipAddress: string, hoursWindow: number): Promise<number> {
    const timeThreshold = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);
    
    return await this.prisma.user.count({
      where: {
        registrationIp: ipAddress,
        createdAt: { gte: timeThreshold }
      }
    });
  }

  /**
   * حساب عدد الحسابات من نفس الجهاز
   */
  private async getAccountsCountFromDevice(deviceFingerprint: string, hoursWindow: number): Promise<number> {
    const timeThreshold = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);
    
    return await this.prisma.user.count({
      where: {
        deviceFingerprint,
        createdAt: { gte: timeThreshold }
      }
    });
  }

  /**
   * فحص User Agent المشبوه
   */
  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /headless/i,
      /phantom/i,
      /selenium/i,
      /automation/i,
      /python/i,
      /curl/i,
      /wget/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * فحص الموقع الجغرافي المشبوه
   */
  private async checkSuspiciousLocation(geoLocation: string, referrerId?: string): Promise<boolean> {
    // TODO: تنفيذ منطق فحص الموقع الجغرافي
    // مثل: مقارنة موقع المُحال مع موقع المُحيل
    // أو فحص البلدان المعروفة بالنشاط المشبوه
    
    return false; // مؤقتاً
  }

  /**
   * فحص نمط رقم الهاتف المشبوه
   */
  private isSuspiciousPhonePattern(phoneNumber: string): boolean {
    // فحص أرقام متتالية أو متكررة
    const consecutivePattern = /(\d)\1{4,}/; // 5 أرقام متتالية أو أكثر
    const sequentialPattern = /(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)/;
    
    return consecutivePattern.test(phoneNumber) || sequentialPattern.test(phoneNumber);
  }

  /**
   * حساب الأيام النشطة للمستخدم
   */
  private calculateActiveDays(
    interactions: Array<{ createdAt: Date }>,
    posts: Array<{ createdAt: Date }>,
    registrationDate: Date
  ): number {
    const allActions = [...interactions, ...posts];
    const actionDates = allActions.map(action => 
      action.createdAt.toDateString()
    );
    
    // إزالة التكرارات للحصول على الأيام الفريدة
    const uniqueDays = Array.from(new Set(actionDates));
    
    return uniqueDays.length;
  }

  /**
   * الحصول على إحصائيات الإحالة للمؤثر
   */
  async getReferrerStats(referrerId: string): Promise<{
    totalReferrals: number;
    approvedReferrals: number;
    pendingReferrals: number;
    rejectedReferrals: number;
    suspiciousReferrals: number;
    averageFakeScore: number;
  }> {
    const stats = await this.prisma.referralAuditLog.groupBy({
      by: ['reviewStatus'],
      where: { referrerId },
      _count: { id: true },
      _avg: { fakeScore: true }
    });

    const totalReferrals = stats.reduce((sum, stat) => sum + stat._count.id, 0);
    const approvedReferrals = stats.find(s => s.reviewStatus === 'approved')?._count.id || 0;
    const pendingReferrals = stats.find(s => s.reviewStatus === 'pending')?._count.id || 0;
    const rejectedReferrals = stats.find(s => s.reviewStatus === 'rejected')?._count.id || 0;

    const suspiciousReferrals = await this.prisma.referralAuditLog.count({
      where: {
        referrerId,
        fakeScore: { gte: this.config.fakeScoreThreshold }
      }
    });

    const avgStats = await this.prisma.referralAuditLog.aggregate({
      where: { referrerId },
      _avg: { fakeScore: true }
    });

    return {
      totalReferrals,
      approvedReferrals,
      pendingReferrals,
      rejectedReferrals,
      suspiciousReferrals,
      averageFakeScore: avgStats._avg.fakeScore || 0,
    };
  }
}
