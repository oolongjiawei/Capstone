import { useState } from 'react';
import Modal from 'react-modal';
import './BaziInputModal.scss';

Modal.setAppElement('#root');  // For accessibility considerations

const BaziInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');

  const handleSubmit = () => {
    onSubmit({ year, month, day, hour });
    onClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bazi Input Modal"
      className="bazi-input__modal"
      overlayClassName="bazi-input__overlay"
    >
      <div className='bazi-input__popup card' >
        <h2>Enter Bazi Information</h2>
        <div className="input-group】">
          <label>Birth Year:</label>
          <input type="number" placeholder="yyyy" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Birth Month:</label>
          <input type="number" placeholder="mm" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Birth Day:</label>
          <input type="number" placeholder="dd" value={day} onChange={(e) => setDay(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Birth Hour:</label>
          <input type="number" placeholder="" value={hour} onChange={(e) => setHour(e.target.value)} />
        </div>
        <button onClick={handleSubmit}>Generate Bazi</button>
      </div>
    </Modal>
  );
};

export default BaziInputModal;
