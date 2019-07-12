const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const time = ({ hours = 0, minutes = 0, seconds = 0 }) => {
  return hours * hour + minutes * minute + seconds * second;
};

export { minute, hour, second, day, time };
