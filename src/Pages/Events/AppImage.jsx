import React, { useState, useRef } from 'react';
import Cropper from "react-easy-crop";

const AppImage = ({ onCropDone }) => {
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState("choose-img");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4 / 3);
    const inputRef = useRef();
  
    const onImageSelected = (selectedImg) => {
      setImage(selectedImg);
      setCurrentPage("crop-img");
    };
  
    const handleOnChange = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
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
          resolve(blob);
        }, "image/jpeg");
      });
    };
  
    const handleCropDone = async () => {
   //add logic for adding this image cropped to upload image in component AddEvent

    };
  
    return (
      <div>
        {currentPage === "choose-img" ? (
          <div>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleOnChange}
              style={{ display: "none" }}
            />
            <button onClick={() => inputRef.current.click()}>Choose Image</button>
          </div>
        ) : (
          <div>
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
                    width: '100%',
                    height: '400px', 
                    backgroundColor: '#fff',
                },
            }}
            />
            <button style={{ marginTop: '500px', textAlign: 'center', backgroundColor: '#ccc', padding: '10px', zIndex: 1 }} onClick={() => setCurrentPage("choose-img")}>Cancel</button>
            <button style={{ marginTop: '500px', textAlign: 'center', backgroundColor: '#bbb', padding: '10px', zIndex: 1 }} onClick={handleCropDone}>Done</button>
          </div>
        )}
      </div>
    );
  };
  
  export default AppImage;
  