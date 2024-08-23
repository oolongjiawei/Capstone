import './Footer.scss';
import { Link } from 'react-router-dom';

const URL = import.meta.env.VITE_APP_BASE_URL;

const Footer = ({ url }) => {
    return (
      <footer className='footer'>
        <Link to={url}>
          <span className='footer-text'>© Fortune House All Rights Reserved.</span>
        </Link>
      </footer>
    );
  };
  
  export default Footer;