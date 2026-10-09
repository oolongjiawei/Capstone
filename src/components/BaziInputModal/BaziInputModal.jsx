import { useRef, useState } from 'react';
import Modal from 'react-modal';
import './BaziInputModal.scss';
import YearWheel from './YearWheel';
import MonthGrid from './MonthGrid';
import DayCalendar from './DayCalendar';
import HourClock from './HourClock';
import { MONTH_NAMES, daysInMonth, formatHour } from './pickerUtils';
import SoundToggle from '../SoundToggle/SoundToggle';
import { playBreath, playError, playSlide } from '../../sound/mysticSound';

Modal.setAppElement('#root');  // For accessibility considerations

const MIN_YEAR = 1950;
const MAX_NAME_LENGTH = 30;
const FIELDS = ['year', 'month', 'day', 'hour'];

// One row of the form: tap it to expand its picker underneath
const PickerField = ({ name, label, display, isOpen, isInvalid, onToggle, children }) => (
  <div className={`bazi-input__field ${isOpen ? 'is-open' : ''} ${isInvalid ? 'invalid' : ''}`}>
    <button
      type="button"
      className="bazi-input__toggle"
      aria-expanded={isOpen}
      aria-controls={`bazi-${name}-panel`}
      onClick={() => {
        playSlide(!isOpen);
        onToggle();
      }}
      data-sound="custom"
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

// initialValues: an existing profile when editing it
const BaziInputModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = null,
  title = 'Enter Your Information',
  submitLabel = 'Generate Bazi',
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const nameRef = useRef(null);
  const [year, setYear] = useState(initialValues?.birth_year ?? null);
  const [month, setMonth] = useState(initialValues?.birth_month ?? null);
  const [day, setDay] = useState(initialValues?.birth_day ?? null);
  const [hour, setHour] = useState(initialValues?.birth_time ?? null);
  const [openField, setOpenField] = useState(initialValues ? null : 'year');
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

  // the warning follows the form: it shows after a failed submit and goes once all is filled in
  const isComplete = Boolean(name.trim()) && FIELDS.every((field) => values[field] != null);

  const handleSubmit = () => {
    setHasSubmitted(true);
    const missing = FIELDS.find((field) => values[field] == null);
    if (!isComplete) {
      playError();
      if (!name.trim()) {
        nameRef.current.focus();
      } else {
        setOpenField(missing);
      }
      return;
    }

    // coming back here to edit (Regenerate) starts from a tidy form with every picker closed
    setHasSubmitted(false);
    setOpenField(null);
    // the API takes whole hours; flooring keeps the same 时辰 since those change on whole odd hours
    onSubmit({ name: name.trim(), year, month, day, hour: Math.floor(hour) });
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
      <SoundToggle className="bazi-input__sound" />
      <button
        type="button"
        className="bazi-input__close"
        onClick={() => {
          playBreath(false);
          onClose();
        }}
        aria-label="Close"
        data-sound="custom"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <h1>{title}</h1>
      <div className='bazi-input__popup'>
        <div className='bazi-input__fields'>
          <label className={`bazi-input__name ${hasSubmitted && !name.trim() ? 'invalid' : ''}`}>
            <span className="bazi-input__label">Name</span>
            <input
              ref={nameRef}
              type="text"
              className="bazi-input__name-input"
              placeholder="Whose chart is this?"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </label>
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
        {hasSubmitted && !isComplete && (
          <small className="error-message">
            Please enter a name and choose the birth year, month, day and hour.
          </small>
        )}
        <button onClick={handleSubmit} data-sound="custom">{submitLabel}</button>
      </div>
    </Modal>
  );
};

export default BaziInputModal;
