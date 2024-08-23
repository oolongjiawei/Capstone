import { useState } from "react";
import "./FortuneCookiesPage.scss";
import Cookies from "../../components/Cookies/Cookies";
import SavedCookies from "../../components/SavedCookies/SavedCookies";
import cookieNote from "../../assets/images/cookie-note.png";
import Header from "../../components/Header/Header.jsx";

const FortuneCookiesPage = () => {
  const [isSavedCookiesVisible, setIsSavedCookiesVisible] = useState(false);
  const userId = localStorage.getItem("userId");

  const toggleSavedCookies = () => {
    setIsSavedCookiesVisible(!isSavedCookiesVisible);
    // Scroll down
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 500);
  };

  return (
    <div className="cookies-master">
      <Header onLogoClick={() => {}} />
      <div className="cookies-page">
        <div className="cookies__wrapper">
          
          <div className="cookie__generator">
            <Cookies userId={userId} />
          </div>

          <div className="cookies__collector">

          <div className="cookies__collector--wrapper">
            
            <div className="cookies__collector--image">
              <img
                className="cookies__collector--img"
                src={cookieNote}
                alt="cookies collector btn"
                onClick={toggleSavedCookies}
              />
            </div>

            
              <span className="cookies__collector--title" alt="cookies collector btn"
                onClick={toggleSavedCookies}>
                Cookies Collection
              </span>
          </div>

            {isSavedCookiesVisible && <SavedCookies userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FortuneCookiesPage;
