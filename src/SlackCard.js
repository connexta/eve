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

  height: 100%;

  font-family: Consolas, monaco, "Ubuntu Mono", courier, monospace !important;
  font-size: ${SLACK_FONT_SIZE};
  color: black;
`;

class SlackCard extends React.Component {
  // replace slack specific tags with different text style and emoji
  getSlackStyleMessage(messageText) {
    // set connexta cutom emojis
    const customEmojis = this.props.emojis;

    if (!messageText) {
      messageText = "Could not find message :sad_octopus_monkey:!";
    }

    // replace custom emojis found
    messageText.replace(/:(.*?):/g, (match, name) => {
      if (customEmojis[name]) {
        // alias points to actual
        if (customEmojis[name].includes("alias:")) {
          messageText = messageText.replace(
            `:${name}:`,
            `<img height="25" width="25" style="margin-left: .25em; margin-right: .25em; display: inline;" src=${
              customEmojis[customEmojis[name].split(":")[1]]
            } alt=${name}/>`
          );
        } else {
          messageText = messageText.replace(
            `:${name}:`,
            `<img height="25" width="25" style="margin-left: .25em; margin-right: .25em; display: inline;" src=${customEmojis[name]} alt=${name}/>`
          );
        }
      }
    });

    // set any `` messages
    messageText.replace(/`(.*?)`/g, (match, phrase) => {
      messageText = messageText.replace(
        `\`${phrase}\``,
        `<div style="color: red; margin-left: .25em; margin-right: .25em;">${phrase}</div>`
      );
    });

    // decode anyone user tagged
    messageText.replace(/<(.*?)>/g, (match, phrase) => {
      const id = phrase.slice(1, phrase.length);

      const user = this.props.slackUsers.find(user => {
        return user.id === id;
      });

      if (user) {
        messageText = messageText.replace(
          `<${phrase}>`,
          `<small style="color: #4c8dac; margin-left: .10em; margin-right: .10em; font-size: ${SLACK_FONT_SIZE}">@${user.profile.display_name}</small>`
        );
      } else {
        // handle tags to other channels
        if (!phrase.includes("img") && phrase.includes("|")) {
          messageText = messageText.replace(
            `<${phrase}>`,
            `<small style="color: #4c8dac; margin-left: .10em; margin-right: .10em; font-size: ${SLACK_FONT_SIZE}">#${
              phrase.split("|")[1]
            }</small>`
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
    messageText.replace(/_(.*?)_/g, (match, phrase) => {
      messageText = messageText.replace(
        `_${phrase}_`,
        `<div style="font-style: italic; display: inline;">${phrase}</div>`
      );
    });

    // set slack built in emojis
    return emojis.html(messageText, "resources/emojis/");
  }

  // return name from given user ID
  userIdToName(id) {
    var name;
    this.props.slackUsers.forEach(member => {
      if (member.id == id) {
        name = member.profile.real_name;
        return;
      }
    });
    return name;
  }

  // return the avatar associated with the given user ID
  userIdToAvatar(id) {
    var avatar;
    this.props.slackUsers.forEach(member => {
      if (member.id == id) {
        avatar = member.profile.image_48;
        return;
      }
    });
    return avatar;
  }

  // returns relative time since msg posted
  getRelativeMsgLife(index) {
    var msgTime = this.props.messages[index].ts;
    var data = new Date();
    var currTime = data.getTime();

    var timeDiff = (currTime - msgTime * 1000) / 60000; // time diff in min

    var timeDiffHrs = Math.round(timeDiff / 60);
    var timeDiffDays = Math.round(timeDiff / 1440);

    if (timeDiff < 60) {
      return Math.round(timeDiff) + " min";
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
      `<img height="50" style="border-radius: 50%; margin-right: 10px; margin-left: 5px; margin-top: 5px; display: inline;" src=${avatar} alt=${author} />` +
      `<div style="font-weight: bolder; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="font-size: 15px; color: gray; display: inline; margin-left: 10px;">${this.getRelativeMsgLife(
        index
      )}</div>` +
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
