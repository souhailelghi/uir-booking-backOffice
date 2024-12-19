import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import ApiManager from "../../api";

const AddEvent = () => {
  const [lien, setLien] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [fileLabel, setFileLabel] = useState("No file selected"); // Custom label
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [dateDepart, setDateDepart] = useState("");
  const [dateFin, setDateFin] = useState("");

  const inputRef = useRef();
  const navigate = useNavigate();

  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setCurrentPage("crop-img");
  };

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileLabel(file.name); // Update label with file name
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onImageSelected(reader.result);
      };
    }
  };

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    const canvas = document.createElement("canvas");
    const imageElement = document.createElement("img");
    imageElement.src = image;

    await new Promise((resolve) => {
      imageElement.onload = resolve;
    });

    const ctx = canvas.getContext("2d");
    const { width, height, x, y } = croppedArea;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result); // Return the data URL
        };
      }, "image/jpeg");
    });
  };

  const handleCropDone = async () => {
    try {
      const croppedDataURL = await getCroppedImage();
      if (croppedDataURL) {
        setImage(croppedDataURL);
        setCurrentPage("choose-img");
      } else {
        console.error("Failed to generate cropped image.");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!lien || !image || !title || !description || !dateDepart || !dateFin) {
      Swal.fire({
        title: "Assurez-vous de remplir tout!",
        icon: "error",
      });
      return;
    }

    try {
      const base64Image = image.split(",")[1];
      const byteCharacters = atob(base64Image);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const imageBlob = new Blob([new Uint8Array(byteNumbers)], {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("imageUpload", imageBlob, "cropped-image.jpg");
      formData.append("lien", lien);
      formData.append("dateDepart", dateDepart);
      formData.append("dateFin", dateFin);

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


  
  const onAspectRatioChange = (event) => {
    setAspectRatio(Number(event.target.value));
};

  return (
    <div className="m-0 mt-6 gap-9 sm:grid-cols-2 m-16">
      <div className="flex flex-col gap-9">
        {currentPage === "choose-img" ? (
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
                    value={title} 
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
                    value={description}
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
                    value={lien}
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
                    value={dateDepart}
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
                    value={dateFin}
                    required
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                <label className="mt-8 mb-2.5 block text-black dark:text-white">
                  Image <span className="text-meta-1">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleOnChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="w-full cursor-pointer rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  >
                    {fileLabel}
                  </label>
                </div>
          
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
              </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6 mb-4.5">
          <div className="w-full sm:w-1/2 relative">
            {/* Centered Cropper */}
            <div className="flex justify-center items-center h-full">
              <Cropper
                image={image}
                aspect={aspectRatio}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: "1050px",
                    height: "400px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  },
                }}
              />
            </div>
        
            {/* Action Buttons */}
            <div className="flex justify-end gap-6 mt-10"  style={{ marginTop: '50px', textAlign: 'center', padding: '10px', zIndex: 1 }}>
              <button
                onClick={() => setCurrentPage("choose-img")}
                className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={handleCropDone}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Done
              </button>
            </div>
        
            {/* Aspect Ratio Options */}
            <div className="mt-6 p-4 rounded bg-primary-light shadow-md">
              <label className="block font-semibold mb-4">Aspect Ratio:</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={1 / 1}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  1:1
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={5 / 4}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  5:4
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={4 / 3}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  4:3
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={3 / 2}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  3:2
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={5 / 3}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  5:3
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={16 / 9}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  16:9
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={3 / 1}
                    name="ratio"
                    onChange={onAspectRatioChange}
                    className="mr-2"
                  />
                  3:1
                </label>
              </div>
            </div>
          </div>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default AddEvent;
