const graphapi = require("./graphapi");

module.exports = {
  getPages: async function() {
    const pages = await graphapi.callApiWithToken('https://graph.microsoft.com/beta/sites/root/pages');
    //console.log("PAGES:", pages);
  }
};
