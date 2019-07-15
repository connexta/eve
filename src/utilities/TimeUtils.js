const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const time = ({ hours = 0, minutes = 0, seconds = 0 }) => {
  return hours * hour + minutes * minute + seconds * second;
};

//@param: time is a Date object representing the target time to be used to calculate relative time
//@return:
//  gets calculated relative time from current time.
//  i.e. 19 hours ago
const getRelativeTime = targetDate => {
  if (typeof targetDate != Date) {
    return undefined;
  }

  let currTime = new Date().getTime();
  let targetTime = targetDate.getTime();

  let timeDiff = currTime - targetTime; // time diff in milliseconds

  let timeDiffMin = Math.round(timeDiff / minute);
  let timeDiffHrs = Math.round(timeDiff / hour);
  let timeDiffDays = Math.round(timeDiff / day);

  if (timeDiffMin < 60) {
    return timeDiffMin == 0 ? "now" : timeDiffMin + " min ago";
  } else if (timeDiffHrs < 24) {
    return timeDiffHrs + (timeDiffHrs == 1 ? " hour ago" : " hours ago");
  } else {
    return timeDiffDays + (timeDiffDays == 1 ? " day ago" : " days ago");
  }
};

export { minute, hour, second, day, time, getRelativeTime };
