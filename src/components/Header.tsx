
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
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <path d="M30 20C30 14.4772 34.4772 10 40 10H70C75.5228 10 80 14.4772 80 20V30C80 35.5228 75.5228 40 70 40H40C34.4772 40 30 35.5228 30 30V20Z" fill="#2b4a9a"/>
            <path d="M30 50C30 44.4772 34.4772 40 40 40H70C75.5228 40 80 44.4772 80 50V80C80 85.5228 75.5228 90 70 90H40C34.4772 90 30 85.5228 30 80V50Z" fill="#8847ea"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-wider text-[#71436d] font-medium">
              by Fleete
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#2b4a9a]">
              Post<span className="text-[#8847ea]">Genius</span>
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
