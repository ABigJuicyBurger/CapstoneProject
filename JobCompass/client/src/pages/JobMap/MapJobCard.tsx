import JobCard from "../../components/JobCard/JobCard";
import MapJobCardType from "../../../types/MapJobCardType";

const MapJobCard = ({ jobId, onClose }: MapJobCardType) => {
  return (
    <div className="map-job-card">
      <JobCard jobId={jobId} onClose={onClose} />
    </div>
  );
};

export default MapJobCard;
