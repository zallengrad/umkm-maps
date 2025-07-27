// frontend/src/components/MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapView = ({ umkmList }) => {
  console.log("MapView: Menerima umkmList:", umkmList); // ✨ LOG INI ✨

  // Pastikan ada data UMKM sebelum mencoba mendapatkan posisi tengah
  const centerLat = umkmList.length > 0 ? umkmList[0].latitude : -7.8013; // Koordinat default Desa Bejiarum (misal)
  const centerLng = umkmList.length > 0 ? umkmList[0].longitude : 110.3643; // Koordinat default Desa Bejiarum (misal)

  // Jika tidak ada UMKM atau koordinatnya invalid, gunakan koordinat default
  const position = [isNaN(centerLat) ? -7.8013 : centerLat, isNaN(centerLng) ? 110.3643 : centerLng];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-[500px] w-full rounded-lg shadow-lg">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {umkmList.map((umkm) => {
        const lat = parseFloat(umkm.latitude);
        const lng = parseFloat(umkm.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`UMKM "${umkm.name}" memiliki koordinat tidak valid: Lat ${umkm.latitude}, Lng ${umkm.longitude}`);
          return null;
        }

        return (
          <Marker key={umkm.id || umkm.name} position={[lat, lng]}>
            <Popup>
              <h3 className="font-bold">{umkm.name}</h3>
              <p>{umkm.category}</p>
              <p>{umkm.address}</p>
              {umkm.Maps_url && (
                <a href={umkm.Maps_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Lihat di Google Maps
                </a>
              )}
              {umkm.photos && umkm.photos.length > 0 && <img src={umkm.photos[0]} alt={umkm.name} className="mt-2 w-full h-24 object-cover rounded" />}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
