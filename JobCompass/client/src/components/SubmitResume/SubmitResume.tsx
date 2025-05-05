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

    if (selectedFile) {
      if (selectedFile.size > 5000000) {
        alert("What a large resume! Try to reduce the size");
        return;
      }
      formData.append("resume", selectedFile);
    }
    console.log(selectedFile);
    try {
      console.log("Uploading file:", selectedFile?.name);
      const response = await axios.put(`${API_URL}/user/meta`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }); // add headers to the request

      if (response.data) {
        setUserMeta(response.data);
        setSelectedFile(null);
        alert("File uploaded successfully!"); // fix as window.alert is oldy, switch to a component library
        // from a css framework
        // tailwind just makes css faster
      }
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
