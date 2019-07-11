export function extractTime(time) {
    if (time) {
      let extractedTime = time.split("T");
      extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
      return extractedTime;
    }
  }