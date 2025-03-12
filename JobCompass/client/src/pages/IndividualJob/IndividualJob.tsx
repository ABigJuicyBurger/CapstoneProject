import JobCard from "../../components/JobCard/JobCard";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function IndividualJob(): JSX.Element {
  return (
    <>
      <h1>This is the individual job page</h1>
      <JobCard />
    </>
  );
}

export default IndividualJob;
