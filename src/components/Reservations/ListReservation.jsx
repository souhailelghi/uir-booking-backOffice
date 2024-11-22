import React, { useEffect, useState } from "react";
import ApiManager from "../../api";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Filtrage from "../TableComponent/Filtrage"
import Pagination from "../TableComponent/Pagination"

function ListReservation() {
  const [reservations, setReservations] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [studentFirstNames, setstudentFirstNames] = useState({});
  const [studentLastName, setstudentLastName] = useState({});
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
// Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(3);


  useEffect(() => {
    fetchReservation();
  }, [selectedSport]);

  const fetchReservation = async () => {

    //todo : --------------
    try {
      const endpoint = selectedSport
      ? `/Reservations/BySportCategoryId/${selectedSport}`
      : "/Reservations/list";
   
      const response = await ApiManager.get(endpoint);
      // setSportsLocal(response.data);
      setReservations(response.data);
      setRequests(response.data);
      setFilteredRequests(response.data);
      response.data.forEach((reservation) => {
        if (reservation.sportId && !sportNames[reservation.sportId]) {
          fetchSportName(reservation.sportId);
        }
        if (reservation.codeUIR && !sportNames[reservation.codeUIR]) {
          fetchSportName(reservation.codeUIR);
        }
        if (reservation.codeUIR && !studentNames[reservation.studentId]) {
          fetchStudentName(reservation.codeUIR);
        }
      });
      console.log('list of reservations : ' , response.data);
      

    } catch (error) {
      console.log("Failed to load sports ");
    }
    //todo : --------------
  
  };

  const fetchSportName = async (sportId) => {
    try {
      const response = await ApiManager.get(`/Sports/${sportId}`);
      setSportNames((prevSportNames) => ({
        ...prevSportNames,
        [sportId]: response.data.name,
      }));
    } catch (error) {
      console.error("Error fetching sport name:", error);
    }
  };

  const fetchStudentName = async (codeUIR) => {
    try {
      const response = await ApiManager.get(`/Students/GetStudentByCodeUIR/${codeUIR}`);


    

      setstudentFirstNames((prevStudentNames) => ({
        ...prevStudentNames,
        [codeUIR]: response.data.firstName,
      }));
      setstudentLastName((prevStudentNames) => ({
        ...prevStudentNames,
        [codeUIR]: response.data.lastName,
      }));

    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await ApiManager.delete(`/Reservation/${reservationId}`);
        fetchReservation();
        toast.success("reservation supprimée avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression de la reservation.");
      }
    }
  };
  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
  };

  //todo : Pagination 
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  <Filtrage
    requests={requests}
    onFilteredRequests={setFilteredRequests}
    sportNames={sportNames}
    onSportSelect={handleSportSelect}
  />
  <div className="flex justify-between items-center mb-6">
    <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
      List des Reservations
    </h4>
  </div>

  <div className="font-satoshi">
    <table className="w-full table-auto border-collapse border border-stroke dark:border-strokedark">
      <thead className="bg-blue-100 dark:bg-meta-4 text-graydark">
        <tr>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase">Student Code</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase">First Name</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase">Last Name</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase text-center">Sport</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase text-center">Time</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase text-center hidden sm:table-cell">Date</th>
          <th className="p-2.5 xl:p-5 text-sm font-medium uppercase text-center hidden sm:table-cell">List Student</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((reservation, key) => (
          <tr
            className={`${
              key === currentRequests.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
            }`}
            key={reservation.id}
          >
            <td className="p-2.5 xl:p-5 text-black dark:text-white">
              {reservation.codeUIR || "Loading..."}
            </td>
            <td className="p-2.5 xl:p-5 text-black dark:text-white">
              {studentFirstNames[reservation.codeUIR] || "Loading..."}
            </td>
            <td className="p-2.5 xl:p-5 text-black dark:text-white">
              {studentLastName[reservation.codeUIR] || "Loading..."}
            </td>
            <td className="p-2.5 xl:p-5 text-center text-black dark:text-white">
              {sportNames[reservation.sportId] || "Loading..."}
            </td>
            <td className="p-2.5 xl:p-5 text-center text-black">
              {reservation.hourStart} - {reservation.hourEnd}
            </td>
            <td className="p-2.5 xl:p-5 text-center hidden sm:table-cell text-black dark:text-white">
              {reservation.onlyDate}
            </td>
            <td className="p-2.5 xl:p-5 text-center hidden sm:table-cell text-black dark:text-white">
              {reservation.codeUIRList ? reservation.codeUIRList.join(" ") : "No codes"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
</div>

  );
}

export default ListReservation;
