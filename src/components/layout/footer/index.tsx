import React from 'react';
import { FooterBrand } from './FooterBrand';
import { FooterLinkGrid } from './FooterLinkGrid';
import { FooterLegal } from './Footerlegal';
import { cn } from '@/fetch-API/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "bg-white border p-8 sm:p-10 md:p-12 text-gray-800",
      "transition-shadow duration-300 hover:shadow-md",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <FooterBrand />
          <FooterLinkGrid />
        </div>
        <FooterLegal />
      </div>
    </footer>
  );
};

export default Footer;