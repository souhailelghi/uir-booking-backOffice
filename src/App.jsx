import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListReservation from "./components/Reservations/ListReservation.jsx";
// import PlanningExam from "./components/Organism/PlanningExam";
import SportCategorysList from "./components/Surveillants/SportCategorysList.jsx";
import UpdateSurveillant from "./components/Surveillants/UpdateSurveillant.jsx";
import Header from "./components/Layouts/Header";
import ExamResultsPage from "./Pages/ExamResultsPage";
import ExamDetailPage from "./Pages/ExamDetailPage";
import StagiaireListPage from "./Pages/StagiaireListPage";
import TestResultsPage from "./Pages/TestResultsPage";
import TestDetailPage from "./Pages/TestDetailPage";
import TestStagiaireList from "./Pages/TestStagiaireListe";
import Sidebar from "./components/Layouts/SideBar";
import Planification from "./Pages/PlanificationPage";
import RoomList from "./Pages/Rooms/RoomList";
import UpdateRoom from "./Pages/Rooms/UpdateRoom";
import PlanificationTestPage from "./Pages/Tests/PlanificationTest";
import ListTest from "./Pages/Tests/ListTests";
import EditTest from "./Pages/Tests/UpdateTest";
import VaraintExamPage from "./Pages/VariantExams/VaraintExamPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddSportCategorys from "./components/Surveillants/AddSportCategorys.jsx";
import AddRoom from "./Pages/Rooms/AddRoom";
import PlaningsList from "./Pages/Rooms/PlaningsList";
import AddNewVariant from "./Pages/VariantExams/AddNewVariant.jsx";
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
              <Route path="/ExamResultsPage" element={<ExamResultsPage />} />
              <Route
                path="/ExamDetails/:id/:fid"
                element={<ExamDetailPage />}
              />
              <Route
                path="/stagiaire-list/:id/:fid"
                element={<StagiaireListPage />}
              />
              <Route path="/TestResultsPage"element={<TestResultsPage />} />
              <Route path="/TestDetailPage/:id/:fid" 
              element={<TestDetailPage />} />
              <Route
                path="/TestStagiaireList/:id/:fid"
                element={<TestStagiaireList />}
              />
              <Route path="/ListReservation" element={<ListReservation />} />
              {/* <Route path="/PlanningExam/Create" element={<PlanningExam />} /> */}
              <Route path="/SportCategorys" element={<SportCategorysList />} />
              <Route path="/add-SportCategorys" element={<AddSportCategorys />} />
              <Route path="/Update/:id" element={<UpdateSurveillant />} />
              <Route path="/Planification" element={<Planification />} />
              <Route path="/add-room" element={<AddRoom />} />
              <Route path="/planning-list" element={<PlaningsList />} />
              <Route path="/add-planning-form" element={<AddPlanningForm />} />
              <Route path="/room-list" element={<RoomList />} />
              <Route path="/update-room/:id" element={<UpdateRoom />} />
              <Route
                path="/PlanningTest/create"
                element={<PlanificationTestPage />}
              />
              <Route path="/VaraintExam/create" element={<AddNewVariant />} />
              <Route path="/VaraintExam" element={<VaraintExamPage />} />
              <Route path="/ListTest" element={<ListTest />} />
              <Route path="/update-test/:id" element={<EditTest />} />
              <Route path="/update-planning/:id" element={<UpdatePlanning />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
