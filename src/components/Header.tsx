
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 px-8 flex items-center justify-between animate-fade-in", className)}>
      <div className="flex items-center">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            by Fleete
          </span>
          <h1 className="text-2xl font-medium tracking-tight">
            Post<span className="text-primary">Genius</span>
          </h1>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Social Media Content Generator
      </div>
    </header>
  );
};

export default Header;
