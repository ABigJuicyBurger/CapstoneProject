import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";

const ExerciseMap = () => {
    const [zoom, setZoom] = useState(10);

    const onZoomChanged = () => {
        console.log("Zoom changed")
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
        <div className="map-container">
        <APIProvider apiKey={apiKey}>
            <Map
            defaultCenter={{lat: 51, lng: 30}}
            defaultZoom={12}
            onZoomChanged={onZoomChanged}
            >

                
            </Map>

        </APIProvider>
        </div>
    )
}