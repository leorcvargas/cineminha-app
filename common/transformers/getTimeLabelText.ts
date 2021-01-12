const getTimeLabelText = (time: number) => {
  const value = Math.floor(time);
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  const minutesLabel = minutes < 10 ? `0${minutes}` : minutes;
  const secondsLabel = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutesLabel}:${secondsLabel}`;
};

export default getTimeLabelText;
