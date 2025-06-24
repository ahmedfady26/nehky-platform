import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showText?: boolean
  href?: string
  className?: string
}

const sizeConfig = {
  sm: { width: 32, height: 32, textSize: 'text-lg' },
  md: { width: 48, height: 48, textSize: 'text-xl' },
  lg: { width: 80, height: 80, textSize: 'text-2xl' },
  xl: { width: 120, height: 120, textSize: 'text-3xl' },
  '2xl': { width: 160, height: 160, textSize: 'text-4xl' }
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  href = '/', 
  className = '' 
}: LogoProps) {
  const config = sizeConfig[size]

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 space-x-reverse ${className}`}>
      <Image
        src="/nehky_logo.webp"
        alt="شعار نحكي"
        width={config.width}
        height={config.height}
        className="rounded-lg"
        priority
      />
      {showText && (
        <span className={`font-bold text-gray-800 ${config.textSize}`}>
          نحكي
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
