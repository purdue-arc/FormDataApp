import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const FileUploadComponent = ({ color = "blue" }) => {
    const fileInputRef = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        return () => {
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);

    const openFileExplorer = () => {
        console.log("Button clicked");
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event) => {
        console.log("File input changed");
        const file = event.target.files && event.target.files[0];

        if (!file) return;

        const fileType = file.type;
        console.log("Selected file type:", fileType);

        if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
            const fileURL = URL.createObjectURL(file);
            console.log("Generated file URL:", fileURL);
            setPreviewURL(fileURL);
            setFileType(fileType);
        } else {
            alert("Please upload a valid image or video file.");
            setPreviewURL(null);
            setFileType(null);
        }
    };

    return (
        <div>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{display: "none"}}
                onChange={handleFileSelect}
                accept="image/*,video/*"
            />

            {/* Button to open file explorer */}
            <motion.button
                type="button"
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                onClick={openFileExplorer}
                style={{
                    backgroundColor: color,
                    color: "white", // Set text color to white
                    borderRadius: "8px", // Adjust for rounded edges
                    padding: "10px 20px", // Add some padding for better appearance
                    border: "none", // Remove default button border
                    cursor: "pointer" // Ensure it's clickable
                }}
            >
                Add Content
            </motion.button>

            {/* Preview Section */}
            {previewURL && fileType && (
                <div style={{width: "200px", height: "200px", overflow: "hidden"}}>
                    {/* Conditionally render image or video based on the file type */}
                    {fileType.startsWith("image/") ? (
                        <img
                            src={previewURL}
                            alt="Preview"
                            style={{width: "100%", height: "100%", objectFit: "contain"}}
                        />
                    ) : fileType.startsWith("video/") ? (
                        <video
                            src={previewURL}
                            controls
                            style={{width: "100%", height: "100%", objectFit: "contain"}}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default FileUploadComponent;