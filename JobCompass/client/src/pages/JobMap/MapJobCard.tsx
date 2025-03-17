import JobCard from "../../components/JobCard/JobCard";
import MapJobCardNoteType from "../../../types/MapJobCardType";

const MapJobCard = ({
  noteState,
  updateNote,
  jobId,
  onClose,
}: MapJobCardNoteType) => {
  return (
    <div className="map-job-card">
      <JobCard
        noteState={noteState}
        updateNote={updateNote}
        jobId={jobId}
        onClose={onClose}
      />
    </div>
  );
};

export default MapJobCard;
