import JobCard from "../../components/JobCard/JobCard";
import MapJobCardNoteType from "../../../types/MapJobCardType";
import "./MapJobCard.scss"; // Added for styling consistency

const MapJobCard = ({
  noteState,
  updateNoteVisibility,
  jobId,
  onClose,
  guestUser,
  updateGuestUser,
}: MapJobCardNoteType) => {
  return (
    <div className="map-job-card">
      <JobCard
        noteState={noteState}
        updateNoteVisibility={updateNoteVisibility}
        jobId={jobId}
        onClose={onClose}
        guestUser={guestUser}
        updateGuestUser={updateGuestUser}
      />
    </div>
  );
};

export default MapJobCard;
