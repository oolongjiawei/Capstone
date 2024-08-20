import "./ErrorPage.scss";
import catBackB from "../../assets/images/cat-black-b.png";


const ErrorPage = () => {
    // const URL = import.meta.env.VITE_APP_BASE_URL;
    const URL = 'http://localhost:5173';


    return (
        <>
        <div className="error-page">
            <div className="error-page__wrapper">
              <img src={catBackB} alt="black cat back" />
            </div>
            <h1 className="error-page__text">Ouch! Error...</h1>
        </div>
        </>
    );
};

export default ErrorPage;