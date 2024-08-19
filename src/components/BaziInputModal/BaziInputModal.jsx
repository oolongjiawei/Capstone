import { useState } from 'react';
import Modal from 'react-modal';
import './BaziInputModal.scss';

Modal.setAppElement('#root');  // For accessibility considerations

const BaziInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [touchedYear, setTouchedYear] = useState(false);
  const [touchedMonth, setTouchedMonth] = useState(false);
  const [touchedDay, setTouchedDay] = useState(false);
  const [touchedHour, setTouchedHour] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleYearScroll = () => {
    if (year === '') { 
      setYear(1980); 
    }
  };
  const handleMonthScroll = () => {
    if (month === '') { 
      setMonth(6); 
    }
  };
  const handleDayScroll = () => {
    if (day === '') { 
      setDay(15); 
    }
  };
  const handleHourScroll = () => {
    if (hour === '') { 
      setHour(12); 
    }
  };

  const validateInput = (value, min, max) => {
    return value >= min && value <= max;
  };

  const handleSubmit = () => {
    setHasSubmitted(true); // Set flag to indicate submission attempt

    if (
      !validateInput(year, 1950, currentYear) ||
      !validateInput(month, 1, 12) ||
      !validateInput(day, 1, 31) ||
      !validateInput(hour, 0, 23)
    ) {
      setError('Please enter valid values within the allowed range.');
      return;
    }

    setError('');
    setTimeout(() => {
      onSubmit({ year, month, day, hour });
      onClose();
    }, 300);
  };

  const isRequired = hasSubmitted; // Only set required after form submission attempt

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
          <div className={`bazi-input__field ${hasSubmitted && !validateInput(year, 1950, currentYear) ? 'invalid' : ''}`}>
            <label className="bazi-input__label">Birth Year:</label>
            <input
              className='bazi-input__detail'
              type="number" //scroller
              placeholder="Enter Year (1950 - Present)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onWheel={handleYearScroll} 
              onBlur={() => setTouchedYear(true)}
              min="1950"
              max={currentYear}
              required={isRequired}
            />
          </div>
          <div className={`bazi-input__field ${hasSubmitted && !validateInput(month, 1, 12) ? 'invalid' : ''}`}>
            <label className="bazi-input__label">Birth Month:</label>
            <input
              className='bazi-input__detail'
              type="number"
              placeholder="Enter Month (1 - 12)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              onWheel={handleMonthScroll} 
              onBlur={() => setTouchedMonth(true)}
              min="1"
              max="12"
              required={isRequired}
            />
          </div>
          <div className={`bazi-input__field ${hasSubmitted && !validateInput(day, 1, 31) ? 'invalid' : ''}`}>
            <label className="bazi-input__label">Birth Day:</label>
            <input
              className='bazi-input__detail'
              type="number"
              placeholder="Enter Day (1 - 31)"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              onWheel={handleDayScroll} 
              onBlur={() => setTouchedDay(true)}
              min="1"
              max="31"
              required={isRequired}
            />
          </div>
          <div className={`bazi-input__field ${hasSubmitted && !validateInput(hour, 0, 23) ? 'invalid' : ''}`}>
            <label className="bazi-input__label">Birth Hour:</label>
            <input
              className='bazi-input__detail'
              type="number"
              placeholder="Enter Hour (0 - 23)"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              onWheel={handleHourScroll} 
              onBlur={() => setTouchedHour(true)}
              min="0"
              max="23"
              required={isRequired}
            />
          </div>
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
