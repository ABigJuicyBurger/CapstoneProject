import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  // InfoWindow, maybe needed for custom marker styling
} from "@vis.gl/react-google-maps";
import React, { useCallback } from "react";

import JobCardType from "../../../types/JobCardType.ts";

export const MyMarker = React.memo(function MyMarker({
  job,
  handleMarkerClick,
  handleMarkerHover,
  isHovered,
  salary_range,
  miniMarker = true,
}: {
  job: JobCardType;
  handleMarkerClick: (jobId: string) => void;
  handleMarkerHover: (jobId: string, isHovered: boolean) => void;
  isHovered: boolean;
  salary_range: string;
  miniMarker?: boolean;
}) {

  const getNumericCoordinate = (coord: any): number | null => {
    if (coord === null || coord === undefined) return null;
    if (typeof coord === 'number') return coord;
    if (typeof coord === 'string') return parseFloat(coord);
    if (coord.lat !== undefined) return coord.lat;
    if (coord.lng !== undefined) return coord.lng;
    return null;
  };

  const lat = getNumericCoordinate(job.latitude);
  const lng = getNumericCoordinate(job.longitude);
  
  if (lat === null || lng === null) {
    console.error('Invalid coordinates for job:', job.id, job.latitude, job.longitude);
    return null;
  }
  // Calculate z-index - higher for hovered markers to appear on top
  const zIndex = isHovered ? 1000 : 1;

  const onMouseEnter = useCallback(() => {
    handleMarkerHover(job.id, true);
  }, [job.id, handleMarkerHover]);

  const onMouseLeave = useCallback(() => {
    handleMarkerHover(job.id, false);
  }, [job.id, handleMarkerHover]);

  return (
    <AdvancedMarker
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      key={job.id}
      position={{
        lat,
        lng
      }}
      // render some jobs and some clusters through preprocessing
      // too many jobs ? cluster : job
      clickable={true}
      onClick={() => {
        handleMarkerClick(job.id);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="info-window"
      // Apply zIndex directly to the AdvancedMarker
      zIndex={zIndex}
    >
      <div
        className={`info-window-anchor ${isHovered ? "hovered" : ""} ${
          miniMarker ? "mini-marker" : ""
        }`}
      >
        <div className="info-window-anchor__marker">
          {(isHovered || !miniMarker) && salary_range}
        </div>
      </div>
    </AdvancedMarker>
  );
});
