import axios from "axios";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [totalReservations, setTotalReservations] = useState(0); // State for total reservations
  const [totalEvents, setTotalEvents] = useState(0); // State for total events
  const [totalSports, setTotalSports] = useState(0); // State for total sports
  const [totalCourts, setTotalCourts] = useState(0); // State for total courts

  useEffect(() => {
    // Function to fetch all data
    const fetchData = async () => {
      try {
        // Fetch total reservations
        const reservationResponse = await axios.get(
          "https://localhost:7125/api/Reservations/total-reservations"
        );
        setTotalReservations(reservationResponse.data);

        // Fetch total events
        const eventsResponse = await axios.get(
          "https://localhost:7125/api/Event/total-events"
        );
        setTotalEvents(eventsResponse.data);

        // Fetch total sports
        const sportsResponse = await axios.get(
          "https://localhost:7125/api/SportCategorys/total-sports"
        );
        setTotalSports(sportsResponse.data);

        // Fetch total courts
        const courtsResponse = await axios.get(
          "https://localhost:7125/api/Sports/total-courts"
        );
        setTotalCourts(courtsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        {/* <p className="text-gray-500">11/14/2024</p> */}
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button className="py-2 px-4 bg-gray-200 text-gray-700 rounded-l-md">
        Aperçu
        </button>
     
   
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Events */}
        <div className="p-6 bg-blue-700 text-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Nombre Total d'Événements</h2>
          <p className="text-4xl font-bold mb-1">{totalEvents.toLocaleString()}</p>
      
        </div>

        {/* Total Sports */}
        <div className="p-6 bg-orange-500 text-black rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Nombre Total de Sports</h2>
          <p className="text-4xl font-bold mb-1">{totalSports.toLocaleString()}</p>
      
        </div>

        {/* Total Courts */}
        <div className="p-6 bg-blue-700 text-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Nombre Total de Terrains</h2>
          <p className="text-4xl font-bold mb-1">{totalCourts.toLocaleString()}</p>
      
        </div>

        {/* Total Reservations */}
        <div className="p-6 bg-orange-500 text-black rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Nombre Total de Réservations</h2>
          <p className="text-4xl font-bold mb-1">
            {totalReservations.toLocaleString()}
          </p>
    
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
