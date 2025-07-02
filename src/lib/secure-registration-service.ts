/**
 * خدمة التسجيل المتكاملة مع التحقق من OTP ومنع الحسابات الوهمية
 * Integrated Registration Service with OTP Verification & Anti-Abuse Protection
 * 
 * تجمع بين:
 * - التحقق من رقم الهاتف عبر OTP
 * - كشف الحسابات الوهمية
 * - تسجيل عمليات الإحالة
 * - منع إساءة الاستخدام
 */

import { PrismaClient } from '@prisma/client';
import { OTPService } from './otp-service';
import { AntiAbuseService, type UserRegistrationData } from './anti-abuse-service';
import crypto from 'crypto';

export interface RegistrationRequest {
  fullName: string;
  username: string;
  phoneNumber: string;
  password: string;
  gender?: 'MALE' | 'FEMALE';
  age?: number;
  
  // معلومات الأمان
  ipAddress: string;
  userAgent: string;
  geoLocation?: string;
  
  // معلومات الإحالة
  referrerCode?: string; // كود الإحالة
  referrerId?: string;   // ID المُحيل
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
  requiresOTP: boolean;
  otpSent?: boolean;
  securityFlags?: {
    isSuspicious: boolean;
    fakeScore: number;
    requiresManualReview: boolean;
  };
}

export interface OTPVerificationRequest {
  phoneNumber: string;
  otpCode: string;
  completeRegistration?: boolean;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  userId?: string;
  isRegistrationComplete?: boolean;
  referralRewardEligible?: boolean;
}

