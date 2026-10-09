import { useEffect, useId, useRef, useState } from 'react';
import { NOISE_TO_ALPHA, NOISE_TO_INVERTED_ALPHA } from './noise';

// The noise is stretched to 0-1 alpha (see noise.js); the threshold sweeps that range
const HIDDEN = -0.55; // nothing reaches the 0.5 cut-off
const SHOWN = 0.55; // everything does
// Most of the noise sits near the top of that band, so the sweep starts slow and speeds up;
// this keeps the uncovered area growing at a roughly even pace
const reveal = (p) => p ** 2.2;

// Shows ("in") or hides ("out") its children through a fractal-noise mask, so they appear or
// vanish in irregular patches. An SVG filter turns turbulence into alpha and the animated
// threshold decides which patches of the children are drawn.
// An "out" layer is the exact complement of an "in" layer: same noise and timing, inverted,
// so a pair with the same box, duration and startAt swaps pixel for pixel (like a crossfade).
const TurbulentDissolve = ({
  direction = 'in',
  play = true,
  duration = 1200,
  startAt,
  onEnd,
  className,
  children,
  ...rest
}) => {
  const id = `dissolve-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const thresholdRef = useRef(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  // "in" starts masked (invisible); "out" is unmasked until it plays
  const [filtered, setFiltered] = useState(direction === 'in');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!play) return;
    let frame;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      setFiltered(false);
      if (direction === 'out') setHidden(true);
      onEndRef.current?.();
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    setFiltered(true);
    // a shared startAt keeps a crossfading pair on exactly the same clock
    const start = startAt ?? performance.now();
    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const threshold = HIDDEN + reveal(p) * (SHOWN - HIDDEN);
      thresholdRef.current?.setAttribute('intercept', String(direction === 'in' ? threshold : -threshold));
      if (p < 1) {
        frame = requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    frame = requestAnimationFrame(step);
    // animation frames pause in a hidden tab; make sure the flow still moves on
    const fallback = setTimeout(finish, start + duration + 250 - performance.now());
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [play, direction, duration, startAt]);

  return (
    <div
      {...rest}
      className={className}
      style={{ filter: filtered ? `url(#${id})` : undefined, visibility: hidden ? 'hidden' : undefined }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        {/* a little larger than the element so its shadow dissolves with it */}
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" />
          {/* alpha = stretched luminance of the noise */}
          <feColorMatrix type="matrix" values={direction === 'in' ? NOISE_TO_ALPHA : NOISE_TO_INVERTED_ALPHA} />
          <feComponentTransfer>
            <feFuncA ref={thresholdRef} type="linear" slope="1" intercept={direction === 'in' ? HIDDEN : -HIDDEN} />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1" />
          <feComposite operator="in" in="SourceGraphic" />
        </filter>
      </svg>
      {children}
    </div>
  );
};

export default TurbulentDissolve;
