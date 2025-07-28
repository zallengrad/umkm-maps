// frontend/src/components/MapView.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom default icon for Leaflet markers
// Ini mengatasi masalah icon default Leaflet tidak muncul
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✨ KOMPONEN BARU: MapSizeInvalidator (Untuk memperbaiki tampilan peta terpotong) ✨
// Komponen ini akan memaksa peta untuk menghitung ulang ukurannya
const MapSizeInvalidator = () => {
  const map = useMap(); // Hook untuk mendapatkan instance peta Leaflet
  useEffect(() => {
    // Panggil invalidateSize saat komponen mount
    map.invalidateSize();
    // Anda bisa menambahkan event listener untuk resize window di sini
    // jika layout Anda sering berubah ukuran setelah peta dimuat
    // window.addEventListener('resize', () => map.invalidateSize());
    // return () => window.removeEventListener('resize', () => map.invalidateSize());
  }, [map]); // Dependensi adalah objek peta itu sendiri
  return null; // Komponen ini tidak merender apa pun di DOM
};

// ✨ KOMPONEN BARU: FitBoundsCustom (Untuk mengatur zoom otomatis ke semua marker) ✨
// Komponen ini akan menyesuaikan tampilan peta agar semua marker terlihat di layar
const FitBoundsCustom = ({ bounds }) => {
  const map = useMap(); // Hook untuk mendapatkan instance peta Leaflet

  useEffect(() => {
    // Pastikan bounds memiliki koordinat yang valid sebelum mencoba fit
    if (bounds && bounds.isValid()) {
      // Menyesuaikan peta agar semua marker terlihat
      // padding: memberikan sedikit ruang kosong di sekitar marker
      // maxZoom: membatasi zoom agar tidak terlalu dekat
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }
  }, [map, bounds]); // Panggil ulang jika objek peta atau batas (bounds) berubah

  return null; // Komponen ini tidak merender apa pun di DOM
};

const MapView = ({ umkmList }) => {
  console.log("MapView: Menerima umkmList:", umkmList); // Log untuk debugging, sangat membantu!

  // Filter UMKM yang memiliki koordinat valid untuk marker dan penentuan batas peta
  const allValidCoords = umkmList
    .map((umkm) => {
      const lat = parseFloat(umkm.latitude); // Pastikan ini diubah jadi angka
      const lng = parseFloat(umkm.longitude); // Pastikan ini diubah jadi angka
      // Log jika ada koordinat tidak valid agar bisa Anda perbaiki di DB
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`UMKM "${umkm.name}" memiliki koordinat tidak valid: Lat "${umkm.latitude}", Lng "${umkm.longitude}". Marker tidak akan dirender untuk UMKM ini.`);
        return null; // Kembalikan null jika koordinat tidak valid
      }
      return [lat, lng]; // Kembalikan array [latitude, longitude] jika valid
    })
    .filter((coord) => coord !== null); // Hapus semua entri null (koordinat tidak valid)

  // Koordinat default untuk Desa Bejiarum, Kecamatan Kertek, Wonosobo
  // Ini akan digunakan jika tidak ada UMKM yang memiliki koordinat valid
  const defaultCenterBejiarum = [-7.35986761253203, 109.9416955177686];

  // Menentukan batas peta (bounds) untuk zoom otomatis
  // Jika ada koordinat valid, gunakan itu. Jika tidak, gunakan pusat default.
  const bounds =
    allValidCoords.length > 0
      ? L.latLngBounds(allValidCoords) // Menggunakan koordinat valid untuk batas
      : L.latLngBounds([defaultCenterBejiarum, defaultCenterBejiarum]); // Batas default jika tidak ada marker

  // Menentukan posisi awal peta (center dan zoom)
  // Ini akan diatur ulang oleh FitBoundsCustom jika ada marker valid
  const initialPosition = allValidCoords.length > 0 ? allValidCoords[0] : defaultCenterBejiarum;

  return (
    <MapContainer
      center={initialPosition} // Posisi awal, akan disesuaikan oleh FitBoundsCustom
      zoom={13} // Zoom awal, akan disesuaikan oleh FitBoundsCustom
      scrollWheelZoom={false} // Roda scroll untuk zoom dinonaktifkan
      className="h-[500px] w-full rounded-lg shadow-lg" // Kelas CSS untuk tinggi dan lebar peta
    >
      <TileLayer // Lapisan peta dasar (OpenStreetMap)
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ✨ Panggil komponen MapSizeInvalidator di dalam MapContainer ✨ */}
      {/* Ini penting agar peta tidak terpotong */}
      <MapSizeInvalidator />

      {/* ✨ Panggil komponen FitBoundsCustom jika ada koordinat valid ✨ */}
      {/* Ini akan menengahkan dan zoom otomatis ke semua marker */}
      {allValidCoords.length > 0 && <FitBoundsCustom bounds={bounds} />}

      {/* Loop untuk menampilkan setiap marker UMKM */}
      {umkmList.map((umkm) => {
        const lat = parseFloat(umkm.latitude);
        const lng = parseFloat(umkm.longitude);

        // Hanya render marker jika koordinatnya valid dan bukan NaN (Not a Number)
        if (isNaN(lat) || isNaN(lng)) {
          // Pesan console.warn sudah ada di bagian allValidCoords filter
          return null; // Jangan render marker jika koordinat invalid
        }

        return (
          <Marker key={umkm.id || umkm.name} position={[lat, lng]}>
            <Popup>
              <h3 className="font-bold">{umkm.name}</h3>
              <p>{umkm.category}</p>
              <p>{umkm.address}</p>
              {umkm.Maps_url && ( // Pastikan menggunakan Maps_url
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
