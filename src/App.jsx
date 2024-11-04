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


function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-10">
       
            <Routes>
              <Route path="/ListReservation" element={<ListReservation />} />
              <Route path="/SportCategorys" element={<SportCategorysList />} />
              <Route path="/add-SportCategorys" element={<AddSportCategorys />} />
              <Route path="/Update/:id" element={<UpdateSportCategory />} />
              <Route path="/add-sport" element={<AddSport />} />
              //todo : planning 
              <Route path="/planning-list" element={<PlaningsList />} />
              <Route path="/add-planning-form" element={<AddPlanningForm />} />
              <Route path="/sport-list" element={<SportList />} />
              <Route path="/update-sport/:id" element={<UpdateSport />} />
              <Route path="/update-planning/:id" element={<UpdatePlanning />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
