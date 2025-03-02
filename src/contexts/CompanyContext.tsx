
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { companyInfo as defaultCompanyInfo } from '@/data/companyInfo';

// Define company information type
interface CompanyInfo {
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  tone: string;
}

// Create context
interface CompanyContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  resetToDefaults: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => ({ ...prev, ...info }));
  };

  const resetToDefaults = () => {
    setCompanyInfo(defaultCompanyInfo);
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, updateCompanyInfo, resetToDefaults }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook for using the context
export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
