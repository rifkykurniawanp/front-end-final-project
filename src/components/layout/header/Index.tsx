"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { HeaderActions } from "./headeractions";
import { SearchBar } from "./search/searchbar";

export interface HeaderProps {
  cartItems?: { quantity: number }[];
  notifications?: any[];
  onNotificationRead?: (id: string) => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems = [],
  notifications = [],
  onNotificationRead,
  onSearch,
}) => {
  const router = useRouter();

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <header className="bg-[#3E2F2F] px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Center: Search */}
      <div className="flex-1 w-full max-w-xl">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        <HeaderActions
          cartItems={cartItems}
          notifications={notifications}
          onCartClick={handleCartClick}  // langsung ke /cart
          onNotificationRead={onNotificationRead}
        />
      </div>
    </header>
  );
};

export default Header;
