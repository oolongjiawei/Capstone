import { useId, useRef, useState } from 'react';
import { formatHour } from './pickerUtils';
import { playTick } from '../../sound/mysticSound';

const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
const SIZE = 220;
const C = SIZE / 2;
const HAND_LENGTH = C * 0.52;

// Chinese double-hour (时辰) for an hour in [0, 24): 23:00-00:59 is 子, 01:00-02:59 is 丑, ...
const branchOf = (hour) => BRANCHES[Math.floor((hour + 1) / 2) % 12];

// position on the dial for an hour (0-12, half hours allowed)
const point = (hour12, radius) => {
  const angle = (hour12 * 30 * Math.PI) / 180;
  return { x: C + radius * Math.sin(angle), y: C - radius * Math.cos(angle) };
};

// Clock face with only an hour hand: drag the hand (or tap a number) to set the time, in half-hour steps
const HourClock = ({ value, onChange }) => {
  const uid = `clock-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
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
    if (hour !== value) {
      playTick();
      onChange(hour);
    }
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
    playTick();
    onChange(hour);
  };

  const hour12 = value != null ? value % 12 || 12 : 12;
  const tip = point(hour12, HAND_LENGTH);
  const halfHourTicks = Array.from({ length: 12 }, (_, i) => point(i + 0.5, C * 0.78));

  return (
    <div className="bazi-clock">
      {/* raised bezel around a recessed dial, like the app's neumorphic buttons */}
      <div className="bazi-clock__bezel">
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
        <defs>
          {/* the hand is shaded across its width like a rounded bar */}
          <linearGradient id={`${uid}-hand`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" className="bazi-clock__stop--hand-light" />
            <stop offset="0.45" className="bazi-clock__stop--hand" />
            <stop offset="1" className="bazi-clock__stop--hand-dark" />
          </linearGradient>
          {/* knob and hub: glossy beads lit from the top left */}
          <radialGradient id={`${uid}-knob`} cx="0.35" cy="0.3" r="0.75">
            <stop offset="0" className="bazi-clock__stop--knob-light" />
            <stop offset="0.55" className="bazi-clock__stop--knob" />
            <stop offset="1" className="bazi-clock__stop--knob-dark" />
          </radialGradient>
          <radialGradient id={`${uid}-hub`} cx="0.35" cy="0.3" r="0.75">
            <stop offset="0" className="bazi-clock__stop--hand-light" />
            <stop offset="0.55" className="bazi-clock__stop--hand" />
            <stop offset="1" className="bazi-clock__stop--hand-dark" />
          </radialGradient>
          <filter id={`${uid}-lift`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" className="bazi-clock__shadow" />
          </filter>
        </defs>
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
        {/* the shadow sits on the unrotated group, so it always falls bottom-right */}
        <g className="bazi-clock__hand-group" filter={`url(#${uid}-lift)`}>
          <g transform={`rotate(${hour12 * 30} ${C} ${C})`}>
            <rect
              x={C - 5}
              y={C - HAND_LENGTH}
              width={10}
              height={HAND_LENGTH + 14}
              rx={5}
              fill={`url(#${uid}-hand)`}
            />
          </g>
          <circle className="bazi-clock__knob" cx={tip.x} cy={tip.y} r={10} fill={`url(#${uid}-knob)`} />
          <circle cx={C} cy={C} r={9} fill={`url(#${uid}-hub)`} />
        </g>
      </svg>
      </div>

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
