import React, { useState } from "react";
import "./LoginSignUp.css";

import { ClipLoader } from 'react-spinners'; 
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';  
import { useNavigate } from 'react-router-dom';
import ApiManager from "../api";


const LoginSignUp = ({ onLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



 
  const handleSubmit  = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 
    // Input validation
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return; // Stop execution if fields are empty
    }
    try {
      const result = await ApiManager.post('https://localhost:7109/api/Account/login', {
        email,
        password,
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
    } finally {
      setLoading(false); 
    }
  };


 
  return (
    <div className="flex justify-center items-center h-screen css-background">
      <div className="bg-[#f8f9fc] lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
  
      
      <form onSubmit={handleSubmit}>
      
      <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
            />
          </div>




          <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-800">
            Mot de passe
          </label>
          <div className="relative">


            <input
               id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 pr-10"
              autoComplete="off"
            />
            <div
           
              onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>
          </div>
   


    
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
          } text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center`}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Se connecter"}
        </button>
        {error && <div  className="text-red-500 mt-2 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;

