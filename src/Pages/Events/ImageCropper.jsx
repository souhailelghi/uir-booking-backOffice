import React, { useState } from 'react';
import Cropper from "react-easy-crop";

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4 / 3);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (event) => {
        setAspectRatio(Number(event.target.value));
    };

    return (
        <div >
            {/* Cropper Component */}
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
                        height: '400px', // Fixed height for the cropper to ensure space for buttons
                        backgroundColor: '#fff',
                    },
                }}
            />

            {/* Aspect Ratio Radio Buttons */}
            <div  style={{ marginTop: '500px', textAlign: 'center', backgroundColor: '#fff', padding: '10px', zIndex: 1 }}>
            <div >
                <label style={{ display: 'block', marginBottom: '10px' }}>Aspect Ratio:</label>
                <div>
                    <input type="radio" value={1 / 1} name="ratio" onChange={onAspectRatioChange} /> 1:1
                </div>
                <div>
                    <input type="radio" value={5 / 4} name="ratio" onChange={onAspectRatioChange} /> 5:4
                </div>
                <div>
                    <input type="radio" value={4 / 3} name="ratio" onChange={onAspectRatioChange} /> 4:3
                </div>
                <div>
                    <input type="radio" value={3 / 2} name="ratio" onChange={onAspectRatioChange} /> 3:2
                </div>
                <div>
                    <input type="radio" value={5 / 3} name="ratio" onChange={onAspectRatioChange} /> 5:3
                </div>
                <div>
                    <input type="radio" value={16 / 9} name="ratio" onChange={onAspectRatioChange} /> 16:9
                </div>
                <div>
                    <input type="radio" value={3 / 1} name="ratio" onChange={onAspectRatioChange} /> 3:1
                </div>
            </div>

            {/* Buttons */}
            <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 10px',
                position: 'absolute',
                bottom: '20px',
                width: '100%',
                zIndex: 1,
            }}>
                <button
                    onClick={onCropCancel}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 1,
                    }}
                >
                    Cancel
                </button>

                <button
                    onClick={() => {
                        onCropDone(croppedArea); // Pass cropped area
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 1,
                    }}
                >
                    Crop & Apply
                </button>
            </div>
            </div>
        </div>
    );
};

export default ImageCropper;
