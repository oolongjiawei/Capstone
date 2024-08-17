import { useState } from "react";
import axios from "axios";
import "./LoginForm.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // Handle success (e.g., save token, redirect)
      console.log("Login successful", response.data);
      // Save token to localStorage or cookies
      localStorage.setItem("token", response.data.token);

      // Redirect user after successful login
      window.location.href = "/dashboard"; // Change to your dashboard route

    } catch (err) {
      // Handle error
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login__container">
      <div className="login__card card">
        <div className="logo">
          吉
          <img src="../../src/assets/images/logo.jpg" alt="Logo" />
        </div>
        <h1>Log in</h1>
        <span>Welcome back!</span>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input__container">
            <i className="fas fa-user"></i>
            <input
              className="login__username"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input__container">
            <i className="fas fa-lock"></i>
            <input
              className="login__password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="signup-or-login__link ">
          <a href="/">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
