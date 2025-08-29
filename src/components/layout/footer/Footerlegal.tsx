"use client";
import React from "react";
import { legalLinks } from "./data";

export const FooterLegal = () => (
  <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
    <p className="text-sm text-[#EADFC7]">
      © {new Date().getFullYear()} RUIND EDU-COMMERCE. All rights reserved.
    </p>
    <div className="flex space-x-6 text-sm">
      {legalLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-[#EADFC7] hover:text-[#FFD700] hover:underline underline-offset-4"
        >
          {link.name}
        </a>
      ))}
    </div>
  </div>
);
