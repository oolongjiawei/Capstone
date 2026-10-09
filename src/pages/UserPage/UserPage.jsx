import './UserPage.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import catBlack from "../../assets/images/cat-black.png";
import catWhite from "../../assets/images/cat-white.png";
import catPat from "../../assets/images/cat-pat.png";
import Header from '../../components/Header/Header.jsx';
import BaziFlow from '../../components/BaziFlow/BaziFlow.jsx';
import { playCatBell } from '../../sound/mysticSound';


const UserPage = () => {
  const navigate = useNavigate();
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  // Black cat in light mode, white cat in dark mode; LogoComponent owns the theme toggle
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const toggleCatImage = () => {
    setIsDarkMode(prev => !prev);
  };

  // save the result as a new Bazi profile
  const handleSaveBazi = async (baziData) => {
    const userId = localStorage.getItem('userId');
    const response = await axios.post('http://localhost:8080/api/fortune/bazi', {
      name: baziData.name,
      birthYear: baziData.birth_year,
      birthMonth: baziData.birth_month,
      birthDay: baziData.birth_day,
      birthTime: baziData.birth_time,
      save: true,
      userId: userId,
    });
    setIsFlowOpen(false);
    navigate(`/user/${userId}/personal-bazi`, { state: { savedProfileId: response.data.bazi.id } });
  };

  return (
    <div className='user-page__master'>
    <Header onLogoClick={toggleCatImage} />
    <div className="user-page">
     
        <div className="user-page__wrapper">

              <div className="cat">
                <div
                  className="cat__all"
                  onClick={() => {
                    playCatBell();
                    setIsFlowOpen(true);
                  }}
                >

                    <img className='cat__own' src={isDarkMode ? catWhite : catBlack} alt="fortune cat" />

                    <div className="cat__seat">
                      <img src={catPat} alt="cat seat pat" />
                    </div>
                </div>
              </div>  

          
        </div>
        <BaziFlow isOpen={isFlowOpen} onClose={() => setIsFlowOpen(false)} onSave={handleSaveBazi} />
    </div>
    </div>
  );
};

export default UserPage;
