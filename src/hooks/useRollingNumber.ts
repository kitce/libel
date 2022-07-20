import getRandomNumber from 'lodash/random';
import { useEffect, useState } from 'react';

const roll = (start: number, end: number, current: number, random: boolean): number => {
  const next = random ? getRandomNumber(start, end) : current + 1;
  if (next === current) {
    /* roll again if it hits the same number */
    return roll(start, end, current, random);
  }
  if (next >= end) {
    /* back to the beginning if it passes the end */
    return start;
  }
  return next;
};

const useRollingNumber = (start: number, end: number, interval: number, random = true) => {
  const initial = random ? getRandomNumber(start, end) : start;

  const [number, setNumber] = useState(initial);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = roll(start, end, number, random);
      setNumber(next);
    }, interval);
    return () => {
      window.clearInterval(timer);
    };
  }, [start, end, interval, random, number]);

  return number;
};

export default useRollingNumber;
