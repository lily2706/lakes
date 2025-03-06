import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LakeMap = () => {
  const [lakes, setLakes] = useState([]);
  const [outerBoundary, setOuterBoundary] = useState(null);
  const [innerBoundary, setInnerBoundary] = useState(null);

  useEffect(() => {
    fetch("/data/lakes.json")
      .then((res) => res.json())
      .then((data) => setLakes(data))
      .catch((err) => console.error("Error loading lakes.json:", err));

    fetch("/data/outer-boundary.geojson")
      .then((res) => res.json())
      .then((data) => setOuterBoundary(data))
      .catch((err) => console.error("Error loading outer-boundary.geojson:", err));

    fetch("/data/bengaluru-boundary.geojson")
      .then((res) => res.json())
      .then((data) => setInnerBoundary(data))
      .catch((err) => console.error("Error loading bengaluru-boundary.geojson:", err));
  }, []);

  const thickBlueIcon = new L.Icon({
    iconUrl: "/pin-thick-blue.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });

  const lightBlueIcon = new L.Icon({
    iconUrl: "/pin-light-blue.png",
    iconSize: [25, 40],
    iconAnchor: [12, 40],
    popupAnchor: [0, -35],
  });

  const outerBoundaryStyle = {
    color: "#800020", // Burgundy outer boundary
    weight: 5,
    fillOpacity: 0,
  };

  const innerBoundaryStyle = {
    color: "#cccccc", // Light grey inner boundaries
    weight: 1,
    fillOpacity: 0.1,
  };

  // Function to estimate volume
  const estimateVolume = (area) => {
    const areaSqMeters = area * 4046.86;
    const avgDepth = area > 100 ? 6 : 3; // depth in meters
    return areaSqMeters * avgDepth; // volume in cubic meters
  };

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {outerBoundary && <GeoJSON data={outerBoundary} style={outerBoundaryStyle} />}
      {innerBoundary && <GeoJSON data={innerBoundary} style={innerBoundaryStyle} />}

      {lakes.map((lake, index) => {
        const volume = estimateVolume(lake.area);
        return (
          <Marker
            key={index}
            position={[lake.lat, lake.lng]}
            icon={lake.area > 100 ? thickBlueIcon : lightBlueIcon}
          >
            <Popup>
              <strong>{lake.name}</strong><br />
              Area: {lake.area} acres<br />
              Volume: {volume.toLocaleString()} m³<br />
              Lat: {lake.lat}<br />
              Lng: {lake.lng}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LakeMap;
