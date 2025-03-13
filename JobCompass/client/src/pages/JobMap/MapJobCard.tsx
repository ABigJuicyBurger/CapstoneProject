import JobCard from "../../components/JobCard/JobCard";
const MapJobCard = ({
  jobId,
  onClose,
}: {
  jobId: number;
  onClose: () => void;
}) => {
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
