import React from "react";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants";
import Card from "@material-ui/core/Card";
import { BOX_STYLE } from "./index";
import { CX_OFF_WHITE, CX_DARK_BLUE, CX_FONT } from "./Constants";
import { minute, time } from "./utilities/TimeUtils";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;
const MAX_MSGS = 9;
const CARD_HEIGHT = (window.innerHeight - 124) / 2 - 18;

const styles = {
  CardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
    height: CARD_HEIGHT
  },
  cardHeader: {
    fontFamily: CX_FONT,
    margin: "12px 0 12px 16px",
    height: "40px"
  },
  SlackCardContainer: {
    top: "72px",
    height: "100%",
    position: "absolute"
  },
  GradientBlock: {
    height: "15%",
    width: "100%",
    bottom: "10px",
    background: "linear-gradient(transparent," + CX_OFF_WHITE + ")",
    position: "absolute",
    zIndex: 2
  },
  WhiteBlock: {
    height: "12px",
    width: "100%",
    bottom: 0,
    background: CX_OFF_WHITE,
    position: "absolute",
    zIndex: 3
  }
};

class SlackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojis: [],
      messages: [],
      slackUsers: [],
      channels: [],
      userLoading: true,
      emojiLoading: true,
      msgLoading: true,
      chanLoading: true
    };
  }

  // refresh messages every 60 sec and user-list every 2 hours
  async componentDidMount() {
    await this.setUserList();
    await this.setEmojiList();
    await this.setMessages();
    await this.setChannels();

    this.messageIntervalID = setInterval(() => this.setMessages(), minute);
    this.userListIntervalID = setInterval(
      () => this.setUserList(),
      time({ hours: 2 })
    );
    this.checkRefreshIntervalID = setInterval(
      () => this.checkRefresh(),
      minute
    );
  }

  // clean up intervals
  componentWillUnmount() {
    clearInterval(this.messageIntervalID);
    clearInterval(this.userListIntervalID);
    clearInterval(this.checkRefreshIntervalID);
  }

  // checks if any components need to re-fetch data
  checkRefresh() {
    if (this.state.userLoading) {
      this.setUserList();
    }
    if (this.state.emojiLoading) {
      this.setEmojiList();
    }
    if (this.state.msgLoading) {
      this.setMessages();
    }
    if (this.state.chanLoading) {
      this.setChannels();
    }
  }

  // fetch latest slack messages
  async setMessages() {
    console.log("Fetching latest slack messages...");
    const response = await fetch(
      "https://slack.com/api/channels.history?token=" +
        TOKEN +
        "&channel" +
        CHANNEL
    ).catch(e => console.log("error", e));

    if (response.json().ok) {
      let messageList = [];
      response.json().messages.forEach((message, msgCount) => {
        msgCount++;
        if (msgCount > MAX_MSGS) return;
        messageList.push(message);
      });
      this.setState({ messages: messageList, msgLoading: false });
    } else {
      console.log("Failed to fetch slack messages");
    }
  }

  // fetch user list
  async setUserList() {
    console.log("Fetching slack users...");
    const response = await fetch(
      "https://slack.com/api/users.list?token=" + TOKEN
    ).catch(e => console.log("error", e));

    if (response.json().ok) {
      this.setState({
        slackUsers: response.json().members,
        userLoading: false
      });
    } else {
      console.log("Failed to fetch slack users");
    }
  }

  // fetch custom emoji list
  async setEmojiList() {
    console.log("Fetching emojis...");
    const response = await fetch(
      "https://slack.com/api/emoji.list?token=" + TOKEN
    ).catch(e => console.log("error", e));

    if (response.json().ok) {
      this.setState({ emojis: response.json().emoji, emojiLoading: false });
    } else {
      console.log("Failed to fetch slack emojis");
    }
  }

  async setChannels() {
    console.log("Fetching slack channels...");
    const response = await fetch(
      "https://slack.com/api/channels.list?token=" + TOKEN
    ).catch(e => console.log("error", e));

    if (response.json().ok) {
      this.setState({ channels: response.json().channels, chanLoading: false });
    } else {
      console.log("Failed to fetch slack channels");
    }
  }

  getChannelName(id) {
    var channel = this.state.channels.find(chan => {
      return chan.id == id;
    });
    return channel == undefined ? undefined : channel.name;
  }

  // check if any data is still being fetched
  anyStillLoading() {
    return (
      this.state.userLoading ||
      this.state.emojiLoading ||
      this.state.msgLoading ||
      this.state.chanLoading
    );
  }

  render() {
    if (this.anyStillLoading()) {
      return (
        <Card style={{ ...styles.CardContainer, ...BOX_STYLE }} raised={true}>
          Loading Slack...
        </Card>
      );
    } else {
      let cardList = [];
      for (var i = 0; i < MAX_MSGS; i++) {
        cardList.push(
          <SlackCard
            key={i}
            index={i}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
        );
      }

      return (
        <Card style={{ ...styles.CardContainer, ...BOX_STYLE }} raised={true}>
          <span style={styles.cardHeader}>#{this.getChannelName(CHANNEL)}</span>
          <div style={styles.GradientBlock}></div>
          <div style={styles.WhiteBlock}></div>
          <div style={styles.SlackCardContainer}>{cardList}</div>
        </Card>
      );
    }
  }
}

export default SlackComponent;
