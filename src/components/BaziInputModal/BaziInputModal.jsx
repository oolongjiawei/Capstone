import { useState } from 'react';
import Modal from 'react-modal';
import './BaziInputModal.scss';
import YearWheel from './YearWheel';
import MonthGrid from './MonthGrid';
import DayCalendar from './DayCalendar';
import HourClock from './HourClock';
import { MONTH_NAMES, daysInMonth, formatHour } from './pickerUtils';

Modal.setAppElement('#root');  // For accessibility considerations

const MIN_YEAR = 1950;
const FIELDS = ['year', 'month', 'day', 'hour'];

// One row of the form: tap it to expand its picker underneath
const PickerField = ({ name, label, display, isOpen, isInvalid, onToggle, children }) => (
  <div className={`bazi-input__field ${isOpen ? 'is-open' : ''} ${isInvalid ? 'invalid' : ''}`}>
    <button
      type="button"
      className="bazi-input__toggle"
      aria-expanded={isOpen}
      aria-controls={`bazi-${name}-panel`}
      onClick={onToggle}
    >
      <span className="bazi-input__label">{label}</span>
      <span className={`bazi-input__value ${display ? '' : 'is-empty'}`}>{display ?? 'Select'}</span>
    </button>
    {isOpen && (
      <div id={`bazi-${name}-panel`} className="bazi-input__panel">
        {children}
      </div>
    )}
  </div>
);

const BaziInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const [openField, setOpenField] = useState('year');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const values = { year, month, day, hour };

  const openNext = (field) => setOpenField(FIELDS[FIELDS.indexOf(field) + 1] ?? null);
  const toggle = (field) => setOpenField(openField === field ? null : field);

  // Drop a day that no longer exists in the newly chosen month (e.g. 31 -> February)
  const keepValidDay = (y, m) => {
    if (day && m && day > daysInMonth(y ?? 2000, m)) setDay(null);
  };

  const handleYearChange = (y) => {
    setYear(y);
    keepValidDay(y, month);
  };
  const handleYearDone = (y) => {
    handleYearChange(y);
    openNext('year');
  };
  const handleMonth = (m) => {
    setMonth(m);
    keepValidDay(year, m);
    openNext('month');
  };
  const handleDay = (y, m, d) => {
    setYear(y);
    setMonth(m);
    setDay(d);
    openNext('day');
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const missing = FIELDS.find((field) => values[field] == null);
    if (missing) {
      setError('Please choose your birth year, month, day and hour.');
      setOpenField(missing);
      return;
    }

    setError('');
    setTimeout(() => {
      // the API takes whole hours; flooring keeps the same 时辰 since those change on whole odd hours
      onSubmit({ year, month, day, hour: Math.floor(hour) });
      onClose();
    }, 300);
  };

  const fieldProps = (name) => ({
    name,
    isOpen: openField === name,
    isInvalid: hasSubmitted && values[name] == null,
    onToggle: () => toggle(name),
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bazi Input Modal"
      className="bazi-input__modal card"
      overlayClassName="bazi-input__overlay"
      closeTimeoutMS={300}
    >
      <h1>Enter Your Information</h1>
      <div className='bazi-input__popup'>
        <div className='bazi-input__fields'>
          <PickerField {...fieldProps('year')} label="Birth Year" display={year}>
            <YearWheel min={MIN_YEAR} max={currentYear} value={year} onChange={handleYearChange} onDone={handleYearDone} />
          </PickerField>

          <PickerField {...fieldProps('month')} label="Birth Month" display={month && MONTH_NAMES[month - 1]}>
            <MonthGrid value={month} onSelect={handleMonth} />
          </PickerField>

          <PickerField {...fieldProps('day')} label="Birth Day" display={day}>
            <DayCalendar year={year} month={month} day={day} minYear={MIN_YEAR} onSelect={handleDay} />
          </PickerField>

          <PickerField {...fieldProps('hour')} label="Birth Hour" display={hour != null ? formatHour(hour) : null}>
            <HourClock value={hour} onChange={setHour} />
          </PickerField>
        </div>
        {error && (
          <small className="error-message">
            {error}
          </small>
        )}
        <button onClick={handleSubmit}>Generate Bazi</button>
      </div>
    </Modal>
  );
};

export default BaziInputModal;
