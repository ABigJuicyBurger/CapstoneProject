import JobCard from "../types/JobCardType";
type MapJobCardNoteType = {
  jobId?: string;
  onClose?: () => void;
  updateNoteVisibility?: () => void;
  noteState?: boolean;
  jobs?: JobCard[] | undefined; // Add this if JobMap needs it
  guestUser?: {
    name: string;
    id: string;
    savedJobs: string[];
  } | null;
  updateGuestUser?: (jobId: string) => void;
};

export default MapJobCardNoteType;
