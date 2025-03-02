
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define company information type
interface CompanyInfo {
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  tone: string;
}

// Default company info
const defaultCompanyInfo: CompanyInfo = {
  name: "Fleete",
  description: "Fleete provides innovative fleet management solutions that optimize operations, reduce costs, and improve efficiency for businesses with vehicle fleets of all sizes.",
  industry: "Fleet Management Technology",
  targetAudience: "Business owners and fleet managers looking to optimize their vehicle operations and reduce costs",
  uniqueSellingPoints: [
    "Real-time vehicle tracking and analytics",
    "Fuel consumption optimization",
    "Predictive maintenance to prevent breakdowns",
    "Driver behavior monitoring for improved safety",
    "Comprehensive reporting dashboard"
  ],
  tone: "Professional yet approachable, focusing on efficiency and innovation"
};

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
