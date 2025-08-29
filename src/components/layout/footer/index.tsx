"use client";
import React from "react";
import { FooterBrand } from "./FooterBrand";
import { FooterLinkGrid } from "./FooterLinkGrid";
import { FooterLegal } from "./Footerlegal";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full bg-[#3E2F2F] text-[#F5F5DC]",
        "px-8 py-12 sm:px-12 md:px-16",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <FooterBrand />
        <FooterLinkGrid />
      </div>
      <FooterLegal />
    </footer>
  );
};

export default Footer;
