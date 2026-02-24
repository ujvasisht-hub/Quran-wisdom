import type { DailyWisdom } from './types';
import { wisdomQ1 } from './wisdom-q1';
import { wisdomQ2 } from './wisdom-q2';
import { wisdomQ3 } from './wisdom-q3';
import { wisdomQ4 } from './wisdom-q4';

export type { DailyWisdom };

const allWisdom: DailyWisdom[] = [
  ...wisdomQ1,
  ...wisdomQ2,
  ...wisdomQ3,
  ...wisdomQ4,
];

export function getWisdomForDate(date: Date = new Date()): DailyWisdom {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = ((dayOfYear - 1) % 366 + 366) % 366;
  return allWisdom[index];
}

export function getFormattedDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
