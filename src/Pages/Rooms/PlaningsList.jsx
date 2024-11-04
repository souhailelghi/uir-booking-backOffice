// import React, { useEffect, useState } from "react";
// import { Link, useNavigate ,useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import ApiManager from "../../api";
// import { FaRegEdit } from "react-icons/fa";
// import { RiDeleteBin5Line } from "react-icons/ri";

// function PlaningsList() {
//   const [VariantExams, setVariantExams] = useState([]);
//   const [plannings, setPlannings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const sportId = new URLSearchParams(useLocation().search).get("id");
//   console.log("sport id : : ", sportId);
  
//   const [error, setError] = useState(null);
  
//   const navigate = useNavigate();

//   // const sportId = "611e99b9-f82a-4d7c-b6b5-17ccec6da74b"; 


//   const fetchVariantExams = async () => {
//     try {
//       const response = await ApiManager.get(`/Plannings/get-by-sport/${sportId}`);
//       console.log("sport id inside fetchVariantExams ",sportId);
      
//       setVariantExams(response.data);
//       console.log('data get by sport', response.data);
//     } catch (error) {
//       console.error("Error fetching VariantExams:", error);
//       toast.error("Erreur lors de la récupération des VariantExams.");
//     }
//   };

//   useEffect(() => {
//     fetchVariantExams();
//   }, []);
//   const handleFetchClick = (sportId) => {
//     navigate(`/add-planning-form?id=${sportId}`); // Navigate with the sport ID
//     console.log(" ***handleFetchClick sport : **",sportId);
//   };

//   const handleDelete = async (testId) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
//       try {
//         const response = await ApiManager.delete(`/Test/${testId}`);
//         if (response.status === 200) {
//           setVariantExams(VariantExams.filter((test) => test.id !== testId));
//           toast.success("Test supprimé avec succès !");
//         } else {
//           toast.error("Erreur lors de la suppression du test.");
//         }
//       } catch (error) {
//         console.error("Error deleting test:", error);
//         toast.error("Erreur lors de la suppression du test.");
//       }
//     }
//   };
//   return (
//     <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <div className="flex justify-between items-center mb-6">
//         <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
//          list Planings :
//         </h4>
//         <button
//           // onClick={() => navigate("/add-planning-form")}
//           onClick={() => handleFetchClick(test.id)}
//           className="px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" 
//         >
//           Ajouter un planing
//         </button>
//       </div>

//       <div className="flex flex-col font-satoshi">
//         <div className="grid grid-cols-3 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">Day</h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//             Date Created
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//             Time Ranges
//             </h5>
//           </div>
        
       
//         </div>

//         {VariantExams.map((test, key) => (
//           <div
//             className={`grid grid-cols-3 sm:grid-cols-5 ${
//               key === VariantExams.length - 1
//                 ? ""
//                 : "border-b border-stroke dark:border-strokedark"
//             }`}
//             key={test.id}
//           >
//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
//               <p className="hidden text-black dark:text-white sm:block font-semibold">
//                 {test.day }
//               </p>
//             </div>
//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black">{test.dateCreation }</p>
//             </div>
//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//             <ul className="text-black">
//                                 {test.timeRanges.length === 0 ? (
//                                     <li>No time ranges available.</li>
//                                 ) : (
//                                     test.timeRanges.map(range => (
//                                         <li key={range.id}>
//                                             {range.hourStart} - {range.hourEnd}
//                                         </li>
//                                     ))
//                                 )}
//                             </ul>
//             </div>
      
//             <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
//               <Link to={`/update-planning/${test.id}`}>
//                 <FaRegEdit className="text-graydark cursor-pointer" />
//               </Link>
//               <RiDeleteBin5Line
//                 className="text-red-600 cursor-pointer"
//                 onClick={() => handleDelete(test.id)}
//               />
//             </div>
//                       <button  onClick={ () => handleFetchClick(test.id)}> ajoute planing</button>          

//           </div>
//         ))}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default PlaningsList;

// PlaningsList Component

//todo: --------------------
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ApiManager from "../../api";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

function PlaningsList() {
  const [VariantExams, setVariantExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const sportId = new URLSearchParams(useLocation().search).get("id");
  const navigate = useNavigate();


   // Helper function to convert day number to day name
   const getDayName = (day) => {
    switch (day) {
      case 0:
        return "Lundi";
      case 1:
        return "Mardi";
      case 2:
        return "Mercredi";
      case 3:
        return "Jeudi";
      case 4:
        return "Vendredi";
      case 5:
        return "Samedi";
      case 6:
        return "Dimanche";
      default:
        return "Unknown Day";
    }
  };
  const fetchVariantExams = async () => {
    try {
      const response = await ApiManager.get(`/Plannings/get-by-sport/${sportId}`);
      
      
      setVariantExams(response.data);
    } catch (error) {
      console.error("Error fetching VariantExams:", error);
      toast.error("Erreur lors de la récupération des VariantExams.");
    }
  };

  useEffect(() => {
    fetchVariantExams();
  }, [sportId]);

  const handleFetchClick = () => {
    navigate(`/add-planning-form?id=${sportId}`);
  };

  const handleDelete = async (testId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        const response = await ApiManager.delete(`/Plannings/delete/${testId}`);
        if (response.status === 200) {
          setVariantExams(VariantExams.filter((test) => test.id !== testId));
          toast.success("Test supprimé avec succès !");
        } else {
          toast.error("Erreur lors de la suppression du test.");
        }
      } catch (error) {
        console.error("Error deleting test:", error);
        toast.error("Erreur lors de la suppression du test.");
      }
    }
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
         list Planings :
        </h4>
        <button
          onClick={handleFetchClick} // Use sportId directly here
          className="px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" 
        >
          Ajouter un planing
        </button>
      </div>

      <div className="flex flex-col font-satoshi">
        <div className="grid grid-cols-3 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Day</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Date Created
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Time Ranges
            </h5>
          </div>
        </div>

        {VariantExams.map((test, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === VariantExams.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={test.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block font-semibold">
                {getDayName(test.day)}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">{test.dateCreation }</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
            <ul className="text-black">
              {test.timeRanges.length === 0 ? (
                  <li>No time ranges available.</li>
              ) : (
                  test.timeRanges.map(range => (
                      <li key={range.id}>
                          {range.hourStart} - {range.hourEnd}
                      </li>
                  ))
              )}
            </ul>
            </div>
      
            <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
              <Link to={`/update-planning/${test.id}`}>
                <FaRegEdit className="text-graydark cursor-pointer" />
              </Link>
              <RiDeleteBin5Line
                className="text-red-600 cursor-pointer"
                onClick={() => handleDelete(test.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default PlaningsList;
