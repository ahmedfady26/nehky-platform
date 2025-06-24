import './globals.css'
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { NotificationProvider } from '@/lib/NotificationContext'
import { DataRefreshProvider } from '@/lib/DataRefreshContext'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'نحكي - منصة التواصل الاجتماعي العربية',
  description: 'منصة تواصل اجتماعي عربية مخصصة لتعزيز العلاقة بين المؤثرين والمتابعين',
  keywords: 'تواصل اجتماعي, عربي, مؤثرين, متابعين, نحكي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <body className="min-h-screen antialiased">
        <DataRefreshProvider>
          <NotificationProvider>
            <div id="root">
              {children}
            </div>
          </NotificationProvider>
        </DataRefreshProvider>
      </body>
    </html>
  )
}
