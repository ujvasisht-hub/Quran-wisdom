import { useCallback, useEffect, useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied' as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const scheduleNotification = useCallback(async (timeStr: string) => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') return false;
    }

    const [hour, minute] = timeStr.split(':').map(Number);

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        hour,
        minute,
      });
    }

    return true;
  }, [permission, requestPermission]);

  return { permission, requestPermission, scheduleNotification };
}
