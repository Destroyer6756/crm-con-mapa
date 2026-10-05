import { useState, useCallback } from 'react';
import type { Notification } from '../types/cloud';

let notificationCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: Notification['type'] = 'success') => {
      const id = `notif-${++notificationCounter}`;
      const newNotif: Notification = { id, message, type, timestamp: new Date() };
      setNotifications((prev) => [...prev, newNotif]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
}

export default useNotifications;
