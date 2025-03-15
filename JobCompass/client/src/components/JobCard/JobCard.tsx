import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

import JobCardType from "../../../types/JobCardType";
import "./JobCard.scss";

const backendURL = import.meta.env.VITE_BACKEND_URL;
console.log(backendURL);

function JobCard({ jobId }: { jobId?: string }): JSX.Element {
  // my fnxn will return JSX
  const [job, setJob] = useState<JobCardType | null>(null); // tells TS what data to expect
  const [expandedText, setExpandedText] = useState<Boolean>(false);
  const MAX_LENGTH = 150;

  const { id: urlId } = useParams();
  const id = jobId || urlId; // ID can be from params or from what user clicks on map

  const fetchJob = async (): Promise<void | unknown> => {
    // void means it just completes operation
    // this function is a promise that returns nothing
    try {
      console.log("Attempting to fetch from:", `${backendURL}/jobs/${id}`);
      // TODO: Fetch from id dynamically; not needed currently
      const jobResponse = await axios.get(`${backendURL}/jobs/${id}`); // later switch 1 w/ ${id}
      setJob(jobResponse.data);
    } catch (err: any) {
      setJob(null);
      console.log(err.message);
      return <h1>Could not fetch job!</h1>;
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  // TODO: reload automatically on new job (if user types different id)

  useEffect(() => {
    fetchJob();
  }, [id]);

  // TODO: style to save job appropriately and have it link to user faves
  const saveJob = async () => {
    return <h1>Job saved</h1>;
  };

  console.log(job);

  if (!job) {
    return <h1>Loading Job...</h1>;
  }

  return (
    <div className="jobCard">
      <div className="jobCard__header">
        <Link to={"/"}>
          <img src="/" alt="arrow" /> Go Back
        </Link>
        <h2 className="jobCard__header__title">{job.title}</h2>
        <section className="jobCard__header__title__company">
          <h3 className="jobCard__header__company">{job.company}</h3>
          <img
            src="/"
            className="jobCard__header__logo-placeholder"
            alt="logo"
          />
        </section>
        <div className="jobCard__header__cta">
          {/* <Link to="/jobURL">Apply</Link> */}
          <button onClick={saveJob}> Save job </button>
        </div>
      </div>
      <div className="jobCard__details">
        <h2 className="jobCard__details__heading">Job Details</h2>
        <div className="jobCard__details__type">
          <section className="jobCard__details__type__section">
            <h3 className="jobCard__details__type-title">Job Type</h3>
            <p className="jobCard__details__type-text">{job.type}</p>
          </section>
          <section className="jobCard__details__salary__section">
            <h3 className="jobCard__details__salary-title">Salary</h3>
            <p className="jobCard__details__salary-text">{job.salary_range}</p>
          </section>
          <section className="jobCard__details__date__section">
            <h4 className="jobCard__details__date-title">Date</h4>
            <p className="jobCard__details__date-text">
              {format(new Date(job.created_at), "MMMM d, yyyy")}
            </p>
          </section>
        </div>
      </div>
      <div className="jobCard__skills">
        <h3 className="jobCard__skills__title">Skills</h3>
        <div className="jobCard__skills__list">
          <ul className="jobCard__skills__items">
            {job.skills.map((skill, index) => (
              <li className="jobCard__skills__item" key={index}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="jobCard__description">
        <h3 className="jobCard__description__title">Job Description</h3>
        <p className="jobCard__description__text">
          {expandedText
            ? job.description
            : `${job.description.substring(0, MAX_LENGTH)}...`}
        </p>
        <button
          className="jobCard__description__button"
          onClick={() => setExpandedText(!expandedText)}
        >
          {expandedText ? "Show Less" : "Read More"}
        </button>
        <h3 className="jobCard__description__title">Requirements</h3>
        <p className="jobCard__description__requirements">{job.requirements}</p>
      </div>
    </div>
  );
}

export default JobCard;
