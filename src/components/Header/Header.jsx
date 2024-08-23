import "./Header.scss";
import LogoComponent from "../LogoComponent/LogoComponent";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

const Header = ({ onLogoClick }) => {
  const { userId } = useParams(); 
  console.log("Header User ID:", userId);
  console.log("onLogoClick prop:", onLogoClick);  

    return (

    <div className="header" >
      <div className="header__wrapper" >
        <div className="hearder__logo" >
          <LogoComponent onLogoClick={onLogoClick} />
        </div>

        <div className="brand">
          <span className="brand__name" >Fortune</span>
          <span className="brand__name" >House</span>
        </div>

      </div>
      <nav className="header__nav" >
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