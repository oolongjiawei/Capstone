import './BaziResultModal.scss';
import { useState } from 'react';
import Modal from 'react-modal';
import BaziChart from '../BaziChart/BaziChart';
import TurbulentDissolve from '../TurbulentDissolve/TurbulentDissolve';
import { playBreath } from '../../sound/mysticSound';

// The whole result arrives through the noise while the name dissolves out, pixel for pixel
// (same full-screen box, same noise, same clock), then the results seep into the chart.
// Mounted with the dialog content, so every opening starts from an empty chart again.
const ResultCard = ({ baziData, enterStart, enterDuration, onSave, onRegenerate, onClose, saveLabel }) => {
  const [isSeeping, setIsSeeping] = useState(false);
  return (
    <TurbulentDissolve
      className="bazi-result__layer"
      startAt={enterStart}
      duration={enterDuration}
      onEnd={() => setIsSeeping(true)}
      // the layer covers the overlay, so tapping beside the card closes it here instead
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bazi-result__popup card">
      <h1>{baziData.name ? `${baziData.name}'s Bazi` : 'Bazi Results'}</h1>
      <BaziChart baziData={baziData} seepText={isSeeping ? 'play' : 'hold'} />
      <p className="bazi-result__element">
        Element: <strong>{baziData.element}</strong> ({baziData.element_color})
      </p>
      <div className="bazi-result__buttons">
        {/* saving plays its own chime once it has worked (BaziFlow) */}
        <button onClick={onSave} data-sound="custom">{saveLabel}</button>
        <button onClick={onRegenerate}>Edit &amp; Regenerate</button>
        <button
          onClick={() => {
            playBreath(false);
            onClose();
          }}
          data-sound="custom"
        >
          Close
        </button>
      </div>
      </div>
    </TurbulentDissolve>
  );
};

const BaziResultModal = ({
  isOpen,
  onClose,
  baziData,
  onSave,
  onRegenerate,
  saveLabel = 'Save Profile',
  enterStart,
  enterDuration = 1200,
}) => {
  if (!isOpen || !baziData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bazi Result Modal"
      className="bazi-result__modal"
      overlayClassName="bazi-result__overlay"
    >
      <ResultCard
        baziData={baziData}
        enterStart={enterStart}
        enterDuration={enterDuration}
        onSave={onSave}
        onRegenerate={onRegenerate}
        onClose={onClose}
        saveLabel={saveLabel}
      />
    </Modal>
  );
};

export default BaziResultModal;
