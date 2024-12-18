import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import ApiManager from "../../api";

const AddEvent = () => {
  const [lien, setLien] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [dateDepart, setDateDepart] = useState(""); // New state for DateDepart
  const [dateFin, setDateFin] = useState(""); // New state for DateFin

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!lien || !imageUpload || !title || !description || !dateDepart || !dateFin) {
      Swal.fire({
        title: "Assurez-vous de remplir tout!",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imageUpload", imageUpload);
    formData.append("lien", lien);
    formData.append("dateDepart", dateDepart); // Append DateDepart
    formData.append("dateFin", dateFin); // Append DateFin

    try {
      const response = await ApiManager.post("/Event/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Event ajouté avec succès!",
          icon: "success",
        });
        navigate("/event-list");
      } else {
        Swal.fire({
          title: "Erreur lors de l'ajout de l'Event!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur réseau!",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2 m-16">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Créer Event</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  {/* Title */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                    Title Event <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le titre"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  {/* Description */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                    Description <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez la description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  {/* Lien */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                    Lien <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le lien"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                    required
                    onChange={(e) => setLien(e.target.value)}
                  />

                  {/* DateDepart */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                    Date de Départ <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                    required
                    onChange={(e) => setDateDepart(e.target.value)}
                  />

                  {/* DateFin */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                    Date de Fin <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                    required
                    onChange={(e) => setDateFin(e.target.value)}
                  />

                  {/* Image */}
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
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

              {/* Buttons */}
              <div className="flex justify-end gap-4.5">
                <Link
                  to="/event-list"
                  className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
