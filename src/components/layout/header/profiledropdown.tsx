"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface HeaderUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface ProfileDropdownProps {
  user: HeaderUser;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onLogout,
  onProfileClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user.name || user.email.split("@")[0];
  const displayAvatar = user.avatar || "";

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-[#F5E6C4] hover:text-[#D4AF7F]"
        variant="ghost"
      >
        {user.avatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 bg-[#F5E6C4] rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-[#3E2F2F]" />
          </div>
        )}
        <span className="font-medium hidden lg:inline">{displayName}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#F9F4EA] rounded-lg shadow-lg border border-[#E5D7C5] z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-[#E5D7C5]">
            <p className="text-sm font-medium truncate text-[#3E2F2F]">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={onProfileClick}
            className="w-full text-left px-4 py-2 text-sm text-[#3E2F2F] hover:bg-[#E5D7C5]"
          >
            Profile
          </button>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-[#3E2F2F] hover:bg-[#E5D7C5]"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-[#3E2F2F] hover:bg-[#E5D7C5]"
          >
            Settings
          </Link>

          <Separator className="my-1 bg-[#E5D7C5]" />

          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};
