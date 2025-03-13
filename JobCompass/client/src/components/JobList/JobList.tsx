import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./JobList.scss";
import JobCardType from "../../../types/JobCardType";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function JobList({ jobBoard }): JSX.Element {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // runtime check, doesn't need a type annotation (no type declared)
  if (!jobBoard) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="job-list">
      <header className="job-list__header">
        <h1 className="job-list__title">List of Jobs</h1>
      </header>
      <div className="job-list__jobs">
        {jobBoard.map((job) => (
          <Link key={job.id} to={`/job/${job.id}`}>
            <div className="job-list__card">
              <section className="job-list__card-header">
                <h1>{job.title}</h1>
                <h2>{job.company}</h2>
                <img src="logo" alt="" />
              </section>
              <section className="job-list__card-content">
                {/* <h3>Longitude: {job.longitude}</h3>
                <h4>Latitude: {job.latitude}</h4> */}
                <h5>Id: {job.id}</h5>
              </section>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default JobList;
