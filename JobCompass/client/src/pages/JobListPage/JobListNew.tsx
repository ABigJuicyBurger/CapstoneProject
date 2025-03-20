import { JSX } from "react";
import JobList from "../../components/JobList/JobList";
import JobCardType from "../../../types/JobCardType";

function JobListNew({ jobBoard }: { jobBoard: JobCardType[] }): JSX.Element {
  return (
    <>
      <JobList jobBoard={jobBoard} />
    </>
  );
}

export default JobListNew;
