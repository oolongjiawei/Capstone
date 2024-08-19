import './BaziResultModal.scss';
import Modal from 'react-modal';
// import oldPaper from "../../assets/images/old-paper.png"

const BaziResultModal = ({ isOpen, onClose, baziData, onSave, onRegenerate }) => {
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
        <h1>Bazi Results</h1>
        <div className="bazi-result__popup--content">
          <div className="bazi-result__popup--bazi">
            <p><strong>Year:</strong> {baziData.bazi_year} ({baziData.symbol_year})</p>
            <p><strong>Month:</strong> {baziData.bazi_month} ({baziData.symbol_month})</p>
            <p><strong>Day:</strong> <span className='bazi-result__popup--day'>{baziData.bazi_day} ({baziData.symbol_day})</span></p>
            <p><strong>Time:</strong> {baziData.bazi_time} ({baziData.symbol_time})</p>
            <p><strong>Element:</strong> {baziData.element} ({baziData.element_color})</p>
          </div>
          <p className='bazi-result__popup--brief'><strong>Brief:</strong> {baziData.brief}</p>
        </div>
        <div className="bazi-result__buttons">
          <button onClick={onSave}>Save Bazi</button>
          <button onClick={onRegenerate}>Regenerate Bazi</button>
          <button onClick={onClose}>Close</button>
        </div>
    
      </div>
    </Modal>
  );
};

export default BaziResultModal;
