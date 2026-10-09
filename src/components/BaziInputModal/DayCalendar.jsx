import { useState } from 'react';
import { MONTH_NAMES, daysInMonth } from './pickerUtils';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Month calendar; picking a day also fixes the year and month being viewed
const DayCalendar = ({ year, month, day, minYear, onSelect }) => {
  const today = new Date();
  const [view, setView] = useState({ year: year ?? 1990, month: month ?? 1 });

  const isFirst = view.year === minYear && view.month === 1;
  const isLast = view.year === today.getFullYear() && view.month === today.getMonth() + 1;

  const shiftMonth = (delta) => {
    setView(({ year: y, month: m }) => {
      const index = y * 12 + (m - 1) + delta;
      return { year: Math.floor(index / 12), month: (index % 12) + 1 };
    });
  };

  const firstWeekday = new Date(view.year, view.month - 1, 1).getDay();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth(view.year, view.month) }, (_, i) => i + 1),
  ];
  const isFuture = (d) => new Date(view.year, view.month - 1, d) > today;
  const isSelected = (d) => d === day && view.year === year && view.month === month;

  return (
    <div className="bazi-calendar">
      <div className="bazi-calendar__header">
        <button type="button" className="bazi-option bazi-calendar__nav" onClick={() => shiftMonth(-1)} disabled={isFirst} aria-label="Previous month">
          ‹
        </button>
        <span className="bazi-calendar__title" aria-live="polite">
          {MONTH_NAMES[view.month - 1]} {view.year}
        </span>
        <button type="button" className="bazi-option bazi-calendar__nav" onClick={() => shiftMonth(1)} disabled={isLast} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="bazi-calendar__grid">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="bazi-calendar__weekday" aria-hidden="true">{w}</span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`blank-${i}`} />
          ) : (
            <button
              key={d}
              type="button"
              className={`bazi-option bazi-calendar__day ${isSelected(d) ? 'is-selected' : ''}`}
              aria-pressed={isSelected(d)}
              aria-label={`${MONTH_NAMES[view.month - 1]} ${d}, ${view.year}`}
              disabled={isFuture(d)}
              onClick={() => onSelect(view.year, view.month, d)}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default DayCalendar;
