import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from './components/Header/Header.jsx';
// import Footer from './components/Footer/Footer.jsx';/
import HomePage from './pages/HomePage/HomePage';
// import Page from './pages';



function App() {

  return (
    <BrowserRouter>
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<Page />} /> */}
      </Routes>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;