//Reformat extracted time for better display:
//Display year-month-date hour:minute:second as i.e. 2019-07-10 20:22:44
export function extractTime(time) {
    if (time) {
      let extractedTime = time.split("T");
      extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
      return extractedTime;
    }
  }