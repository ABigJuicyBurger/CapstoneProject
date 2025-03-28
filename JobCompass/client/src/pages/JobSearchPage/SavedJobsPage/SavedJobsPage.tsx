import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

import JobCardType from "../../../../types/JobCardType";

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
    <div className="page-content">
      {guestUser ? <h1>Guest Saved Jobs</h1> : <h1>User Saved Jobs</h1>}
      {guestUser &&
        savedJobs.map((job) => (
          <Link key={job.id} to={`/job/${job.id}`}>
            <div key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default SavedJobsPage;
