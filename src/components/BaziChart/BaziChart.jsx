import { useEffect, useId, useRef, useState } from 'react';
import './BaziChart.scss';
import { NOISE_TO_ALPHA } from '../TurbulentDissolve/noise';
import { playInkDrop } from '../../sound/mysticSound';

// Seeping text: each pillar's text comes up from the bottom of its cells through mottled noise,
// like ink soaking through paper. Order: the Day Master first, then Year, Month, Hour, then the
// description.
const SEEP_ORDER = ['day', 'year', 'month', 'hour', 'brief'];
const SEEP_MS = { day: 900, year: 900, month: 900, hour: 900, brief: 1300 };
const SEEP_STAGGER_MS = 550;
// alpha = 0.35 * noise + 0.65 * (1 at the bottom .. 0 at the top) + threshold; shown where >= 0.5
const NOISE_WEIGHT = 0.35;
const RISE_WEIGHT = 0.65;
const HIDDEN = -0.6; // nothing reaches 0.5
const SHOWN = 0.5; // everything does
// black at the top, white at the bottom: the ink rises from the bottom of each cell
const RISE_GRADIENT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3ClinearGradient id='g' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='black'/%3E%3Cstop offset='1' stop-color='white'/%3E%3C/linearGradient%3E%3Crect width='8' height='8' fill='url(%23g)'/%3E%3C/svg%3E";

// seepText (optional): "hold" keeps the result text hidden (headers stay), "play" seeps it in
const BaziChart = ({ baziData, seepText }) => {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const thresholdRefs = useRef({});
  const [seeped, setSeeped] = useState(() => new Set());

  useEffect(() => {
    if (seepText !== 'play') return;
    const finishAll = () => setSeeped(new Set(SEEP_ORDER));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishAll();
      return;
    }
    let frame;
    const finished = new Set();
    const sounded = new Set();
    const start = performance.now();
    const step = (now) => {
      SEEP_ORDER.forEach((group, i) => {
        if (finished.has(group)) return;
        if (!sounded.has(group) && now - start >= i * SEEP_STAGGER_MS) {
          sounded.add(group);
          playInkDrop(i, group === 'brief');
        }
        const p = Math.min(1, Math.max(0, (now - start - i * SEEP_STAGGER_MS) / SEEP_MS[group]));
        thresholdRefs.current[group]?.setAttribute('k4', String(HIDDEN + p * (SHOWN - HIDDEN)));
        if (p === 1) {
          finished.add(group);
          setSeeped(new Set(finished));
        }
      });
      if (finished.size < SEEP_ORDER.length) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    // animation frames pause in a hidden tab; still show the full chart in the end
    const total = (SEEP_ORDER.length - 1) * SEEP_STAGGER_MS + SEEP_MS.brief + 250;
    const fallback = setTimeout(finishAll, total);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [seepText]);

  if (!baziData) {
    return null;
  }

  // the filter sits on the text, not the cell, so the cell's background and borders stay put
  const ink = (group, text) => (
    <span
      className="bazi-chart__ink"
      style={seepText && !seeped.has(group) ? { filter: `url(#seep-${uid}-${group})` } : undefined}
    >
      {text}
    </span>
  );

  return (
    <div className="bazi-chart">
      {seepText && (
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
          {SEEP_ORDER.map((group, i) => (
            <filter key={group} id={`seep-${uid}-${group}`} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed={i + 1} result="noise" />
              <feColorMatrix in="noise" type="matrix" values={NOISE_TO_ALPHA} result="mottle" />
              <feImage href={RISE_GRADIENT} x="0%" y="0%" width="100%" height="100%" preserveAspectRatio="none" result="ramp" />
              <feColorMatrix in="ramp" type="luminanceToAlpha" result="rise" />
              <feComposite
                ref={(el) => {
                  thresholdRefs.current[group] = el;
                }}
                in="mottle"
                in2="rise"
                operator="arithmetic"
                k1="0"
                k2={NOISE_WEIGHT}
                k3={RISE_WEIGHT}
                k4={HIDDEN}
              />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 1" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite operator="in" in="SourceGraphic" />
            </filter>
          ))}
        </svg>
      )}
      <table className="bazi-chart__table"> 
        <thead>
          <tr>
            <th>Hour 时</th>
            <th>Day 日</th>
            <th>Month 月</th>
            <th>Year 年</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ink('hour', baziData.bazi_time)}</td>
            <td className='main_column'>{ink('day', baziData.bazi_day)}</td>
            <td>{ink('month', baziData.bazi_month)}</td>
            <td>{ink('year', baziData.bazi_year)}</td>
          </tr>
          <tr>
            <td>{ink('hour', baziData.symbol_time)}</td>
            <td className='main_column'>{ink('day', baziData.symbol_day)}</td>
            <td>{ink('month', baziData.symbol_month)}</td>
            <td>{ink('year', baziData.symbol_year)}</td>
          </tr>
          <tr>
            <td></td>
            <td>{ink('brief', baziData.brief)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BaziChart;
