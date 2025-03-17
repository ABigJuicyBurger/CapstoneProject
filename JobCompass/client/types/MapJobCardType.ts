type MapJobCardNoteType = {
  jobId?: string;
  onClose?: () => void;
  updateNote: () => void;
  note?: string[];
};

export default MapJobCardNoteType;
