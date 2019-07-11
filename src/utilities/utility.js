//Reformat extracted time for better display:
//Display year-month-date hour:minute:second as i.e. 2019-07-10 20:22:44
export function extractTime(time) {
  if (time) {
    let extractedTime = time.split("T");
    extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
    return extractedTime;
  }
}

//@param: time is a Date object representing the target time to be used to calculate relative time
//@return:
//  gets calculated relative time from current time.
//  i.e. 19 hours ago
export function getRelativeTime(targetDate) {
  if (typeof targetDate == undefined) {
    return undefined;
  }

  let currDate = new Date();
  let currTime = currDate.getTime();
  let targetTime = targetDate.getTime();

  let timeDiff = (currTime - targetTime) / 60000; // time diff in min

  let timeDiffMin = Math.round(timeDiff);
  let timeDiffHrs = Math.round(timeDiff / 60);
  let timeDiffDays = Math.round(timeDiff / 1440);

  if (timeDiff < 60) {
    return timeDiffMin == 0 ? "now" : timeDiffMin + " min ago";
  } else if (timeDiffHrs < 24) {
    return timeDiffHrs + (timeDiffHrs == 1 ? " hour ago" : " hours ago");
  } else {
    return timeDiffDays + (timeDiffDays == 1 ? " day ago" : " days ago");
  }
}
