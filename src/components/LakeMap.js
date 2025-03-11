import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LakeMap = () => {
  const [lakes, setLakes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [outerBoundary, setOuterBoundary] = useState(null);
  const [innerBoundary, setInnerBoundary] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("lakes"); // Default to lakes

  useEffect(() => {
    fetch("/data/lakes.json")
      .then((res) => res.json())
      .then((data) => setLakes(data))
      .catch((err) => console.error("Error loading lakes.json:", err));

    fetch("/data/hotels.json")
      .then((res) => res.json())
      .then((data) => setHotels(data))
      .catch((err) => console.error("Error loading hotels.json:", err));

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

  const hotelIcon = new L.Icon({
    iconUrl: "/marker-icon-red.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });

  const outerBoundaryStyle = {
    color: "#800020",
    weight: 5,
    fillOpacity: 0,
  };

  const innerBoundaryStyle = {
    color: "#cccccc",
    weight: 1,
    fillOpacity: 0.1,
  };

  const estimateVolume = (area) => {
    const areaSqMeters = area * 4046.86;
    const avgDepth = area > 100 ? 6 : 3;
    return areaSqMeters * avgDepth;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Filter Buttons */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
        background: "white",
        padding: "10px",
        borderRadius: "5px",
      }}>
        <button 
          onClick={() => setSelectedCategory("lakes")} 
          style={{ marginRight: "10px", padding: "8px", backgroundColor: selectedCategory === "lakes" ? "#007bff" : "#ccc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Show Lakes
        </button>
        <button 
          onClick={() => setSelectedCategory("hotels")} 
          style={{ padding: "8px", backgroundColor: selectedCategory === "hotels" ? "#dc3545" : "#ccc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Show Hotels
        </button>
      </div>

      {/* Map Container */}
      <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ height: "100vh", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {outerBoundary && <GeoJSON data={outerBoundary} style={outerBoundaryStyle} />}
        {innerBoundary && <GeoJSON data={innerBoundary} style={innerBoundaryStyle} />}

        {/* Render Markers Based on Selection */}
        {selectedCategory === "lakes" &&
          lakes.map((lake, index) => {
            const volume = estimateVolume(lake.area);
            return (
              <Marker key={`lake-${index}`} position={[lake.lat, lake.lng]} icon={lake.area > 100 ? thickBlueIcon : lightBlueIcon}>
                <Popup>
                  <strong>{lake.name}</strong><br />
                  Area: {lake.area} acres<br />
                  Volume: {volume.toLocaleString()} m³<br />
                  Lat: {lake.lat}<br />
                  Lng: {lake.lng}
                </Popup>
              </Marker>
            );
          })
        }

        {selectedCategory === "hotels" &&
          hotels.map((hotel, index) => (
            <Marker key={`hotel-${index}`} position={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]} icon={hotelIcon}>
              <Popup>
                <strong>{hotel.name}</strong><br />
                {hotel.address}<br />
                Lat: {hotel.latitude}<br />
                Lng: {hotel.longitude}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
  );
};

export default LakeMap;
