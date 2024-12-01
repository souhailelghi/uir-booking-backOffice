import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiManager from "../../api";

const AddSport = () => {
  
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
        const response = await ApiManager.get("/SportCategorys/list");
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
      const response = await ApiManager.post("/Sports/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        Swal.fire({
          title: " Sport  ajouté avec succès!",
          icon: "success",
        });
        toast.success("Sport ajouté avec succès!");
        navigate("/sport-list");
      } else {
        toast.error("Erreur lors de l'ajout du sport!");
      }
    } catch (error) {
      toast.error(`Erreur réseau! ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/sport-list");
  };

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Créer Terrain</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Sport<span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={categorieId}
                    onChange={(e) => setCategorieId(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="" disabled>
                      Sélectionnez une Sport
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
             
                {/* <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Référence" required onChange={(e) => setReferenceSport(e.target.value)} /> <br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Nombre de joueurs" required onChange={(e) => setNbPlayer(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="number" placeholder="Jours de repos (le délai d’attente avant de pouvoir effectuer une nouvelle réservation.)" required onChange={(e) => setDaysoff(e.target.value)} /> <br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Conditions" required onChange={(e) => setConditions(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Nom" required onChange={(e) => setName(e.target.value)} /><br /><br />
                <input className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter" type="text" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} /> <br /> */}
<div className="form-container">
  <div className="relative w-full mb-4">
    <label
      htmlFor="referenceSport"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Référence
    </label>
    <input
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      type="number"
      id="referenceSport"
      placeholder=""
      required
      onChange={(e) => setReferenceSport(e.target.value)}
    />
  </div>

  <div className="relative w-full mb-4">
    <label
      htmlFor="nbPlayer"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Nombre de joueurs
    </label>
    <input
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      type="number"
      id="nbPlayer"
      placeholder=""
      required
      onChange={(e) => setNbPlayer(e.target.value)}
    />
  </div>

  <div className="relative w-full mb-4">
    <label
      htmlFor="daysoff"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Jours de repos (le délai d’attente avant de pouvoir effectuer une nouvelle réservation.)
    </label>
    <input
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      type="number"
      id="daysoff"
      placeholder=""
      required
      onChange={(e) => setDaysoff(e.target.value)}
    />
  </div>

  <div className="relative w-full mb-4">
    <label
      htmlFor="conditions"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Conditions
    </label>
    <textarea
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      id="conditions"
      rows="4"
      placeholder=""
      required
      onChange={(e) => setConditions(e.target.value)}
    ></textarea>
  </div>

  <div className="relative w-full mb-4">
    <label
      htmlFor="name"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Nom
    </label>
    <input
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      type="text"
      id="name"
      placeholder=""
      required
      onChange={(e) => setName(e.target.value)}
    />
  </div>

  <div className="relative w-full mb-4">
    <label
      htmlFor="description"
      className="block text-[#424242] text-[16px] mb-2 transition-all peer-placeholder-shown:text-[#9E9E9E] peer-focus:text-[#424242]"
    >
      Description
    </label>
    <textarea
      className="peer w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition disabled:cursor-default disabled:bg-whiter"
      id="description"
      rows="4"
      placeholder=""
      required
      onChange={(e) => setDescription(e.target.value)}
    ></textarea>
  </div>
</div>

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

export default AddSport;
