// ============================================================
// dateHelper.js — Utility functions for date manipulation
// ============================================================

/**
 * Format a Date object to "YYYY-MM-DD" string
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as "YYYY-MM-DD" string
 */
export function getTodayStr() {
  return formatDate(new Date());
}

/**
 * Get array of last N days as "YYYY-MM-DD" strings (newest last)
 */
export function getLastNDays(n = 7) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

/**
 * Get last 7 days
 */
export function getLast7Days() {
  return getLastNDays(7);
}

/**
 * Get number of days in a given month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week (0=Sun) for first day of a month
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Format "YYYY-MM-DD" to display like "Senin, 31 Mei 2026"
 */
export function formatDisplayDate(dateStr) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date(dateStr + 'T00:00:00');
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Short day name for stats chart
 */
export function getShortDayName(dateStr) {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()];
}

/**
 * Get month name in Bahasa Indonesia
 */
export function getMonthName(month) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[month];
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr) {
  return dateStr === getTodayStr();
}

/**
 * Check if a date string is in the future
 */
export function isFuture(dateStr) {
  return dateStr > getTodayStr();
}
