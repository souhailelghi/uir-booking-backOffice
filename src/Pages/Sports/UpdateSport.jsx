import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ApiManager from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

const UpdateSport = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [categorieId, setCategorieId] = useState("");
  const [referenceSport, setReferenceSport] = useState(location.state?.referenceSports || "");
  const [nbPlayer, setNbPlayer] = useState(location.state?.nbPlayers || "");
  const [daysoff, setDaysoff] = useState(location.state?.daysoffs || "");
  const [conditions, setConditions] = useState(location.state?.conditionss || "");
  const [name, setName] = useState(location.state?.names || "");
  const [description, setDescription] = useState(location.state?.descriptions || "");
  const [imageUpload, setImageUpload] = useState(null);
  const [sportCategories, setSportCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch sports categories
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
    if (!name) {
      Swal.fire({
        title: "Assurez-vous de remplir tout!",
        icon: "error",
      });
      return;
    }


    const formData = {
      id,
      categorieId,
      referenceSport,
      nbPlayer,
      daysoff,
      conditions,
      name,
      description,
      imageUpload
    };

    try {
      const response = await ApiManager.put(`/Sports/update`, formData);
      if (response.status === 200) {
        toast.success("Sport mise à jour avec succès!");
        Swal.fire({
          title: "Sport  mis à jour avec succès!",
          icon: "success",
        });
        navigate('/sport-list');
      } else {
        Swal.fire({
          title: "Erreur lors de la mise à jour du Sport !",
          icon: "error",
        });
        toast.error("Erreur lors de la mise à jour de la sport!");
      }
    } catch (error) {
      console.error('Error updating sport:', error);
      toast.error(`Erreur réseau! ${error.message}`);
    }
  };

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2 m-16">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Modifier Sport
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2 mb-4">
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
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Référence</label>
                  <input
                    type="number"
                    placeholder="Référence"
                    value={referenceSport}
                    required
                    onChange={(e) => setReferenceSport(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Nombre de joueurs</label>
                  <input
                    type="number"
                    placeholder="Nombre de joueurs"
                    value={nbPlayer}
                    required
                    onChange={(e) => setNbPlayer(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Jours de repos</label>
                  <input
                    type="number"
                    placeholder="Jours de repos"
                    value={daysoff}
                    required
                    onChange={(e) => setDaysoff(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Conditions</label>
                  <input
                    type="text"
                    placeholder="Conditions"
                    value={conditions}
                    required
                    onChange={(e) => setConditions(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
                <div className="w-full sm:w-1/2 mb-4">
                  <label className="mb-2 block text-black dark:text-white">Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                </div>
              </div>
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
              <div className="flex justify-end gap-4.5 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/sport-list')}
                  className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Mettre à jour
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

export default UpdateSport;
