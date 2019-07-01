import React from "react";
import styled from "styled-components";
import Parser from "html-react-parser";
import emojis from "./emojis";
import { CX_OFF_WHITE } from "./Constants";
import circle_logo from "../resources/circle_logo.png";

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
`;

const CardContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const CardText = styled.div`
  font-family: NotoSansJP, Slack-Lato, appleLogo, sans-serif;
  font-size: ${SLACK_FONT_SIZE};
  color: black;

  min-height: 100%;
  width: 100%;

  ::before {
    content: "";
    position: absolute;
    top: 80%;
    right: 0;
    height: 20%;
    width: 100%;
    background: linear-gradient(transparent, ${CX_OFF_WHITE});
    z-index: 1;
  }
`;

const CardMedia = styled.div`
  max-width: 10vw;
  height: 14vh;
  margin-right: 5px;
  margin-top: 5px;
  z-index: 3;
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
  overflow: hidden; \
  white-space: nowrap; \
  font-size: " +
  SLACK_FONT_SIZE +
  ";";

const msgLifeStyle =
  " \
  font-size: 15px; \
  color: gray; \
  display: inline; \
  margin-left: 10px; \
  white-space: nowrap; \
  overflow: hidden; \
  ";

const avatarStyle =
  " \
  border-radius: 50%; \
  margin-right: 10px; \
  margin-left: 5px; \
  margin-top: 5px; \
  display: inline; \
  height: 50px; \
  width: 50px; \
  ";

const fileImgStyle =
  " \
  display: block; \
  margin-left: 10px; \
  margin-right: 10px; \
  width: 100%; \
  height: 100%; \
  ";

