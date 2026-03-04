import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const NOTIFICATION_ID = 4001;

async function cancelAllExisting() {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (_) {}
}

async function getSavedTime(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: 'notification_time' });
    return value;
  } catch {
    return null;
  }
}

async function saveTime(timeStr: string) {
  try {
    await Preferences.set({ key: 'notification_time', value: timeStr });
  } catch (_) {}
}

export function useNotifications() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    checkPermissionSilent();
  }, []);

  const checkPermissionSilent = async (): Promise<'granted' | 'denied' | 'default'> => {
    try {
      const result = await LocalNotifications.checkPermissions();
      const status = result.display === 'granted' ? 'granted' : result.display === 'denied' ? 'denied' : 'default';
      setPermission(status);
      return status;
    } catch {
      return 'default';
    }
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
      // Cancel everything first
      await cancelAllExisting();

      const [hour, minute] = timeStr.split(':').map(Number);

      // Schedule using exact hour and minute repeat
      // This uses Android's AlarmManager which works even when app is closed
      await LocalNotifications.schedule({
        notifications: [
          {
            id: NOTIFICATION_ID,
            title: '🕌 Daily Quranic Wisdom',
            body: 'Your verse and reflection for today is ready. Tap to open.',
            schedule: {
              on: {
                hour: hour,
                minute: minute,
              },
            },
            smallIcon: 'ic_stat_notify',
            iconColor: '#d4af37',
            sound: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });

      await saveTime(timeStr);
      return true;
    } catch (err) {
      console.error('Failed to schedule notification:', err);
      return false;
    }
  }, [permission, requestPermission]);

  return { permission, requestPermission, scheduleNotification };
}
