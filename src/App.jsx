import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Header from './components/Header/Header.jsx';
// import Footer from './components/Footer/Footer.jsx';
// import HomePage from './components/HomePage/Homepage';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserPage from './pages/UserPage/UserPage.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import PersonalBaziPage from './pages/PersonalBaziPage/PersonalBaziPage.jsx';
import FortuneCookiesPage from './pages/FortuneCookiesPage/FortuneCookiesPage.jsx';
import "./App.scss";

function App() {


  return (
    <BrowserRouter>
    <div className="app">
    {/* <Header/>  */}
        <div className="app__wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/user/:userId/personal-bazi" element={<PersonalBaziPage />} />
          <Route path="/user/:userId/fortune-cookies" element={<FortuneCookiesPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        </div>
          {/* <Footer />   */}
    </div>
    </BrowserRouter>
  );
}


export default App;