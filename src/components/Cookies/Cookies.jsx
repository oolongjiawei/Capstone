import { useState } from 'react';
import './Cookies.scss';
import cookie from "../../assets/images/cookie.png";
import axios from 'axios';

const Cookies = ({ userId }) => {
  const [fortuneMessage, setFortuneMessage] = useState(''); // for saving of new generate fortune cookie

  //generate daily cookie
  const handleGenerateFortuneCookie = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/fortune/cookie', {
        userId: userId,
        save: false, //unsave
      });
      console.log('Generated Fortune Cookie:', response.data.fortune);
      setFortuneMessage(response.data.fortune);
    } catch (error) {
      console.error('Error generating Fortune Cookie:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="">
      <button className='' onClick={handleGenerateFortuneCookie}>Fortune Cookie</button>
      <img 
        src={cookie} 
        alt="cookie" 
        onClick={handleGenerateFortuneCookie} 
        className="cookie__image"
      />
      {fortuneMessage && <p>Your Fortune Cookie: {fortuneMessage}</p>}
    </div>
  );
};

export default Cookies;
