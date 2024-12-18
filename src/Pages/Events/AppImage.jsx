import React, { useState } from 'react';
import ImageCropper from './ImageCropper';
import FileInput from './FileInput';

const AppImage = () => {
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState("choose-img");

    const onImageSelected = (selectedImg) => {
        setImage(selectedImg);
        setCurrentPage("crop-img");
    };

    const onCropDone = (croppedArea) => {
        console.log('Cropped area:', croppedArea);
        console.log('image cropped :', image);
        setCurrentPage('choose-img'); // You can navigate to another page or show the cropped image
    };

    const onCropCancel = () => {
        setCurrentPage('choose-img'); // You can revert to the choose image page
    };

    return (
        <div>
            {currentPage === "choose-img" ? (
                <FileInput onImageSelected={onImageSelected} />
            ) : currentPage === "crop-img" ? (
                <ImageCropper
                    image={image}
                    onCropDone={onCropDone}
                    onCropCancel={onCropCancel}
                />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default AppImage;
