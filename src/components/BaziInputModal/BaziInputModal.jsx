import { useState } from 'react';
import Modal from 'react-modal';
import './BaziInputModal.scss';

Modal.setAppElement('#root');  // For accessibility considerations

const BaziInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');

  const currentYear = new Date().getFullYear(); 

  const handleSubmit = () => {
    if (
      year < 1950 || year > currentYear ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23
    ) {
      alert('Please enter valid values within the allowed range.');
      return;
    }
    onSubmit({ year, month, day, hour });
    onClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bazi Input Modal"
      className="bazi-input__modal card"
      overlayClassName="bazi-input__overlay"
    >
      <h1>Enter Bazi Information</h1>
      <div className='bazi-input__popup'>
        <div className="input-group">
          <label>Birth Year:</label>
          <input
            type="number"
            placeholder=""
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max={currentYear}
          />
        </div>
        <div className="input-group">
          <label>Birth Month:</label>
          <input
            type="number"
            placeholder=""
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
        </div>
        <div className="input-group">
          <label>Birth Day:</label>
          <input
            type="number"
            placeholder=""
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min="1"
            max="31"
          />
        </div>
        <div className="input-group">
          <label>Birth Hour:</label>
          <input
            type="number"
            placeholder=""
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            min="0"
            max="23"
          />
        </div>
        <button onClick={handleSubmit}>Generate Bazi</button>
      </div>
    </Modal>
  );
};

export default BaziInputModal;
