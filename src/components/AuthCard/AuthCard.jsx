import { useState, useEffect } from "react";
import axios from "axios";
import "./AuthCard.scss";
import { useNavigate } from "react-router-dom";

const AuthCard = ({ type }) => {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "login" && type !== "register") {
      console.error("Invalid type prop. Expected 'login' or 'register'.");
      return;
    }
  }, [type]);

  const isRegister = type === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const url = isRegister ? "http://localhost:8080/api/auth/register" : "http://localhost:8080/api/auth/login";
      const response = await axios.post(url, { email, password, username: isRegister ? username : undefined });
      console.log(`${isRegister ? "Registration" : "Login"} successful`, response.data);
      localStorage.setItem("token", response.data.token);

       // Redirect to the user-specific page
       if (response.data.userId) {
        navigate(`/user/${response.data.userId}`);
      } else {
        // Handle cases where userId is not returned
        console.error("User ID is missing in the response");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card card">
        <div className="logo">
          <img src="../../src/assets/images/logo.jpg" alt="Logo" />
        </div>
        <h1>{isRegister ? "Sign Up" : "Log In"}</h1>
        <span>{isRegister ? "Create an account!" : "Welcome back!"}</span>
        {error && <p className="error-message">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          {isRegister && (
              <div className="input__container username">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  className="auth__username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
          )}
          <div className="input__container email">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              className="auth__email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input__container password">
            {/* <i className="fas fa-lock"></i> */}
            <input
              type="password"
              className="auth__password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegister && (
              <div className="input__container confirm-password">
                {/* <i className="fas fa-lock"></i> */}
                <input
                  type="password"
                  className="auth__password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
          )}
          <button type="submit">{isRegister ? "Sign Up" : "Login"}</button>
        </form>
        <div className="signup-or-login__link">
          {isRegister ? (
            <a href="/login">Already have an account?<br/>Log In</a>
          ) : (
            <a href="/register">Sign Up</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