class SlackCard extends React.Component {
  // replace slack specific tags with different text style and emoji
  getSlackStyleMessage(messageText) {
    // set connexta cutom emojis
    const customEmojis = this.props.emojis;

    if (!messageText) {
      messageText = "";
      return messageText;
    }

    // replace custom emojis found
    messageText = messageText.replace(/:(.+?):/gm, (match, name) => {
      if (customEmojis[name]) {
        // alias points to actual
        if (customEmojis[name].includes("alias:")) {
          return `<img height="20" width="20" style="${emojiStyle}" src=${
            customEmojis[customEmojis[name].split(":")[1]]
          } alt=${name}/>`;
        } else {
          return `<img height="20" width="20" style="${emojiStyle}" src=${customEmojis[name]} alt=${name}/>`;
        }
      }
      return `:${name}:`;
    });

    // set any `` messages
    messageText.replace(/`([^``].+?[^``])`[^\S]/gm, (match, phrase) => {
      messageText = messageText.replace(
        `\`${phrase}\``,
        `<div style="${inlineCodeStyle}">${phrase}</div>`
      );
    });

    // set any ``` ``` messages
    messageText.replace(/`{3}(.+?)`{3}(?!\S)/gm, (match, phrase) => {
      messageText = messageText.replace(
        `\`\`\`${phrase}\`\`\``,
        `<div style="${preformatTextStyle}">${phrase}</div>`
      );
    });

    // decode any user/channel tagged
    messageText.replace(/<(.+?)>/g, (match, phrase) => {
      const id = phrase.slice(1, phrase.length);

      var user;
      if (this.props.slackUsers != undefined) {
        user = this.props.slackUsers.find(user => {
          return user.id === id;
        });
      }

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

    // decode any <http(s)> links, removing '< >' to avoid issues with html parser
    // treating as tag
    messageText.replace(/<(http.*?)>/g, (match, phrase) => {
      messageText = messageText.replace(`<${phrase}>`, phrase);
    });

    // set any *bold* messages
    messageText.replace(/\*(.+?)\*[^\S]/g, (match, phrase) => {
      messageText = messageText.replace(
        `*${phrase}*`,
        `<div style="font-weight: bolder; display: inline;">${phrase}</div>`
      );
    });

    // set any _italic_ messages
    messageText.replace(/_(.+?)_[^\S]/g, (match, phrase) => {
      messageText = messageText.replace(
        `_${phrase}_`,
        `<div style="font-style: italic; display: inline;">${phrase}</div>`
      );
    });

    // set slack built in emojis
    return emojis.html(messageText);
  }

  // return name from given user ID
  userIdToName(id) {
    if (this.props.slackUsers == undefined) {
      return undefined;
    }

    var user = this.props.slackUsers.find(member => {
      return member.id == id;
    });
    return user == undefined ? undefined : user.profile.real_name;
  }

  // return the avatar associated with the given user ID
  userIdToAvatar(id) {
    if (this.props.slackUsers == undefined) {
      return undefined;
    }

    var user = this.props.slackUsers.find(member => {
      return member.id == id;
    });

    return user == undefined ? undefined : user.profile.image_48;
  }

  // returns relative time since msg posted
  getRelativeMsgLife(index) {
    if (this.props.messages == undefined) {
      return undefined;
    }

    var message = this.props.messages[index];
    var msgTime =
      message.attachments == undefined ? message.ts : message.attachments[0].ts;
    msgTime = msgTime == undefined ? message.ts : msgTime;

    var data = new Date();
    var currTime = data.getTime();

    var timeDiff = (currTime - msgTime * 1000) / 60000; // time diff in min

    var timeDiffMin = Math.round(timeDiff);
    var timeDiffHrs = Math.round(timeDiff / 60);
    var timeDiffDays = Math.round(timeDiff / 1440);

    // check for additional footer info
    var footer =
      message.attachments == undefined
        ? ""
        : " | " + message.attachments[0].footer;

    if (timeDiff < 60) {
      return (timeDiffMin == 0 ? "now" : timeDiffMin + " min ago") + footer;
    } else if (timeDiffHrs < 24) {
      return (
        timeDiffHrs + (timeDiffHrs == 1 ? " hour ago" : " hours ago") + footer
      );
    } else {
      return (
        timeDiffDays + (timeDiffDays == 1 ? " day ago" : " days ago") + footer
      );
    }
  }

  getCardHeader(index) {
    var message = this.props.messages[index];
    if (message == undefined) {
      return "Error: No message";
    }

    // check if author is bot or unknown
    var author =
      message.attachments == undefined
        ? this.userIdToName(message.user)
        : message.attachments[0].author_name;
    if (message.bot_id != undefined) {
      author = "Bot";
    } else if (author == undefined) {
      author = "Unknown User";
    }

    const unknown = `<img style="${avatarStyle}" src=${circle_logo} alt=${author} />`;
    var avatar =
      message.attachments == undefined
        ? this.userIdToAvatar(message.user)
        : message.attachments[0].author_icon;
    var icon =
      avatar == undefined
        ? unknown
        : `<img style="${avatarStyle}" src=${avatar} alt=${author} />`;

    return (
      icon +
      `<div style="font-weight: bold; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="${msgLifeStyle}">${this.getRelativeMsgLife(index)}</div>`
    );
  }

  getCardText(index) {
    var message = this.props.messages[index];
    if (message == undefined) {
      message = "No message";
    }

    // account for message being shared message
    var messageText =
      message.attachments == undefined
        ? message.text
        : message.attachments[0].text;
    return `<div style="margin-left: 10px; margin-top: 5px;">${this.getSlackStyleMessage(
      messageText
    )}</div>`;
  }

  getCardMedia(index) {
    var message = this.props.messages[index];

    // check if media comes from attachment or file in api call
    var image =
      message.attachments == undefined
        ? message.image_url
        : message.attachments[0].image_url;
    image =
      image == undefined
        ? ""
        : `<img style="${fileImgStyle}" src=${image} alt="image"/>`;
    image =
      message.files == undefined
        ? image
        : `<img style="${fileImgStyle}" src=${message.files[0].url_private} alt="file" />`;

    return image;
  }

  render() {
    return (
      <CardStyle>
        {Parser(this.getCardHeader(this.props.index))}
        <CardContentContainer>
          <CardMedia>{Parser(this.getCardMedia(this.props.index))}</CardMedia>
          <CardText>{Parser(this.getCardText(this.props.index))}</CardText>
        </CardContentContainer>
      </CardStyle>
    );
  }
}

export default SlackCard;
