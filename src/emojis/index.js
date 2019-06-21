const emojis = require("./characters");

exports.unicode = input => {
  return replace(input, unicodeForEmoji);
};

exports.html = input => {
  return replace(input, htmlForEmoji); // pass in function htmlForEmoji
};

// fn -> function to be used
function replace(input, fn) {
  const tokens = input.split(":"); // tokens split by colon
  const parsed = []; // parsed tokens
  let emojiBefore = true; // flag indicating if previous iteration token is an emoji

  for (let i = 0; i < tokens.length; ++i) {
    // for each token
    const emojiCurrent = isEmoji(tokens[i]); // flag indicating if current iteration token is an emoji

    if (!emojiBefore && !emojiCurrent) {
      // if we are not dealing with an emoji
      parsed.push(":"); // adds the colon back
    }

    if (emojiCurrent) {
      // if current iteration token is an emoji
      parsed.push(fn(tokens[i])); // parses the emoji and push it to the parsed array
    } else {
      // if current iteration token isn't an emoji
      parsed.push(tokens[i]); // push it without any parsing
    }
    emojiBefore = emojiCurrent; // setting current flag as before flag
  }

  return parsed.join(""); // joining the parsed tokens and returning it
}

function isEmoji(token) {
  return emojis[token] !== undefined;
}

function unicodeForEmoji(token) {
  return emojis[token];
}

function htmlForEmoji(token) {
  const src = require("../../resources/emojis/" + token + ".png");
  return `<img class="emoji" width="25" height="25" style="display: inline;" src=${src} alt="${token}">`;
}
