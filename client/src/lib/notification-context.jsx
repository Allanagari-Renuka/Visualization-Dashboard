// lib/notification-context.jsx
import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [items, setItems] = useState([]);
  const didMountRef = useRef(false);

  const addNotification = useCallback((message) => {
    const item = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
    };
    setItems((prev) => [item, ...prev].slice(0, 100));
    setHasUnread(true);
  }, []);

  // When push notifications are toggled on, show a small template toast once.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (!pushEnabled) {
      // When disabled, just keep the small rounded icon (unread state)
      setHasUnread(true);
      return;
    }

    const message = "Push notifications have been enabled. New alerts will appear in the top-right corner.";
    addNotification(message);
    toast({
      title: "Push notifications enabled",
      description: message,
      duration: 2000,
    });
  }, [pushEnabled, addNotification]);

  const value = {
    pushEnabled,
    setPushEnabled,
    hasUnread,
    markAllRead: () => setHasUnread(false),
    addNotification,
    items,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}