export class SecureRegistrationService {
  private prisma: PrismaClient;
  private otpService: OTPService;
  private antiAbuseService: AntiAbuseService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.otpService = new OTPService(prisma);
    this.antiAbuseService = new AntiAbuseService(prisma);
  }

  /**
   * المرحلة الأولى: بدء عملية التسجيل وإرسال OTP
   */
  async initiateRegistration(request: RegistrationRequest): Promise<RegistrationResponse> {
    try {
      // 1. التحقق من عدم وجود المستخدم مسبقاً
      const existingUser = await this.checkExistingUser(request.phoneNumber, request.username);
      if (existingUser.exists) {
        return {
          success: false,
          message: existingUser.message,
          requiresOTP: false,
        };
      }

      // 2. إنشاء device fingerprint
      const deviceFingerprint = this.generateDeviceFingerprint(request.userAgent, request.ipAddress);

      // 3. العثور على المُحيل (إذا وُجد)
      let referrerId: string | undefined;
      if (request.referrerCode) {
        referrerId = await this.findReferrerByCode(request.referrerCode);
      } else if (request.referrerId) {
        referrerId = request.referrerId;
      }

      // 4. إنشاء مستخدم مؤقت (غير مُفعل)
      const hashedPassword = await this.hashPassword(request.password);
      
      let tempUser;
      try {
        tempUser = await this.prisma.user.create({
          data: {
            fullName: request.fullName,
            username: request.username,
            nehkyEmail: `${request.username}@nehky.com`,
            phone: request.phoneNumber,
            passwordHash: hashedPassword,
            gender: request.gender,
            age: request.age,
            
            // معلومات الأمان والتتبع
            registrationIp: request.ipAddress,
            registrationUserAgent: request.userAgent,
            registrationGeo: request.geoLocation,
            deviceFingerprint,
            referrerId,
            
            // حالة التحقق
            phoneVerified: false,
            isActive: false, // لن يتم تفعيله إلا بعد OTP
          }
        });
      } catch (createError: any) {
        if (createError.code === 'P2002') {
          // Unique constraint violation - رقم الهاتف أو اسم المستخدم مُستخدم
          return {
            success: false,
            message: 'رقم الهاتف أو اسم المستخدم مُستخدم بالفعل',
            requiresOTP: false,
          };
        }
        throw createError;
      }

      // 5. فحص إساءة الاستخدام
      const registrationData: UserRegistrationData = {
        userId: tempUser.id,
        phoneNumber: request.phoneNumber,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        deviceFingerprint,
        geoLocation: request.geoLocation,
        referrerId,
      };

      const abuseCheck = await this.antiAbuseService.checkRegistrationAbuse(registrationData);

      // 6. تسجيل عملية الإحالة (إذا وُجدت)
      if (referrerId) {
        await this.antiAbuseService.logReferralAudit(registrationData, abuseCheck);
      }

      // 7. إرسال OTP
      const otpResult = await this.otpService.sendOTP(request.phoneNumber, tempUser.id);

      if (!otpResult.success) {
        // حذف المستخدم المؤقت في حالة فشل إرسال OTP
        await this.prisma.user.delete({ where: { id: tempUser.id } });
        
        return {
          success: false,
          message: otpResult.message,
          requiresOTP: false,
        };
      }

      return {
        success: true,
        message: 'تم إرسال رمز التحقق. يرجى إدخال الرمز لإتمام التسجيل',
        userId: tempUser.id,
        requiresOTP: true,
        otpSent: true,
        securityFlags: {
          isSuspicious: abuseCheck.isSuspicious,
          fakeScore: abuseCheck.fakeScore,
          requiresManualReview: abuseCheck.recommendedAction === 'manual_review',
        },
      };

    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      return {
        success: false,
        message: 'حدث خطأ في النظام. يرجى المحاولة مرة أخرى',
        requiresOTP: false,
      };
    }
  }

  /**
   * المرحلة الثانية: التحقق من OTP وإتمام التسجيل
   */
  async verifyOTPAndCompleteRegistration(request: OTPVerificationRequest): Promise<OTPVerificationResponse> {
    try {
      // 1. التحقق من رمز OTP
      const otpResult = await this.otpService.verifyOTP(request.phoneNumber, request.otpCode);

      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
          isRegistrationComplete: false,
        };
      }

      // 2. تفعيل المستخدم
      const user = await this.prisma.user.update({
        where: { id: otpResult.userId },
        data: {
          isActive: true,
          phoneVerified: true,
        }
      });

      // 3. تحديث حالة التحقق في سجل الإحالة
      await this.antiAbuseService.updatePhoneVerificationStatus(user.id);

      // 4. التحقق من أهلية مكافأة الإحالة
      const referralRewardEligible = await this.checkReferralRewardEligibility(user.id);

      return {
        success: true,
        message: 'تم إتمام التسجيل بنجاح! مرحباً بك في منصة نحكي',
        userId: user.id,
        isRegistrationComplete: true,
        referralRewardEligible,
      };

    } catch (error) {
      console.error('خطأ في التحقق من OTP:', error);
      return {
        success: false,
        message: 'حدث خطأ في التحقق. يرجى المحاولة مرة أخرى',
        isRegistrationComplete: false,
      };
    }
  }

  /**
   * إعادة إرسال OTP
   */
  async resendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    return await this.otpService.resendOTP(phoneNumber);
  }

  /**
   * التحقق من وجود مستخدم مسبقاً
   */
  private async checkExistingUser(phoneNumber: string, username: string): Promise<{
    exists: boolean;
    message: string;
  }> {
    // فحص رقم الهاتف
    const phoneExists = await this.prisma.user.findUnique({
      where: { phone: phoneNumber },
      select: { phoneVerified: true }
    });

    if (phoneExists && phoneExists.phoneVerified) {
      return {
        exists: true,
        message: 'رقم الهاتف مسجل ومُحقق بالفعل',
      };
    }

    // فحص اسم المستخدم
    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (usernameExists) {
      return {
        exists: true,
        message: 'اسم المستخدم مُستخدم بالفعل',
      };
    }

    return { exists: false, message: '' };
  }

  /**
   * العثور على المُحيل بواسطة كود الإحالة
   */
  private async findReferrerByCode(referrerCode: string): Promise<string | undefined> {
    // TODO: تنفيذ منطق البحث عن المُحيل بواسطة كود الإحالة
    // يمكن أن يكون الكود هو username أو كود خاص
    
    const referrer = await this.prisma.user.findUnique({
      where: { username: referrerCode },
      select: { id: true, isActive: true }
    });

    return referrer?.isActive ? referrer.id : undefined;
  }

  /**
   * إنشاء device fingerprint
   */
  private generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    const data = `${userAgent}-${ipAddress}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
  }

  /**
   * تشفير كلمة المرور
   */
  private async hashPassword(password: string): Promise<string> {
    // TODO: استخدام bcrypt أو مكتبة تشفير آمنة
    // هذا مثال مبسط - يجب استخدام bcrypt في الإنتاج
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * التحقق من أهلية مكافأة الإحالة
   */
  private async checkReferralRewardEligibility(userId: string): Promise<boolean> {
    const auditLog = await this.prisma.referralAuditLog.findFirst({
      where: { 
        referredUserId: userId,
        fakeScore: { lt: 0.7 }, // أقل من عتبة الحساب الوهمي
      }
    });

    return !!auditLog && !auditLog.rewardGranted;
  }

  /**
   * بدء مراقبة سلوك المستخدم الجديد
   */
  async startUserBehaviorMonitoring(userId: string): Promise<void> {
    // بدء مراقبة السلوك في الخلفية
    setTimeout(async () => {
      await this.antiAbuseService.monitorUserBehavior(userId);
    }, 1000 * 60 * 60); // بعد ساعة من التسجيل

    // مراقبة دورية كل 24 ساعة
    setInterval(async () => {
      await this.antiAbuseService.monitorUserBehavior(userId);
    }, 1000 * 60 * 60 * 24);
  }

  /**
   * الحصول على حالة التسجيل
   */
  async getRegistrationStatus(phoneNumber: string): Promise<{
    isRegistered: boolean;
    phoneVerified: boolean;
    isActive: boolean;
    requiresOTP: boolean;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { phone: phoneNumber },
      select: {
        phoneVerified: true,
        isActive: true,
        otpCode: true,
        otpExpiresAt: true,
      }
    });

    if (!user) {
      return {
        isRegistered: false,
        phoneVerified: false,
        isActive: false,
        requiresOTP: false,
      };
    }

    const hasValidOTP = !!user.otpCode && !!user.otpExpiresAt && user.otpExpiresAt > new Date();

    return {
      isRegistered: true,
      phoneVerified: user.phoneVerified,
      isActive: user.isActive,
      requiresOTP: !user.phoneVerified && hasValidOTP,
    };
  }
}
