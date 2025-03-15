import JobCard from "../../components/JobCard/JobCard";
type MapJobCardType = {
  jobId: string;
  onClose: () => void;
};

const MapJobCard = ({ jobId, onClose }: MapJobCardType) => {
  return (
    <div className="map-job-card">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <JobCard jobId={jobId} />
    </div>
  );
};

export default MapJobCard;
