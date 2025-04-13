// src/services/api.js
import counties from '../data/county.json';

// No need for async here, since the data is imported at build time.
export function getRandomCounty() {
  const keys = Object.keys(counties);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return counties[randomKey]; // returns an object like { county, fips, lat, lon }
}

export async function getWeatherData(lat, lon) {
  const endpoint = `https://mesonet.agron.iastate.edu/json/vtec_events_bypoint.py?lat=${lat}&lon=${lon}&sdate=2024-01-01&edate=2024-12-31`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Error fetching weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getWeatherData:", error);
    // Return an empty events array on error
    return { events: [] };
  }
}
