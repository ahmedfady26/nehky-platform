"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface DataRefreshContextType {
  // مؤشرات التحديث لكل نوع من البيانات
  refreshTriggers: {
    posts: number;
    users: number;
    dashboard: number;
    notifications: number;
    points: number;
    admins: number;
    trending: number;
  };
  
  // دوال لتشغيل التحديث
  triggerRefresh: (dataType: keyof DataRefreshContextType['refreshTriggers']) => void;
  triggerMultipleRefresh: (dataTypes: Array<keyof DataRefreshContextType['refreshTriggers']>) => void;
  
  // دوال مساعدة للتحقق من التحديثات
  getRefreshTrigger: (dataType: keyof DataRefreshContextType['refreshTriggers']) => number;
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

export const DataRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTriggers, setRefreshTriggers] = useState({
    posts: 0,
    users: 0,
    dashboard: 0,
    notifications: 0,
    points: 0,
    admins: 0,
    trending: 0,
  });

  const triggerRefresh = useCallback((dataType: keyof typeof refreshTriggers) => {
    console.log(`🔄 تشغيل تحديث البيانات لنوع: ${dataType}`);
    setRefreshTriggers(prev => ({
      ...prev,
      [dataType]: prev[dataType] + 1
    }));
  }, []);

  const triggerMultipleRefresh = useCallback((dataTypes: Array<keyof typeof refreshTriggers>) => {
    console.log(`🔄 تشغيل تحديث متعدد للأنواع: ${dataTypes.join(', ')}`);
    setRefreshTriggers(prev => {
      const newTriggers = { ...prev };
      dataTypes.forEach(dataType => {
        newTriggers[dataType] = prev[dataType] + 1;
      });
      return newTriggers;
    });
  }, []);

  const getRefreshTrigger = useCallback((dataType: keyof typeof refreshTriggers) => {
    return refreshTriggers[dataType];
  }, [refreshTriggers]);

  const value: DataRefreshContextType = {
    refreshTriggers,
    triggerRefresh,
    triggerMultipleRefresh,
    getRefreshTrigger,
  };

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (context === undefined) {
    throw new Error('useDataRefresh must be used within a DataRefreshProvider');
  }
  return context;
};

// Hook مخصص للتحقق من التحديثات
export const useRefreshEffect = (
  dataType: keyof DataRefreshContextType['refreshTriggers'],
  refreshFunction: () => void,
  dependencies: any[] = []
) => {
  const { getRefreshTrigger } = useDataRefresh();
  const refreshTrigger = getRefreshTrigger(dataType);

  React.useEffect(() => {
    if (refreshTrigger > 0) {
      console.log(`🔄 تنفيذ تحديث البيانات لنوع: ${dataType} (محفز: ${refreshTrigger})`);
      refreshFunction();
    }
  }, [refreshTrigger, ...dependencies]);
};

export default DataRefreshContext;
