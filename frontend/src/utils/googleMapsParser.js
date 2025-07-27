// frontend/src/utils/googleMapsParser.js

/**
 * Mengekstrak latitude dan longitude dari berbagai format URL Google Maps.
 * @param {string} url - URL Google Maps
 * @returns {{lat: number, lng: number}|null} Objek berisi lat dan lng, atau null jika tidak ditemukan.
 */
export const extractLatLngFromGoogleMapsUrl = (url) => {
  if (!url || typeof url !== "string") {
    return null;
  }

  let lat = null;
  let lng = null;

  // --- Format Umum: /@lat,lng,zoom ---
  // Contoh: https://www.google.com/maps/@-7.8013,110.3643,15z
  const coordsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordsMatch && coordsMatch.length >= 3) {
    lat = parseFloat(coordsMatch[1]);
    lng = parseFloat(coordsMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log(`✅ Ditemukan lat/lng dari format @: ${lat}, ${lng}`);
      return { lat, lng };
    }
  }

  // --- Format Q (query): maps?q=lat,lng ---
  // Contoh: https://www.google.com/maps?q=-7.8013,110.3643
  const queryMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (queryMatch && queryMatch.length >= 3) {
    lat = parseFloat(queryMatch[1]);
    lng = parseFloat(queryMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log(`✅ Ditemukan lat/lng dari format ?q: ${lat}, ${lng}`);
      return { lat, lng };
    }
  }

  // --- Format Embed/Place ID: /place/.../@lat,lng ---
  // Contoh: https://www.google.com/maps/place/Some+Place/@-7.8013,110.3643,15z/data=!3m1!1e3
  const placeMatch = url.match(/\/place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (placeMatch && placeMatch.length >= 3) {
    lat = parseFloat(placeMatch[1]);
    lng = parseFloat(placeMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log(`✅ Ditemukan lat/lng dari format /place: ${lat}, ${lng}`);
      return { lat, lng };
    }
  }

  console.warn("⚠️ Tidak dapat mengekstrak lat/lng dari URL Maps:", url);
  return null;
};
