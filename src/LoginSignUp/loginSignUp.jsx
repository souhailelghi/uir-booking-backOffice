import React, { useState } from "react";
import "./LoginSignUp.css";
import { assets } from "../assets/assets";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = ({ target: { value } }) => {
    setUserName(value);
  };
  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
  };

  // const handleLogin = async () => {
  //   setError('');
  //    // Input validation
  //    if (!email || (action === "Sign Up" && !email) || !password) {
  //     setError("Please fill in all required fields.");
  //     return; // Stop execution if fields are empty
  //   }
  //   try {
  //     const result = await axios.post('https://localhost:7253/api/Account/login', {
  //       email: email,
  //       password: password,
  //     });
  //   //   console.log("Login successful, token:", result.data.token);
  //     var token = result.data.token;
  //      // Store the token in localStorage for access across components
  //        localStorage.setItem("token", token);

  //     // Call onLogin to update isLoggedIn in App
  //     onLogin();

  //   //   alert(`Success: ${result.data.token}`);
  //     navigate('/' ); // Redirect to the main page or desired route after login

  //   } catch (error) {
      
  //   console.log("err req :",error.request)
  //     if (error.response && error.response.status === 401 ) {
  //       // alert(`Error: ${error.response.status} - ${error.response.data}`);
   
        
  //       // setError(`Error: ${error.response.status} - ${error.response.data}`);
  //       setError(`email or passe word incorrect !`);
  //     } else if (error.request) {
  //       setError('Error: No response from server.');
  //     } else {
  //       setError('Error: Request setup failed.');
  //     }
  //   }
  // };

  const handleLogin = async () => {
    setError('');
    // Input validation
    if (!email || (action === "Sign Up" && !email) || !password) {
      setError("Please fill in all required fields.");
      return; // Stop execution if fields are empty
    }
    try {
      const result = await axios.post('https://localhost:7253/api/Account/login', {
        email: email,
        password: password,
      });

      const token = result.data.token;
      // Store the token in localStorage for access across components
      localStorage.setItem("token", token);

      // Call onLogin to update isLoggedIn in App
      onLogin();

      navigate('/'); // Redirect to the main page or desired route after login
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

  const handleSignUp = async ()=>{
    setError('');
    // Input validation
    if (!email || (action === "Sign Up" && !email) || !password) {
     setError("Please fill in all required fields.");
     return; // Stop execution if fields are empty
   }
   try {
     const result = await axios.post('https://localhost:7253/api/Account/registerAdmin', {
      username:username,
       email: email,
       password: password,
     });

     var token = result.data.token;
    //  console.log("the token of registerAdmin is : " , token);
     
      // Store the token in localStorage for access across components
        localStorage.setItem("token", token);
        alert("account create succes")

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
              type="email"
              id="txtName"
              placeholder="Enter Email"
              onChange={handleEmailChange}
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
          <div className={action === "Login" ? "Submit gray" : "submit"} onClick={async () => {
            if(action==="Sign Up"){
              await handleSignUp();
            } else{

              setAction("Sign Up")
            }
          }}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
