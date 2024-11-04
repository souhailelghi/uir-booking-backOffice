import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRoom = () => {
  const [categorieId, setCategorieId] = useState("");
  const [referenceSport, setReferenceSport] = useState("");
  const [nbPlayer, setNbPlayer] = useState("");
  const [daysoff, setDaysoff] = useState("");
  const [conditions, setConditions] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null); // For image file
  const [sportCategories, setSportCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSportCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7125/api/SportCategorys/list");
        setSportCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories sportives:", error);
      }
    };
    fetchSportCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categorieId || !referenceSport || !nbPlayer || !daysoff || !conditions || !name || !description || !imageUpload) {
      toast.error("Assurez-vous de remplir tout!");
      return;
    }

    // Prepare the form data for multipart/form-data submission
    // const formData = new FormData();
    // formData.append("CategorieId", categorieId);
    // formData.append("ReferenceSport", referenceSport);
    // formData.append("NbPlayer", nbPlayer);
    // formData.append("Daysoff", daysoff);
    // formData.append("Conditions", conditions);
    // formData.append("Name", name);
    // formData.append("Description", description);
    // formData.append("ImageUpload", imageUpload); // Add the image file
    
    const formData = {
      categorieId:categorieId,
      referenceSport:referenceSport,
      nbPlayer:nbPlayer,
      daysoff:daysoff,
      conditions:conditions,
      name:name,
      description:description,
      imageUpload:imageUpload
    };

    try {
      const response = await axios.post("https://localhost:7125/api/Sports/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success("Sport ajouté avec succès!");
        navigate("/room-list");
      } else {
        toast.error("Erreur lors de l'ajout du sport!");
      }
    } catch (error) {
      toast.error(`Erreur réseau! ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/room-list");
  };

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Créer Sport</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Catégorie sportive <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={categorieId}
                    onChange={(e) => setCategorieId(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="" disabled>
                      Sélectionnez une catégorie sportive
                    </option>
                    {sportCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other fields */}
             
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Référence" required onChange={(e) => setReferenceSport(e.target.value)} /> <br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Nombre de joueurs" required onChange={(e) => setNbPlayer(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Jours de repos" required onChange={(e) => setDaysoff(e.target.value)} /> <br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Conditions" required onChange={(e) => setConditions(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Nom" required onChange={(e) => setName(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} /> <br />

                {/* Image upload */}
                  {/* Image upload */}
              <div className="flex flex-col mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Image <span className="text-meta-1">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setImageUpload(e.target.files[0])}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  required
                />
              </div>
             

              <div className="flex justify-end gap-4.5">
                <button onClick={handleCancel} type="button" className="rounded bg-meta-1 py-2 px-6 text-white">
                  Annuler
                </button>
                <button type="submit" className="rounded bg-primary py-2 px-6 text-white">
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddRoom;
