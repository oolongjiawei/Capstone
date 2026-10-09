import deleteIcon from "../../assets/icons/close.svg";
import smileFaceIcon from "../../assets/icons/smile-face.svg";
import cookieNote from "../../assets/images/cookie-note.png";
import "./SavedCookies.scss";

const SavedCookies = ({ cookies, error, onDelete }) => {
  return (
    <section className="saved-cookies" aria-labelledby="saved-cookies-title">
      <h2 id="saved-cookies-title" className="saved-cookies__title">
        <img src={cookieNote} alt="" className="saved-cookies__icon" />
        Cookies Collection
        <span className="saved-cookies__count">{cookies.length}</span>
      </h2>

      {error && <p className="saved-cookies__error">{error}</p>}

      {cookies.length === 0 && !error ? (
        <p className="saved-cookies__empty">
          No saved fortunes yet. Crack a cookie and press &quot;Save to collection&quot;.
        </p>
      ) : (
        <ul className="saved-cookies__list">
          {cookies.map((cookie) => (
            <li key={cookie.cookie_id} className="saved-cookie__item">
              <div className="saved-cookie__row">
                <img src={smileFaceIcon} alt="" className="saved-cookie__smile-face-icon" />
                <p className="saved-cookie__message">{cookie.cookie_message}</p>
                <img src={smileFaceIcon} alt="" className="saved-cookie__smile-face-icon" />
                <small className="saved-cookie__date">
                  {new Date(cookie.created_at).toLocaleDateString()}
                </small>
              </div>
              <button
                type="button"
                className="saved-cookie__delete"
                onClick={() => onDelete(cookie.cookie_id)}
                aria-label={`Delete fortune: ${cookie.cookie_message}`}
              >
                <img src={deleteIcon} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SavedCookies;
