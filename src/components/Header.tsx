
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
          <img 
            src="/lovable-uploads/a6ae9528-0b2b-4654-9ba0-79169e676648.png" 
            alt="Fleete Logo" 
            className="h-10 object-contain mr-3"
          />
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-wider text-[#71436d] font-medium">
              Internal Tool
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#2b4a9a]">
              Fleete<span className="text-[#8847ea]">Advertising</span>
            </h1>
          </div>
        </div>
      </div>
      
      <div className="text-sm font-medium text-[#71436d]">
        Social Media Content Generator
      </div>
    </header>
  );
};

export default Header;
