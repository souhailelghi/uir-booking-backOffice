import React, { useEffect, useState } from "react";
import ApiManager from "../../api";
import { Link } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Filtrage from "../TableComponent/Filtrage"
import Pagination from "../TableComponent/Pagination"
import jsPDF from 'jspdf';
import image from '../../assets/uir.png'


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
  const [selectedReservations, setSelectedReservations] = useState([]);

  const handleCheckboxToggle = (reservationId) => {
    setSelectedReservations((prev) =>
      prev.includes(reservationId)
        ? prev.filter((id) => id !== reservationId)
        : [...prev, reservationId]
    );
  };
  

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
     
        if (reservation.codeUIR && !studentNames[reservation.studentId]) {
          fetchStudentName(reservation.codeUIR);
        }
      });
   
      

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



  const handleExportPDF = async () => {
    if (selectedReservations.length === 0) {
      toast.error("Please select at least one reservation to export.");
      return;
    }
  
    try {
      const pdf = new jsPDF();
  
      selectedReservations.forEach((id, index) => {
        const reservation = reservations.find((res) => res.id === id);
  
        if (reservation) {
          // Add content to the page
          pdf.setFontSize(16);
          pdf.text(`Reservation Details`, 10, 10);
  
          // Get current date to show at the top right of the page
          const currentDate = new Date().toLocaleDateString();
  
          // Calculate the position of the date at the far right
          const pageWidth = pdf.internal.pageSize.getWidth();
          pdf.setFontSize(12);
          pdf.text(currentDate, pageWidth - 10, 10, { align: 'right' });
  
          pdf.setFontSize(12);
          pdf.text(`Reservation #${index + 1}`, 10, 20);
          pdf.text(`Student Code: ${reservation.codeUIR}`, 10, 30);
          pdf.text(`full Name: ${studentFirstNames[reservation.codeUIR] || "Loading..."} - ${studentLastName[reservation.codeUIR] || "Loading..."}`, 10, 40);
          // pdf.text(`Last Name: `, 10, 50);
          pdf.text(`Sport: ${sportNames[reservation.sportId] || "Loading..."}`, 10, 50);
          pdf.text(`Time: ${reservation.hourStart} - ${reservation.hourEnd}`, 10, 60);
          pdf.text(`Date: ${reservation.onlyDate || "Unknown"}`, 10, 70);
  
          if (reservation.codeUIRList && reservation.codeUIRList.length > 0) {
            pdf.text(`List of Codes:`, 10, 90);
  
            reservation.codeUIRList.forEach((code, codeIndex) => {
              const yPosition = 100 + codeIndex * 10; // Adjust y-position for each code
              pdf.rect(10, yPosition - 5, 5, 5); // Draw checkbox
              pdf.text(code, 20, yPosition); // Add the code text
            });
          }
  
          // Add a new page for the next reservation if not the last one
          if (index < selectedReservations.length - 1) {
            pdf.addPage();
          }
        }
      });
  
      // Save the PDF
      pdf.save("Reservations.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF.");
    }
  };
  

  // const handleExportPDF = async () => {
  //   if (selectedReservations.length === 0) {
  //     toast.error("Please select at least one reservation to export.");
  //     return;
  //   }
  
  //   try {
  //     const pdf = new jsPDF();
  
  //     selectedReservations.forEach((id, index) => {
  //       const reservation = reservations.find((res) => res.id === id);
  
  //       if (reservation) {
  //         // Add content to the page
  //         pdf.setFontSize(16);
  //         pdf.text(`Reservation Details`, 10, 10);
  
  //         pdf.setFontSize(12);
  //         pdf.text(`Reservation #${index + 1}`, 10, 20);
  //         pdf.text(`Student Code: ${reservation.codeUIR}`, 10, 30);
  //         pdf.text(`First Name: ${studentFirstNames[reservation.codeUIR] || "Loading..."}`, 10, 40);
  //         pdf.text(`Last Name: ${studentLastName[reservation.codeUIR] || "Loading..."}`, 10, 50);
  //         pdf.text(`Sport: ${sportNames[reservation.sportId] || "Loading..."}`, 10, 60);
  //         pdf.text(`Time: ${reservation.hourStart} - ${reservation.hourEnd}`, 10, 70);
  //         pdf.text(`Date: ${reservation.onlyDate || "Unknown"}`, 10, 80);
  
  //         if (reservation.codeUIRList && reservation.codeUIRList.length > 0) {
  //           pdf.text(`List of Codes:`, 10, 90);
  
  //           reservation.codeUIRList.forEach((code, codeIndex) => {
  //             const yPosition = 100 + codeIndex * 10; // Adjust y-position for each code
  //             pdf.rect(10, yPosition - 5, 5, 5); // Draw checkbox
  //             pdf.text(code, 20, yPosition); // Add the code text
  //           });
  //         }
  
  //         // Add a new page for the next reservation if not the last one
  //         if (index < selectedReservations.length - 1) {
  //           pdf.addPage();
  //         }
  //       }
  //     });
  
  //     // Save the PDF
  //     pdf.save("Reservations.pdf");
  //     toast.success("PDF exported successfully!");
  //   } catch (error) {
  //     console.error("Error exporting PDF:", error);
  //     toast.error("Failed to export PDF.");
  //   }
  // };
  
  //todo : 

  // const handleExportPDF = async () => {
  //   if (selectedReservations.length === 0) {
  //     toast.error("Please select at least one reservation to export.");
  //     return;
  //   }
  
  //   try {
  //     const pdf = new jsPDF();
  
  //     selectedReservations.forEach((id, index) => {
  //       const reservation = reservations.find((res) => res.id === id);
  
  //       if (reservation) {
  //         // Add content to the page
  //         pdf.setFontSize(16);
  //         pdf.text(`Reservation Details`, 10, 10);
  
  //         pdf.setFontSize(12);
  //         pdf.text(`Reservation #${index + 1}`, 10, 20);
  //         pdf.text(`Student Code: ${reservation.codeUIR}`, 10, 30);
  //         pdf.text(`First Name: ${studentFirstNames[reservation.codeUIR] || "Loading..."}`, 10, 40);
  //         pdf.text(`Last Name: ${studentLastName[reservation.codeUIR] || "Loading..."}`, 10, 50);
  //         pdf.text(`Sport: ${sportNames[reservation.sportId] || "Loading..."}`, 10, 60);
  //         pdf.text(`Time: ${reservation.hourStart} - ${reservation.hourEnd}`, 10, 70);
  //         pdf.text(`Date: ${reservation.onlyDate || "Unknown"}`, 10, 80);
  
  //         if (reservation.codeUIRList && reservation.codeUIRList.length > 0) {
  //           pdf.text(`List of Codes: ${reservation.codeUIRList.join(", ")}`, 10, 90);
  //         }
  
  //         // Add a new page for the next reservation if not the last one
  //         if (index < selectedReservations.length - 1) {
  //           pdf.addPage();
  //         }
  //       }
  //     });
  
  //     // Save the PDF
  //     pdf.save("Reservations.pdf");
  //     toast.success("PDF exported successfully!");
  //   } catch (error) {
  //     console.error("Error exporting PDF:", error);
  //     toast.error("Failed to export PDF.");
  //   }
  // };
  
  
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
  <button
  onClick={handleExportPDF}
  className="px-4 py-2 bg-blue-950 text-white rounded-md"
>
  Export PDF
</button>


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
          <th className="p-2.5 xl:p-5 text-center">Actions</th>
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
              <input
  type="checkbox"
  checked={selectedReservations.includes(reservation.id)}
  onChange={() => handleCheckboxToggle(reservation.id)}
  className="form-checkbox"
/>

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
            <td className="p-2.5 xl:p-5 flex justify-center gap-3 text-2xl">
                
                  <Link  to={`/checklist/${reservation.id}`}    >
                      <FaRegListAlt className="text-graydark cursor-pointer" />
                    </Link>
                  
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
