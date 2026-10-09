import "./Header.scss";
import LogoComponent from "../LogoComponent/LogoComponent";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import { useState } from "react";

const Header = ({ onLogoClick }) => {
  const { userId } = useParams(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
      <nav id="header-nav" className={`header__nav ${isMenuOpen ? 'is-open' : ''}`} >
          <a href={`/user/${userId}`} className="nav-link">Home</a>
          <a href={`/user/${userId}/personal-bazi`} className="nav-link">Personal Bazi Chart</a>
          <a href={`/user/${userId}/fortune-cookies`} className="nav-link">Fortune Cookies</a>
        </nav>
    </div>

    );
  };
  Header.propTypes = {
    onLogoClick: PropTypes.func.isRequired,  
  };
  
  export default Header;