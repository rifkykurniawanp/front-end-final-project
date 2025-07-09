// components/layout/header/NotificationPopover.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Notification } from '@/types/header'; // Impor dari types

interface NotificationPopoverProps {
  notifications: Notification[];
  onNotificationRead?: (notificationId: string) => void;
}

const getNotificationTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
};

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ notifications, onNotificationRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-700 hover:text-orange-950 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm hover:scale-105">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && <p className="text-sm text-gray-500 mt-1">You have {unreadCount} unread messages.</p>}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <div
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => onNotificationRead?.(notification.id)}
                >
                  {/* ... (Konten notifikasi sama seperti sebelumnya) ... */}
                </div>
                {index < notifications.length - 1 && <Separator />}
              </React.Fragment>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>
         {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" className="w-full text-sm">View all</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};