import React from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Notification } from "@/types/header";

interface NotificationPopoverProps {
  notifications: Notification[];
  onNotificationRead?: (notificationId: string) => void;
}

const getNotificationTypeColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "text-green-700";
    case "warning":
      return "text-yellow-700";
    case "error":
      return "text-red-700";
    default:
      return "text-blue-700";
  }
};

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  onNotificationRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-[#F5E6C4] hover:text-[#D4AF7F] rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#F9F4EA] border border-[#E5D7C5]" align="end">
        <div className="p-4 border-b border-[#E5D7C5]">
          <h3 className="font-semibold text-[#3E2F2F]">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You have {unreadCount} unread messages.
            </p>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <div
                  className={`p-4 hover:bg-[#E5D7C5] cursor-pointer ${
                    !notification.read ? "bg-[#EFE7DA]" : ""
                  }`}
                  onClick={() => onNotificationRead?.(notification.id)}
                >
                  <p
                    className={`font-medium ${getNotificationTypeColor(
                      notification.type
                    )}`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="bg-[#E5D7C5]" />
                )}
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
          <div className="p-2 border-t border-[#E5D7C5]">
            <Button variant="ghost" className="w-full text-sm text-[#3E2F2F] hover:bg-[#E5D7C5]">
              View all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
