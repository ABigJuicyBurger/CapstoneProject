import { Link, useParams, useNavigate } from "react-router-dom";
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
  const { userType, id } = useParams();
  const navigate = useNavigate();
  const [userSavedJobs, setUserSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const API_URL = "http://localhost:8080";

  // Fetch user's saved jobs if they're logged in
  useEffect(() => {
    // Only try to fetch if we're viewing a logged-in user's saved jobs
    if (userType === "user" && id) {
      const fetchUserSavedJobs = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          
          // If no token, redirect to guest view
          if (!token) {
            navigate("/guest/savedJobs");
            return;
          }
          
          const response = await axios.get(`${API_URL}/user/meta`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.savedjobs) {
            try {
              const savedJobsData = JSON.parse(response.data.savedjobs);
              setUserSavedJobs(Array.isArray(savedJobsData) ? savedJobsData : []);
            } catch (e) {
              console.error("Error parsing saved jobs:", e);
              setUserSavedJobs([]);
            }
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user saved jobs:", error);
          setError("Failed to load saved jobs");
          setLoading(false);
        }
      };

      fetchUserSavedJobs();
    }
  }, [userType, id, navigate]);

  // Determine which saved jobs to display based on userType
  const savedJobsToDisplay = (() => {
    if (userType === "guest" && guestUser) {
      // Use guest user's saved jobs
      return jobs.filter((job) => guestUser.savedJobs.includes(job.id));
    } else if (userType === "user" && id) {
      // Use logged-in user's saved jobs
      return jobs.filter((job) => userSavedJobs.includes(job.id));
    }
    return [];
  })();

  // Remove a job from saved jobs
  const handleRemoveJob = async (jobId: string) => {
    try {
      if (userType === "guest" && guestUser) {
        // Update for guest user (client-side only)
        const updatedSavedJobs = guestUser.savedJobs.filter(id => id !== jobId);
        
        // Update session storage
        const updatedGuestUser = {
          ...guestUser,
          savedJobs: updatedSavedJobs
        };
        
        sessionStorage.setItem("guestUser", JSON.stringify(updatedGuestUser));
        
        // Force a refresh of the page to update the UI
        window.location.reload();
      } else if (userType === "user") {
        // Update for logged-in user (server-side)
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          return;
        }
        
        // Get current saved jobs
        const response = await axios.get(`${API_URL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.savedjobs) {
          try {
            // Parse saved jobs, remove the job, and update
            let currentSavedJobs = JSON.parse(response.data.savedjobs);
            if (!Array.isArray(currentSavedJobs)) currentSavedJobs = [];
            
            const updatedSavedJobs = currentSavedJobs.filter((id: string) => id !== jobId);
            
            // Update the server
            await axios.put(`${API_URL}/user/meta`, {
              savedjobs: JSON.stringify(updatedSavedJobs)
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            // Update local state
            setUserSavedJobs(updatedSavedJobs);
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
        {userType === "guest" ? "Guest Saved Jobs" : "Your Saved Jobs"}
      </h1>
      
      {error && <div className="saved-jobs__error">{error}</div>}

      {savedJobsToDisplay.length > 0 ? (
        <div className="saved-jobs__list">
          {savedJobsToDisplay.map((job) => (
            <div className="saved-jobs__item-container" key={job.id}>
              <Link
                className="saved-jobs__item"
                to={`/job/${job.id}`}
              >
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
