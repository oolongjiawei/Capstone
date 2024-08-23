import './PersonalBaziPage.scss'; 
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import BaziChart from '../../components/BaziChart/BaziChart';
import axios from 'axios';

const PersonalBaziPage = () => {
  const { userId } = useParams();
  const [baziData, setBaziData] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User'); // Retrieve username, default to 'User' if not found
  useEffect(() => {
    console.log("Username:", username); // Log the username
    const fetchBaziData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/fortune/user/${userId}/bazi`);
        setBaziData(response.data);
        console.log("Bazi Data:", response.data); // Log the Bazi data
      } catch (error) {
        console.error('Error fetching Bazi data:', error.response ? error.response.data : error.message);
      }
    };

    if (userId) {
      fetchBaziData();
    }
  }, [userId, username]);
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log("Retrieved username from localStorage:", storedUsername);
    setUsername(storedUsername || 'User');
  }, []);
  
  return (
    <>
      <Header onLogoClick={() => {}} /> 
      <div className="cookies-page">
        <div className="cookies__all">
          {username && <h2>{username}, your Bazi chart is as follows:</h2>} 
          {baziData ? (
            <BaziChart baziData={baziData} /> 
          ) : (
            <p>Loading your Bazi data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalBaziPage;
