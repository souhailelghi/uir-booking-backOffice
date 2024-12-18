import React, { useState } from "react";
import "./LoginSignUp.css";
import { assets } from "../assets/assets";

import { useNavigate } from 'react-router-dom';
import ApiManager from "../api";


const LoginSignUp = ({ onLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleNameChange = ({ target: { value } }) => {
    setUser(value);
  };
  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };



 
  const handleLogin = async () => {
    setError('');
    // Input validation
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return; // Stop execution if fields are empty
    }
    try {
      const result = await ApiManager.post('https://localhost:7109/api/Account/login', {
        email: email,
        password: password,
      });

      const { token, userId, username , roles } = result.data;
      // Store the token in localStorage for access across components
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      const theUserNAME = result.data.userName;
      localStorage.setItem("username", theUserNAME); 
      localStorage.setItem("roles", JSON.stringify(roles));

      console.log("data : for login user name is : ",result.data.userName);
      var Role =result.data.roles[0];
      console.log("the roles is :: ",Role);
      

      // Call onLogin to update isLoggedIn in App
      onLogin();

      navigate('/dashboard'); // Redirect to the main page or desired route after login
    } catch (error) {
      console.log("err req:", error.request);
      if (error.response) {
        if (error.response.status === 401) {
          // Check if the message matches the specific admin restriction
          const message = error.response.data.message;
          if (message === "Access denied. Only admins can log in.") {
            setError(message); // Display the specific message from the response
          } else {
            setError("Email or password incorrect!");
          }
        } else {
          setError('Error: Unable to log in. Please try again.');
        }
      } else if (error.request) {
        setError('Error: No response from server.');
      } else {
        setError('Error: Request setup failed.');
      }
    }
  };


 
  return (
    <div className='Main-container'>
      <div className='Login-container'>
        <div className='header'>
          <div className='text'>Se connecter</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
      
         
      
          <div className='input'>
            <img src={assets.email} alt='email' />
            <input
              type="email"
              id="txtEmail"
              placeholder="Enter Email"
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className='input'>
            <img src={assets.password} alt='password' />
            <input
              type={showPassword ? "text" : "password"}
              id="txtPassword"
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle-btn"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {error && <div className='error-message'>{error}</div>}
        <div className='submit-container'>
          <div className={ "submit"} onClick={handleLogin}>
         
        
            Se connecter
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;

