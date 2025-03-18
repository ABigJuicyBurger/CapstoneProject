import JobCard from "../types/JobCardType";
type MapJobCardNoteType = {
  jobId?: string;
  onClose?: () => void;
  updateNoteVisibility: () => void;
  noteState?: boolean;
  jobs?: JobCard[] | undefined; // Add this if JobMap needs it
};

export default MapJobCardNoteType;
