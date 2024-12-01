import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ApiManager from "../../api";

const SportCategorysList = () => {
  const [listData, setListData] = useState([]);
  const [role, setRole] = useState('');

  const fetchSportCategorys = async () => {
    try {
      const response = await ApiManager.get("/SportCategorys/list");
      setListData(response.data);
    } catch (error) {
      console.error("Error fetching Sport Categorys:", error);
    }
  };

  useEffect(() => {
    fetchSportCategorys();
    const storedRole = JSON.parse(localStorage.getItem("roles"))[0]; // Get the first role
    setRole(storedRole);
  }, []);

  const handleDelete = async (SportCategorysId) => {
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
          await ApiManager.delete(`/SportCategorys/delete/${SportCategorysId}`);
          fetchSportCategorys();
          Swal.fire("Supprimé!", "L'élément a été supprimé.", "success");
        } catch (error) {
          Swal.fire("Erreur", "Erreur lors de la suppression.", "error");
        }
      }
    });
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">Sports</h4>
        {/* Only show the "Ajouter Categorys" button if the role is SuperAdmin */}
        {role === 'SuperAdmin' && (
          <Link
            to="/add-SportCategorys"
            className="px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Ajouter Sport
          </Link>
        )}
      </div>

      <div className="flex flex-col font-satoshi">
        <div className="grid grid-cols-2 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-3">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom du sport</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Image du sport</h5>
          </div>
        </div>

        {listData.map((list) => (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 border-b border-stroke dark:border-strokedark`}
            key={list.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block font-semibold">{list.name}</p>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <img
                src={list.image ? `data:image/png;base64,${list.image}` : "placeholder.png"}
                alt={list.name}
                className="w-12 h-12 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center"
              />
            </div>
            
            <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
              {/* Only show Edit and Delete buttons if the role is SuperAdmin */}
              {role === 'SuperAdmin' && (
                <>
                  <Link to={`/update/${list.id}`} state={{names: list.name , images: list.image}}>
                    <FaRegEdit className="text-graydark cursor-pointer" />
                  </Link>
                  <RiDeleteBin5Line
                 className="text-red-600 cursor-pointer"
                onClick={() => handleDelete(list.id)}
              />
                 
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportCategorysList;
