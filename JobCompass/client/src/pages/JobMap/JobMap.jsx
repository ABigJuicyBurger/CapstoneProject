import { APIProvider, Map } from "@vis.gl/react-google-maps";

const JobMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const calgaryCenter = { lat: 51.0447, lng: -114.0719 };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "95vw", height: "95vh" }}
        defaultCenter={{ calgaryCenter }}
        defaultZoom={10.8}
        disableDefaultUI={true}
        mapTypeControl={true}
        gestureHandling={"cooperative"}
        zoomControl={false}
        streetViewControl={false} // Disable street view
        fullscreenControl={false}
      >
        {/*Job Markers logic*/}
        {/* <AdvancedMarker
            key={job.id}
            position={{ lat: job.latitude, lng: job.longitude }}
          >
            <Pin
              background={'#4285F4'}
              borderColor={'#FFF'}
              glyphColor={'#FFF'}
            /> */}
        {/* Custom marker content */}
        {/* <div className="job-marker">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
            </div>
          </AdvancedMarker> */}
      </Map>
    </APIProvider>
  );
};
