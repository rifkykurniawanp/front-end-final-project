"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/fetch-API/utils'; // utilitas untuk menggabungkan class (dari shadcn/ui)

import type { HeaderProps } from '@/types/header';
import { Logo } from './logo';
import { SearchBar } from './searchbar';
import { HeaderActions } from './headeractions';
// import { MobileMenu } from './MobileMenu'; // Jika Anda membuatnya

// Data dummy bisa diletakkan di sini atau di-pass dari parent
const DUMMY_NOTIFICATIONS = [
  { id: '1', title: 'New Course Available', message: 'React Advanced Patterns...', time: '2h ago', read: false, type: 'info' as const },
  { id: '2', title: 'Assignment Due', message: 'JS fundamentals assignment is due...', time: '5h ago', read: false, type: 'warning' as const },
];

const Header: React.FC<HeaderProps> = ({
  currentUser,
  cartItems = [],
  notifications = DUMMY_NOTIFICATIONS,
  onSearch,
  onCartClick: customOnCartClick,
  onProfileClick,
  onLogin: customOnLogin,
  onLogout,
  onNotificationRead,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Gunakan handler default jika prop tidak disediakan
  const onLogin = () => customOnLogin ? customOnLogin() : router.push('/login');
  const onCartClick = () => customOnCartClick ? customOnCartClick() : router.push('/cart');

  return (
    <header className={cn("bg-white shadow-sm border-b sticky top-0 z-40 transition-shadow", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Layout */}
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={onSearch} />
          </div>
          <HeaderActions
            currentUser={currentUser}
            cartItems={cartItems}
            notifications={notifications}
            onLogin={onLogin}
            onLogout={onLogout}
            onCartClick={onCartClick}
            onProfileClick={onProfileClick}
            onNotificationRead={onNotificationRead}
          />
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar (di luar layout utama agar tidak mengganggu flex) */}
        <div className="md:hidden pb-4">
           <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {/* Mobile Menu Container */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          {/* Implementasi MobileMenu di sini atau impor komponennya */}
          {/* <MobileMenu currentUser={currentUser} ... /> */}
          <p className='p-4 text-center'>Mobile Menu Content Goes Here</p>
        </div>
      )}
    </header>
  );
};

export default Header;