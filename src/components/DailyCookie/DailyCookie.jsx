import { useState, useEffect } from 'react';
import axios from 'axios';
import './DailyCookie.scss';
import cookieImage from '../../assets/images/cookie.png';

const DailyCookie = ({ userId }) => {
  const [fortuneMessage, setFortuneMessage] = useState('');
  const [fortuneId, setFortuneId] = useState(null); 
  const [isCookieGenerated, setIsCookieGenerated] = useState(false);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);

  useEffect(() => {
    const checkDailyCookie = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/fortune/user/${userId}/daily-cookie`);
        if (response.data.fortune) {
          setFortuneMessage(response.data.fortune);
          setFortuneId(response.data.id); 
          setIsCookieGenerated(true); 
          setIsSaveButtonVisible(false); 
        }
      } catch (error) {
        console.error('Error checking daily Fortune Cookie:', error.response ? error.response.data : error.message);
      }
    };

    checkDailyCookie();
  }, [userId]);

  const handleGenerateFortuneCookie = async () => {
    if (isCookieGenerated) return;

    try {
      const response = await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: userId,
        save: false, 
      });
      console.log('Generated Fortune Cookie:', response.data.fortune);
      setFortuneMessage(response.data.fortune);
      setFortuneId(response.data.id); // 保存生成的 cookie ID
      setIsCookieGenerated(true); 
      setIsSaveButtonVisible(true); 
    } catch (error) {
      console.error('Error generating Fortune Cookie:', error.response ? error.response.data : error.message);
    }
  };

  const handleSaveFortuneCookie = async () => {
    try {
      await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: userId,
        cookieId: fortuneId, 
        save: true,
      });
      console.log('Fortune Cookie saved successfully');
      setIsSaveButtonVisible(false); 
    } catch (error) {
      console.error('Error saving Fortune Cookie:', error.response ? error.response.data : error.message);
    }
  };

  const handleCancelFortuneCookie = () => {
    setIsSaveButtonVisible(false); 
  };

  return (
    <div className="daily-cookie__container">
      <img
        src={cookieImage}
        alt="Daily Cookie"
        onClick={handleGenerateFortuneCookie}
        className={`daily-cookie__image ${isCookieGenerated ? 'greyscale' : ''}`}
        disabled={isCookieGenerated}
      />
      {fortuneMessage && <p className='daily-cookie__label'><span>Your Daily Fortune:</span><br/> {fortuneMessage}</p>}
      {isSaveButtonVisible && (
        <div className="daily-cookie__buttons">
          <button onClick={handleSaveFortuneCookie} className="daily-cookie__button-save">
            Save
          </button>
          <button onClick={handleCancelFortuneCookie} className="daily-cookie__button-cancel">
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyCookie;
