import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png'; 
import './LogoComponent.scss'; 


const LogoComponent = ({ onLogoClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(currentTheme === 'dark');
    document.body.className = `${currentTheme}-mode`;
  }, []);

  const handleLogoClick = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.body.className = `${newMode}-mode`;
    localStorage.setItem('theme', newMode);
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div className={`logo-default ${isDarkMode ? 'rotate' : ''}`} onClick={handleLogoClick}>
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default LogoComponent;
