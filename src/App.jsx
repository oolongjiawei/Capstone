import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
// import HomePage from './components/HomePage/Homepage';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserPage from './pages/UserPage/UserPage.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import "./App.scss";


function App() {

  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
        {/* <Footer />   */}

    </BrowserRouter>
  );
}

export default App;