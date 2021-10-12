const graphapi = require("./graphapi");

const TEAMID = process.env.TEAMS_TEAMID;
const CHANID = process.env.TEAMS_CHANID;
const url =
  "https://graph.microsoft.com/beta/teams/" +
  TEAMID +
  "/channels/" +
  CHANID +
  "/messages";

module.exports = {
  getMessages: async function() {
    const messageList = await graphapi.callApiWithToken(url);
    //console.log("MESSAGE_LIST:", messageList);
    const messages = [];

    for (const key of Object.keys(messageList.value)) {
      const messageID = messageList.value[key].id;
      const url2 = url + "/" + messageID;
      const message = await graphapi.callApiWithToken(url2);
      if (message.from == null) {
        // Skipping SYSTEM generated message
        continue;
      }

      messages.push({
        user: message.from.user.displayName,
        content: message.body.content,
        date: message.createdDateTime,
        url: message.webUrl,
      });
    }

    const short_list = messages.slice(0, 5);
    //console.log("=-=-=-=-= SHORT LIST", short_list)
    return short_list;
  },
};
