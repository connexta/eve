const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Returns string with formatted time (hours, minutes, and AM/PM suffix) for Date object
export function getTimeString(date) {
  let suffix = " AM";
  let time = date.getHours() + ":";

  if (date.getHours() >= 12) {
    suffix = " PM";
    if (date.getHours() > 12) {
      time = date.getHours() - 12 + ":";
    }
  }

  time =
    date.getMinutes() < 10
      ? time + "0" + date.getMinutes()
      : time + date.getMinutes();

  return time + suffix;
}

// catch and clean error before printing to console
export function catchError(err) {
  var error = {};
  if (typeof err === "string") {
    let errParts = err.split("|");
    error =
      errParts.length > 1
        ? { message: errParts, debug: errParts }
        : { message: err };
  } else {
    error = {
      message: err.message,
      debug: JSON.stringify(err)
    };
  }

  console.log(error);
}

// Returns string for day of week based on numeric value
export function getDayofWeek(num) {
  switch (num) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
    default:
      return "";
  }
}

// Converts dateTimeTimeZone to Date object (used w Microsoft Graph API)
export function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

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
