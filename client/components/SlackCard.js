import React from "react";
import styled from "styled-components";
import Parser from "html-react-parser";
import square_logo from "../../resources/square_logo.png";
import { getRelativeTime } from "../utils/TimeUtils";
import { CX_FONT } from "../utils/Constants";
import { getEmoji } from "../utils/emojis/emojiUtil";

const SLACK_FONT_SIZE = "20px";

const StyledCard = styled.div`
  padding-bottom: 10px;
  margin: 0 0 5px 0;
  font-family: ${CX_FONT};
  font-size: ${SLACK_FONT_SIZE};
  position: relative;
`;

const ContentContainer = styled.div`
  vertical-align: top;
`;

const HeaderAndContent = styled.div`
  display: inline-block;
  width: 80%;
`;

const CardText = styled.div`
  font-size: ${SLACK_FONT_SIZE};
  margin-top: 4px;
  width: 100%;
  color: black;
  min-height: 100%;
  width: 100%;
`;

const AvatarStyle = styled.img`
  border-radius: 8%;
  margin: 5px 10px 0 0;
  display: inline;
  height: 50px;
  width: 50px;
  display: inline-block;
  vertical-align: top;
`;

const cardMedia =
  "max-width: 10vw; \
  height: 14vh; \
  margin-right: 5px; \
  margin-top: 5px; \
  ;";

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

const fileImgStyle =
  " \
  display: block; \
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

    // set any :emoji: messages
    messageText = messageText.replace(/:(\S+?):/gm, (match, name) => {
      // check for custom emoji
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

      // check for standard emoji
      let emoji = getEmoji(name);
      if (!emoji) {
        return match;
      } else {
        return `<div style="${emojiStyle}">${emoji}</div>`;
      }
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
    messageText = messageText.replace(/\*(.+?)\*(?!\w)/g, (match, phrase) => {
      return `<div style="font-weight: bolder; display: inline;">${phrase}</div>`;
    });

    // set any _italic_ messages
    messageText = messageText.replace(/_(.+?)_(?!\w)/g, (match, phrase) => {
      return `<div style="font-style: italic; display: inline;">${phrase}</div>`;
    });

    // set any ~strikethrough~ messages
    messageText = messageText.replace(/\~(.+?)\~(?!\w)/g, (match, phrase) => {
      return `<div style="text-decoration: line-through; display: inline;">${phrase}</div>`;
    });

    return messageText;
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

    return getRelativeTime(new Date(msgTime * 1000)); // convert sec to ms for date obj
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
      if (
        message.bot_id ||
        (message.attachments && message.attachments.bot_id)
      ) {
        author = "Bot";
      } else {
        author = "Unknown User";
      }
    }

    // check for additional footer info
    let footer =
      message.attachments == undefined ||
      message.attachments[0].footer == undefined
        ? ""
        : " | " + message.attachments[0].footer;

    return (
      `<div style="font-weight: bold; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="${msgLifeStyle}">${this.getRelativeMsgLife(index) +
        footer}</div>`
    );
  }

  getIcon(index) {
    let message = this.props.messages[index];

    let author;
    let avatar;
    if (message != undefined){
      // check if author is bot or unknown
      author =
        message.attachments == undefined
          ? this.userIdToName(message.user)
          : message.attachments[0].author_name;

      avatar =
        message.attachments == undefined
          ? this.userIdToAvatar(message.user)
          : message.attachments[0].author_icon;
    }
    else {
      author = undefined;
      avatar = undefined;
    }

    return author != undefined ? avatar : square_logo;
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
    return this.getSlackStyleMessage(messageText);
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
        : `<div style="${cardMedia}"><img style="${fileImgStyle}" src=${media} alt="media"/></div>`;

    // check if message has file, creating html snippet if it does
    media =
      message.files == undefined
        ? media
        : `<div style="${cardMedia}"><img style="${fileImgStyle}" src=${message.files[0].url_private} alt="file" /></div>`;

    // check if message attachment has file to share
    if (message.attachments && message.attachments[0].files) {
      media = `<div style="${cardMedia}"><img style="${fileImgStyle}" src=${message.attachments[0].files[0].url_private} alt="file" /></div>`;
    }

    return media;
  }

  render() {
    return (
      <StyledCard>
        <AvatarStyle src={this.getIcon(this.props.index)}></AvatarStyle>
        <HeaderAndContent>
          {Parser(this.getCardHeader(this.props.index))}
          <ContentContainer>
            {Parser(this.getCardMedia(this.props.index))}
            <CardText>{Parser(this.getCardText(this.props.index))}</CardText>
          </ContentContainer>
        </HeaderAndContent>
      </StyledCard>
    );
  }
}

export default SlackCard;
