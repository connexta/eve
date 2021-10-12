const graphapi = require("./graphapi");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  getPages: async function() {
    const pages = await graphapi.callApiWithToken(
      "https://graph.microsoft.com/beta/sites/root/pages"
    );

    const cards = pages.value
      .filter((page) => {
        return page.createdBy.user.displayName != "System Account";
      })
      .map((page) => {
        const title = page.title;
        const createdBy = page.createdBy.user.displayName;
        const date = page.lastModifiedDateTime;
        const link = page.webUrl;

        return {
          title,
          createdBy,
          date,
          link,
        };
      })
      .slice(0, 5);

    return cards;
  },
};
