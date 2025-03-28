import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

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

  const savedJobs = guestUser
    ? jobs.filter((job) => guestUser?.savedJobs.includes(job.id))
    : [];

  useEffect(() => {
    // load guest saved jobs (maybe local storage)
    if (userType === "guest") {
      console.log("Hi guest!");
    } else if (userType === "user" && id) {
      // load user saved jobs
      console.log("Hi user!");
    }
  });

  return (
    <div className="page-content saved-jobs__container">
      <h1 className="saved-jobs__title">
        {guestUser ? "Guest Saved Jobs" : "User Saved Jobs"}
      </h1>

      {savedJobs.length > 0 ? (
        <div className="saved-jobs__list">
          {savedJobs.map((job) => (
            <Link
              className="saved-jobs__item"
              key={job.id}
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
