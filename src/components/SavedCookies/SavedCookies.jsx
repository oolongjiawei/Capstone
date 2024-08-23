import { useState, useEffect } from "react";
import axios from "axios";
import deleteIcon from "../../assets/icons/close.svg";
import simleFaceIcon from "../../assets/icons/smile-face.svg";
import "./SavedCookies.scss";


const SavedCookies = ({ userId }) => {
  const [savedCookies, setSavedCookies] = useState([]);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchSavedCookies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/fortune/user/${userId}/saved-cookies`
        );
        setSavedCookies(response.data);

        fetchSavedCookies();
      } catch (error) {
        console.error(
          "Error fetching saved fortune cookies:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to load saved fortune cookies.");
      }
    };

    fetchSavedCookies();
  }, [userId]);

  const handleDeleteCookie = async (cookieId) => {
    console.log('Deleting cookie with ID:', cookieId);
    try {
      await axios.delete(
        `http://localhost:8080/api/fortune/user/${userId}/cookies/${cookieId}`
      );
      setSavedCookies(
        savedCookies.filter((cookie) => cookie.cookie_id !== cookieId)
      );

      console.log("Fortune cookie deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting fortune cookie:",
        error.response ? error.response.data : error.message
      );
    }
  };


  return (
    <div className="saved-cookies">
      {error && <p className="saved-cookies__error">{error}</p>}
      <ul className="saved-cookies__list">
        {savedCookies.map((cookie) => (

            <li key={cookie.cookie_id} className="saved-cookie__item" >

              <div className="saved-cookie__row">
                    <img
                    src={simleFaceIcon}
                    alt="smile face icon"
                    className="saved-cookie__smile-face-icon"
                    />
                    <div className="saved-cookie__content">
                        <p className="saved-cookie__message">
                            {cookie.cookie_message}
                        </p>
                        <small className="saved-cookie__date">
                            {new Date(cookie.created_at).toLocaleDateString()}
                        </small>
                    </div>
                    <img
                    src={simleFaceIcon}
                    alt="smile face icon"
                    className="saved-cookie__smile-face-icon"
                    />
              </div>

              <div className="saved-cookie__tool">
                    <img
                        src={deleteIcon}
                        alt="Delete icon"
                        onClick={() => handleDeleteCookie(cookie.cookie_id)}
                        className="saved-cookie__delete-icon"
                    />
              </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedCookies;
