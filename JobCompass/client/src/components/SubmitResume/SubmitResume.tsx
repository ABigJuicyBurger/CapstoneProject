import axios from "axios";
import React, { useState } from "react";

type UserMetaData = {
  id: number;
  user_id: number;
  bio: string;
  resume: string;
  savedjobs: string | string[]; // Update the type of savedjobs to string | string[]
};

const SubmitResume = ({
  setUserMeta,
}: {
  setUserMeta: React.Dispatch<React.SetStateAction<UserMetaData | null>>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  }; // handle file update

  const onFileUpload = async () => {
    const formData = new FormData();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please upload a valid file type (PDF or Word document)');
        return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
    }

    formData.append("resume", selectedFile, selectedFile.name);

    try {
        const response = await axios.put(
            `${API_URL}/user/meta`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        setUserMeta((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            resume: response.data.resume
          }
        })
        alert("Resume uploaded successfully!");

    } catch (error: any) {
        console.error("Upload error:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
            alert(`Upload failed: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            alert("No response from server. Please try again.");
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
            alert(`Upload failed: ${error.message}`);
        }
    }
};

  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>
            Last modified: {new Date(selectedFile.lastModified).toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          {/* <h4>Upload your resume here</h4> */}
        </div>
      );
    }
  };

  return (
    <>
      <div className="profile-resume__div">
        <input
          className="profile-resume__input"
          type="file"
          onChange={onFileChange}
        />
        <button
          onClick={onFileUpload}
          className="profile-resume__upload-button"
        >
          Upload Resume
        </button>
      </div>
      {fileData()}
    </>
  );
};
export default SubmitResume;
