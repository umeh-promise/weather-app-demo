import Day from './Day';

function Weather({
  weather: {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  },
  location,
}) {
  return (
    <div>
      <h2>Location: {location}</h2>
      <ul className='weather'>
        {dates.map((date, i) => (
          <Day
            date={date}
            min={min.at(i)}
            max={max.at(i)}
            code={codes.at(i)}
            key={date}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}

export default Weather;
