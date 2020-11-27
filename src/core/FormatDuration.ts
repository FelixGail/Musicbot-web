import { Duration } from 'moment';

function formatDuration(duration: Duration): string {
  const seconds = duration.asSeconds();
  if (seconds < 60) {
    return `< 1 minute`;
  } else if (seconds < 90) {
    return '1 minute';
  } else if (seconds < 3600) {
    return `${duration.asMinutes().toPrecision(1)} minutes`;
  } else if (seconds < 5400) {
    return `1 hour`;
  } else {
    return `${duration.asHours().toPrecision(1)} hours`;
  }
}

export default formatDuration;
