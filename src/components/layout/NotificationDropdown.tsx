import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, X, ArrowRight, Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info" | "success";
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Unusual Transaction Detected",
    message: "Large debit of ₹2,45,000 flagged for review in HDFC account",
    type: "critical",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Budget Alert",
    message: "Marketing spend exceeded monthly budget by 15%",
    type: "warning",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Payment Received",
    message: "Invoice #INV-2025-089 payment of ₹1,85,000 received",
    type: "success",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Account Reconciliation",
    message: "March 2025 reconciliation completed successfully",
    type: "info",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    title: "Low Balance Warning",
    message: "ICICI operating account balance below threshold (₹50,000)",
    type: "warning",
    timestamp: "Yesterday",
    read: true,
  },
];

const TYPE_CONFIG = {
  critical: {
    icon: AlertTriangle,
    color: "var(--z-red)",
    bg: "rgba(240,82,82,0.1)",
    border: "rgba(240,82,82,0.3)",
  },
  warning: {
    icon: AlertTriangle,
    color: "var(--z-yellow)",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  info: {
    icon: Info,
    color: "var(--z-accent)",
    bg: "rgba(61,110,250,0.1)",
    border: "rgba(61,110,250,0.3)",
  },
  success: {
    icon: CheckCircle,
    color: "var(--z-green)",
    bg: "rgba(20,217,164,0.1)",
    border: "rgba(20,217,164,0.3)",
  },
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sort notifications: unread first, then by criticality
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Unread first
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;
    
    // Then by priority
    const priority = { critical: 0, warning: 1, info: 2, success: 3 };
    return priority[a.type] - priority[b.type];
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2"
        style={{ color: "var(--z-text-secondary)" }}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span
            className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
            style={{ background: "var(--z-red)", color: "white" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-96 rounded-xl border shadow-2xl"
            style={{
              background: "var(--z-bg-surface)",
              borderColor: "var(--z-border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: "var(--z-border)" }}
            >
              <div>
                <h3
                  className="font-display text-sm font-semibold"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  Notifications
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
                  {unreadCount} unread
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--z-accent)" }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 mb-3 opacity-20" style={{ color: "var(--z-text-muted)" }} />
                  <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
                    No notifications
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {sortedNotifications.map((notification, index) => {
                    const config = TYPE_CONFIG[notification.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group cursor-pointer px-5 py-4 transition-colors ${
                          !notification.read ? "bg-opacity-50" : ""
                        }`}
                        style={{
                          background: !notification.read
                            ? `${config.bg}30`
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--z-bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = !notification.read
                            ? `${config.bg}30`
                            : "transparent";
                        }}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: config.bg }}
                          >
                            <Icon className="h-4 w-4" style={{ color: config.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className="text-sm font-medium truncate"
                                style={{ color: "var(--z-text-primary)" }}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div
                                  className="h-2 w-2 shrink-0 rounded-full mt-1.5"
                                  style={{ background: config.color }}
                                />
                              )}
                            </div>
                            <p
                              className="text-xs mt-1 line-clamp-2"
                              style={{ color: "var(--z-text-secondary)" }}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className="text-[10px]"
                                style={{ color: "var(--z-text-muted)" }}
                              >
                                {notification.timestamp}
                              </span>
                              <span
                                className="text-[10px] uppercase tracking-wider font-medium"
                                style={{ color: config.color }}
                              >
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="border-t px-5 py-3"
              style={{ borderColor: "var(--z-border)" }}
            >
              <button
                className="flex w-full items-center justify-center gap-2 text-xs font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--z-accent)" }}
              >
                View All Notifications
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
