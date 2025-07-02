'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="nehky-container">
        <div className="flex items-center justify-between h-28 py-3">
          <Link href="/" className="flex items-center space-x-3 space-x-reverse flex-shrink-0">
            <Image
              src="/assets/nehky_logo.webp"
              alt="نحكي"
              width={200}
              height={150}
              className="nehky-logo nehky-logo-header"
            />
            <span className="text-5xl font-bold nehky-text-gradient">نحكي</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 space-x-reverse flex-grow justify-center">
            <a href="/" className="nehky-nav-link">
              الرئيسية
            </a>
            <a href="/explore" className="nehky-nav-link">
              استكشف القصص
            </a>
            <a href="/categories" className="nehky-nav-link">
              التصنيفات
            </a>
            <a href="/about" className="nehky-nav-link">
              من نحن
            </a>
            <a href="/contact" className="nehky-nav-link">
              تواصل معنا
            </a>
          </nav>

          <div className="flex items-center space-x-2 space-x-reverse">
            <a href="/login" className="nehky-btn-secondary text-sm px-3 py-2">
              دخول
            </a>
            <a href="/register" className="nehky-btn-primary text-sm px-3 py-2">
              تسجيل
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
