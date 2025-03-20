import JobCard from "../../components/JobCard/JobCard";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function IndividualJob(): JSX.Element {
  return (
    <>
      <JobCard />
    </>
  );
}

export default IndividualJob;
