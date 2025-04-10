import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

import JobNote from "../JobNote/JobNote.tsx";

import JobCardType from "../../../types/JobCardType.ts";
import MapJobCardType from "../../../types/MapJobCardType.ts";

import "../../components/JobCard/JobCard.scss";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function JobCard({
  noteState,
  updateNoteVisibility,
  jobId,
  onClose = () => {},
  guestUser,
  updateGuestUser,
}: MapJobCardType): JSX.Element {
  // my fnxn will return JSX
  const [job, setJob] = useState<JobCardType | null>(null); // tells TS what data to expect
  const [expandedText, setExpandedText] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [userSavedJobs, setUserSavedJobs] = useState<string[]>([]);
  const MAX_LENGTH = 150;

  const { id: urlId } = useParams();
  const id = jobId || urlId; // ID can be from params or from what user clicks on map

  const fetchJob = async (): Promise<void | unknown> => {
    // void means it just completes operation
    // this function is a promise that returns nothing
    try {
      const jobResponse = await axios.get(`${backendURL}/jobs/${id}`);
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

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${backendURL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.savedjobs) {
          let currentSavedJobs = [];

          // Parse current saved jobs, handling both string and array formats
          try {
            if (typeof response.data.savedjobs === "string") {
              // Handle string format (from database)
              const savedJobsData =
                response.data.savedjobs.trim() === ""
                  ? "[]"
                  : response.data.savedjobs;
              currentSavedJobs = JSON.parse(savedJobsData);
            } else if (Array.isArray(response.data.savedjobs)) {
              // Handle array format (already parsed by server)
              currentSavedJobs = response.data.savedjobs;
            }

            if (!Array.isArray(currentSavedJobs)) currentSavedJobs = [];
          } catch (e) {
            console.error("Error parsing saved jobs:", e);
          }

          setUserSavedJobs(currentSavedJobs);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    checkSavedJobs();
  }, []);

  const saveJob = async () => {
    if (!job) return;

    // Check if we have a token (logged-in user)
    const token = localStorage.getItem("token");

    if (token) {
      // Logged-in user flow
      try {
        // Get current saved jobs
        const response = await axios.get(`${backendURL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.savedjobs) {
          let currentSavedJobs = [];

          // Parse current saved jobs, handling empty strings and invalid JSON
          try {
            if (typeof response.data.savedjobs === "string") {
              // Handle string format (from database)
              const savedJobsData =
                response.data.savedjobs.trim() === ""
                  ? "[]"
                  : response.data.savedjobs;
              currentSavedJobs = JSON.parse(savedJobsData);
            } else if (Array.isArray(response.data.savedjobs)) {
              // Handle array format (already parsed by server)
              currentSavedJobs = response.data.savedjobs;
            }

            if (!Array.isArray(currentSavedJobs)) currentSavedJobs = [];
          } catch (e) {
            console.error("Error parsing saved jobs:", e);
            currentSavedJobs = [];
          }

          // Check if job is already saved
          if (currentSavedJobs.includes(job.id)) {
            setSaveMessage("Job already saved!");
          } else {
            // Add job ID to saved jobs
            const updatedSavedJobs = [...currentSavedJobs, job.id];

            // Update the server
            const updateResponse = await axios.put(
              `${backendURL}/user/meta`,
              {
                savedjobs: JSON.stringify(updatedSavedJobs),
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            setUserSavedJobs(updatedSavedJobs);
            setSaveMessage("Job Saved!");
          }
        }
      } catch (error) {
        console.error("Error saving job:", error);
        setSaveMessage("Failed to save job");
      }
    } else if (guestUser && updateGuestUser) {
      // Guest user flow
      if (guestUser.savedJobs.includes(job.id)) {
        setSaveMessage("Job already saved!");
      } else {
        updateGuestUser(job.id);
        setSaveMessage("Job Saved!");
      }
    }

    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  if (!job) {
    return <h1>Loading Job...</h1>;
  }

  return (
    <>
      {noteState ? (
        // anyitme on click maybe link or nav; later problem
        <JobNote updateNoteVisibility={updateNoteVisibility} />
      ) : (
        <div className="jobCard">
          <div className="jobCard__header">
            <Link to={-1 as any}>
              <img
                className="jobCard__header__goBack"
                src="/assets/Icons/arrow-right-solid.svg"
                alt="arrow"
                onClick={() => onClose()}
              />
            </Link>
            <h2 className="jobCard__header__title">{job.title}</h2>
            <section className="jobCard__header__title__company">
              <h3 className="jobCard__header__company">{job.company}</h3>
              <img
                src="/assets/Logo/genericlogo.svg"
                className="jobCard__header__logo-placeholder"
                alt="logo"
              />
            </section>
            <div className="jobCard__header__cta">
              <button onClick={saveJob}>
                {localStorage.getItem("token")
                  ? userSavedJobs.includes(job.id)
                    ? "Job Saved"
                    : "Save Job"
                  : guestUser?.savedJobs.includes(job.id)
                  ? "Job Saved"
                  : "Save Job"}
              </button>
              <button onClick={() => updateNoteVisibility?.()}>
                View Note
              </button>
              {saveMessage && (
                <div className="jobCard__save-message">{saveMessage}</div>
              )}
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
                <p className="jobCard__details__salary-text">
                  {job.salary_range}
                </p>
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
            <p className="jobCard__description__requirements">
              {job.requirements}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
export default JobCard;
