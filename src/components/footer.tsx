import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SOCIAL_LINKS = {
  twitter: "https://twitter.com/...", 
  instagram: "https://instagram.com/rifkykurniawanp", 
  linkedin: "https://linkedin.com/in/rifkykurniawanputra",
  github: "https://github.com/username_anda"        
};

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-2.16-1.76-2.16-1.48 0-2.24.98-2.24 2.16V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.1 1.16 3.1 4.44z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-600 hover:text-orange-950 transition-all duration-200 ease-in-out hover:underline hover:underline-offset-4"
    >
      {children}
    </a>
  </li>
);

// --- Main Footer Component ---
const Footer = () => {
  const socialLinks = [
    { 
      href: SOCIAL_LINKS.twitter, 
      icon: <TwitterIcon />,
      label: "Twitter"
    },
    { 
      href: SOCIAL_LINKS.instagram, 
      icon: <InstagramIcon />,
      label: "Instagram"
    },
    { 
      href: SOCIAL_LINKS.linkedin, 
      icon: <LinkedinIcon />,
      label: "LinkedIn"
    },
    { 
      href: SOCIAL_LINKS.github, 
      icon: <GithubIcon />,
      label: "GitHub"
    },
  ];

  const linkSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Integrations', href: '/integrations' },
        { name: 'Changelog', href: '/changelog' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Partners', href: '/partners' },
      ],
    },
  ];

  return (
    <footer className="bg-white rounded-lg shadow-sm border p-8 sm:p-10 md:p-12 text-gray-800 transition-shadow duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Section: Logo, Description, Socials */}
        <div className="md:col-span-4 lg:col-span-5">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 ease-in-out"
          >
            <div className="relative overflow-hidden rounded-full">
              <Image 
                src="/logo.png" 
                alt="RUIND EDU-COMMERCE Logo" 
                className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110"
                width={32}
                height={32}
                priority
              />
            </div>
            <span className="text-lg font-semibold text-gray-800 hidden sm:inline transition-colors duration-200">
              RUIND EDU-COMMERCE
            </span>
          </Link>
          
          <p className="text-gray-600 text-sm max-w-sm mb-6 mt-4 leading-relaxed">
            RUIND terinspirasi dari gagasan bahwa untuk membangun sesuatu yang baru, terkadang kita perlu meruntuhkan kebiasaan lama.
          </p>
          
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${link.label}`}
                className="text-gray-500 hover:text-orange-950 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm hover:scale-105"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">
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
      </div>

      {/* Bottom Section: Copyright and Legal */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} RUIND EDU-COMMERCE. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm">
          <Link 
            href="/privacy" 
            className="text-gray-600 hover:text-orange-950 hover:underline hover:underline-offset-4 transition-all duration-200 ease-in-out"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="text-gray-600 hover:text-orange-950 hover:underline hover:underline-offset-4 transition-all duration-200 ease-in-out"
          >
            Terms of Service
          </Link>
          <Link 
            href="/cookies" 
            className="text-gray-600 hover:text-orange-950 hover:underline hover:underline-offset-4 transition-all duration-200 ease-in-out"
          >
            Cookies Settings
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;