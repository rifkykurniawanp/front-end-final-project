import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const SocialLinks = [
  {
    href: "https://twitter.com/ruind",
    icon: Twitter,
    label: "Twitter",
    color: "hover:text-blue-400",
    bgColor: "hover:bg-blue-50",
  },
  {
    href: "https://instagram.com/ruind",
    icon: Instagram,
    label: "Instagram",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
  {
    href: "https://linkedin.com/company/ruind",
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:text-blue-600",
    bgColor: "hover:bg-blue-50",
  },
  {
    href: "https://github.com/ruind",
    icon: Github,
    label: "GitHub",
    color: "hover:text-gray-800",
    bgColor: "hover:bg-gray-50",
  },
];



export const linkSections = [
  {
    title: 'Produk',
    links: [
      { name: 'Teh Premium', href: '/product/tea' },
      { name: 'Kopi Artisan', href: '/coffee' },
      { name: 'Herbal Alami', href: '/herbal' },
      { name: 'Matcha Jepang', href: '/matcha' },
      { name: 'Peralatan Brewing', href: '/equipment' },
      { name: 'Semua Produk', href: '/products' },
    ],
  },
  {
    title: 'Kursus',
    links: [
      { name: 'Tea Brewing 101', href: '/courses/tea-brewing' },
      { name: 'Barista Professional', href: '/courses/barista' },
      { name: 'Herbal Medicine', href: '/courses/herbal' },
      { name: 'Latte Art Workshop', href: '/courses/latte-art' },
      { name: 'Sertifikasi', href: '/certification' },
      { name: 'Semua Kursus', href: '/courses' },
    ],
  },
  {
    title: 'Bundle Spesial',
    links: [
      { name: 'Starter Tea Kit', href: '/bundles/tea-starter' },
      { name: 'Coffee Lover Set', href: '/bundles/coffee-lover' },
      { name: 'Herbal Wellness Pack', href: '/bundles/herbal-wellness' },
      { name: 'Barista Complete Kit', href: '/bundles/barista-kit' },
      { name: 'Gift Bundle', href: '/bundles/gift' },
      { name: 'Semua Bundle', href: '/bundles' },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { name: 'Konsultasi Gratis', href: '/consultation' },
      { name: 'Subscription Box', href: '/subscription' },
      { name: 'Corporate Training', href: '/corporate' },
      { name: 'Bulk Order', href: '/bulk-order' },
      { name: 'Customer Support', href: '/support' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Blog & Tips', href: '/blog' },
      { name: 'Komunitas', href: '/community' },
      { name: 'Mitra Petani', href: '/farmers' },
      { name: 'Karir', href: '/careers' },
      { name: 'Kontak', href: '/contact' },
    ],
  },
];

export const legalLinks = [
  { name: 'Kebijakan Privasi', href: '/privacy' },
  { name: 'Syarat & Ketentuan', href: '/terms' },
  { name: 'Kebijakan Refund', href: '/refund' },
  { name: 'Pengaturan Cookie', href: '/cookies' },
]