const graphapi = require("./graphapi");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  getPages: async function() {
    const pages = await graphapi.callApiWithToken('https://graph.microsoft.com/beta/sites/root/pages');
    //console.log("PAGES:", pages);

    const cards = new Map();
    let x = 0;
    pages.value.forEach(page => {
       //console.log("PAGE:", page);
       const card = {
         style: page.webParts,
         date: page.lastModifiedDateTime,
         link: page.webUrl,
         text: page.title};
       x++;
       cards.set(x,card);
    });
    return cards;
  }
};
