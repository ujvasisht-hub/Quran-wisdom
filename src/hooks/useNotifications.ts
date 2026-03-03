import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export function useNotifications() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!Capacitor.isNativePlatform()) {
      if (typeof Notification !== 'undefined') {
        const perm = Notification.permission;
        setPermission(perm === 'granted' ? 'granted' : perm === 'denied' ? 'denied' : 'default');
      }
      return;
    }
    const result = await LocalNotifications.checkPermissions();
    if (result.display === 'granted') {
      setPermission('granted');
    } else if (result.display === 'denied') {
      setPermission('denied');
    } else {
      setPermission('default');
    }
  };

  const requestPermission = useCallback(async (): Promise<'granted' | 'denied' | 'default'> => {
    if (!Capacitor.isNativePlatform()) {
      if (typeof Notification === 'undefined') return 'denied';
      const result = await Notification.requestPermission();
      setPermission(result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'default');
      return result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'default';
    }
    const result = await LocalNotifications.requestPermissions();
    const status = result.display === 'granted' ? 'granted' : result.display === 'denied' ? 'denied' : 'default';
    setPermission(status);
    return status;
  }, []);

  const scheduleNotification = useCallback(async (timeStr: string): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
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
    }

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (_) {}

    const [hour, minute] = timeStr.split(':').map(Number);

    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '🕌 Daily Quranic Wisdom',
            body: 'Your verse and reflection for today is ready. Tap to open.',
            schedule: {
              at: scheduled,
              repeats: true,
              every: 'day',
            },
            smallIcon: 'ic_stat_notify',
            iconColor: '#d4af37',
            sound: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      return true;
    } catch (err) {
      console.error('Failed to schedule notification:', err);
      return false;
    }
  }, [permission, requestPermission]);

  return { permission, requestPermission, scheduleNotification };
}