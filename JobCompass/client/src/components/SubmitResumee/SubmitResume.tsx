import axios from "axios";
import React, { useState } from "react";

const SubmitResume = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  }; // handle file update

  const onFileUpload = () => {
    const formData = new FormData();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    if (selectedFile) {
      if (selectedFile.size > 5000000) {
        alert("What a large resume! Try to reduce the size");
        return;
      }
      formData.append("Resume", selectedFile, selectedFile.name);
    }
    console.log(selectedFile);
    try {
      axios.post("", formData);
    } catch (err) {
      console.error(err);
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
          <h4>Upload your resume here</h4>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={onFileChange} />
        <button
          onClick={onFileUpload}
          className="profile-resume__upload-button"
        >
          Upload Resume
        </button>
      </div>
      {fileData()}
    </div>
  );
};

export default SubmitResume;
