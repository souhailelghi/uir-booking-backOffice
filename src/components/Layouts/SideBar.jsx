import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClipboard, FaUser, FaChartBar ,FaSwatchbook , FaPassport} from "react-icons/fa";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { MdMeetingRoom, MdSupervisorAccount } from "react-icons/md";
import UIRRLogo from "../../assets/UIRR.png";
import "./Sidebar.css";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-screen blue-uir text-white ${
          isOpen ? "w-55" : "w-16"
        } transition-width duration-300`}
      >
        {isOpen && (
          <div className="py-7 px-2">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
              <Link to="/ListReservation" className="font-bold">
        {/* <p>LOGO</p> */}
        {/* <img src={UIRRLogo} alt="UIRR Logo" className="h-8 w-auto rounded-full" /> */}
        <img src={UIRRLogo} alt="UIRR Logo" className="h-8 w-auto rounded-full"  />
           </Link>
                {/* <span className="text-2xl font-extrabold text-green">
                  Logo
                </span> */}
              
              </div>
            </div>
            <nav>
              <div className="px-4 mt-10">
              <Link to="/ListReservation" className="font-bold">
                <h2 className="text-xs font-semibold text-gray-400 uppercase">
                  Menu
                </h2>
                </Link>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link
                      to="/ListReservation"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <MdSupervisorAccount  className="text-gray-500" />
                      <span>Reservations</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sport-list"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaPassport className="text-gray-500" />
                      <span>Les Terrains</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/SportCategorys"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaSwatchbook className="text-gray-500" />
                      <span>Les Sports</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/ExamResultsPage"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaClipboard className="text-gray-500" />
                      <span>black list</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      to="/TestResultsPage"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaChartBar className="text-gray-500" />
                      <span>User list</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      to="/ListTest"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaCalendarAlt className="text-gray-500" />
                      <span>settings</span>
                    </Link>
                  </li> */}

                
                  {/* 
                  <li>
                    <Link
                      to="/VaraintExam"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
                    >
                      <FaCalendarAlt className="text-gray-500" />
                      <span>Planing</span>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </nav>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-4 right-5 focus:outline-none"
        >
          {isOpen ? (
            <IoIosArrowDropleft className="text-2xl text-orange" />
          ) : (
            <IoIosArrowDropright className="text-2xl text-orange" />
          )}
        </button>
      </div>
      <div
        className={`flex-1 transition-margin duration-300 ${
          isOpen ? "ml-55" : "ml-16"
        } overflow-auto`}
      ></div>
    </div>
  );
};

export default Sidebar;
