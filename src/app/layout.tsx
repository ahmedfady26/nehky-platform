import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/custom.css'
import '../styles/mobile.css'
import '../styles/tablet.css'
import '../styles/scalable.css'
import MobileBottomNav from '../components/MobileBottomNav'
import { TabletNavigation } from '../components/TabletComponents'
import { DeviceProvider } from '../components/ScalableComponents'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'نحكي - منصة التواصل الاجتماعي الذكية',
  description: 'منصة نحكي للتواصل الاجتماعي مع أنظمة ذكية متقدمة',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'نحكي'
  },
  formatDetection: {
    telephone: false
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#059669'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} pb-16 sm:pb-0`}>
        <DeviceProvider>
          <TabletNavigation />
          {children}
          <MobileBottomNav />
        </DeviceProvider>
      </body>
    </html>
  )
}
