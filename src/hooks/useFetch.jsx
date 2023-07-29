import { useEffect } from 'react';
import { convertToFlag } from '../helpers/formatNumbers';

export function useFetch(location, callback) {
  useEffect(() => {
    async function fetchWeather() {
      if (location?.length < 2) return callback({ weather: {} });
      try {
        callback((currState) => {
          return { ...currState, isLoading: true };
        });
        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();
        // console.log(geoData);

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        callback((currState) => ({
          ...currState,
          displayLocation: `${name} ${convertToFlag(country_code)}`,
        }));

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        callback((currState) => ({ ...currState, weather: weatherData.daily }));
      } catch (err) {
        console.error(err);
      } finally {
        callback((currState) => ({ ...currState, isLoading: false }));
      }
    }

    fetchWeather();
  }, [callback, location]);
}
