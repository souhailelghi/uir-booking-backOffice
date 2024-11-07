import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line , RiTimeLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import ApiManager from '../../api';
import Swal from "sweetalert2";


//todo : list sport 
const SportList = () => {
  const [listData, setListData] = useState([]);
  const navigate = useNavigate();

  const fetchSports = async () => {
    try {
      const response = await ApiManager.get('/Sports/list');
      console.log(response.data);
      
      setListData(response.data);
      
    } catch (error) {
      console.error('Error fetching sports:', error);
      toast.error('Erreur lors de la récupération des sports.');
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

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
        await ApiManager.delete(`/Sports/delete/${sportId}`);
        fetchSports();
        Swal.fire("Supprimé!", "L'élément a été supprimé.", "success");
        toast.success("Sport supprimée avec succès !");
      } catch (error) {
        Swal.fire("Erreur", "Erreur lors de la suppression.", "error");
        toast.error("Erreur lors de la suppression de la sport.");
      }
    }
    });
    console.log(sportId);
  };

  // add time to sport : 
  const handleAddTime = async (sportId) => {
    // if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
    //   try {
    //     await ApiManager.delete(`/Sports/delete/${sportId}`);
    //     fetchSports();
    //     toast.success("Salle supprimée avec succès !");
    //   } catch (error) {
    //     toast.error("Erreur lors de la suppression de la salle.");
    //   }
    // }
    console.log(sportId);
  };

  const handleFetchClick = (id) => {
    navigate(`/planning-list?id=${id}`); // Navigate with the sport ID
    console.log("sport",id);
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
          Sports
        </h4>
        <button
          onClick={() => navigate('/add-sport')}
          className="px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Ajouter Sport
        </button>
      </div>

      <div className="flex flex-col font-satoshi">
        <div className="grid grid-cols-3 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nom de la sport
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              day off
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Capacité
            </h5>
          </div>
          
        </div>

        {listData.map((sport, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${key === listData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            key={sport.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block font-semibold">
                {sport.name}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">{sport.description == 0?"Salle Normale" : sport.daysoff}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">{sport.nbPlayer}</p>
            </div>
            
            <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
              <Link to={`/update-sport/${sport.id}`} state={{
                conditionss:sport.conditions,
                 names: sport.name ,
                 descriptions:sport.description ,
                 daysoffs:sport.daysoff , 
                 nbPlayers:sport.nbPlayer,
                 referenceSports:sport.referenceSport}  }>
                <FaRegEdit className='text-graydark cursor-pointer' />
              </Link>
              <RiDeleteBin5Line className='text-red-600 cursor-pointer' onClick={() => handleDelete(sport.id)} />
             
              <RiTimeLine className='text-red-500 cursor-pointer' onClick={() => handleFetchClick(sport.id)} />
                
                {/* <button className="btn btn-secondary" onClick={() => handleFetchClick(room.id)}>
                  Fetch all Date Hours By Id
                </button> */}
              
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SportList;
