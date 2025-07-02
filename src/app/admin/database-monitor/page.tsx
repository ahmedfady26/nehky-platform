'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, Users, Phone, Mail, Calendar } from 'lucide-react'

interface User {
  id: string
  fullName: string
  username: string
  nehkyEmail: string
  externalEmail: string
  phone: string
  isInfluencer: boolean
  createdAt: string
}

export default function DatabaseMonitorPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchUsers, 3000) // تحديث كل 3 ثوان
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: users.length,
    withPhone: users.filter(u => u.phone && u.phone.length > 3).length,
    influencers: users.filter(u => u.isInfluencer).length,
    recent: users.filter(u => {
      const userDate = new Date(u.createdAt)
      const now = new Date()
      return now.getTime() - userDate.getTime() < 24 * 60 * 60 * 1000 // آخر 24 ساعة
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* العنوان والتحكم */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold nehky-text-gradient mb-2">
                مراقب قاعدة البيانات المباشر
              </h1>
              <p className="text-gray-600">
                مراقبة المستخدمين الجدد في الوقت الفعلي
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="nehky-checkbox"
                />
                تحديث تلقائي
              </label>
              
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="nehky-button-primary flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>

          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-3">
              آخر تحديث: {lastUpdate.toLocaleString('ar-EG')}
            </p>
          )}
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.withPhone}</p>
                <p className="text-sm text-gray-600">لديهم رقم هاتف</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.influencers}</p>
                <p className="text-sm text-gray-600">المؤثرين</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.recent}</p>
                <p className="text-sm text-gray-600">آخر 24 ساعة</p>
              </div>
            </div>
          </div>
        </div>

        {/* قائمة المستخدمين */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">آخر المستخدمين المُسجلين</h2>
          </div>

          {loading && users.length === 0 ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">جاري تحميل البيانات...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">لا توجد مستخدمين حتى الآن</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-nehky-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                        {user.isInfluencer && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                            مؤثر
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">اسم المستخدم:</span>
                          <span className="font-mono mr-2">{user.username}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-500">البريد الإلكتروني:</span>
                          <span className="font-mono mr-2">{user.nehkyEmail}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-500">البريد الخارجي:</span>
                          <span className="font-mono mr-2">{user.externalEmail}</span>
                        </div>
                        
                        <div className={`${user.phone && user.phone.length > 3 ? 'text-green-600' : 'text-red-500'}`}>
                          <span className="text-gray-500">رقم الهاتف:</span>
                          <span className="font-mono mr-2">
                            {user.phone && user.phone.length > 3 ? user.phone : '❌ غير مكتمل'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-gray-500">تاريخ التسجيل:</span>
                          <span className="mr-2">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
