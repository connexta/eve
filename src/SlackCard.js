import React from "react";
import styled from "styled-components";
import Parser from "html-react-parser";
import emojis from "./emojis";
import { CX_OFF_WHITE, CX_DARK_BLUE, CX_FONT } from "./Constants";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;

const MAX_MSGS = 5;
const SLACK_FONT_SIZE = "20px";

const CardContainer = styled.div`
  border: 2px solid black;
  background-color: ${CX_DARK_BLUE};

  font-family: ${CX_FONT};
  font-size: 50px;
  color: ${CX_OFF_WHITE};

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

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
  constructor(props) {
    super(props);
    this.state = {
      emojis: {},
      messages: [],
      slackUsers: [],
      isLoading: true
    };
  }

  // refresh messages every 30 sec and user-list every 2 hours
  componentDidMount() {
    this.setUserList();
    this.setEmojiList();
    this.setMessages();
    setInterval(() => this.setMessages(), 30000);
    setInterval(() => this.setUserList(), 72000000);
  }

  // fetch latest messages
  setMessages() {
    console.log("Fetching latest slack messages...");
    fetch(
      "https://slack.com/api/channels.history?token=" +
        TOKEN +
        "&channel=" +
        CHANNEL
    )
      .then(response => response.json())
      .then(data => {
        var messageList = [];
        var msgCount = 0;
        data.messages.forEach(message => {
          msgCount++;
          if (msgCount > MAX_MSGS) return;
          messageList.push(message);
        });
        this.setState({
          messages: messageList,
          isLoading: false
        });
      })
      .catch(e => console.log("error", e));
  }

  // fetch user list
  setUserList() {
    console.log("Fetching slack users...");
    fetch("https://slack.com/api/users.list?token=" + TOKEN)
      .then(response => response.json())
      .then(data => {
        this.setState({ slackUsers: data.members });
      });
  }

  // fetch custom emoji list
  setEmojiList() {
    console.log("Fetching emojis...");
    fetch("https://slack.com/api/emoji.list?token=" + TOKEN)
      .then(response => response.json())
      .then(data => {
        this.setState({ emojis: data.emoji });
      });
  }

  // replace slack specific tags with different text style and emoji
  getSlackStyleMessage(messageText) {
    // set connexta cutom emojis
    const customEmojis = this.state.emojis;

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

      const user = this.state.slackUsers.find(user => {
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
    var members = this.state.slackUsers;
    for (var i = 0; i < members.length; i++) {
      if (members[i].id == id) {
        return members[i].profile.real_name;
      }
    }
    return undefined;
  }

  // return the avatar associated with the given user ID
  userIdToAvatar(id) {
    var members = this.state.slackUsers;
    for (var i = 0; i < members.length; i++) {
      if (members[i].id == id) {
        return members[i].profile.image_48;
      }
    }
    return undefined;
  }

  // returns relative time since msg posted
  getRelativeMsgLife(index) {
    var msgTime = this.state.messages[index].ts;
    var data = new Date();
    var currTime = data.getTime();

    var timeDiff = (currTime - msgTime * 1000) / 60000; // time diff in min

    var timeDiffHrs = Math.round(timeDiff / 60);
    var timeDiffDays = Math.round(timeDiff / 1440);

    if (timeDiff < 60) {
      return Math.round(timeDiff) + " min";
    } else if (timeDiff < 1440) {
      return timeDiffHrs + (timeDiffHrs == 1 ? " hour" : " hours");
    } else {
      return timeDiffDays + (timeDiffDays == 1 ? " day" : " days");
    }
  }

  cardInfo(index) {
    if (this.state.messages[index] == undefined) {
      return "No message";
    }
    var author = this.userIdToName(this.state.messages[index].user);
    if (author == undefined) {
      return "Unknown user";
    }

    var avatar = this.userIdToAvatar(this.state.messages[index].user);
    return (
      `<img height="50" style="border-radius: 50%; margin-right: 10px; margin-left: 5px; margin-top: 5px; display: inline;" src=${avatar} alt=${author} />` +
      `<div style="font-weight: bolder; display: inline; padding-bottom: 10px;">${author}</div>` +
      `<div style="font-size: 15px; color: gray; display: inline; margin-left: 10px;">${this.getRelativeMsgLife(
        index
      )}</div>` +
      `<div style="margin-left: 10px; margin-top: 5px;">${this.getSlackStyleMessage(
        this.state.messages[index].text
      )}</div`
    );
  }

  render() {
    return this.state.isLoading ? (
      <CardContainer>Loading...</CardContainer>
    ) : (
      <CardContainer>
        {Parser(`<div style="margin-left: 10px;">Recent Messages</div>`)}
        <CardStyle>{Parser(this.cardInfo(0))}</CardStyle>
        <CardStyle>{Parser(this.cardInfo(1))}</CardStyle>
        <CardStyle>{Parser(this.cardInfo(2))}</CardStyle>
        <CardStyle>{Parser(this.cardInfo(3))}</CardStyle>
        <CardStyle>{Parser(this.cardInfo(4))}</CardStyle>
      </CardContainer>
    );
  }
}

export default SlackCard;
