import axios from "axios";
import { useState, useEffect } from "react";

function JobList() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [jobBoard, setJobBoard] = useState([]);

  const fetchAllJobs = async () => {
    try {
      const jobListResponse = await axios.get(`${backendURL}/jobs`);
      console.log(jobListResponse.data);
      setJobBoard(jobListResponse.data);
    } catch (error) {
      console.log(error.message);
      return <h1>Could not get jobs! Try again later</h1>;
    }
  };

  // load all jobs
  useEffect(() => {
    fetchAllJobs();
  }, []);

  if (!jobBoard) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div>This is the list of jobs. will connect to map ASAP</div>
      {jobBoard.map((job) => (
        <div key={job.id}>
          <h1>Title: {job.title}</h1>
          <h2>Company: {job.company}</h2>
          <h3>Longitude: {job.longitude}</h3>
          <h4>Latitude: {job.latitude}</h4>
          <h5>Id: {job.id}</h5>
        </div>
      ))}
    </>
  );
}

export default JobList;
