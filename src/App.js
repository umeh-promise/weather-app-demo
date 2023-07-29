import { useEffect } from 'react';
import { useState } from 'react';
import Weather from './components/Weather';
import { convertToFlag } from './helpers/formatNumbers';

function App() {
  const [state, setState] = useState({
    // location: () => localStorage.getItem('location') || '',
    location: 'nigeria',
    isLoading: false,
    displayLocation: '',
    weather: {},
  });

  useEffect(() => {
    async function fetchWeather() {
      if (state.location.length < 2) return setState({ weather: {} });
      try {
        setState((currState) => {
          return { ...currState, isLoading: true };
        });
        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${state.location}`
        );
        const geoData = await geoRes.json();
        console.log(geoData);

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setState((currState) => {
          return {
            ...currState,
            displayLocation: `${name} ${convertToFlag(country_code)}`,
          };
        });

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setState((currState) => {
          return { ...currState, weather: weatherData.daily };
        });
      } catch (err) {
        console.error(err);
      } finally {
        setState((currState) => {
          return { ...currState, isLoading: false };
        });
      }
    }
    localStorage.setItem('location', state.location);
    fetchWeather();
  }, [state.location]);

  return (
    <div className='app'>
      <h1>Classy wather</h1>
      <div>
        <input
          type='text'
          placeholder='Search for location..'
          value={state.location}
          // onChange={(e) => setState((currObj) => {...currObj,  location: e.target.value })}
          onChange={(e) =>
            setState((currState) => {
              return { ...currState, location: e.target.value };
            })
          }
        />
      </div>
      {/* <button onClick={fetchWeather.bind(this)}>Get weather</button> */}

      {state.isLoading ? <p className='loader'>Loading...</p> : ''}

      {state.weather.weathercode && (
        <Weather weather={state.weather} location={state.location} />
      )}
    </div>
  );
}

export default App;
