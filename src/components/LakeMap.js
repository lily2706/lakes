import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LakeMap = () => {
  const [lakes, setLakes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [outerBoundary, setOuterBoundary] = useState(null);
  const [innerBoundary, setInnerBoundary] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/data/lakes.json")
      .then((res) => res.json())
      .then((data) => setLakes(data.filter(lake => !isNaN(lake.latitude) && !isNaN(lake.longitude))))
      .catch((err) => console.error("Error loading lakes.json:", err));

    fetch("/data/hotels.json")
      .then((res) => res.json())
      .then((data) => setHotels(data.filter(hotel => !isNaN(hotel.latitude) && !isNaN(hotel.longitude) && hotel.latitude >= -90 && hotel.latitude <= 90)))
      .catch((err) => console.error("Error loading hotels.json:", err));

    fetch("/data/company.json")
      .then((res) => res.json())
      .then((data) => setCompanies(data.filter(company => !isNaN(company.latitude) && !isNaN(company.longitude))))
      .catch((err) => console.error("Error loading company.json:", err));

    fetch("/data/outer-boundary.geojson")
      .then((res) => res.json())
      .then((data) => setOuterBoundary(data))
      .catch((err) => console.error("Error loading outer-boundary.geojson:", err));

    fetch("/data/bengaluru-boundary.geojson")
      .then((res) => res.json())
      .then((data) => setInnerBoundary(data))
      .catch((err) => console.error("Error loading bengaluru-boundary.geojson:", err));
  }, []);

  // Define Marker Icons
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

  const companyIcon = new L.Icon({
    iconUrl: "/placeholder.PNG",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });

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
        <button onClick={() => setSelectedCategory("all")}>Show All</button>
        <button onClick={() => setSelectedCategory("lakes")}>Show Lakes</button>
        <button onClick={() => setSelectedCategory("hotels")}>Show Hotels</button>
        <button onClick={() => setSelectedCategory("companies")}>Show Companies</button>
      </div>

      {/* Map Container */}
      <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ height: "100vh", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {outerBoundary && <GeoJSON data={outerBoundary} style={{ color: "#800020", weight: 5, fillOpacity: 0 }} />}
        {innerBoundary && <GeoJSON data={innerBoundary} style={{ color: "#cccccc", weight: 1, fillOpacity: 0.1 }} />}

        {/* Show Lake Markers */}
        {(selectedCategory === "lakes" || selectedCategory === "all") &&
          lakes.map((lake, index) => (
            <Marker key={`lake-${index}`} position={[lake.latitude, lake.longitude]} icon={lake.area > 100 ? thickBlueIcon : lightBlueIcon}>
              <Popup>
                <strong>{lake.name}</strong><br />
                Area: {lake.area} acres<br />
                Lat: {lake.latitude}<br />
                Lng: {lake.longitude}
              </Popup>
            </Marker>
          ))
        }

        {/* Show Hotel Markers */}
        {(selectedCategory === "hotels" || selectedCategory === "all") &&
          hotels.map((hotel, index) => (
            <Marker key={`hotel-${index}`} position={[hotel.latitude, hotel.longitude]} icon={hotelIcon}>
              <Popup>
                <strong>{hotel.name}</strong><br />
                {hotel.address}<br />
                Lat: {hotel.latitude}<br />
                Lng: {hotel.longitude}
              </Popup>
            </Marker>
          ))
        }

        {/* Show Company Markers */}
        {(selectedCategory === "companies" || selectedCategory === "all") &&
          companies.map((company, index) => (
            <Marker key={`company-${index}`} position={[company.latitude, company.longitude]} icon={companyIcon}>
              <Popup>
                <strong>{company.company}</strong><br />
                {company.address}<br />
                Lat: {company.latitude}<br />
                Lng: {company.longitude}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
  );
};

export default LakeMap;