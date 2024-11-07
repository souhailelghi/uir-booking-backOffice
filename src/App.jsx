import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListReservation from "./components/Reservations/ListReservation.jsx";
import SportCategorysList from "./components/SportCategorys/SportCategorysList.jsx";
import UpdateSportCategory from "./components/SportCategorys/UpdateSportCategory.jsx";
import Header from "./components/Layouts/Header";
import Sidebar from "./components/Layouts/SideBar";
import SportList from "./Pages/Sports/SportList.jsx";
import UpdateSport from "./Pages/Sports/UpdateSport.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddSportCategorys from "./components/SportCategorys/AddSportCategorys.jsx";
import AddSport from "./Pages/Sports/AddSport.jsx";
import PlaningsList from "./Pages/Sports/PlaningsList.jsx";
import AddPlanningForm from "./Pages/Plannigs/AddPlanningForm";
import UpdatePlanning from "./Pages/Plannigs/UpdatePlanning.jsx";
import LoginSignUp from "./LoginSignUp/loginSignUp.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };


  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header onLogout={handleLogout} /> {/* Pass handleLogout to Header */}
            <div className="p-10">
              <Routes>
                <Route path="/" element={<ListReservation />} />
                <Route path="/ListReservation" element={<ListReservation />} />
                <Route path="/SportCategorys" element={<SportCategorysList />} />
                <Route path="/add-SportCategorys" element={<AddSportCategorys />} />
                <Route path="/Update/:id" element={<UpdateSportCategory />} />
                <Route path="/add-sport" element={<AddSport />} />
                <Route path="/planning-list" element={<PlaningsList />} />
                <Route path="/add-planning-form" element={<AddPlanningForm />} />
                <Route path="/sport-list" element={<SportList />} />
                <Route path="/update-sport/:id" element={<UpdateSport />} />
                <Route path="/update-planning/:id" element={<UpdatePlanning />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <LoginSignUp onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;
