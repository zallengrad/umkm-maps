import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import dataUMKM from "../data/umkm.json";

// Custom icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -35],
});

// Zoom otomatis berdasarkan semua marker
const FitToBounds = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(data.map((umkm) => [umkm.lat, umkm.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [data, map]);

  return null;
};

const MapView = () => {
  return (
    <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200">
      <MapContainer scrollWheelZoom={true} className="h-full w-full z-10" center={[-7.31621, 110.21143]} zoom={15}>
        <TileLayer attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {dataUMKM.map((umkm) => (
          <Marker key={umkm.id} position={[umkm.lat, umkm.lng]} icon={customIcon}>
            <Popup>
              <div className="text-sm font-semibold mb-1">{umkm.nama}</div>
              <div className="text-xs text-gray-600">{umkm.alamat}</div>
              <a href={umkm.link_maps} target="_blank" rel="noreferrer" className="text-blue-600 text-xs mt-1 inline-block hover:underline">
                📍 Buka di Maps
              </a>
            </Popup>
          </Marker>
        ))}

        <FitToBounds data={dataUMKM} />
      </MapContainer>
    </div>
  );
};

export default MapView;
