import IndividualJobCard from "../../components/IndividualJobCard/IndividualJobCard.tsx";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function IndividualJob({ noteState }: { noteState: boolean }): JSX.Element {
  return (
    <>
      <IndividualJobCard noteState={noteState} />
    </>
  );
}
export default IndividualJob;
