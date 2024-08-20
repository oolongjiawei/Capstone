import './UserPage.scss';
import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import BaziInputModal from '../../components/BaziInputModal/BaziInputModal';
import BaziResultModal from '../../components/BaziResultModal/BaziResultModal';
import Cookies from '../../components/Cookies/Cookies'; 
import SavedCookies from '../../components/SavedCookies/SavedCookies';
import axios from 'axios';
import catBlack from "../../assets/images/cat-black.png";
// import catWhite from "../../assets/images/cat-white.png";
import catPat from "../../assets/images/cat-pat.png";
import cookieNote from "../../assets/images/cookie-note.png";


const UserPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baziData, setBaziData] = useState(null); 
  const [isBaziPopupOpen, setIsBaziPopupOpen] = useState(false); 
  const [isSavedCookiesVisible, setIsSavedCookiesVisible] = useState(false);

  const toggleSavedCookies = () => {
    setIsSavedCookiesVisible(!isSavedCookiesVisible);
  };
  
  
// open input popup
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
// close input popup
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
// deal with bazi input
  const handleBaziSubmit = async (baziData) => {
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
        console.error('User ID is missing.');
        return;
    }
    try {
      console.log('Sending Bazi data:', baziData); 
      const response = await axios.post('http://localhost:8080/api/fortune/bazi', {
        birthYear: baziData.year,
        birthMonth: baziData.month,
        birthDay: baziData.day,
        birthTime: baziData.hour,
        save: false, 
        userId: userId,
      });
      console.log('Generated Bazi data:', response.data);
      setBaziData(response.data.bazi);
      setIsBaziPopupOpen(true);
    } catch (error) {
      console.error('Error generating Bazi:', error.response ? error.response.data : error.message);
      alert('There was an error generating the Bazi data. Please try again.')
    }
  };

  //close bazi result popup
  const handleBaziPopupClose = () => {
    setIsBaziPopupOpen(false);
    setBaziData(null); 
  };
//save or replace already exist bazi result
  const handleSaveBazi = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing.');
        return;
  }


  
    try {
      const response = await axios.post('http://localhost:8080/api/fortune/bazi', {
        birthYear: baziData.birth_year,  
        birthMonth: baziData.birth_month,
        birthDay: baziData.birth_day,
        birthTime: baziData.birth_time,
        save: true, 
        userId: userId,
      });
      console.log('Bazi data saved successfully:', response.data);
      setIsBaziPopupOpen(false); 
    } catch (error) {
      console.error('Error saving Bazi:', error.response ? error.response.data : error.message);
    }
  };

  const handleRegenerateBazi = () => {
    setIsModalOpen(true); 
    setIsBaziPopupOpen(false); 
  };

  const userId = localStorage.getItem('userId'); 

  return (
    <div className="user-page">
        <div className="user-page__wrapper">
          
            <div className="cat__all" onClick={handleOpenModal}>
              <img className='cat__own' src={catBlack} alt="fortune black cat" />
              <div className="cat__seat">
                <img src={catPat} alt="cat seat pat" />
              </div>
            </div>

            <div className="cookies__all">
              <div className="cookie__generator">
                <Cookies userId={userId}/>
              </div>
              <div className="cookies__collector">

              <span className='cookies__collector--title'>Cookies Collection</span>
                <img 
                  className='cookies__img' 
                  src={cookieNote}
                  alt="cookies collector btn" 
                  onClick={toggleSavedCookies} 
                />
              </div>
              
              {isSavedCookiesVisible && <SavedCookies userId={userId} />} 
            </div>
        </div>
        <BaziInputModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleBaziSubmit}
        />
        <BaziResultModal 
            isOpen={isBaziPopupOpen}
            onClose={handleBaziPopupClose}
            baziData={baziData}
            onSave={handleSaveBazi}
            onRegenerate={handleRegenerateBazi}
        />
    </div>
  );
};

export default UserPage;
