import { useRef, useState } from 'react';
import { formatHour } from './pickerUtils';

const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
const SIZE = 220;
const C = SIZE / 2;

// Chinese double-hour (时辰) for an hour in [0, 24): 23:00-00:59 is 子, 01:00-02:59 is 丑, ...
const branchOf = (hour) => BRANCHES[Math.floor((hour + 1) / 2) % 12];

// position on the dial for an hour (0-12, half hours allowed)
const point = (hour12, radius) => {
  const angle = (hour12 * 30 * Math.PI) / 180;
  return { x: C + radius * Math.sin(angle), y: C - radius * Math.cos(angle) };
};

// Clock face with only an hour hand: drag the hand (or tap a number) to set the time, in half-hour steps
const HourClock = ({ value, onChange }) => {
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const [isPM, setIsPM] = useState(value != null ? value >= 12 : false);

  const to24 = (hour12, pm) => (hour12 % 12) + (pm ? 12 : 0);

  const setFromPointer = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const degrees = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
    // 15 degrees per half hour; the top of the dial is 12
    const hour12 = (Math.round(degrees / 15) % 24) / 2 || 12;
    const hour = to24(hour12, isPM);
    if (hour !== value) onChange(hour);
  };

  const handlePointerDown = (e) => {
    dragging.current = true;
    svgRef.current.setPointerCapture(e.pointerId);
    setFromPointer(e);
  };
  const handlePointerMove = (e) => {
    if (dragging.current) setFromPointer(e);
  };
  const handlePointerUp = () => {
    dragging.current = false;
  };

  const setMeridiem = (pm) => {
    setIsPM(pm);
    if (value != null) onChange((value % 12) + (pm ? 12 : 0));
  };

  const handleKeyDown = (e) => {
    const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const hour = ((value ?? (isPM ? 12 : 0)) + step * 0.5 + 24) % 24;
    setIsPM(hour >= 12);
    onChange(hour);
  };

  const hour12 = value != null ? value % 12 || 12 : 12;
  const tip = point(hour12, C * 0.52);
  const halfHourTicks = Array.from({ length: 12 }, (_, i) => point(i + 0.5, C * 0.78));

  return (
    <div className="bazi-clock">
      <svg
        ref={svgRef}
        className={`bazi-clock__face ${value == null ? 'is-unset' : ''}`}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
        tabIndex={0}
        aria-label="Birth hour"
        aria-valuemin={0}
        aria-valuemax={23}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value != null ? formatHour(value) : 'Not set'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <circle className="bazi-clock__dial" cx={C} cy={C} r={C - 4} />
        {halfHourTicks.map((p, i) => (
          <circle key={i} className="bazi-clock__tick" cx={p.x} cy={p.y} r={2.5} />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const h = i + 1;
          const p = point(h, C * 0.78);
          return (
            <text
              key={h}
              className={`bazi-clock__number ${value != null && h === hour12 ? 'is-selected' : ''}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {h}
            </text>
          );
        })}
        <line className="bazi-clock__hand" x1={C} y1={C} x2={tip.x} y2={tip.y} />
        <circle className="bazi-clock__knob" cx={tip.x} cy={tip.y} r={9} />
        <circle className="bazi-clock__hub" cx={C} cy={C} r={6} />
      </svg>

      <div className="bazi-clock__meridiem" role="group" aria-label="AM or PM">
        <button type="button" className={`bazi-option ${!isPM ? 'is-selected' : ''}`} aria-pressed={!isPM} onClick={() => setMeridiem(false)}>
          AM
        </button>
        <button type="button" className={`bazi-option ${isPM ? 'is-selected' : ''}`} aria-pressed={isPM} onClick={() => setMeridiem(true)}>
          PM
        </button>
      </div>

      <p className="bazi-clock__readout">
        {value != null ? (
          <>
            {formatHour(value)} · <span className="bazi-clock__branch">{branchOf(value)}时</span>
          </>
        ) : (
          'Drag the hand to your birth hour'
        )}
      </p>
    </div>
  );
};

export default HourClock;
