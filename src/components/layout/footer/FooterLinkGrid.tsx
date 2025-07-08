import React from 'react';
import { linkSections } from './data';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a href={href} className="text-gray-600 hover:text-orange-950 transition-colors hover:underline underline-offset-4">
      {children}
    </a>
  </li>
);

export const FooterLinkGrid = () => (
  <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
    {linkSections.map((section) => (
      <div key={section.title}>
        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">
          {section.title}
        </h3>
        <ul className="space-y-3 text-sm">
          {section.links.map((link) => (
            <FooterLink key={link.name} href={link.href}>
              {link.name}
            </FooterLink>
          ))}
        </ul>
      </div>
    ))}
  </div>
);