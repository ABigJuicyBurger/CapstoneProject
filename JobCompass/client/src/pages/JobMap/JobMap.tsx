import {
  APIProvider,
  Map,
  Pin,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import MapJobCard from "./MapJobCard.tsx";

import "./JobMap.scss";

import JobCardType from "../../../types/JobCardType";
import { useState } from "react";

const JobMap = ({ jobs }: { jobs: JobCardType[] }) => {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = (jobUrl: string) => {
    setSelectedJobId(jobUrl);
  };

  return (
    <div className="map-container">
      <div className="map-layout">
        <div className="map-section">
          <APIProvider apiKey={apiKey}>
            <Map
              // style={{ width: "95vw", height: "100vh" }}
              defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
              mapId={`6ca41446c199331d`}
              defaultZoom={10.8}
              disableDefaultUI={true}
              mapTypeControl={true}
              gestureHandling={"cooperative"}
              zoomControl={false}
              streetViewControl={false} // Disable street view
              fullscreenControl={false}
            >
              {/*Job Markers logic*/}
              {jobs.map((job) => (
                <AdvancedMarker
                  key={job.id}
                  position={{
                    lat: parseFloat(job.latitude), // backup numbers to prevent map death
                    lng: parseFloat(job.longitude),
                  }}
                  clickable={true}
                  onClick={() => {
                    handleMarkerClick(job.id);
                  }}
                >
                  <Pin
                    background={"#4285F4"}
                    borderColor={"#FFF"}
                    glyphColor={"#FFF"}
                  />
                  {/* Custom marker content */}
                  <div className="job-marker">
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>

        {selectedJobId && (
          <div className="job-details-section">
            <MapJobCard
              jobId={selectedJobId}
              onClose={() => setSelectedJobId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMap;
