import { useState } from 'react';
import axios from 'axios';
import './DefaultCookie.scss';
import cookieImage from '../../assets/images/cookie.png';
import cookieOpenImage from '../../assets/images/cookie-open.png';
import { playCollect, playCookieCrack, playError } from '../../sound/mysticSound';

const DefaultCookie = ({ savedIds, onSave }) => {
  const [fortune, setFortune] = useState(null); // { id, message }
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState('');

  const handleCrackCookie = async () => {
    playCookieCrack();
    setError('');
    setJustSaved(false);
    try {
      const response = await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: localStorage.getItem('userId'),
        save: false,
      });
      setFortune({ id: response.data.id, message: response.data.fortune });
    } catch (error) {
      console.error('Error generating Fortune Cookie:', error.response ? error.response.data : error.message);
      setError('The cookie wouldn’t crack. Please try again.');
    }
  };

  const handleSaveFortuneCookie = async () => {
    setIsSaving(true);
    setError('');
    try {
      await onSave(fortune.id);
      playCollect();
      // back to a whole cookie, ready to crack the next one
      setFortune(null);
      setJustSaved(true);
    } catch (error) {
      playError();
      console.error('Error saving Fortune Cookie:', error.response ? error.response.data : error.message);
      setError('Couldn’t save this fortune. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCrackAnother = () => {
    setFortune(null);
    setError('');
  };

  const isSaved = fortune && savedIds.has(fortune.id);

  return (
    <section className="default-cookie" aria-labelledby="default-cookie-title">
      <h2 id="default-cookie-title" className="default-cookie__title">
        {fortune
          ? 'Your fortune'
          : justSaved
            ? 'Saved ✓ Tap the cookie to crack another'
            : 'Tap the cookie to crack it open'}
      </h2>

      <button
        type="button"
        className={`default-cookie__wrap ${fortune ? 'is-open' : ''}`}
        onClick={handleCrackCookie}
        data-sound="custom"
        disabled={Boolean(fortune)}
        aria-label="Crack open a fortune cookie"
      >
        <img
          src={fortune ? cookieOpenImage : cookieImage}
          alt=""
          className="default-cookie__image"
        />
      </button>

      {fortune && (
        <>
          <p key={fortune.id} className="default-cookie__slip" aria-live="polite">
            {fortune.message}
          </p>
          <div className="default-cookie__buttons">
            <button
              type="button"
              className="default-cookie__button-save"
              onClick={handleSaveFortuneCookie}
              data-sound="custom"
              disabled={isSaved || isSaving}
            >
              {isSaved ? 'Already collected' : isSaving ? 'Saving…' : 'Save to collection'}
            </button>
            <button type="button" className="default-cookie__button-again" onClick={handleCrackAnother}>
              Crack another
            </button>
          </div>
        </>
      )}

      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default DefaultCookie;
