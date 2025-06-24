import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AdminNavProps {
  currentPage?: string
  className?: string
}

export default function AdminNav({ currentPage, className = '' }: AdminNavProps) {
  const router = useRouter()

  const navItems = [
    {
      id: 'dashboard',
      label: 'لوحة الإدارة',
      icon: '🏠',
      path: '/admin',
      description: 'الصفحة الرئيسية'
    },
    {
      id: 'keyword-management',
      label: 'إدارة الكلمات',
      icon: '🔤',
      path: '/admin/keyword-management',
      description: 'تكرارات الكلمات والاتجاهات'
    },
    {
      id: 'test-pages',
      label: 'صفحات الاختبار',
      icon: '🧪',
      path: '/test-keyword-occurrences',
      description: 'أدوات التطوير والاختبار'
    }
  ]

  return (
    <nav className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 ${className}`} dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🧭 التنقل السريع</h3>
        <button
          onClick={() => router.push('/')}
          className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
        >
          الخروج من الإدارة
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
              currentPage === item.id
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
