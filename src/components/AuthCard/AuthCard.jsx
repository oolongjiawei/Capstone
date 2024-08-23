import { useState, useEffect } from "react";
import axios from "axios";
import "./AuthCard.scss";
import { useNavigate } from "react-router-dom";
import LogoComponent from '../LogoComponent/LogoComponent'; 

const AuthCard = ({ type }) => {
  const navigate = useNavigate();


  const isRegister = type === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isRequired, setIsRequired] = useState(false); 
  const [apodImageUrl, setApodImageUrl] = useState(""); 

  useEffect(() => {
    if (type !== "login" && type !== "register") {
      console.error("Invalid type prop. Expected 'login' or 'register'.");
      return;
    }
  
    // Fetch APOD image
    const fetchApodImage = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
        );
        setApodImageUrl(response.data.hdurl); // 存储图像 URL
      } catch (err) {
        console.error("Error fetching APOD image:", err);
      }
    };
  
    fetchApodImage();
  }, [type]); 

  const validateForm = () => {
    if (!email || !password || (isRegister && !username)) {
      setError("Please fill out all required fields.");
      return false;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setIsRequired(true);  

    if (!validateForm()) {
      return;
    }

    try {
      const url = isRegister ? "http://localhost:8080/api/auth/register" : "http://localhost:8080/api/auth/login";
      const response = await axios.post(url, { email, password, username: isRegister ? username : undefined });
      console.log(`${isRegister ? "Registration" : "Login"} successful`, response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);

      console.log('Login successful, username:', response.data.username);
      setTimeout(() => {
        if (response.data.userId) {
          navigate(`/user/${response.data.userId}`);
        } else {
          console.error("User ID is missing in the response");
        }
      }, 500);

      if (response.data.userId) {
        navigate(`/user/${response.data.userId}`);
      } else {
        console.error("User ID is missing in the response");
      }
    } catch (err) {
      setError("An error occurred !!");
    }
  };

  return (
    // <div className="auth__container">
    <div 
      className="auth__container"
      style={{ backgroundImage: `url(${apodImageUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} // 设置背景图像
    >
      <div className="auth__card card">
        <div className="auth__header">
          <div className="auth__header--logo">
            <LogoComponent />
          </div>
          <h1 className="auth__title">{isRegister ? "Sign Up" : "Log In"}</h1>
          <span>{isRegister ? "Create an account!" : "Welcome back!"}</span>
        </div>  
        {error && <p className="error-message">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className={`input__container username ${hasSubmitted && !username ? 'invalid' : ''}`}>
              <i className="fas fa-user"></i>
              <input
                type="text"
                className="auth__username  auth__input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isRequired}
              />
            </div>
          )}
          <div className={`input__container email ${hasSubmitted && !email ? 'invalid' : ''}`}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              className="auth__email auth__input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={isRequired}
            />
          </div>
          <div className={`input__container password ${hasSubmitted && !password ? 'invalid' : ''}`}>
            <input
              type="password"
              className="auth__password auth__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isRequired}
            />
          </div>
          {isRegister && (
            <div className={`input__container confirm-password ${hasSubmitted && (password !== confirmPassword) ? 'invalid' : ''}`}>
              <input
                type="password"
                className="auth__password auth__input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={isRequired}
              />
            </div>
          )}
          <button type="submit">{isRegister ? "Sign Up" : "Login"}</button>
        </form>
        <div className="signup-or-login__link">
          {isRegister ? (
            <a href="/login">Already have an account?<br />Log In</a>
          ) : (
            <a href="/register">Sign Up</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
