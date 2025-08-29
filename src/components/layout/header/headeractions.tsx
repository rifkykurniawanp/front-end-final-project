"use client";

import { ProfileDropdown } from "./profiledropdown";
import { NotificationPopover } from "./NotificationPopUp";
import { ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

export interface HeaderActionsProps {
  cartItems?: { quantity: number }[];
  notifications?: any[];
  onCartClick?: () => void;
  onNotificationRead?: (id: string) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  cartItems = [],
  notifications = [],
  onCartClick,
  onNotificationRead,
}) => {
  const { user, logout, isInitialized, isClient } = useAuthContext();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Jangan render apa-apa sampai context siap di client
  if (!isInitialized || !isClient) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <NotificationPopover
        notifications={notifications}
        onNotificationRead={onNotificationRead}
      />

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative p-2 text-[#F5E6C4] hover:text-[#D4AF7F] rounded-lg transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D4AF7F] text-[#3E2F2F] text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* User */}
      {user ? (
        <ProfileDropdown
          user={{
            id: user.id.toString(),
            email: user.email,
            name: user.email.split("@")[0], // fallback
          }}
          onLogout={logout}
        />
      ) : (
        <Button
          onClick={() => (window.location.href = "/login")}
          variant="outline"
          className="text-[#F5E6C4] border-[#D4AF7F] hover:bg-[#4A3737] hover:text-[#D4AF7F]"
        >
          <LogIn className="h-4 w-4 mr-2" /> Login
        </Button>
      )}
    </div>
  );
};
