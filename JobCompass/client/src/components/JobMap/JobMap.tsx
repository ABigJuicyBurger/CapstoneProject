import {
  APIProvider,
  Map,
  Pin,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useMap,
  // InfoWindow, maybe needed for custom marker styling
} from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect, useState, useMemo, useCallback } from "react";
import { MyMarker } from "./MyMarker.tsx";

import MapJobCard from "./MapJobCard.tsx";
import "./JobMap.scss";

import MapJobCardNoteType from "../../../types/MapJobCardType.ts";
import { formatSalary } from "./formatSalary.tsx";
import JobCardType from "../../../types/JobCardType.ts";

// Updated to center of Canada
const CANADA_CENTER = {
  lat: 56.1304,
  lng: -106.3468,
};

// Extended to cover all of Canada
const CANADA_BOUNDS = {
  north: 83.0, // Northern boundary latitude (covers Arctic islands)
  south: 41.7, // Southern boundary latitude (covers Windsor, ON)
  west: -141.0, // Western boundary longitude (covers Yukon)
  east: -52.6, // Eastern boundary longitude (covers Newfoundland)
};

const RESTRICTION = {
  latLngBounds: CANADA_BOUNDS,
  strictBounds: false,
};

const JobMap = ({
  updateNoteVisibility,
  jobs,
  noteState,
  guestUser,
  updateGuestUser,
}: MapJobCardNoteType): JSX.Element => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  // TODO: Show salary on hover (originally show title and company on load)
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(4); // Lower default zoom level for all of Canada

  const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const navigate = useNavigate();

  const handleMarkerClick = useCallback(
    (jobUrl: string) => {
      setSelectedJobId(jobUrl);
      navigate(`/jobs/${jobUrl}`);
    },
    [navigate]
  );

  useEffect(() => {
    console.log("Hovered job id", hoveredJobId);
  }, [hoveredJobId]);

  // Calculate which markers should show text based on zoom and density
  const jobsWithVisibility = useMemo(() => {
    if (!jobs) return [];

    // If few jobs, we can show more of them with text
    const jobCount = jobs.length;
    const lowDensity = jobCount < 10;
    const mediumDensity = jobCount >= 10 && jobCount < 30;

    // At high zoom levels (>13), show all markers with text
    // At medium zoom (11-13), show some markers with text based on criteria
    // At low zoom (<11), show mini markers only

    return jobs.map((job) => {
      // Calculate if this marker should show text based on zoom level and density
      let showText = false;

      if (currentZoom >= 13) {
        // Zoomed in enough to show all markers with text
        showText = true;
      } else if (11 <= currentZoom && currentZoom < 13) {
        if (lowDensity) {
          // If there are few markers, show them all with text
          showText = true;
        } else if (mediumDensity) {
          // For medium density, only show text for markers with certain properties
          // For example, show text for markers with higher salaries
          const salaryValue = parseInt(job.salary_range.replace(/[^0-9]/g, ""));
          showText = salaryValue > 100000; // Show text for high-paying jobs
        }
        // For high density at medium zoom, keep most as mini markers
      }

      return { ...job, showText };
    });
  }, [jobs, currentZoom]);

  const onZoomChanged = useCallback(
    (e: { detail: { zoom: number } }) => setCurrentZoom(e.detail.zoom),
    [setCurrentZoom]
  );

  return (
    <div className="map-container">
      <div className="map-layout">
        <div className="map-section">
          <APIProvider apiKey={apiKey}>
            <Map
              // style={{ width: "95vw", height: "100vh" }}
              defaultCenter={CANADA_CENTER}
              mapId={`6ca41446c199331d`}
              defaultZoom={4}
              // remove zoom in out
              disableDefaultUI={true}
              // remove satellide mode
              mapTypeControl={false}
              // how user can interact
              gestureHandling={"cooperative"}
              // + / - zoom buttons
              zoomControl={false}
              // Disable street view
              streetViewControl={false}
              draggableCursor={"default"}
              fullscreenControl={false}
              //prevent user from zooming outside Canada
              restriction={RESTRICTION}
              minZoom={3}
              maxZoom={17}
              onZoomChanged={onZoomChanged}
            >
              {/*Job Markers logic*/}
              {jobsWithVisibility &&
                jobsWithVisibility.map((job) => {
                  const salary_range = formatSalary(job.salary_range);

                  const isHovered = hoveredJobId === job.id;
                  return (
                    <MyMarker
                      key={job.id}
                      job={job}
                      handleMarkerClick={handleMarkerClick}
                      setHoveredJobId={setHoveredJobId}
                      isHovered={isHovered}
                      salary_range={salary_range}
                      miniMarker={!job.showText && !isHovered}
                    />
                  );
                })}
            </Map>
          </APIProvider>
        </div>

        {selectedJobId && (
          <div className="job-details-section">
            <MapJobCard
              updateNoteVisibility={updateNoteVisibility}
              jobId={selectedJobId}
              onClose={() => setSelectedJobId(null)}
              noteState={noteState}
              guestUser={guestUser}
              updateGuestUser={updateGuestUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default JobMap;
