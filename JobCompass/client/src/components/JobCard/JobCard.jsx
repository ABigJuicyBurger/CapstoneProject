import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
console.log(backendURL);
function JobCard() {
  const [job, setJob] = useState(null);

  //   const {id} = useParams()

  const fetchJob = async () => {
    try {
      const jobResponse = await axios.get(`${backendURL}/jobs/2`); // later switch 1 w/ ${id}
      setJob(jobResponse.data);
    } catch (err) {
      setJob(null);
      console.log(err.message);
      return <h1>Could not fetch job!</h1>;
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

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
        <h1 className="jobCard__title">{job.title}</h1>
        <h3 className="jobCard__company">{job.company}</h3>
        <div className="jobCard__header__cta">
          {/* <Link to="/jobURL">Apply</Link> */}
          <button onClick={saveJob} />
        </div>
      </div>
      <div className="jobCard_details">
        <h1>Job Details</h1>
        <div className="jobCard__details__type">
          <h3>Job Type</h3>
          <h4>{job.type}</h4>
        </div>
      </div>
      <div className="jobCard__skills">
        <h1>Skills</h1>
        <div className="jobCard__skills__list">
          <ul>
            {job.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
