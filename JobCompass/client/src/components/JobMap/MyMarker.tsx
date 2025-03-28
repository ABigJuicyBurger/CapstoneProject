import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  // InfoWindow, maybe needed for custom marker styling
} from "@vis.gl/react-google-maps";

import JobCardType from "../../../types/JobCardType.ts";

export function MyMarker({ job, handleMarkerClick, setHoveredJobId, hoveredJobId, salary_range }: {
  job: JobCardType;
  handleMarkerClick: (jobId: string) => void;
  setHoveredJobId: (jobId: string | null) => void;
  hoveredJobId: string | null;
  salary_range: string;
}) {
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
    console.log(hoveredJobId);
  }}
  onMouseLeave={() => setHoveredJobId(null)}
  className="info-window "
>
  <div
    className={`info-window-anchor ${
      hoveredJobId === job.id ? "hovered" : ""
    }`}
  >
    <div className="info-window-anchor__marker">
      {salary_range}
    </div>
  </div>
</AdvancedMarker>
}
