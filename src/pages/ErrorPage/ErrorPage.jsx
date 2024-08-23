import "./ErrorPage.scss";
import catBackB from "../../assets/images/cat-black-b.png";
import { useNavigate, useParams } from 'react-router-dom';



const ErrorPage = () => {
    // const URL = import.meta.env.VITE_APP_BASE_URL;
    const URL = 'http://localhost:5173';

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleBack = () => {
        if (userId) {
            navigate(`/user/${userId}`);
        } else {
            navigate('/'); 
        }
    };


    return (
        <>
        <div className="error-page">
            <div className="error-page__wrapper">
              <img src={catBackB} alt="black cat back" />
            </div>
            <h1 className="error-page__text">Ouch! Error...</h1>
            <button className="back" onClick={handleBack}>Back to the Homepage</button>

        </div>
        </>
    );
};

export default ErrorPage;