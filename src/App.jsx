import { useEffect, useRef } from 'react';
import { useFetchWeather } from './hooks/useFetchWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import Weather from './components/Weather';

function App() {
  const [location, setLocation] = useLocalStorage('location', '');
  const { isLoading, weather, displayLocation } = useFetchWeather(location);

  const searchRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'Enter') {
        if (searchRef.current === document.activeElement) return;
        searchRef.current.focus();
        setLocation('');
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setLocation]);

  return (
    <div className='app'>
      <h1>weather Demo App</h1>
      <div>
        <input
          type='text'
          placeholder='Search for location..'
          ref={searchRef}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {isLoading ? <p className='loader'>Loading...</p> : ''}

      {weather.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}

export default App;
