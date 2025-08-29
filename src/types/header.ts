export interface User {
  id: string | number;
  email: string;
  name?: string;
  avatar?: string;
}

export interface HeaderUser {
  id: string | number;
  email: string;
  name?: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface HeaderProps {
  currentUser?: User;
  cartItems?: CartItem[];
  notifications?: Notification[];
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onNotificationRead?: (notificationId: string) => void;
  className?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}
