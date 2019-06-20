import React from "react";
import styled from "styled-components";
import Parser from "html-react-parser";
import emojis from "./emojis";
import { CX_OFF_WHITE } from "./Constants";

const SLACK_FONT_SIZE = "20px";

const CardStyle = styled.div`
  border-radius: 5px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 5px;
  background-color: ${CX_OFF_WHITE};

  max-height: 25%;
  height: 100%;
  overflow: hidden;

  font-family: NotoSansJP, Slack-Lato, appleLogo, sans-serif;
  font-size: ${SLACK_FONT_SIZE};
  color: black;

  position: relative;

  ::before {
    content: "";
    position: absolute;
    top: 80%;
    left: 0;
    height: 20%;
    width: 100%;
    background: linear-gradient(transparent, ${CX_OFF_WHITE});
  }
`;

const inlineCodeStyle =
  "color: red; \
  border: solid gray 1px; \
  border-radius: 5px; \
  padding-left: .25em; \
  padding-right: .25em; \
  display: inline; \
  font-family: monospace; \
  font-size: 18px; \
  background-color: #f8f8f8; \
";

const preformatTextStyle =
  "color: black; \
  border: solid gray 1px; \
  border-radius: 5px; \
  padding-left: .25em; \
  padding-right: .25em; \
  margin-right: 10px; \
  margin-top: 5px; \
  font-family: monospace; \
  font-size: 18px; \
  background-color: #f8f8f8; \
  white-space: pre; \
";

const emojiStyle =
  " \
  margin-left: .25em; \
  margin-right: .25em; \
  display: inline; \
";

const userChanStyle =
  " \
  color: #4c8dac; \
  margin-left: .10em; \
  margin-right: .10em; \
  font-size: " +
  SLACK_FONT_SIZE +
  ";";

const msgLifeStyle =
  " \
  font-size: 15px; \
  color: gray; \
  display: inline; \
  margin-left: 10px; \
  ";

const avatarStyle =
  " \
  border-radius: 50%; \
  margin-right: 10px; \
  margin-left: 5px; \
  margin-top: 5px; \
  display: inline; \
  ";

class SlackCard extends React.Component {
  // replace slack specific tags with different text style and emoji
  getSlackStyleMessage(messageText) {
    // set connexta cutom emojis
    const customEmojis = this.props.emojis;

    if (!messageText) {
      messageText = "Error: Could not find message :(";
    }

    // replace custom emojis found
    messageText.replace(/:(.*?):/g, (match, name) => {
      if (customEmojis[name]) {
        // alias points to actual
        if (customEmojis[name].includes("alias:")) {
          messageText = messageText.replace(
            `:${name}:`,
            `<img height="25" width="25" style="${emojiStyle}" src=${
              customEmojis[customEmojis[name].split(":")[1]]
            } alt=${name}/>`
          );
        } else {
          messageText = messageText.replace(
            `:${name}:`,
            `<img height="25" width="25" style="${emojiStyle}" src=${customEmojis[name]} alt=${name}/>`
          );
        }
      }
    });

    // set any `` messages
    messageText.replace(
      /(?<![`|a-z|A-Z])`(?!`)(.+?)(?<!`)`(?![`|a-z|A-Z])/g,
      (match, phrase) => {
        messageText = messageText.replace(
          `\`${phrase}\``,
          `<div style="${inlineCodeStyle}">${phrase}</div>`
        );
      }
    );

    // set any ``` ``` messages
    messageText.replace(/```(.*?)```/gs, (match, phrase) => {
      messageText = messageText.replace(
        `\`\`\`${phrase}\`\`\``,
        `<div style="${preformatTextStyle}">${phrase}</div>`
      );
    });

    // decode any user/channel tagged
    messageText.replace(/<(.*?)>/g, (match, phrase) => {
      const id = phrase.slice(1, phrase.length);

      const user = this.props.slackUsers.find(user => {
        return user.id === id;
      });

      if (user) {
        messageText = messageText.replace(
          `<${phrase}>`,
          `<small style="${userChanStyle}">@${user.profile.display_name}</small>`
        );
      } else {
        // handle tags to other channels
        if (!phrase.includes("img") && phrase.includes("|")) {
          messageText = messageText.replace(
            `<${phrase}>`,
            `<small style="${userChanStyle}">#${phrase.split("|")[1]}</small>`
          );
        }
      }
    });

    // set any *bold* messages
    messageText.replace(/\*(.*?)\*/g, (match, phrase) => {
      messageText = messageText.replace(
        `*${phrase}*`,
        `<div style="font-weight: bolder; display: inline;">${phrase}</div>`
      );
    });

    // set any _italic_ messages
    messageText.replace(
      /(?<![a-z|A-Z])_(.*?)_(?![a-z|A-Z])/g,
      (match, phrase) => {
        messageText = messageText.replace(
          `_${phrase}_`,
          `<div style="font-style: italic; display: inline;">${phrase}</div>`
        );
      }
    );

    // set slack built in emojis
    return emojis.html(messageText);
  }

  // return name from given user ID
  userIdToName(id) {
    var user = this.props.slackUsers.find(member => {
      return member.id == id;
    });
    return user == undefined ? undefined : user.profile.real_name;
  }

  // return the avatar associated with the given user ID
  userIdToAvatar(id) {
    var user = this.props.slackUsers.find(member => {
      return member.id == id;
    });
    return user == undefined ? undefined : user.profile.image_48;
  }

  // returns relative time since msg posted
  getRelativeMsgLife(index) {
    var msgTime = this.props.messages[index].ts;
    var data = new Date();
    var currTime = data.getTime();

    var timeDiff = (currTime - msgTime * 1000) / 60000; // time diff in min

    var timeDiffMin = Math.round(timeDiff);
    var timeDiffHrs = Math.round(timeDiff / 60);
    var timeDiffDays = Math.round(timeDiff / 1440);

    if (timeDiff < 60) {
      return timeDiffMin == 0 ? "now" : timeDiffMin + " min ago";
    } else if (timeDiffHrs < 24) {
      return timeDiffHrs + (timeDiffHrs == 1 ? " hour ago" : " hours ago");
    } else {
      return timeDiffDays + (timeDiffDays == 1 ? " day ago" : " days ago");
    }
  }

  cardInfo(index) {
    if (this.props.messages[index] == undefined) {
      return "No message";
    }
    var author = this.userIdToName(this.props.messages[index].user);
    if (author == undefined) {
      return "Unknown user";
    }

    var avatar = this.userIdToAvatar(this.props.messages[index].user);
    return (
      `<img height="50" style="${avatarStyle}" src=${avatar} alt=${author} />` +
      `<div style="font-weight: bold; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="${msgLifeStyle}">${this.getRelativeMsgLife(index)}</div>` +
      `<div style="margin-left: 10px; margin-top: 5px;">${this.getSlackStyleMessage(
        this.props.messages[index].text
      )}</div>`
    );
  }

  render() {
    return <CardStyle>{Parser(this.cardInfo(this.props.index))}</CardStyle>;
  }
}

export default SlackCard;
