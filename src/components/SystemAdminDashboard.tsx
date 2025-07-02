'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Settings, Activity, Clock, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface SystemLog {
  id: string;
  type: string;
  status: 'SUCCESS' | 'ERROR' | 'RUNNING';
  details: string;
  executedAt: Date;
}

interface TaskStatus {
  name: string;
  isRunning: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  successCount: number;
  errorCount: number;
  status: 'healthy' | 'warning' | 'error';
}

export default function SystemAdminDashboard() {
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      // محاكاة بيانات النظام
      const mockTasks: TaskStatus[] = [
        {
          name: 'تحسين الاهتمامات',
          isRunning: false,
          lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // قبل ساعتين
          nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000), // بعد 4 ساعات
          successCount: 24,
          errorCount: 1,
          status: 'healthy'
        },
        {
          name: 'تحليلات الفيديو',
          isRunning: true,
          lastRun: new Date(Date.now() - 30 * 60 * 1000), // قبل 30 دقيقة
          nextRun: new Date(Date.now() + 30 * 60 * 1000), // بعد 30 دقيقة
          successCount: 48,
          errorCount: 0,
          status: 'healthy'
        },
        {
          name: 'اقتراحات المتابعة',
          isRunning: false,
          lastRun: new Date(Date.now() - 8 * 60 * 60 * 1000), // قبل 8 ساعات
          nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000), // بعد 4 ساعات
          successCount: 12,
          errorCount: 2,
          status: 'warning'
        }
      ];

      const mockLogs: SystemLog[] = [
        {
          id: '1',
          type: 'INTEREST_OPTIMIZATION',
          status: 'SUCCESS',
          details: JSON.stringify({ updated: 150, archived: 25, deleted: 5 }),
          executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'VIDEO_ANALYTICS',
          status: 'RUNNING',
          details: JSON.stringify({ processing: 45, completed: 32 }),
          executedAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '3',
          type: 'FOLLOW_SUGGESTIONS',
          status: 'ERROR',
          details: JSON.stringify({ error: 'Database connection timeout' }),
          executedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
        }
      ];

      setTasks(mockTasks);
      setLogs(mockLogs);
      
      // تحديد حالة النظام العامة
      const hasErrors = mockTasks.some(task => task.status === 'error');
      const hasWarnings = mockTasks.some(task => task.status === 'warning');
      
      setSystemHealth(hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy');
      
    } catch (error) {
      console.error('خطأ في تحميل بيانات النظام:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskName: string) => {
    try {
      // محاكاة تشغيل/إيقاف المهمة
      setTasks(prev => prev.map(task => 
        task.name === taskName 
          ? { ...task, isRunning: !task.isRunning }
          : task
      ));
    } catch (error) {
      console.error('خطأ في تغيير حالة المهمة:', error);
    }
  };

  const runTaskNow = async (taskName: string) => {
    try {
      // محاكاة تشغيل المهمة فوراً
      setTasks(prev => prev.map(task => 
        task.name === taskName 
          ? { ...task, isRunning: true, lastRun: new Date() }
          : task
      ));
      
      // إيقاف المهمة بعد 30 ثانية (محاكاة)
      setTimeout(() => {
        setTasks(prev => prev.map(task => 
          task.name === taskName 
            ? { ...task, isRunning: false, successCount: task.successCount + 1 }
            : task
        ));
      }, 30000);
    } catch (error) {
      console.error('خطأ في تشغيل المهمة:', error);
    }
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error': return <XCircle className="text-red-500" size={20} />;
      default: return <Info className="text-gray-500" size={20} />;
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري تحميل لوحة إدارة النظام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Settings className="text-blue-600" />
          لوحة إدارة النظام
        </h1>
        <p className="text-gray-600 text-lg">مراقبة وإدارة المهام الدورية والأنظمة الذكية</p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${
          systemHealth === 'healthy' ? 'border-l-4 border-l-green-500' :
          systemHealth === 'warning' ? 'border-l-4 border-l-yellow-500' :
          'border-l-4 border-l-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemHealth)}
              <h3 className="text-lg font-semibold text-gray-800">حالة النظام</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {systemHealth === 'healthy' ? 'سليم' : 
             systemHealth === 'warning' ? 'تحذير' : 'خطأ'}
          </div>
          <p className="text-gray-600 text-sm">
            {systemHealth === 'healthy' ? 'جميع الأنظمة تعمل بشكل طبيعي' :
             systemHealth === 'warning' ? 'بعض الأنظمة تحتاج انتباه' :
             'هناك مشاكل تحتاج حل فوري'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">المهام النشطة</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {tasks.filter(task => task.isRunning).length}
          </div>
          <p className="text-gray-600 text-sm">من أصل {tasks.length} مهام</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">آخر تحديث</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatTime(new Date())}
          </div>
          <p className="text-gray-600 text-sm">تحديث تلقائي كل 30 ثانية</p>
        </div>
      </div>

      {/* Tasks Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Settings size={20} />
              إدارة المهام الدورية
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <h4 className="font-semibold text-gray-800">{task.name}</h4>
                      {task.isRunning && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          قيد التشغيل
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">آخر تشغيل:</span>
                      <div>{formatTime(task.lastRun)}</div>
                    </div>
                    <div>
                      <span className="font-medium">التشغيل التالي:</span>
                      <div>{formatTime(task.nextRun)}</div>
                    </div>
                    <div>
                      <span className="font-medium">نجح:</span>
                      <div className="text-green-600">{task.successCount}</div>
                    </div>
                    <div>
                      <span className="font-medium">أخفق:</span>
                      <div className="text-red-600">{task.errorCount}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTask(task.name)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                        task.isRunning
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {task.isRunning ? <Pause size={14} /> : <Play size={14} />}
                      {task.isRunning ? 'إيقاف' : 'تشغيل'}
                    </button>
                    
                    <button
                      onClick={() => runTaskNow(task.name)}
                      disabled={task.isRunning}
                      className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play size={14} />
                      تشغيل الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={20} />
              سجل النظام
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(log.executedAt)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-1">{log.type}</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">إجراءات سريعة</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
              تشغيل جميع المهام
            </button>
            <button className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg font-medium hover:bg-yellow-200 transition-colors">
              إعادة تحميل التكوين
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              تصدير السجلات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
