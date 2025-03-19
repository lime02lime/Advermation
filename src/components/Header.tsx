
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4 px-8 flex items-center justify-between animate-fade-in", className)}>
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-wider text-[#2d4a6b] font-medium">
              Internal Tool
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#3c5a86]">
              ExampleCo's<span className="text-[#476b9c]">Advertising</span>
            </h1>
          </div>
        </div>
      </div>
      
      <div className="text-sm font-medium text-[#2d4a6b]">
        Social Media Content Generator
      </div>
    </header>
  );
};

export default Header;
