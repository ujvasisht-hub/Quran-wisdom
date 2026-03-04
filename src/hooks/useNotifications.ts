import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const NOTIFICATION_ID = 2001;
const STORAGE_KEY = 'notification_time_saved';

async function cancelAllExisting() {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (_) {}
}

async function scheduleOnce(timeStr: string) {
  await cancelAllExisting();

  const [hour, minute] = timeStr.split(':').map(Number);
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(hour, minute, 0, 0);

  // If time already passed today, schedule for tomorrow
  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: '🕌 Daily Quranic Wisdom',
        body: 'Your verse and reflection for today is ready. Tap to open.',
        schedule: {
          at: scheduled,
          repeats: false,
        },
        smallIcon: 'ic_stat_notify',
        iconColor: '#d4af37',
        sound: undefined,
        actionTypeId: '',
        extra: null,
      },
    ],
  });
}

export function useNotifications() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    checkPermission().then(async (perm) => {
      if (perm === 'granted') {
        // On app open, reschedule for tomorrow if a time was previously saved
        const savedTime = localStorage.getItem(STORAGE_KEY);
        if (savedTime) {
          try {
            await scheduleOnce(savedTime);
          } catch (_) {}
        }
      }
    });
  }, []);

  const checkPermission = async (): Promise<'granted' | 'denied' | 'default'> => {
    if (!Capacitor.isNativePlatform()) {
      if (typeof Notification !== 'undefined') {
        const perm = Notification.permission;
        const status = perm === 'granted' ? 'granted' : perm === 'denied' ? 'denied' : 'default';
        setPermission(status);
        return status;
      }
      return 'default';
    }
    const result = await LocalNotifications.checkPermissions();
    const status = result.display === 'granted' ? 'granted' : result.display === 'denied' ? 'denied' : 'default';
    setPermission(status);
    return status;
  };

  const requestPermission = useCallback(async (): Promise<'granted' | 'denied' | 'default'> => {
    if (!Capacitor.isNativePlatform()) {
      if (typeof Notification === 'undefined') return 'denied';
      const result = await Notification.requestPermission();
      const status = result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'default';
      setPermission(status);
      return status;
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
      await scheduleOnce(timeStr);
      // Save the time so app can reschedule on next open
      localStorage.setItem(STORAGE_KEY, timeStr);
      return true;
    } catch (err) {
      console.error('Failed to schedule notification:', err);
      return false;
    }
  }, [permission, requestPermission]);

  return { permission, requestPermission, scheduleNotification };
}
