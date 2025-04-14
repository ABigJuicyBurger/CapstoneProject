import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import JobCardType from "../../../../types/JobCardType";
import "../../../components/SavedJobs/savedjobs.scss";

function SavedJobsPage({
  guestUser,
  jobs,
}: {
  guestUser: { name: string; id: string; savedJobs: string[] } | null;
  jobs: JobCardType[];
}) {
  const [userSavedJobs, setUserSavedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Fetch user's saved jobs if they're logged in
  useEffect(() => {
    const fetchUserSavedJobs = async () => {
      try {
        setLoading(true);

        if (isLoggedIn) {
          // Logged-in user flow
          try {
            const response = await axios.get(`${API_URL}/user/meta`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data && response.data.savedjobs) {
              try {
                // Handle both string and array formats of saved jobs
                let parsedSavedJobs = [];

                if (typeof response.data.savedjobs === "string") {
                  // Handle string format (from database)
                  const savedJobsData =
                    response.data.savedjobs.trim() === ""
                      ? "[]"
                      : response.data.savedjobs;
                  parsedSavedJobs = JSON.parse(savedJobsData);
                } else if (Array.isArray(response.data.savedjobs)) {
                  // Handle array format (already parsed by server)
                  parsedSavedJobs = response.data.savedjobs;
                }

                if (!Array.isArray(parsedSavedJobs)) parsedSavedJobs = [];

                setUserSavedJobs(parsedSavedJobs);
                console.log("Logged-in user saved jobs:", parsedSavedJobs);
              } catch (e) {
                console.error("Error parsing saved jobs:", e);
                setUserSavedJobs([]);
              }
            }
          } catch (error) {
            console.error("Error fetching user saved jobs:", error);
            setError("Failed to load saved jobs");
          }
        } else {
          // Guest user flow - use saved jobs from props
          if (guestUser && guestUser.savedJobs) {
            setUserSavedJobs(guestUser.savedJobs);
            console.log("Guest user saved jobs:", guestUser.savedJobs);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in fetchUserSavedJobs:", error);
        setError("An error occurred while loading saved jobs");
        setLoading(false);
      }
    };

    fetchUserSavedJobs();
  }, [isLoggedIn, guestUser]);

  // Filter jobs based on saved job IDs
  useEffect(() => {
    if (jobs && userSavedJobs) {
      const filtered = jobs.filter((job) => userSavedJobs.includes(job.id));
      console.log("Filtered saved jobs:", filtered.length);
      setSavedJobs(filtered);
    }
  }, [jobs, userSavedJobs]);

  // Remove a job from saved jobs
  const handleRemoveJob = async (jobId: string) => {
    try {
      if (!isLoggedIn && guestUser) {
        // Update for guest user (client-side only)
        const updatedSavedJobs = guestUser.savedJobs.filter(
          (id) => id !== jobId
        );

        // Update session storage
        const updatedGuestUser = {
          ...guestUser,
          savedJobs: updatedSavedJobs,
        };

        sessionStorage.setItem("guestUser", JSON.stringify(updatedGuestUser));

        // Update local state
        setUserSavedJobs(updatedSavedJobs);
      } else if (isLoggedIn) {
        // Update for logged-in user (server-side)
        setLoading(true);

        // Get current saved jobs
        const response = await axios.get(`${API_URL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.savedjobs) {
          try {
            // Handle both string and array formats of saved jobs
            let currentSavedJobs = [];

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

            const updatedSavedJobs = currentSavedJobs.filter(
              (id: string) => id !== jobId
            );

            // Update the server
            await axios.put(
              `${API_URL}/user/meta`,
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

            // Update local state
            setUserSavedJobs(updatedSavedJobs);
            console.log("Updated saved jobs after removal:", updatedSavedJobs);
          } catch (e) {
            console.error("Error updating saved jobs:", e);
            setError("Failed to remove job");
          }
        }

        setLoading(false);
      }
    } catch (error) {
      console.error("Error removing job:", error);
      setError("Failed to remove job");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content saved-jobs__container">
        <div className="saved-jobs__loading">
          <p>Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content saved-jobs__container">
      <h1 className="saved-jobs__title">
        {isLoggedIn ? "Your Saved Jobs" : "Guest Saved Jobs"}
      </h1>

      {error && <div className="saved-jobs__error">{error}</div>}

      {savedJobs.length > 0 ? (
        <div className="saved-jobs__list">
          {savedJobs.map((job) => (
            <div className="saved-jobs__item-container" key={job.id}>
              <Link className="saved-jobs__item" to={`/job/${job.id}`}>
                <div className="saved-jobs__content">
                  <h3 className="saved-jobs__job-title">{job.title}</h3>
                  <p className="saved-jobs__company">{job.company}</p>
                  <div className="saved-jobs__details">
                    <span>{job.type}</span>
                  </div>
                </div>
              </Link>
              <button
                className="saved-jobs__remove-btn"
                onClick={() => handleRemoveJob(job.id)}
                aria-label="Remove job"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="saved-jobs__empty">
          <h2 className="saved-jobs__empty-title">No saved jobs yet</h2>
          <p className="saved-jobs__empty-message">
            Start saving jobs you're interested in to keep track of them.
          </p>
          <Link to="/jobs" className="saved-jobs__empty-action">
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}

export default SavedJobsPage;
