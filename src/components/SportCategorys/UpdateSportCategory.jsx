import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiManager from "../../api";

const UpdateSportCategory = () => {
  const { id } = useParams();
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSportCategoryById = async () => {
      if (!id) return;

      try {
        const response = await ApiManager.get(`/SportCategorys/${id}`);
        const { name } = response.data;
        const { image } = response.data;
        setLastName(name);
        setImage(image);

        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching Sport Category:", error);
        Swal.fire({
          title: "Erreur lors de la récupération du Sport Category",
          text: error.message,
          icon: "error",
        });
      }
    };

    fetchSportCategoryById();
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!lastName) {
      Swal.fire({
        title: "Assurez-vous de remplir tout!",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", lastName);
    if (imageUpload) {
      formData.append("imageUpload", imageUpload);
    }

    try {
      const response = await ApiManager.put(
        `/SportCategorys/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Sport Category mis à jour avec succès!",
          icon: "success",
        });
        navigate("/SportCategorys");
      } else {
        Swal.fire({
          title: "Erreur lors de la mise à jour du Sport Category!",
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
            <h3 className="font-medium text-black dark:text-white">
              Modifier Sport 
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
                <div className="w-full sm:w-1/2">
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                  Nom du sport<span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Entrez le nom de la catégorie"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="mt-8 mb-2.5 block text-black dark:text-white">
                  Image du sport<span className="text-meta-1">*</span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageUpload(e.target.files[0]);
                      }
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  />
                  {image && (
                    <img
                      src={
                        imageUpload
                          ? URL.createObjectURL(imageUpload)
                          : image.startsWith("data:")
                          ? image
                          : `data:image/png;base64,${image}`
                      }
                      alt="Sport"
                      className="w-24 h-24 object-cover rounded-md mb-2"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4.5">
                <Link
                  to="/SportCategorys"
                  className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Annuler
                </Link>
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
    </div>
  );
};

export default UpdateSportCategory;
