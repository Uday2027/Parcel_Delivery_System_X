import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png', // Delivery truck icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png', // Home icon for destination
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

interface LiveMapProps {
  deliveryLat?: number;
  deliveryLng?: number;
  pickupLat?: number;
  pickupLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  height?: string;
}

// Component to dynamically center the map
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const LiveMap: React.FC<LiveMapProps> = ({ 
  deliveryLat, 
  deliveryLng, 
  pickupLat, 
  pickupLng, 
  destinationLat, 
  destinationLng,
  height = "400px" 
}) => {
  // Default to Dhaka coordinates if nothing provided
  const defaultCenter: [number, number] = [23.8103, 90.4125];
  const center: [number, number] = deliveryLat && deliveryLng ? [deliveryLat, deliveryLng] : defaultCenter;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative z-0" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Dynamic Map Recenter */}
        <ChangeView center={center} />

        {/* Current Delivery Location */}
        {deliveryLat && deliveryLng && (
          <Marker position={[deliveryLat, deliveryLng]} icon={truckIcon}>
            <Popup className="custom-popup">
              <div className="font-bold text-primary">Delivery Fleet</div>
              <div className="text-xs text-zinc-500 font-medium">Currently in transit</div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Location */}
        {pickupLat && pickupLng && (
          <Marker position={[pickupLat, pickupLng]}>
            <Popup>
              <div className="font-bold">Pickup Point</div>
            </Popup>
          </Marker>
        )}

        {/* Destination Location */}
        {destinationLat && destinationLng && (
          <Marker position={[destinationLat, destinationLng]} icon={homeIcon}>
            <Popup>
              <div className="font-bold">Destination</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Overlay status */}
      {(!deliveryLat || !deliveryLng) && (
        <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Waiting for live signal from fleet...</p>
        </div>
      )}
    </div>
  );
};

export default LiveMap;
