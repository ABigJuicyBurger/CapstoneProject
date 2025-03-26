import { useParams } from "react-router-dom";
import { useEffect } from "react";

function SavedJobsPage({
  guestUser,
}: {
  guestUser: { name: string; id: string; savedJobs: any[] } | null;
}) {
  const { userType, id } = useParams();

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
    </div>
  );
}

export default SavedJobsPage;
