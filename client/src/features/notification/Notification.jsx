import { Bell, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../../axios/axios";
import { socket } from "../../socket/socket";

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}
function NotificationBell() {
  const [notifications, setNotifications] = useState([]); // flat array
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // ── Initial load ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notification");
        if (res.status === "success") {
          setNotifications(res.data.notifications ?? []);
          setUnreadCount(res.data.unreadCount ?? 0);
        }
      } catch (error) {
        console.error("[Notification] Fetch error:", error);
      }
    };
    fetchNotifications();
  }, []);

  // ── Real-time: prepend incoming notification ──────────────────────────
  useEffect(() => {
    const onNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("[Notification] Mark as read error:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notification/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("[Notification] Mark all read error:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("[Notification] Delete error:", error);
    }
  };

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-11 h-11 flex items-center justify-center rounded-[14px] border border-primary/20 bg-white shadow-sm text-primary transition-all duration-200 hover:bg-primary/5 hover:border-primary/40 hover:-translate-y-px hover:shadow-md active:translate-y-0 group"
      >
        <Bell
          size={20}
          className="transition-transform duration-300 group-hover:-rotate-12"
        />
        {unreadCount > 0 && (
          <span className="absolute top-[7px] right-[7px] w-[9px] h-[9px] bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2.5 w-[360px] bg-white border border-primary/15 rounded-[18px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between px-[18px] py-4 border-b border-primary/10 bg-white">
            <div className="flex items-center gap-2">
              <h4 className="text-[15px] font-semibold text-primary tracking-tight">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/25 rounded-full px-2 py-0.5 leading-none">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary font-medium bg-primary/8 hover:bg-primary/15 border border-primary/25 rounded-lg px-2.5 py-1 transition-colors duration-150"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                <div className="w-11 h-11 rounded-[14px] bg-primary/8 flex items-center justify-center text-primary">
                  <Bell size={20} />
                </div>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`relative flex items-start gap-3 px-[18px] py-[13px] border-b border-primary/8 transition-colors duration-150 cursor-pointer last:border-b-0 ${
                    !n.isRead
                      ? "bg-indigo-50/70 hover:bg-indigo-100/60"
                      : "hover:bg-primary/5"
                  }`}
                >
                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-primary" />
                  )}

                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[13px] font-semibold ${
                      !n.isRead
                        ? "bg-gradient-to-br from-indigo-400 to-primary"
                        : "bg-gradient-to-br from-primary/40 to-primary/70"
                    }`}
                  >
                    {n.icon || "🔔"}
                  </div>

                  {/* Body */}
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => handleClick(n)}
                  >
                    <p
                      className={`text-[13.5px] leading-snug ${
                        !n.isRead
                          ? "text-gray-800 font-medium"
                          : "text-gray-700 font-normal"
                      }`}
                    >
                      {n.message}
                    </p>

                    <p className="text-[11.5px] text-gray-400 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="self-center p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
