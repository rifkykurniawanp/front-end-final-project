"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "./data";

export const FooterBrand = () => (
  <div className="md:col-span-4 lg:col-span-5">
    <Link href="/" className="flex items-center space-x-3">
      <div className="p-2 rounded-xl bg-gradient-to-br from-white/90 via-white/60 to-transparent shadow-lg">
        <Image
          src="/logo.png"
          alt="RUIND EDU-COMMERCE Logo"
          width={140}
          height={140}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <span className="text-xl font-semibold text-[#F5F5DC]">RUIND EDU-COMMERCE</span>
    </Link>

    <p className="mt-4 text-sm text-[#EADFC7] max-w-sm leading-relaxed">
      RUIND terinspirasi dari gagasan bahwa untuk membangun sesuatu yang baru,
      terkadang kita perlu meruntuhkan kebiasaan lama.
    </p>

    <div className="mt-6 flex space-x-4">
      {SocialLinks.map(({ href, icon: Icon, label, color, bgColor }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${label}`}
          className={`p-2 rounded-lg transition-transform hover:scale-110 ${color} ${bgColor}`}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  </div>
);
