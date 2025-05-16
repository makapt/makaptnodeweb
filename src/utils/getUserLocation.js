"use client";

const GOOGLE_API_KEY = "AIzaSyB8Sfb4kmS4AcgKpxQxN8QxaJxrbaOPNEg"; //process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
          );
          const data = await res.json();

          if (data?.results?.length > 0) {
            const city = data.results?.[0]?.address_components[2]?.long_name;
            resolve({ lat, lon: lng, city: city });
          } else {
            reject("No address found.");
          }
        } catch (err) {
          reject("Reverse geocoding failed.");
        }
      },
      (error) => {
        reject("Location permission denied or unavailable.");
      }
    );
  });
};
