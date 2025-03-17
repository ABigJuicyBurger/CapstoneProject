import JobCard from "../../components/JobCard/JobCard";
import MapJobCardType from "../../../types/MapJobCardType";
import MapJobCardNoteType from "../../../types/MapJobCardType";

const MapJobCard = ({ updateNote, jobId, onClose }: MapJobCardType) => {
  return (
    <div className="map-job-card">
      <JobCard updateNote={updateNote} jobId={jobId} onClose={onClose} />
    </div>
  );
};

export default MapJobCard;
