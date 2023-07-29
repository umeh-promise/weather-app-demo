import { useEffect, useState } from 'react';

export function useLocalStorage(key, initailState) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initailState
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return [value, setValue];
}
