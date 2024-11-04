import React, { useState } from "react";
import "./LoginSignUp.css";
import { assets } from "../assets/assets";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = ({ target: { value } }) => {
    setName(value);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    setError('');
     // Input validation
     if (!name || (action === "Sign Up" && !email) || !password) {
      setError("Please fill in all required fields.");
      return; // Stop execution if fields are empty
    }
    try {
      const result = await axios.post('https://localhost:7253/api/Account/login', {
        username: name,
        password: password,
      });
    //   console.log("Login successful, token:", result.data.token);
      var token = result.data.token;
       // Store the token in localStorage for access across components
         localStorage.setItem("token", token);

      // Call onLogin to update isLoggedIn in App
      onLogin();

    //   alert(`Success: ${result.data.token}`);
      navigate('/' ); // Redirect to the main page or desired route after login

    } catch (error) {
      if (error.response && error.response.status === 401 ) {
        // alert(`Error: ${error.response.status} - ${error.response.data}`);
   
        
        // setError(`Error: ${error.response.status} - ${error.response.data}`);
        setError(`email or passe word incorrect !`);
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
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          {action === "Login" ? null : (
            <div className='input'>
              <img src={assets.person} alt='person' />
              <input
                type="text"
                id="txtName"
                placeholder="Enter Name"
                onChange={handleNameChange}
                required
              />
            </div>
          )}
          <div className='input'>
            <img src={assets.email} alt='email' />
            <input
              type="text"
              id="txtName"
              placeholder="Enter Name"
              onChange={handleNameChange}
              required
            />
          </div>
          <div className='input'>
            <img src={assets.password} alt='password' />
            <input
              type="password"
              id="txtPassword"
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              required
            />
          </div>
        </div>
        {error && <div className='error-message'>{error}</div>}
        <div className='submit-container'>
          <div className={action === "Sign Up" ? "Submit gray" : "submit"} onClick={async () => {
            if (action === "Login") {
              await handleLogin();
            } else {
              setAction("Login");
            }
          }}>
            Login
          </div>
          <div className={action === "Login" ? "Submit gray" : "submit"} onClick={() => {
            setAction("Sign Up")
          }}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
