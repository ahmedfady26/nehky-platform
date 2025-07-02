import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="nehky-bg-dark text-white">
      <div className="nehky-container">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* قسم الشعار والوصف */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Image
                  src="/assets/nehky_logo.webp"
                  alt="نحكي"
                  width={200}
                  height={150}
                  className="nehky-logo"
                />
                <span className="text-3xl font-bold nehky-text-gradient">نحكي</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                منصة نحكي هي المكان المثالي لمشاركة القصص والخبرات والحكايات التي تلهم وتثري حياتنا. 
                انضم إلينا واكتشف عالماً من القصص المذهلة.
              </p>
              <div className="text-gray-300 space-y-2">
                <p>البريد الإلكتروني: info@nehky.com</p>
                <p>الهاتف: +966500000000</p>
              </div>
            </div>

            {/* روابط سريعة */}
            <div>
              <h3 className="font-bold text-lg mb-4 nehky-text-accent">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="nehky-footer-link">الرئيسية</Link></li>
                <li><Link href="/explore" className="nehky-footer-link">استكشف القصص</Link></li>
                <li><Link href="/categories" className="nehky-footer-link">التصنيفات</Link></li>
                <li><Link href="/about" className="nehky-footer-link">من نحن</Link></li>
                <li><Link href="/contact" className="nehky-footer-link">تواصل معنا</Link></li>
              </ul>
            </div>

            {/* الحساب */}
            <div>
              <h3 className="font-bold text-lg mb-4 nehky-text-accent">الحساب</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="nehky-footer-link">تسجيل الدخول</Link></li>
                <li><Link href="/register" className="nehky-footer-link">إنشاء حساب</Link></li>
                <li><Link href="/profile" className="nehky-footer-link">الملف الشخصي</Link></li>
                <li><Link href="/stories" className="nehky-footer-link">قصصي</Link></li>
                <li><Link href="/settings" className="nehky-footer-link">الإعدادات</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* شريط الحقوق */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 نحكي. جميع الحقوق محفوظة - تصميم وتطوير أحمد فادي.
            </p>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <Link href="/privacy" className="nehky-footer-link">سياسة الخصوصية</Link>
              <Link href="/terms" className="nehky-footer-link">شروط الاستخدام</Link>
              <Link href="/support" className="nehky-footer-link">الدعم الفني</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
