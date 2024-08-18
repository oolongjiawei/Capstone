import './UserPage.scss';
import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import BaziInputModal from '../../components/BaziInputModal/BaziInputModal';
import BaziResultModal from '../../components/BaziResultModal/BaziResultModal';
import axios from 'axios';
import catBlack from "../../assets/images/cat-black.png";
// import catWhite from "../../assets/images/cat-white.png";
import catPat from "../../assets/images/cat-pat.png";
// import cookie from "../../assets/images/cookie.png";


const UserPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baziData, setBaziData] = useState(null); 
  const [isBaziPopupOpen, setIsBaziPopupOpen] = useState(false); 


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
    }
  };
  
  const handleBaziPopupClose = () => {
    setIsBaziPopupOpen(false);
    setBaziData(null); 
  };

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

  return (
    <div className="user-page">
        <div className="user-page__wrapper">
            <div className="cat__all" onClick={handleOpenModal}>
                <div className="cat__seat">
                    <img src={catPat} alt="cat seat pat" />
                </div>
                <img className='cat__own' src={catBlack} alt="fortune black cat" />
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
