/**
 * نظام التحقق من رقم الهاتف عبر OTP
 * Phone Number Verification via OTP System
 * 
 * يوفر آليات:
 * - إرسال رمز OTP عبر SMS
 * - التحقق من رمز OTP
 * - منع إساءة الاستخدام (Rate limiting)
 * - تتبع محاولات التحقق
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export interface OTPConfig {
  otpLength: number;           // طول رمز OTP (افتراضي: 6)
  otpExpiryMinutes: number;    // مدة صلاحية OTP بالدقائق (افتراضي: 10)
  maxAttempts: number;         // أقصى عدد محاولات (افتراضي: 5)
  cooldownMinutes: number;     // فترة الانتظار بين الإرسالات (افتراضي: 2)
  dailyLimit: number;          // حد يومي لإرسال OTP (افتراضي: 10)
}

export const DEFAULT_OTP_CONFIG: OTPConfig = {
  otpLength: 6,
  otpExpiryMinutes: 10,
  maxAttempts: 5,
  cooldownMinutes: 2,
  dailyLimit: 10,
};

export class OTPService {
  private prisma: PrismaClient;
  private config: OTPConfig;

  constructor(prisma: PrismaClient, config: OTPConfig = DEFAULT_OTP_CONFIG) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * إنشاء رمز OTP عشوائي
   */
  private generateOTP(): string {
    const min = Math.pow(10, this.config.otpLength - 1);
    const max = Math.pow(10, this.config.otpLength) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * إرسال رمز OTP لرقم الهاتف
   */
  async sendOTP(phoneNumber: string, userId?: string): Promise<{
    success: boolean;
    message: string;
    otpCode?: string; // للاختبار فقط - يجب إزالته في الإنتاج
    expiresAt?: Date;
  }> {
    try {
      // التحقق من وجود المستخدم إذا تم تمرير userId
      let user = null;
      if (userId) {
        user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            phone: true,
            phoneVerified: true,
            otpAttempts: true,
            lastOtpSentAt: true,
          }
        });

        if (!user) {
          return { success: false, message: 'المستخدم غير موجود' };
        }

        if (user.phoneVerified) {
          return { success: false, message: 'رقم الهاتف مُحقق بالفعل' };
        }
      } else {
        // التحقق من أن رقم الهاتف غير مستخدم
        const existingUser = await this.prisma.user.findUnique({
          where: { phone: phoneNumber }
        });

        if (existingUser && existingUser.phoneVerified) {
          return { success: false, message: 'رقم الهاتف مُحقق ومستخدم بالفعل' };
        }
      }

      // التحقق من فترة الانتظار (Cooldown)
      if (user?.lastOtpSentAt) {
        const timeSinceLastOTP = Date.now() - user.lastOtpSentAt.getTime();
        const cooldownMs = this.config.cooldownMinutes * 60 * 1000;
        
        if (timeSinceLastOTP < cooldownMs) {
          const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastOTP) / 1000);
          return { 
            success: false, 
            message: `يرجى الانتظار ${remainingSeconds} ثانية قبل طلب رمز جديد` 
          };
        }
      }

      // إنشاء رمز OTP جديد
      const otpCode = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.config.otpExpiryMinutes * 60 * 1000);

      // حفظ رمز OTP في قاعدة البيانات
      if (userId) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            otpCode,
            otpExpiresAt: expiresAt,
            lastOtpSentAt: new Date(),
          }
        });
      } else {
        // إنشاء مستخدم مؤقت أو تحديث الموجود
        await this.prisma.user.upsert({
          where: { phone: phoneNumber },
          update: {
            otpCode,
            otpExpiresAt: expiresAt,
            lastOtpSentAt: new Date(),
          },
          create: {
            phone: phoneNumber,
            // باقي الحقول المطلوبة - يجب تعديلها حسب متطلبات التطبيق
            fullName: 'مستخدم مؤقت', // سيتم تحديثه لاحقاً
            username: `temp_${Date.now()}`, // سيتم تحديثه لاحقاً
            nehkyEmail: `temp_${Date.now()}@nehky.com`, // سيتم تحديثه لاحقاً
            passwordHash: 'temp', // سيتم تحديثه لاحقاً
            otpCode,
            otpExpiresAt: expiresAt,
            lastOtpSentAt: new Date(),
          }
        });
      }

      // إرسال SMS (يجب تنفيذ الدالة الفعلية)
      const smsResult = await this.sendSMS(phoneNumber, otpCode);
      
      if (!smsResult.success) {
        return { success: false, message: 'فشل في إرسال رمز التحقق' };
      }

      return {
        success: true,
        message: 'تم إرسال رمز التحقق بنجاح',
        otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined, // للاختبار فقط
        expiresAt,
      };

    } catch (error) {
      console.error('خطأ في إرسال OTP:', error);
      return { success: false, message: 'حدث خطأ في إرسال رمز التحقق' };
    }
  }

  /**
   * التحقق من رمز OTP
   */
  async verifyOTP(phoneNumber: string, otpCode: string): Promise<{
    success: boolean;
    message: string;
    userId?: string;
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phone: phoneNumber },
        select: {
          id: true,
          otpCode: true,
          otpExpiresAt: true,
          otpAttempts: true,
          phoneVerified: true,
        }
      });

      if (!user) {
        return { success: false, message: 'رقم الهاتف غير مسجل' };
      }

      if (user.phoneVerified) {
        return { success: false, message: 'رقم الهاتف مُحقق بالفعل' };
      }

      if (!user.otpCode || !user.otpExpiresAt) {
        return { success: false, message: 'لم يتم إرسال رمز تحقق. يرجى طلب رمز جديد' };
      }

      // التحقق من انتهاء صلاحية الرمز
      if (user.otpExpiresAt < new Date()) {
        return { success: false, message: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد' };
      }

      // التحقق من تجاوز عدد المحاولات
      if (user.otpAttempts >= this.config.maxAttempts) {
        return { success: false, message: 'تم تجاوز عدد المحاولات المسموحة. يرجى طلب رمز جديد' };
      }

      // التحقق من صحة الرمز
      if (user.otpCode !== otpCode) {
        // زيادة عدد المحاولات
        await this.prisma.user.update({
          where: { id: user.id },
          data: { otpAttempts: { increment: 1 } }
        });

        const remainingAttempts = this.config.maxAttempts - (user.otpAttempts + 1);
        return { 
          success: false, 
          message: `رمز التحقق غير صحيح. المحاولات المتبقية: ${remainingAttempts}` 
        };
      }

      // تحقق ناجح - تفعيل رقم الهاتف
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          phoneVerified: true,
          otpCode: null,
          otpExpiresAt: null,
          otpAttempts: 0,
        }
      });

      return {
        success: true,
        message: 'تم تحقق رقم الهاتف بنجاح',
        userId: user.id,
      };

    } catch (error) {
      console.error('خطأ في التحقق من OTP:', error);
      return { success: false, message: 'حدث خطأ في التحقق من الرمز' };
    }
  }

  /**
   * إرسال SMS (يجب تنفيذها مع مزود خدمة SMS)
   */
  private async sendSMS(phoneNumber: string, otpCode: string): Promise<{
    success: boolean;
    message: string;
  }> {
    // TODO: تنفيذ الإرسال الفعلي عبر مزود SMS
    // مثل Twilio, AWS SNS, أو مزود محلي مصري
    
    console.log(`📱 إرسال OTP إلى ${phoneNumber}: ${otpCode}`);
    
    // في بيئة التطوير، نعتبر الإرسال ناجحاً دائماً
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: 'تم إرسال الرمز بنجاح (وضع التطوير)' };
    }

    // في الإنتاج، تنفيذ الإرسال الفعلي
    try {
      // مثال باستخدام Twilio:
      // const twilioClient = twilio(accountSid, authToken);
      // await twilioClient.messages.create({
      //   body: `رمز التحقق الخاص بك في منصة نحكي: ${otpCode}`,
      //   from: '+1234567890',
      //   to: phoneNumber
      // });

      return { success: true, message: 'تم إرسال الرمز بنجاح' };
    } catch (error) {
      console.error('خطأ في إرسال SMS:', error);
      return { success: false, message: 'فشل في إرسال الرمز' };
    }
  }

  /**
   * إعادة إرسال رمز OTP
   */
  async resendOTP(phoneNumber: string): Promise<{
    success: boolean;
    message: string;
    otpCode?: string;
    expiresAt?: Date;
  }> {
    // إعادة تعيين محاولات OTP قبل الإرسال الجديد
    try {
      await this.prisma.user.update({
        where: { phone: phoneNumber },
        data: { otpAttempts: 0 }
      });
    } catch (error) {
      // المستخدم قد لا يكون موجوداً، لا مشكلة
    }

    return this.sendOTP(phoneNumber);
  }

  /**
   * التحقق من حالة التحقق للمستخدم
   */
  async getVerificationStatus(phoneNumber: string): Promise<{
    phoneVerified: boolean;
    hasOtpPending: boolean;
    otpExpiresAt?: Date;
    attemptsRemaining: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { phone: phoneNumber },
      select: {
        phoneVerified: true,
        otpCode: true,
        otpExpiresAt: true,
        otpAttempts: true,
      }
    });

    if (!user) {
      return {
        phoneVerified: false,
        hasOtpPending: false,
        attemptsRemaining: this.config.maxAttempts,
      };
    }

    return {
      phoneVerified: user.phoneVerified,
      hasOtpPending: !!user.otpCode && !!user.otpExpiresAt && user.otpExpiresAt > new Date(),
      otpExpiresAt: user.otpExpiresAt || undefined,
      attemptsRemaining: this.config.maxAttempts - user.otpAttempts,
    };
  }
}
