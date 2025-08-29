import Link from "next/link";
import Image from "next/image";
import React from "react";

export const Logo = () => (
  <Link href="/" className="flex items-center space-x-2 group">
    <div className="relative p-1 rounded-full bg-gradient-to-br from-white via-[#f5e6c4] to-[#3E2F2F] shadow-md">
      <div className="rounded-full overflow-hidden">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
    <span className="hidden sm:inline text-lg font-semibold text-[#F5E6C4] tracking-wide transition-colors duration-200 group-hover:text-[#D4AF7F]">
      RUIND EDU-COMMERCE
    </span>
  </Link>
);
