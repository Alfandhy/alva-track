// ============================================================
// calculateStreak.js — Streak calculation utilities
// ============================================================

import { formatDate } from './dateHelper';

/**
 * Get all completion dates for a specific habit (sorted descending)
 */
function getCompletedDates(completions, habitId) {
  return completions
    .filter(c => c.habitId === habitId && c.completed)
    .map(c => c.date)
    .sort((a, b) => b.localeCompare(a)); // newest first
}

/**
 * Calculate current streak for a habit
 * Counts consecutive days ending today or yesterday
 */
export function getCurrentStreak(completions, habitId) {
  const completedDates = getCompletedDates(completions, habitId);
  if (completedDates.length === 0) return 0;

  const today = formatDate(new Date());

  // Check if today or yesterday is completed (streak still alive)
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(completedDates[0] + 'T00:00:00');

  for (const dateStr of completedDates) {
    const d = formatDate(checkDate);
    if (dateStr === d) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest streak for a habit (all time)
 */
export function getLongestStreak(completions, habitId) {
  const completedDates = getCompletedDates(completions, habitId);
  if (completedDates.length === 0) return 0;

  // Sort ascending for longest streak calc
  const sorted = [...completedDates].sort((a, b) => a.localeCompare(b));

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const curr = new Date(sorted[i] + 'T00:00:00');
    const diffDays = (curr - prev) / 86400000;

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Get completion rate percentage for a habit (last 7 days)
 */
export function getCompletionRate(completions, habitId, days = 7) {
  const completedDates = new Set(
    completions
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => c.date)
  );

  let completed = 0;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = formatDate(new Date(today.getTime() - i * 86400000));
    if (completedDates.has(d)) completed++;
  }

  return Math.round((completed / days) * 100);
}

/**
 * Get best habit (highest completion rate last 7 days)
 */
export function getBestHabit(habits, completions) {
  if (habits.length === 0) return null;
  let best = null;
  let bestRate = -1;
  for (const habit of habits) {
    const rate = getCompletionRate(completions, habit.id, 7);
    if (rate > bestRate) {
      bestRate = rate;
      best = habit;
    }
  }
  return best;
}

/**
 * Get best day of the week (most completions) in last 7 days
 */
export function getBestDay(completions) {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const counts = Array(7).fill(0);
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = formatDate(d);
    const dayOfWeek = d.getDay();
    const countForDay = completions.filter(c => c.date === dateStr && c.completed).length;
    counts[dayOfWeek] += countForDay;
  }

  const maxIdx = counts.indexOf(Math.max(...counts));
  return dayNames[maxIdx];
}
