import './PersonalBaziPage.scss'; 
import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import BaziChart from '../../components/BaziChart/BaziChart';
import axios from 'axios';

const PersonalBaziPage = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const [baziData, setBaziData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | empty | error
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User'); // Retrieve username, default to 'User' if not found
  useEffect(() => {
    const fetchBaziData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/fortune/user/${userId}/bazi`);
        setBaziData(response.data);
        setStatus('ready');
      } catch (error) {
        // 404 means this user hasn't saved a chart yet
        setStatus(error.response?.status === 404 ? 'empty' : 'error');
      }
    };

    if (userId) {
      fetchBaziData();
    }
  }, [userId, username]);
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'User');
  }, []);
  
  return (
    <>
      <Header onLogoClick={() => {}} /> 
      <div className="cookies-page">
        <div className="cookies__all">
          {status === 'loading' && <p>Loading your Bazi data...</p>}
          {status === 'ready' && (
            <>
              {state?.justSaved && <p className="bazi-page__notice">Saved to your profile ✓</p>}
              <h2>{username}, your Bazi chart is as follows:</h2>
              <BaziChart baziData={baziData} />
            </>
          )}
          {status === 'empty' && (
            <div className="bazi-page__empty">
              <h2>{username}, you haven&apos;t saved a Bazi chart yet.</h2>
              <p>Tap the lucky cat, enter your birth date, then press &quot;Save Bazi&quot;.</p>
              <Link to={`/user/${userId}`} className="bazi-page__cta">Go to the lucky cat</Link>
            </div>
          )}
          {status === 'error' && <p className="error-message">Couldn&apos;t load your Bazi chart. Please refresh to try again.</p>}
        </div>
      </div>
    </>
  );
};

export default PersonalBaziPage;
