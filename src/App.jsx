import { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import Weather from './components/Weather';

function App() {
  const [state, setState] = useState({
    isLoading: false,
    displayLocation: '',
    weather: {},
  });
  const [location, setLocation] = useLocalStorage('location', '');

  useFetch(location, setState);

  return (
    <div className='app'>
      <h1>weather Demo App</h1>
      <div>
        <input
          type='text'
          placeholder='Search for location..'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {state.isLoading ? <p className='loader'>Loading...</p> : ''}

      {state.weather.weathercode && (
        <Weather weather={state.weather} location={state.displayLocation} />
      )}
    </div>
  );
}

export default App;
