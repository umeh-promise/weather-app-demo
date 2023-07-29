import { useEffect, useState } from 'react';
import { convertToFlag } from '../helpers/formatNumbers';

export function useFetchWeather(location) {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    displayLocation: '',
    weather: {},
  });

  useEffect(() => {
    const controller = new AbortController();
    async function fetchWeather() {
      if (location?.length < 2)
        return setState((currState) => ({ ...currState, weather: {} }));
      try {
        setIsLoading(true);
        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
          { signal: controller.signal }
        );
        const geoData = await geoRes.json();
        // console.log(geoData);

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setState((currState) => ({
          ...currState,
          displayLocation: `${name} ${convertToFlag(country_code)}`,
        }));

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setState((currState) => ({ ...currState, weather: weatherData.daily }));
      } catch (err) {
        if (!err.name === 'AbortError') {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [setState, location]);

  const { weather, displayLocation } = state;

  return { isLoading, weather, displayLocation };
}
