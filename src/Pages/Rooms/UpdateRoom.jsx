import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiManager from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateRoom = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomName, setRoomName] = useState('');
  const [categorieId, setCategorieId] = useState("");
  const [referenceSport, setReferenceSport] = useState("");
  const [nbPlayer, setNbPlayer] = useState("");
  const [daysoff, setDaysoff] = useState("");
  const [conditions, setConditions] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await ApiManager.get(`/Sports/${id}`);
        if (response.status === 200) {
          const roomData = response.data;
          setRoomType(roomData.roomType);
          setCapacity(roomData.capacity);
          setRoomName(roomData.roomName);
        } else {
          toast.error('Erreur lors de la récupération de la salle.');
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        toast.error('Erreur lors de la récupération de la salle.');
      }
    };
    fetchRoom();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!roomType || !capacity || !roomName) {
      toast.error("Assurez-vous de remplir tout!");
      return;
    }

    const formData = {
      id: id,
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
      const response = await ApiManager.put(`/Sports/update`, formData);
      if (response.status === 200) {
        toast.success("Salle mise à jour avec succès!");
        navigate('/room-list');
      } else {
        toast.error("Erreur lors de la mise à jour de la salle!");
      }
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error(`Erreur réseau! ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate('/room-list');
  };

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2 m-16">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Modifier Salle
            </h3>
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
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <input type="number" placeholder="Référence" required onChange={(e) => setReferenceSport(e.target.value)} />
                <input type="number" placeholder="Nombre de joueurs" required onChange={(e) => setNbPlayer(e.target.value)} />
                <input type="number" placeholder="Jours de repos" required onChange={(e) => setDaysoff(e.target.value)} />
                <input type="text" placeholder="Conditions" required onChange={(e) => setConditions(e.target.value)} />
                <input type="text" placeholder="Nom" required onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} />

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
              </div>
              {/* <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Type de salle <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  >
                    <option value="" disabled>
                      Sélectionnez le type de salle
                    </option>
                    <option value={0}>Salle normale</option>
                    <option value={1}>Salle de pratique</option>
                  </select>
                </div>
              </div> */}
              {/* <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Capacité <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={capacity}
                    placeholder="Entrez la capacité"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
              </div> */}
              {/* <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nom de la salle <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    placeholder="Entrez le nom de la salle"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
              </div> */}










              
              <div className="flex justify-end gap-4.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Annuler
                </button>
                <button
                  type='submit'
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

export default UpdateRoom;
