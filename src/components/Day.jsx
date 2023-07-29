import { formatDay, getWeatherIcon } from '../helpers/formatNumbers';

function Day(props) {
  const { date, max, min, code, isToday } = props;
  return (
    <li className='day'>
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? 'Today' : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}

export default Day;
