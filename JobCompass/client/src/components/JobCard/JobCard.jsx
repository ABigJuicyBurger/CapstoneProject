import { useState, useEffect } from "react";
// import { Link, Params } from "react-router-dom";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
console.log(backendURL);
function JobCard() {
  const [job, setJob] = useState(null);

  //   const {id} = useParams()

  const fetchJob = async () => {
    try {
      const jobResponse = await axios.get(`${backendURL}/jobs/1`); // later switch 1 w/ ${id}
      setJob(jobResponse.data);
    } catch (err) {
      setJob(null);
      console.log(err.messagee);
      return <h1>Could not fetch job!</h1>;
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  console.log(job);

  if (!job) {
    return <h1>Loading Job...</h1>;
  }

  return (
    <div className="jobCard">
      <h1 className="jobCard__title">{job.title}</h1>
    </div>
  );
}

export default JobCard;
