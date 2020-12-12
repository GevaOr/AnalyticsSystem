import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const center = {
  lat: -3.745,
  lng: -38.523,
};

function MapAnalytics() {
  const [data, setData] = useState(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  const containerStyle = {
    width: "100%",
    height: "100%"
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/locations")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
      >
        {data &&
        data.map(loc => (
          <Marker
            key={loc._id}
            position={loc.geolocation.location}
          />)
        )
        }
      </GoogleMap>
    </LoadScript>
  );
}

export default MapAnalytics;
