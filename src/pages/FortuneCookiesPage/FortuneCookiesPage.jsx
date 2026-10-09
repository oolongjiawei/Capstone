import { useState, useEffect } from "react";
import axios from "axios";
import "./FortuneCookiesPage.scss";
import DefaultCookie from "../../components/DefaultCookie/DefaultCookie";
import SavedCookies from "../../components/SavedCookies/SavedCookies";
import Header from "../../components/Header/Header.jsx";

const FortuneCookiesPage = () => {
  const userId = localStorage.getItem("userId");
  const [savedCookies, setSavedCookies] = useState([]);
  const [error, setError] = useState("");

  const fetchSavedCookies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/fortune/user/${userId}/saved-cookies`
      );
      setSavedCookies(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching saved fortune cookies:", error.response ? error.response.data : error.message);
      setError("Failed to load saved fortune cookies.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSavedCookies();
    }
  }, [userId]);

  // Lives here (not in SavedCookies) so a cookie saved above shows up in the collection right away
  const handleSaveCookie = async (cookieId) => {
    await axios.post("http://localhost:8080/api/fortune/cookie", {
      userId: userId,
      cookieId: cookieId,
      save: true,
    });
    await fetchSavedCookies();
  };

  const handleDeleteCookie = async (cookieId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/fortune/user/${userId}/cookies/${cookieId}`
      );
      setSavedCookies((cookies) => cookies.filter((cookie) => cookie.cookie_id !== cookieId));
    } catch (error) {
      console.error("Error deleting fortune cookie:", error.response ? error.response.data : error.message);
      setError("Failed to delete that fortune. Please try again.");
    }
  };

  const savedIds = new Set(savedCookies.map((cookie) => cookie.cookie_id));

  return (
    <div className="fortune-page">
      <Header onLogoClick={() => {}} />
      {userId ? (
        <main className="fortune-page__content">
          <DefaultCookie savedIds={savedIds} onSave={handleSaveCookie} />
          <SavedCookies cookies={savedCookies} error={error} onDelete={handleDeleteCookie} />
        </main>
      ) : (
        <p className="fortune-page__signed-out">
          Please <a href="/login">log in</a> to open fortune cookies.
        </p>
      )}
    </div>
  );
};

export default FortuneCookiesPage;
