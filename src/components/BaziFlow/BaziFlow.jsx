import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import BaziInputModal from '../BaziInputModal/BaziInputModal';
import BaziResultModal from '../BaziResultModal/BaziResultModal';
import NameReveal from '../NameReveal/NameReveal';
import { playCrossfade, playError, playSuccess, unlockSound } from '../../sound/mysticSound';

// How long the name and the result take to swap through the noise
const CROSSFADE_MS = 1200;

// The whole "make a chart" flow: input dialog -> name animation (while the chart is
// calculated) -> the name dissolves straight into the result -> save. Used to add a profile
// and to edit one.
const BaziFlow = ({ isOpen, onClose, onSave, initialValues = null, inputTitle, generateLabel, saveLabel }) => {
  const [step, setStep] = useState('input'); // input | reveal | result
  const [result, setResult] = useState(null);
  // the name animation outlives the "reveal" step: it is still dissolving while the result comes in
  const [reveal, setReveal] = useState(null); // { name, leaving }
  // one clock for the name dissolving out and the result dissolving in
  const [crossfadeStart, setCrossfadeStart] = useState(null);
  const revealShown = useRef(null);

  useEffect(() => {
    if (isOpen) setStep('input');
  }, [isOpen]);

  const handleGenerate = async (values) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }
    // this runs inside the Generate click, the user gesture browsers require before sound
    unlockSound();
    setReveal({ name: values.name, leaving: false });
    setStep('reveal');
    const revealShownPromise = new Promise((resolve) => {
      revealShown.current = resolve;
    });
    try {
      const [response] = await Promise.all([
        axios.post('http://localhost:8080/api/fortune/bazi', {
          name: values.name,
          birthYear: values.year,
          birthMonth: values.month,
          birthDay: values.day,
          birthTime: values.hour,
          save: false,
          userId: userId,
        }),
        revealShownPromise,
      ]);
      // open the result under the name, then let the name dissolve away into it
      setCrossfadeStart(performance.now());
      playCrossfade(CROSSFADE_MS / 1000);
      setResult(response.data.bazi);
      setStep('result');
      setReveal((current) => current && { ...current, leaving: true });
    } catch (error) {
      console.error('Error generating Bazi:', error.response ? error.response.data : error.message);
      alert('There was an error generating the Bazi data. Please try again.');
      setReveal(null);
      setStep('input');
    }
  };

  const handleSave = async () => {
    try {
      await onSave(result);
      playSuccess();
    } catch (error) {
      playError();
      console.error('Error saving Bazi:', error.response ? error.response.data : error.message);
      alert('There was an error saving this Bazi profile. Please try again.');
    }
  };

  return (
    <>
      <BaziInputModal
        isOpen={isOpen && step === 'input'}
        onClose={onClose}
        onSubmit={handleGenerate}
        initialValues={initialValues}
        title={inputTitle}
        submitLabel={generateLabel}
      />
      {isOpen && reveal && (
        <NameReveal
          name={reveal.name}
          leaving={reveal.leaving}
          leaveStart={crossfadeStart}
          leaveDuration={CROSSFADE_MS}
          onShown={() => revealShown.current?.()}
          onLeft={() => setReveal(null)}
        />
      )}
      <BaziResultModal
        isOpen={isOpen && step === 'result'}
        onClose={onClose}
        baziData={result}
        onSave={handleSave}
        onRegenerate={() => setStep('input')}
        saveLabel={saveLabel}
        enterStart={crossfadeStart}
        enterDuration={CROSSFADE_MS}
      />
    </>
  );
};

export default BaziFlow;
