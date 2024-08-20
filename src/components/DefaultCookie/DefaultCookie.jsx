import { useState } from 'react';
import axios from 'axios';
import './DefaultCookie.scss';
import cookieImage from '../../assets/images/cookie.png';

const DefaultCookie = ({ userId }) => {
  const [fortuneMessage, setFortuneMessage] = useState('');
  const [generatedCookieId, setGeneratedCookieId] = useState(null); // 保存生成的cookieId
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);

  const handleGenerateFortuneCookie = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: userId,
        save: false, 
      });
      console.log('Generated Fortune Cookie:', response.data.fortune);
      setFortuneMessage(response.data.fortune);
      setGeneratedCookieId(response.data.id); // 保存生成的cookieId
      setIsSaveButtonVisible(true); 
    } catch (error) {
      console.error('Error generating Fortune Cookie:', error.response ? error.response.data : error.message);
    }
  };

  const handleSaveFortuneCookie = async () => {
    try {
      await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: userId,
        cookieId: generatedCookieId, // 使用生成时返回的cookieId
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
    <div className="default-cookie-container">
      <img
        src={cookieImage}
        alt="Fortune Cookie"
        onClick={handleGenerateFortuneCookie}
        className="cookie-image"
      />
      {fortuneMessage && <p>Your Fortune: {fortuneMessage}</p>}
      {isSaveButtonVisible && (
        <div className="button-group">
          <button onClick={handleSaveFortuneCookie} className="save-button">
            Save
          </button>
          <button onClick={handleCancelFortuneCookie} className="cancel-button">
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default DefaultCookie;
