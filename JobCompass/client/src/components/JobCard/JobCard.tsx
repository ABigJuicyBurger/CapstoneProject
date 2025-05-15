import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS
import ReactMarkdown from 'react-markdown';



import JobNote from "../JobNote/JobNote.tsx";

import JobCardType from "../../../types/JobCardType";
import MapJobCardType from "../../../types/MapJobCardType";

import "./JobCard.scss";

const backendURL = import.meta.env.VITE_BACKEND_URL;
console.log(backendURL);

function JobCard({
  noteState,
  updateNoteVisibility,
  jobId,
  onClose = () => {},
  guestUser,
  updateGuestUser,
}: MapJobCardType): JSX.Element {
  console.log("updateNoteVisibility in JobCard:", typeof updateNoteVisibility);

  // my fnxn will return JSX
  const [job, setJob] = useState<JobCardType | null>(null); // tells TS what data to expect
  const [expandedText, setExpandedText] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [userSavedJobs, setUserSavedJobs] = useState<string[]>([]);
  const [aiChecker, setAiChecker] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<{score: string, analysis: string}|null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const MAX_LENGTH = 150;

  const { id: urlId } = useParams();
  const id = jobId || urlId; // ID can be from params or from what user clicks on map

  const fetchJob = async (): Promise<void | unknown> => {
    // void means it just completes operation
    // this function is a promise that returns nothing
    try {
      console.log(
        "Attempting to fetch from:",
        `${backendURL}/jobs/${id}`
      );
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

  // Check if the user has saved this job when component loads
  useEffect(() => {
    const checkSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Skip if not logged in

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
      } catch (error: any) {
        // Handle 401 errors gracefully - just means user isn't properly authenticated
        if (error.response && error.response.status === 401) {
          console.log("User not authenticated, clearing token");
          localStorage.removeItem("token"); // Clear invalid token
        } else {
          console.error("Error fetching saved jobs:", error);
        }
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
        console.log("Saving job for logged-in user:", job.id);

        // Get current saved jobs
        const response = await axios.get(`${backendURL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User meta response:", response.data);

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
            currentSavedJobs = [];
          }

          // Check if job is already saved
          if (currentSavedJobs.includes(job.id)) {
            setSaveMessage("Job already saved!");
          } else {
            // Add job ID to saved jobs
            const updatedSavedJobs = [...currentSavedJobs, job.id];

            console.log("Updating server with saved jobs:", updatedSavedJobs);
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

            console.log("Server update response:", updateResponse.data);

            // Update local state with the new saved jobs
            setUserSavedJobs(updatedSavedJobs);
            setSaveMessage("Job Saved!");
          }
        }
      } catch (error: any) {
        console.error("Error saving job:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          setSaveMessage("Please log in to save jobs");
        } else {
          setSaveMessage("Failed to save job");
        }
      }
    } else if (guestUser && updateGuestUser) {
      // Guest user flow
      if (guestUser.savedJobs.includes(job.id)) {
        setSaveMessage("Job already saved!");
      } else {
        updateGuestUser(job.id);
        console.log(guestUser);
        setSaveMessage("Job Saved!");
      }
    }

    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  const AIAnalyzer = () => {
    setAiChecker(!aiChecker);

  }

  const handleAnalyzeResume = async () => {
    if (!job?.title || !job.description) return;
    setIsAnalyzing(true);

    const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to analyze your resume");
        setIsAnalyzing(false);

        return;
      }; // Skip if not logged in

      try {
        // get user resume
        const resumeResponse = await axios.get(`${backendURL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resumeResponse.data.resume) {
          alert("Please upload a resume to analyze");
          setIsAnalyzing(false);
          return;
        }

        const resumeText = resumeResponse.data.resume;
        console.log(resumeText);
        console.log('Sending resume path to server:', resumeText);

        const response = await axios.post(`${backendURL}/resumeAI`, {
          jobDescription: job.description,
          resumePath: resumeText,
        },      {
          headers: {
              'Content-Type': 'application/json',
          } 
      });
        console.log(response)
        console.log(response.data)
        setAiAnalysis(response.data);
        setIsAnalyzing(false);
      } catch (error) {
        console.error("Error analyzing resume:", error);
        setIsAnalyzing(false);
      }
  }

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
            <Link to={"/jobs"}>
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
              <button
                onClick={() => console.log("button to apply to job clicked")}
              >
                Apply
              </button>
              <button onClick={(() => AIAnalyzer())}>
                {aiChecker ? "Return to job" : "AI Analyzer"}
              </button>
              {saveMessage && (
                <div className="jobCard__save-message">{saveMessage}</div>
              )}
            </div>
          </div>
          {aiChecker ? (
            <div className="jobCard__ai-analysis_section">
              <h2 className="jobCard__ai-analysis_section__heading">AI Checker</h2>
              
             <button
          onClick={() => handleAnalyzeResume()}
          disabled={isAnalyzing}
          className="analyze-button"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </button>
        
        {aiAnalysis && (
          <div className="jobCard__analysis-results">
               <ReactMarkdown>
            {typeof aiAnalysis === 'object' && aiAnalysis.analysis 
                ? aiAnalysis.analysis 
                : JSON.stringify(aiAnalysis)}
        </ReactMarkdown>
        </div>
        )}
              </div>
           
          ) : (
            <>
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
            <div
              className="jobCard__description__text"
              style={{ whiteSpace: "pre-line" }}
            >
              {expandedText
                ? job.description
                 : `${job.description.substring(0, MAX_LENGTH)}...`}
            </div>
            <button
              className="jobCard__description__button"
              onClick={() => setExpandedText(!expandedText)}
            >
              {expandedText ? "Show Less" : "Read More"}
            </button>
            <h3 className="jobCard__description__title">Requirements</h3>
            <div
              className="jobCard__description__requirements"
              style={{ whiteSpace: "pre-line" }}
            >
              {job.requirements}
            </div>
          </div>
          </>
          )}
        </div>
      )}
    </>
  );
}
export default JobCard;
