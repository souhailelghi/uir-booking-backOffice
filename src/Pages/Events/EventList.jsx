import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line, RiTimeLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../api";
import Swal from "sweetalert2";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const EventList = () => {
  const [role, setRole] = useState('');
  const [listData, setListData] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(4);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [selectedSport, setSelectedSport] = useState(null);

  const fetchSports = async () => {
    try {
      console.log("selectedSport from method fetch Sports : ,", selectedSport);

      const endpoint ="/Event/list";
  
      const response = await ApiManager.get(endpoint);
      setListData(response.data);

      //todo : ;;
  
      setRequests(response.data);
      setFilteredRequests(response.data);

  
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Erreur lors de la récupération des events.");
    }
  };

  useEffect(() => {
    fetchSports();
    const storedRole = JSON.parse(localStorage.getItem("roles"))[0]; // Get the first role
    setRole(storedRole);
  }, [selectedSport]);

  const handleDelete = async (sportId) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Supprimer",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ApiManager.delete(`/Event/delete/${sportId}`);
          fetchSports();
          Swal.fire("Supprimé!", "L'élément a été supprimé.", "success");
          toast.success("Sport supprimée avec succès !");
        } catch (error) {
          Swal.fire("Erreur", "Erreur lors de la suppression.", "error");
          toast.error("Erreur lors de la suppression de la event.");
        }
      }
    });
  };

  const handleFetchClick = (id) => {
    navigate(`/planning-list?id=${id}`);
  };

   //todo : Pagination logic
   const indexOfLastRequest = currentPage * requestsPerPage;
   const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
   const currentRequests = filteredRequests.slice(
     indexOfFirstRequest,
     indexOfLastRequest
   );
   const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
 
   const handlePageChange = (event, value) => {
     setCurrentPage(value);
   };
  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
    console.log("sportId : from sport list ", sportId);
    console.log("selectedSport : from sport list ", selectedSport);
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
    
      
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold">Les Events</h4>
          {/* Only show the "Ajouter Categorys" button if the role is SuperAdmin */}
          {role === 'SuperAdmin' && (
        <button
          onClick={() => navigate("/add-Event")}
          className="px-4 py-2 bg-blue-950 text-white rounded-md"
        >
          Ajouter Evant
        </button>
         )}
      </div>

      <div className="overflow-x-auto">
        {currentRequests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100 dark:bg-meta-4 text-graydark">
              <tr>
                <th className="p-2.5 xl:p-5">Title</th>
                <th className="p-2.5 xl:p-5 text-center">Description</th>
                <th className="p-2.5 xl:p-5 text-center">lien</th>
                <th className="p-2.5 xl:p-5 text-center">Image</th>
              
                <th className="p-2.5 xl:p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((sport, key) => (
                <tr
                  key={sport.id}
                  className="border-b border-stroke dark:border-strokedark"
                >
                  <td className="p-2.5 xl:p-5">{sport.title}</td>
                 
                
                  <td className="p-2.5 xl:p-5 text-center"><p className="text-sm ">
                            {expandedCard === sport.id
                              ? sport.description // Show the full text if expanded
                              : `${sport.description.slice(0, 30)}...`}{" "}
                            {/* Show first 30 characters */}
                            <button
                              className="text-blue-400 ml-2"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering onClick of the parent
                                setExpandedCard(
                                  expandedCard === sport.id ? null : sport.id
                                );
                              }}
                            >
                              {expandedCard === sport.id
                                ? "See Less"
                                : "See More"}
                            </button>
                          </p></td>
                          <td className="p-2.5 xl:p-5 text-center">{sport.lien}</td>
             
                
                  <td className="p-2.5 xl:p-5 text-center">
                    <img
                      src={
                        sport.image
                          ? `data:image/png;base64,${sport.image}`
                          : "placeholder.png"
                      }
                      alt="no image"
                      className="w-24 h-24 object-cover rounded-md mx-auto mb-2"
                    />
                  </td>
                      
                  <td className="p-2.5 xl:p-5 flex justify-center gap-3 text-2xl">
                        {/* Only show Edit and Delete buttons if the role is SuperAdmin */}
              {role === 'SuperAdmin' && (
              <>
                    <Link to={`/Update-event/${sport.id}`} >
                    {/* state={{
                conditionss:sport.conditions,
                 names: sport.name ,
                 descriptions:sport.description ,
                 daysoffs:sport.daysoff , 
                 nbPlayers:sport.nbPlayer,
                 referenceSports:sport.referenceSport,
                  images: sport.image}  } */}
                      <FaRegEdit className="text-graydark cursor-pointer" />
                    </Link>
              
                    <RiDeleteBin5Line
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDelete(sport.id)}
                    />
                    </>
                  )}
                 
                  
                   
                 
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4">Aucun event disponible.</p>
        )}
      </div>

      <ToastContainer />
      <Stack spacing={2} className="mt-6">
      <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
   
    </Stack>
   
    </div>
  );
};

export default EventList;
