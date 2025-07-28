import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash, FaPlus } from "react-icons/fa";

const ImageUploader = (props) => {
    const [images, setImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    const handleSetPrimary = (index) => {
        setPrimaryImageIndex(index);
    };
    const onDrop = (acceptedFiles) => {
        if (images.length + acceptedFiles.length > 5) {
            props.alert({ type: 'error', message: 'You can only upload up to 5 images. ', show: true });
            return;
        }

        const newImages = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        setImages((prevImages) => [...prevImages, ...newImages]);
    };


    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    
        // If the deleted image was the primary, update the primary index
        if (index === primaryImageIndex) {
            setPrimaryImageIndex(updatedImages.length > 0 ? 0 : null);
        } else if (index < primaryImageIndex) {
            setPrimaryImageIndex((prev) => prev - 1);
        }
    };
    

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: true,
        maxSize: 5 * 1024 * 1024, // 5MB per image
    });

    return (
        <div className={`image-uploader ${images.length > 0 ? "column-layout" : "row-layout"}`}>
            {/* Render Uploaded Images (Only Primary Image) */}
            {images.length > 0 &&  primaryImageIndex !== null && (
                <div className="image-preview">
                    <div className="image-box">
                        <img src={images[primaryImageIndex]?.preview} alt="Uploaded" className="image" />

                        {/* "Primary" label on first image */}
                        <span className="primary-label">Primary</span>

                        {/* Delete button */}
                        <button onClick={() => removeImage(primaryImageIndex)} className="delete-button">
                            <FaTrash />
                        </button>
                    </div>
                </div>
            )}


            {/* Show upload box only if no images are uploaded */}
            {images.length === 0 && (
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p className="Dragheadingstyle">
                        Drag & Drop (or)
                         <strong className="click-text">Click</strong>
                    </p>
                    {/* <span>You can  upload up to 5 images.</span> */}

                </div>
            )}

            {/* Plus button for adding more images */}
            {images.length > 0 && (
                <div className="AddedImageContainer">
                    <div className="added-image-box-main" style={{ width: "80%" }}>
                        {images.length > 0 && (
                            <div className="added-image-preview">
                                {images.map((image, index) => (
                                    <div key={index} className="added-image-box" onClick={() => handleSetPrimary(index)}>
                                        <img src={image.preview} alt="Uploaded" className="Addedimage" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div {...getRootProps()} className="add-image-box">
                        <input {...getInputProps()} />
                        <FaPlus size={24} color="#408dfb" />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImageUploader;
