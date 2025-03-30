import MapJobCardNoteType from "../../../types/MapJobCardType.ts";
import IndividualJobCard from "../../components/IndividualJobCard/IndividualJobCard.tsx";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS

function IndividualJob({
  noteState,
  updateNoteVisibility,
  jobId,
  onClose = () => {},
  guestUser,
  updateGuestUser,
}: MapJobCardNoteType): JSX.Element {
  return (
    <>
      <IndividualJobCard
        jobId={jobId}
        onClose={onClose}
        updateNoteVisibility={updateNoteVisibility}
        updateGuestUser={updateGuestUser}
        guestUser={guestUser}
        noteState={noteState}
      />
    </>
  );
}
export default IndividualJob;
