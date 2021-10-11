const graphapi = require("./graphapi");

const TEAMID = process.env.TEAMS_TEAMID;
const CHANID =  process.env.TEAMS_CHANID;
const url = 'https://graph.microsoft.com/beta/teams/' + TEAMID + '/channels/' + CHANID + '/messages';

module.exports = {
  getMessages: async function() {
    const messageList = await graphapi.callApiWithToken(url);
    //console.log("MESSAGE_LIST:", messageList);
    for (const key of Object.keys(messageList.value)) {
      const messageID = messageList.value[key].id;
      const url2 = url + '/' + messageID;
      const message = await graphapi.callApiWithToken(url2);
      if (message.from == null) {
        // Skipping SYSTEM generated message
        continue;
      }
      //console.log("MESSAGE:", message);
      const from_user = message.from.user.displayName;
      const content = message.body.content;
      const ctime = message.createdDateTime;
      const weburl = message.webUrl;
      //console.log("MESSAGE_DATA: ", "date-> '", ctime, "', user-> '", from_user, "', content-> '", content, "', url-> '", weburl, "'");
    }
  }
};
