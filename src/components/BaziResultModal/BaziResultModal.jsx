
import './BaziResultModal.scss';
import Modal from 'react-modal';

const BaziResultModal = ({ isOpen, onClose, baziData }) => {
  if (!isOpen || !baziData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bazi Result Modal"
      className="bazi-result__modal"
      overlayClassName="bazi-result__overlay"
    >
    <div className="bazi-result__popup card">
      <div className="bazi-result__popup__content">
        <h2>Bazi Results</h2>
        <p><strong>Year:</strong> {baziData.bazi_year} ({baziData.symbol_year})</p>
        <p><strong>Month:</strong> {baziData.bazi_month} ({baziData.symbol_month})</p>
        <p><strong>Day:</strong> {baziData.bazi_day} ({baziData.symbol_day})</p>
        <p><strong>Time:</strong> {baziData.bazi_time} ({baziData.symbol_time})</p>
        <p><strong>Element:</strong> {baziData.element} ({baziData.element_color})</p>
        <p><strong>Brief:</strong> {baziData.brief}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
     </Modal>
  );
};

export default BaziResultModal;
