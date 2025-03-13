import {
  APIProvider,
  Map,
  Pin,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

import JobCardType from "../../../types/JobCardType";

const JobMap = ({ jobs }: { jobs: JobCardType[] }) => {
  const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = () => {};

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "95vw", height: "95vh" }}
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
            onClick={handleMarkerClick}
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
  );
};

export default JobMap;
