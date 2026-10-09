// Shared by the Bazi input pickers

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

// Hours are kept in half-hour steps: 15.5 -> "3:30 PM (15:30)"
export const formatHour = (hour) => {
  const h = Math.floor(hour);
  const minutes = hour % 1 ? '30' : '00';
  return `${h % 12 || 12}:${minutes} ${h < 12 ? 'AM' : 'PM'} (${String(h).padStart(2, '0')}:${minutes})`;
};
