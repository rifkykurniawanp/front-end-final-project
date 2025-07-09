import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SocialLinks } from './data';

export const FooterBrand = () => (
  <div className="md:col-span-4 lg:col-span-5">
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/logo.png"
        alt="RUIND EDU-COMMERCE Logo"
        width={150}
        height={150}
        className="object-contain transition-transform duration-300 hover:scale-110"
      />
      <span className="text-xl font-semibold">RUIND EDU-COMMERCE</span>
    </Link>

    <p className="mt-4 text-sm text-gray-600 max-w-sm leading-relaxed">
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
          className={`text-gray-500 p-2 rounded-lg transition-colors ${color} ${bgColor}`}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  </div>
);
