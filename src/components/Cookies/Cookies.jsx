import { useState, useEffect } from 'react';
// import DailyCookie from '../DailyCookie/DailyCookie';
import DefaultCookie from '../DefaultCookie/DefaultCookie';
import './Cookies.scss';

const Cookies = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID is missing.');
    }
  }, []);

  if (!userId) {
    return <div>Error: User ID is missing</div>;
  }

  return (

    
    <div className="cookies-container">
      
      {/* <DailyCookie userId={userId} /> */}
      <DefaultCookie userId={userId} />

    </div>

    

  );
};

export default Cookies;
