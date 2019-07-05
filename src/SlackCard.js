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
      return match;
    });

    // set any `` messages
    messageText = messageText.replace(
      /`([^``].+?[^``])`(?!\S)/gm,
      (match, phrase) => {
        return `<div style="${inlineCodeStyle}">${phrase}</div>`;
      }
    );

    // set any ``` ``` messages
    messageText = messageText.replace(
      /`{3}(.+?)`{3}(?!\S)/gm,
      (match, phrase) => {
        return `<div style="${preformatTextStyle}">${phrase}</div>`;
      }
    );

    // decode any user/channel tagged
    messageText = messageText.replace(/<(.+?)>/g, (match, phrase) => {
      const id = phrase.slice(1, phrase.length);

      let user;
      if (this.props.slackUsers != undefined) {
        user = this.props.slackUsers.find(user => {
          return user.id === id;
        });
      }

      if (user) {
        return `<small style="${userChanStyle}">@${user.profile.display_name}</small>`;
      } else {
        // handle tags to other channels
        if (!phrase.includes("img") && phrase.includes("|")) {
          return `<small style="${userChanStyle}">#${
            phrase.split("|")[1]
          }</small>`;
        }
      }
      return match;
    });

    // decode any <http(s)> links, removing '< >' to avoid issues with html parser
    // treating as tag
    messageText = messageText.replace(
      /<(http.*?)>/g,
      (match, phrase) => phrase
    );

    // set any *bold* messages
    messageText = messageText.replace(/\*(.+?)\*(?!\S)/g, (match, phrase) => {
      return `<div style="font-weight: bolder; display: inline;">${phrase}</div>`;
    });

    // set any _italic_ messages
    messageText = messageText.replace(/_(.+?)_(?!\S)/g, (match, phrase) => {
      return `<div style="font-style: italic; display: inline;">${phrase}</div>`;
    });

    // set slack built in emojis
    return emojis.html(messageText);
  }

  // return name from given user ID
  userIdToName(id) {
    if (this.props.slackUsers == undefined) {
      return undefined;
    }

    let user = this.props.slackUsers.find(member => {
      return member.id == id;
    });
    return user == undefined ? undefined : user.profile.real_name;
  }

  // return the avatar associated with the given user ID
  userIdToAvatar(id) {
    if (this.props.slackUsers == undefined) {
      return undefined;
    }

    let user = this.props.slackUsers.find(member => {
      return member.id == id;
    });

    return user == undefined ? undefined : user.profile.image_48;
  }

  // returns relative time since msg posted
  getRelativeMsgLife(index) {
    if (this.props.messages == undefined) {
      return undefined;
    }

    let message = this.props.messages[index];
    let msgTime =
      message.attachments == undefined ? message.ts : message.attachments[0].ts;
    msgTime = msgTime == undefined ? message.ts : msgTime;

    let data = new Date();
    let currTime = data.getTime();

    let timeDiff = (currTime - msgTime * 1000) / 60000; // time diff in min

    let timeDiffMin = Math.round(timeDiff);
    let timeDiffHrs = Math.round(timeDiff / 60);
    let timeDiffDays = Math.round(timeDiff / 1440);

    if (timeDiff < 60) {
      return timeDiffMin == 0 ? "now" : timeDiffMin + " min ago";
    } else if (timeDiffHrs < 24) {
      return timeDiffHrs + (timeDiffHrs == 1 ? " hour ago" : " hours ago");
    } else {
      return timeDiffDays + (timeDiffDays == 1 ? " day ago" : " days ago");
    }
  }

  getCardHeader(index) {
    let message = this.props.messages[index];
    if (message == undefined) {
      return "Error: No message";
    }

    // check if author is bot or unknown
    let author =
      message.attachments == undefined
        ? this.userIdToName(message.user)
        : message.attachments[0].author_name;
    // Got rid of bot check, since all wallboard posts come from bot
    if (author == undefined) {
      author = "Unknown User";
    }

    // get avatar for user
    const unknownAvatar = `<img style="${avatarStyle}" src=${circle_logo} alt=${author} />`;
    let avatar =
      message.attachments == undefined
        ? this.userIdToAvatar(message.user)
        : message.attachments[0].author_icon;
    let icon =
      avatar == undefined
        ? unknownAvatar
        : `<img style="${avatarStyle}" src=${avatar} alt=${author} />`;

    // check for additional footer info
    let footer =
      message.attachments == undefined
        ? ""
        : " | " + message.attachments[0].footer;

    return (
      icon +
      `<div style="font-weight: bold; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="${msgLifeStyle}">${this.getRelativeMsgLife(index) +
        footer}</div>`
    );
  }

  getCardText(index) {
    let message = this.props.messages[index];
    if (message == undefined) {
      message = "No message";
    }

    // account for message being shared message
    let messageText =
      message.attachments == undefined
        ? message.text
        : message.attachments[0].text;
    return `<div style="margin-left: 10px; margin-top: 5px;">${this.getSlackStyleMessage(
      messageText
    )}</div>`;
  }

  getCardMedia(index) {
    let message = this.props.messages[index];

    // check if message has attachments (message is link to another message)
    let media =
      message.attachments == undefined
        ? message.image_url
        : message.attachments[0].image_url;

    // check if message has media, creating html snippet if it does
    media =
      media == undefined
        ? ""
        : `<img style="${fileImgStyle}" src=${media} alt="media"/>`;

    // check if message has file, creating html snippet if it does
    media =
      message.files == undefined
        ? media
        : `<img style="${fileImgStyle}" src=${message.files[0].url_private} alt="file" />`;

    return media;
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
