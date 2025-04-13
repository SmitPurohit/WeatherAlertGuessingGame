// src/services/api.test.js
import { getRandomCounty, getWeatherData } from './api';

describe('API calls using imported counties JSON', () => {
  beforeEach(() => {
    // Reset fetch mocks before each test if using jest-fetch-mock.
    fetch.resetMocks && fetch.resetMocks();
  });

  test('getRandomCounty returns a valid county object', () => {
    const county = getRandomCounty();
    console.log('Random County:', county);
    
    expect(county).toHaveProperty('county');
    expect(county).toHaveProperty('fips');
    expect(county).toHaveProperty('lat');
    expect(county).toHaveProperty('lon');
  });

//   test('getWeatherData returns weather event data for given coordinates', async () => {
//     // Use a fixed test coordinate
//     fetch.mockResponseOnce(JSON.stringify({
//       events: [
//         { type: "Tornado Warning" },
//         { type: "Flash Flood Warning" }
//       ]
//     }));

//     const weatherData = await getWeatherData(41.1083, -87.8617);
//     console.log('Weather Data:', weatherData);
    
//     expect(weatherData).toHaveProperty('events');
//     expect(Array.isArray(weatherData.events)).toBe(true);
//     expect(weatherData.events.length).toBeGreaterThan(0);
//   });

  test('Integration: getRandomCounty and getWeatherData work together', async () => {
    // Get a random county from the static JSON.
    const county = getRandomCounty();
    console.log('Integration - Random County:', county);
    
    // Use the county's lat and lon to query the weather data.
    const weatherData = await getWeatherData(county.lat, county.lon);
    console.log('Integration - Weather Data:', weatherData);
    
    // Verify that the returned weather data has the expected structure.
    expect(weatherData).toHaveProperty('events');
    expect(Array.isArray(weatherData.events)).toBe(true);
    expect(weatherData.events.length).toBeGreaterThan(0);
  });
});
