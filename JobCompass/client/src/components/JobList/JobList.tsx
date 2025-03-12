import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./JobList.scss";
import JobCardType from "../../../types/JobCardType";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function JobList(): JSX.Element {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [jobBoard, setJobBoard] = useState<JobCardType[] | null>([]); // expecting array of jobs similar to JobCardType

  const fetchAllJobs = async (): Promise<void | JSX.Element> => {
    try {
      const jobListResponse = await axios.get(`${backendURL}/jobs`);
      console.log(jobListResponse.data);
      setJobBoard(jobListResponse.data);
    } catch (error: any) {
      console.log(error.message);
      setJobBoard(null);
    }
  };

  // load all jobs
  useEffect(() => {
    fetchAllJobs();
  }, []);

  // runtime check, doesn't need a type annotation (no type declared)
  if (!jobBoard) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {jobBoard.map((job) => (
        <Link key={job.id} to={`/job/${job.id}`}>
          <div className="jobCard">
            <h1>Title: {job.title}</h1>
            <h2>Company: {job.company}</h2>
            <h3>Longitude: {job.longitude}</h3>
            <h4>Latitude: {job.latitude}</h4>
            <h5>Id: {job.id}</h5>
          </div>
        </Link>
      ))}
    </>
  );
}

export default JobList;
