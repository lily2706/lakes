import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import lakes from '../data/lakes.json';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: '/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const LakeMap = () => {
  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {lakes.map((lake, index) => (
        <Marker key={index} position={[lake.lat, lake.lng]} icon={redIcon}>
          <Popup>{lake.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LakeMap;
