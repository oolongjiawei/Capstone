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
      // alert('Please enter valid values within the allowed range.');
      return;
    }
    setTimeout(() => {
      onSubmit({ year, month, day, hour });
      onClose();
    }, 300); 
  };

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
            <div className="bazi-input__field">
              <label>Birth Year:</label>
              <input
                className='bazi-input__detail'
                type="number"
                placeholder="1950 - current"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1950"
                max={currentYear}
              />
            </div>
            <div className="bazi-input__field">
              <label>Birth Month:</label>
              <input
                className='bazi-input__detail'
                type="number"
                placeholder="1 - 12"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                min="1"
                max="12"
              />
            </div>
            <div className="bazi-input__field">
              <label>Birth Day:</label>
              <input
                className='bazi-input__detail'
                type="number"
                placeholder="1 - 31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                min="1"
                max="31"
              />
            </div>
            <div className="bazi-input__field">
              <label>Birth Hour:</label>
              <input
                className='bazi-input__detail'
                type="number"
                placeholder="1 - 23"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                min="0"
                max="23"
              />
            </div>
          </div>
        <button onClick={handleSubmit}>Generate Bazi</button>
      </div>
    </Modal>
  );
};

export default BaziInputModal;
