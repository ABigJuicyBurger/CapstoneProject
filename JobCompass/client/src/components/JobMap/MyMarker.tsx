import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  // InfoWindow, maybe needed for custom marker styling
} from "@vis.gl/react-google-maps";

import JobCardType from "../../../types/JobCardType.ts";

export function MyMarker({ 
  job, 
  handleMarkerClick, 
  setHoveredJobId, 
  hoveredJobId, 
  salary_range,
  miniMarker = true 
}: {
  job: JobCardType;
  handleMarkerClick: (jobId: string) => void;
  setHoveredJobId: (jobId: string | null) => void;
  hoveredJobId: string | null;
  salary_range: string;
  miniMarker?: boolean;
}) {
  // Create a state to track whether this marker is hovered
  const isHovered = hoveredJobId === job.id;
  
  // Calculate z-index - higher for hovered markers to appear on top
  const zIndex = isHovered ? 1000 : 1;

  return <AdvancedMarker
  anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
  key={job.id}
  position={{
    lat: Number(job.latitude),
    lng: Number(job.longitude),
  }}
  // render some jobs and some clusters through preprocessing
  // too many jobs ? cluster : job
  clickable={true}
  onClick={() => {
    handleMarkerClick(job.id);
  }}
  onMouseEnter={() => {
    setHoveredJobId(job.id);
  }}
  onMouseLeave={() => setHoveredJobId(null)}
  className="info-window"
  // Apply zIndex directly to the AdvancedMarker
  zIndex={zIndex}
>
  <div
    className={`info-window-anchor ${
      isHovered ? "hovered" : ""
    } ${miniMarker ? "mini-marker" : ""}`}
  >
    <div className="info-window-anchor__marker">
      {(isHovered || !miniMarker) && salary_range}
    </div>
  </div>
</AdvancedMarker>
}
