// خدمة إرسال الإيميلات
// هذا مثال بسيط - في الإنتاج يفضل استخدام خدمات مثل SendGrid أو AWS SES

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// دالة إرسال إيميل استعادة الحساب
export async function sendAccountRecoveryEmail(
  email: string, 
  username: string, 
  phone: string
): Promise<boolean> {
  try {
    // التحقق من صحة المدخلات
    if (!email || !email.trim()) {
      console.error('خطأ: عنوان الإيميل فارغ');
      return false;
    }

    if (!username || !username.trim()) {
      console.error('خطأ: اسم المستخدم فارغ');
      return false;
    }

    if (!phone || !phone.trim()) {
      console.error('خطأ: رقم الهاتف فارغ');
      return false;
    }

    // التحقق من صحة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('خطأ: عنوان الإيميل غير صحيح:', email);
      return false;
    }
    
    // هنا يمكن استخدام خدمة إرسال الإيميلات الفعلية
    // مثل SendGrid, AWS SES, أو Nodemailer
    
    const emailData: EmailData = {
      to: email.trim(),
      subject: 'استعادة حساب منصة نحكي',
      html: generateRecoveryEmailHtml(username.trim(), phone.trim())
    };

    // للمثال، سنكتفي بطباعة محتوى الإيميل في الكونسول
    console.log('📧 إرسال إيميل استعادة الحساب:');
    console.log('إلى:', emailData.to);
    console.log('الموضوع:', emailData.subject);
    console.log('حالة المرسل إليه: صالح ✅');

    // محاكاة نجاح/فشل الإرسال (90% نجاح)
    const successRate = Math.random();
    if (successRate > 0.1) {
      console.log('✅ تم إرسال الإيميل بنجاح');
      return true;
    } else {
      console.log('❌ فشل إرسال الإيميل (محاكاة خطأ)');
      return false;
    }

    // في الإنتاج، استبدل هذا بالكود الفعلي لإرسال الإيميل
    // await sendEmailViaSMTP(emailData);
    // أو
    // await sendEmailViaSendGrid(emailData);

  } catch (error) {
    console.error('خطأ في إرسال إيميل الاسترداد:', error);
    return false; // فشل الإرسال
  }
}

// دالة توليد محتوى HTML للإيميل
function generateRecoveryEmailHtml(username: string, phone: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>استعادة حساب منصة نحكي</title>
        <style>
            body {
                font-family: 'Cairo', 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #4ade80 0%, #3b82f6 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
                text-align: center;
            }
            .account-info {
                background: #f8fafc;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-right: 4px solid #4ade80;
            }
            .footer {
                background: #f1f5f9;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #64748b;
            }
            .logo {
                font-size: 32px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">💬</div>
                <h1>منصة نحكي</h1>
                <p>استعادة الحساب</p>
            </div>
            
            <div class="content">
                <h2>تم طلب استعادة حساب</h2>
                <p>مرحباً، تم طلب استعادة حساب مرتبط بهذا البريد الإلكتروني.</p>
                
                <div class="account-info">
                    <h3>معلومات الحساب:</h3>
                    <p><strong>اسم المستخدم:</strong> ${username}</p>
                    <p><strong>رقم الهاتف:</strong> ${phone}</p>
                </div>
                
                <p>إذا لم تطلب استعادة هذا الحساب، يرجى تجاهل هذا الإيميل.</p>
                <p>إذا كنت تحتاج المساعدة، يمكنك التواصل مع فريق الدعم.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 منصة نحكي - جميع الحقوق محفوظة</p>
                <p>nehky.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// دالة إرسال رابط استعادة الحساب
export async function sendPasswordResetLink(
  email: string, 
  username: string, 
  resetToken: string,
  baseUrl: string = 'http://localhost:3000'
): Promise<boolean> {
  try {
    // التحقق من صحة المدخلات
    if (!email || !email.trim()) {
      console.error('خطأ: عنوان الإيميل فارغ');
      return false;
    }

    if (!username || !username.trim()) {
      console.error('خطأ: اسم المستخدم فارغ');
      return false;
    }

    if (!resetToken || !resetToken.trim()) {
      console.error('خطأ: رمز الاسترداد فارغ');
      return false;
    }

    // إنشاء رابط الاسترداد
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // تحضير محتوى الإيميل
    const emailContent = generatePasswordResetEmailHTML(username, resetLink);

    // هنا يتم إرسال الإيميل الفعلي
    // مؤقتاً سنطبع في الكونسول للاختبار
    console.log('📧 إرسال إيميل استعادة الحساب:');
    console.log(`إلى: ${email}`);
    console.log(`اسم المستخدم: ${username}`);
    console.log(`الرابط: ${resetLink}`);
    console.log('محتوى الإيميل:');
    console.log(emailContent);

    // محاكاة إرسال ناجح
    return true;

  } catch (error) {
    console.error('خطأ في إرسال إيميل استعادة الحساب:', error);
    return false;
  }
}

// دالة توليد HTML لإيميل استعادة الحساب
function generatePasswordResetEmailHTML(username: string, resetLink: string): string {
  return `
    <div dir="rtl" style="font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0; font-size: 28px;">منصة نحكي</h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">استعادة حسابك على "نحكي"</p>
        </div>
        
        <div style="margin: 30px 0;">
          <p style="color: #333; font-size: 18px; margin: 0 0 15px 0;">مرحبًا ${username} 👋</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 15px 0;">
            تلقينا طلبًا لاستعادة حسابك على منصة نحكي.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 15px 0;">
            يمكنك الآن إعادة تعيين كلمة المرور الخاصة بك عبر الرابط التالي:
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            🔐 إعادة تعيين كلمة المرور
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #856404; margin: 5px 0; font-size: 14px; text-align: center;">
            ⏰ هذا الرابط صالح لمدة 15 دقيقة فقط
          </p>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #721c24; margin: 5px 0; font-size: 14px; text-align: center;">
            ⚠️ إذا لم تطلب هذا، يرجى تجاهل الرسالة
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <p style="color: #666; font-size: 16px; margin: 0;">
            شكرًا لاستخدامك نحكي ❤️
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0; font-size: 12px;">© منصة نحكي - nehky.com</p>
        </div>
      </div>
    </div>
  `;
}

// دالة إرسال رمز OTP عبر SMS (مثال)
export async function sendOTPViaSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // هنا يمكن استخدام خدمة إرسال SMS الفعلية
    // مثل Twilio, AWS SNS, أو خدمة محلية
    
    const message = `رمز التحقق الخاص بك في منصة نحكي: ${otp}\nلا تشارك هذا الرمز مع أحد.`;
    
    // للمثال، سنكتفي بطباعة الرسالة في الكونسول
    console.log('📱 إرسال رسالة SMS:');
    console.log('إلى:', phone);
    console.log('الرسالة:', message);

    // في الإنتاج، استبدل هذا بالكود الفعلي لإرسال SMS
    // await sendSMSViaTwilio(phone, message);
    // أو
    // await sendSMSViaLocalProvider(phone, message);

    return true; // نجح الإرسال
  } catch (error) {
    console.error('خطأ في إرسال رسالة SMS:', error);
    return false; // فشل الإرسال
  }
}

// مثال على دالة إرسال إيميل عبر Nodemailer (معلقة)
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmailViaSMTP(emailData: EmailData): Promise<void> {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
  });
}
*/
