const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Appends s to word if value is not 1
export function addS(val) {
  return val == 1 ? "" : "s";
}

const time = ({ hours = 0, minutes = 0, seconds = 0 }) => {
  return hours * hour + minutes * minute + seconds * second;
};

//@param: time is a Date object representing the target time to be used to calculate relative time
//@return:
//  gets calculated relative time from current time.
//  i.e. 19 hours ago
const getRelativeTime = targetDate => {
  if (targetDate.getTime == undefined) {
    return "";
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
    return timeDiffHrs + " hour" + addS(timeDiffHrs) + " ago";
  } else {
    return timeDiffDays + " day" + addS(timeDiffDays) + " ago";
  }
};

export { minute, hour, second, day, time, getRelativeTime };

//Reformat extracted time for better display:
//Display year-month-date hour:minute:second as i.e. 2019-07-10 20:22:44
export function parseTimeString(time) {
  if (time) {
    let extractedTime = time.split("T");
    extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
    return extractedTime;
  }
}
