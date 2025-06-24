// متغير مؤقت لحفظ OTPs ورموز الاسترداد في الذاكرة
// في الإنتاج، يجب استخدام Redis أو قاعدة بيانات
export const tempOTPs: { [key: string]: { otp: string; userId: string; expires: number; action?: string } } = {};

// متغير مؤقت لحفظ رموز استعادة الحساب (Tokens)
export const resetTokens: { [key: string]: { userId: string; expires: number; used: boolean } } = {};
