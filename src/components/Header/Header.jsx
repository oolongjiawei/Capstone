import "./Header.scss";
import LogoComponent from "../LogoComponent/LogoComponent";
import PropTypes from 'prop-types';
import { Link, useParams } from "react-router-dom";
import SoundToggle from "../SoundToggle/SoundToggle";
import { playBreath } from "../../sound/mysticSound";
import { useEffect, useRef, useState } from "react";

// matches $breakpoint-tablet-mid, where the hamburger hides and the nav becomes a row
const MENU_BREAKPOINT = 544;

const Header = ({ onLogoClick }) => {
  const { userId } = useParams(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firstLinkRef = useRef(null);

  // Mobile menu is a popup over a blurred page: lock page scroll, close on Escape, focus the first link
  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    // past the mid breakpoint the nav is a plain row again, so the popup state no longer applies
    const wideScreen = window.matchMedia(`(min-width: ${MENU_BREAKPOINT}px)`);
    const closeWhenWide = (e) => {
      if (e.matches) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    wideScreen.addEventListener("change", closeWhenWide);
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      wideScreen.removeEventListener("change", closeWhenWide);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

    return (

    <div className="header" >
      <div className="header__wrapper" >
        <div className="hearder__logo" >
          <LogoComponent onLogoClick={onLogoClick} />
        </div>

        <div className="brand">
          <span className="brand__name" >Fortune</span>
          <div className="brand__line">
            <span className="brand__name" >House</span>
            {/* mobile only: the nav collapses behind this button, right next to "House" */}
            <button
              type="button"
              className={`header__menu-button ${isMenuOpen ? 'is-open' : ''}`}
              onClick={() => {
                playBreath(!isMenuOpen);
                setIsMenuOpen(!isMenuOpen);
              }}
              data-sound="custom"
              aria-expanded={isMenuOpen}
              aria-controls="header-nav"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

      </div>
      {/* on mobile the open nav covers the page; tapping the blurred backdrop closes it */}
      <nav
        id="header-nav"
        className={`header__nav ${isMenuOpen ? 'is-open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setIsMenuOpen(false)}
      >
        <div className="header__menu-card">
          {/* in-app navigation (not full page loads), so sounds and state carry across pages */}
          <Link ref={firstLinkRef} to={`/user/${userId}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to={`/user/${userId}/personal-bazi`} className="nav-link" onClick={() => setIsMenuOpen(false)}>Bazi Profiles</Link>
          <Link to={`/user/${userId}/fortune-cookies`} className="nav-link" onClick={() => setIsMenuOpen(false)}>Fortune Cookies</Link>
          <SoundToggle className="header__sound" withLabel />
        </div>
      </nav>
    </div>

    );
  };
  Header.propTypes = {
    onLogoClick: PropTypes.func.isRequired,  
  };
  
  export default Header;