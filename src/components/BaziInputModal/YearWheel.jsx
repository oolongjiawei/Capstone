import { useEffect, useRef } from 'react';

// Must match $wheel-item-height in BaziInputModal.scss
const ITEM_HEIGHT = 40;
const DEFAULT_YEAR = 1990;

// Scrollable year wheel: the year snapped into the middle band is the selection
const YearWheel = ({ min, max, value, onChange, onDone }) => {
  const listRef = useRef(null);
  const settleTimer = useRef(null);
  // centring the wheel on open also fires scroll events; only the user's own scrolling picks a year
  const userScrolled = useRef(false);
  const markUserScroll = () => {
    userScrolled.current = true;
  };
  const shown = value ?? DEFAULT_YEAR;

  const years = [];
  for (let y = min; y <= max; y++) years.push(y);

  // Centre the current (or default) year when the wheel opens
  useEffect(() => {
    listRef.current.scrollTop = (shown - min) * ITEM_HEIGHT;
    return () => clearTimeout(settleTimer.current);
    // only on open; later changes come from the wheel itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToYear = (year) => {
    listRef.current.scrollTo({ top: (year - min) * ITEM_HEIGHT, behavior: 'smooth' });
  };

  // Pick up the year once scrolling settles on it
  const handleScroll = () => {
    if (!userScrolled.current) return;
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const index = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
      const year = Math.min(max, Math.max(min, min + index));
      if (year !== value) onChange(year);
    }, 120);
  };

  const handleKeyDown = (e) => {
    const step = { ArrowUp: -1, ArrowDown: 1, PageUp: -10, PageDown: 10 }[e.key];
    if (step) {
      e.preventDefault();
      const year = Math.min(max, Math.max(min, shown + step));
      onChange(year);
      scrollToYear(year);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onDone(shown);
    }
  };

  return (
    <div className="bazi-wheel">
      <ul
        ref={listRef}
        className="bazi-wheel__list"
        role="listbox"
        aria-label="Birth year"
        aria-activedescendant={`bazi-year-${shown}`}
        tabIndex={0}
        onScroll={handleScroll}
        onWheel={markUserScroll}
        onTouchStart={markUserScroll}
        onPointerDown={markUserScroll}
        onKeyDown={handleKeyDown}
      >
        {years.map((year) => (
          <li
            key={year}
            id={`bazi-year-${year}`}
            role="option"
            aria-selected={year === shown}
            className={`bazi-wheel__item ${year === shown ? 'is-selected' : ''}`}
            onClick={() => scrollToYear(year)}
          >
            {year}
          </li>
        ))}
      </ul>
      <button type="button" className="bazi-option bazi-wheel__done" onClick={() => onDone(shown)}>
        Done
      </button>
    </div>
  );
};

export default YearWheel;
