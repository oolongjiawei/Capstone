import { useSyncExternalStore } from 'react';
import './SoundToggle.scss';
import { isSoundOn, playSuccess, setSoundOn, subscribeSound } from '../../sound/mysticSound';

// Sound on/off, shared by every toggle in the app. withLabel adds "Sound on/off" text
// (the mobile menu); the label hides from the mid breakpoint up, where it is an icon button.
const SoundToggle = ({ className = '', withLabel = false }) => {
  const soundOn = useSyncExternalStore(subscribeSound, isSoundOn);

  const toggle = () => {
    setSoundOn(!soundOn);
    if (!soundOn) playSuccess(); // confirms it's on
  };

  return (
    <button
      type="button"
      className={`sound-toggle ${withLabel ? 'sound-toggle--labelled' : ''} ${className}`}
      onClick={toggle}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Sound effects on' : 'Sound effects off'}
      title={soundOn ? 'Sound on' : 'Sound off'}
      data-sound="custom"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className="sound-toggle__speaker" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {soundOn ? (
          <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      {withLabel && <span className="sound-toggle__label">{soundOn ? 'Sound on' : 'Sound off'}</span>}
    </button>
  );
};

export default SoundToggle;
