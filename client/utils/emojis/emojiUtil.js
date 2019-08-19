// emoji lib used: https://github.com/iamcal/emoji-data

const emojis = require("./emojis");

export const getEmoji = name => {
  let htmlEmoji = undefined;

  // for each emoji object, convert to html if emoji name matches
  emojis.forEach(emoji_obj => {
    if (emoji_obj.short_name == name) {
      htmlEmoji = htmlify(emoji_obj.unified);
      return;
    }
  });
  return htmlEmoji;
};

// convert unicode to html
const htmlify = unicode => {
  let tokens = unicode.split("-");
  let parsed = [];
  tokens.forEach(token => {
    parsed.push("&#x" + token + ";");
  });
  return parsed.join("");
};
