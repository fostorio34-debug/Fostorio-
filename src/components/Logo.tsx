import React from 'react';
import { TrendingUp } from 'lucide-react';

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 bg-[#1e2a4a] rounded-lg overflow-hidden flex-shrink-0">
        <span className="text-white text-2xl font-serif font-bold translate-x-[-2px]">F</span>
        <TrendingUp className="absolute w-6 h-6 text-[#c49a5c] top-1 right-[-4px]" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-serif font-bold text-[#1e2a4a] dark:text-white tracking-tight">fostorio</span>
        <span className="text-[7px] font-sans font-bold text-[#c49a5c] tracking-[0.2em] uppercase">Brand Marketing</span>
      </div>
    </div>
  );
}
