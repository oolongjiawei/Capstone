import { useEffect, useRef } from 'react';
import './NameReveal.scss';
import TurbulentDissolve from '../TurbulentDissolve/TurbulentDissolve';
import { playNameReveal } from '../../sound/mysticSound';

// Letter pop-in modelled on the "word" Lottie the design used: each character bounces in
// with a wiggle, a coloured sweep behind it, an outline, and a burst of confetti.
// Colours come from the theme (--color-reveal-*), so they follow light and dark mode.
const SWEEP_COLORS = [1, 2, 3].map((n) => `var(--color-reveal-sweep-${n})`);
const CONFETTI_COLORS = [...SWEEP_COLORS, 'var(--color-reveal-fill)'];
// [first, second] wiggle angle per letter (degrees)
const WIGGLES = [[7, -14], [-4, 14], [3, -10], [-3, 8], [3, -8], [-3, 10], [3, -12]];
// where each confetti piece flies to, as offsets on a 1200x1200 stage centred at (600, 600)
const CONFETTI = [
  [52, 262], [464, 222], [-176, 214], [492, -254], [-260, -418],
  [-408, -230], [232, -286], [4, -370], [300, 358], [-456, 258],
];

const DURATION_MS = 2750;

// onShown: the pop-in has finished (the parent can bring in the result now)
// leaving: the result is underneath; drop this backdrop and dissolve the name away into it.
//   leaveStart/leaveDuration match the result's dissolve, so the two swap pixel for pixel.
// onLeft: the name is gone
const NameReveal = ({ name, leaving = false, leaveStart, leaveDuration, onShown, onLeft }) => {
  const onShownRef = useRef(onShown);
  onShownRef.current = onShown;
  const onLeftRef = useRef(onLeft);
  onLeftRef.current = onLeft;

  const stopDrone = useRef(() => {});

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => onShownRef.current?.(), reduceMotion ? 1200 : DURATION_MS);
    stopDrone.current = playNameReveal(Array.from(name.replace(/\s+/g, '')).length);
    return () => {
      clearTimeout(timer);
      stopDrone.current(0.3);
    };
    // the sound plays once, for the name this reveal was opened with
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the drone fades while the name dissolves into the result
  useEffect(() => {
    if (leaving) stopDrone.current(leaveDuration / 1000);
  }, [leaving, leaveDuration]);

  // keep words together so long names wrap between words, never mid-word
  let index = 0;
  const words = name.split(/\s+/).map((word) =>
    Array.from(word).map((char) => {
      const i = index++;
      return { char, i };
    })
  );

  return (
    <div className={`name-reveal ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="assertive">
      <span className="name-reveal__sr">Generating the Bazi chart for {name}</span>
      {/* full-screen layer: the same box as the result's layer, so both read the same noise */}
      <TurbulentDissolve
        direction="out"
        play={leaving}
        startAt={leaveStart}
        duration={leaveDuration}
        onEnd={() => onLeftRef.current?.()}
        className="name-reveal__layer"
      >
      <div className="name-reveal__stage" aria-hidden="true">
        {CONFETTI.map(([x, y], i) => (
          <span
            key={i}
            className="name-reveal__confetti"
            style={{
              '--to-x': `${50 + (x / 1200) * 100}%`,
              '--to-y': `${50 + (y / 1200) * 100}%`,
              '--delay': `${(23 + (9 - i) * 2) / 60}s`,
              '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
          />
        ))}
        <p className="name-reveal__name" style={{ '--count': Math.max(index, 4) }}>
          {words.map((letters, w) => (
            <span key={w} className="name-reveal__word">
              {letters.map(({ char, i }) => {
                const [r1, r2] = WIGGLES[i % WIGGLES.length];
                return (
                  <span
                    key={i}
                    className="name-reveal__letter"
                    data-char={char}
                    style={{
                      '--delay': `${i * 50}ms`,
                      '--r1': `${r1}deg`,
                      '--r2': `${r2}deg`,
                      '--sweep': SWEEP_COLORS[i % SWEEP_COLORS.length],
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
        <p className="name-reveal__caption">Casting the Bazi chart…</p>
      </div>
      </TurbulentDissolve>
    </div>
  );
};

export default NameReveal;
