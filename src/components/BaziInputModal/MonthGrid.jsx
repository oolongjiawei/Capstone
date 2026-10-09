import { MONTH_NAMES } from './pickerUtils';

const MonthGrid = ({ value, onSelect }) => (
  <div className="bazi-months" role="group" aria-label="Birth month">
    {MONTH_NAMES.map((name, i) => (
      <button
        key={name}
        type="button"
        className={`bazi-option ${value === i + 1 ? 'is-selected' : ''}`}
        aria-pressed={value === i + 1}
        aria-label={name}
        onClick={() => onSelect(i + 1)}
      >
        {name.slice(0, 3)}
      </button>
    ))}
  </div>
);

export default MonthGrid;
