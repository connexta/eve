import React from "react";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_FONT } from "./Constants";
import Card from "@material-ui/core/Card";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;

const MAX_MSGS = 9;

const styles = {
  CardContainer: {
    margin: "8px 8px 8px 8px",
    fontSize: "50px",
    color: "black",
    height: "50%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: CX_OFF_WHITE,
    position: "relative"
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
    bottom: 0,
    background: "linear-gradient(transparent," + CX_OFF_WHITE + ")",
    position: "absolute",
    zIndex: 10
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
      msgLoading: true,
      userLoading: true,
      emojiLoading: true,
      chanLoading: true
    };
  }

  // refresh messages every 60 sec and user-list every 2 hours
  componentDidMount() {
    this.setUserList();
    this.setEmojiList();
    this.setMessages();
    this.setChannels();
    this.messageIntervalID = setInterval(() => this.setMessages(), 1000 * 60);
    this.userListIntervalID = setInterval(
      () => this.setUserList(),
      1000 * 60 * 60 * 2
    );
    this.refreshIntervalID = setInterval(() => this.refreshAll(), 1000 * 30);
  }

  componentWillUnmount() {
    clearInterval(this.messageIntervalID);
    clearInterval(this.userListIntervalID);
    clearInterval(this.refreshIntervalID);
  }

  refreshAll() {
    if (!this.stillLoading()) {
      return;
    }
    console.log("Refreshing all...");
    this.setUserList();
    this.setEmojiList();
    this.setMessages();
    this.setChannels();
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
      .then(response => {
        if (!response.ok) {
          console.log("Failed to fetch slack messages");
          return;
        }
        return response.json();
      })
      .then(data => {
        var messageList = [];
        data.messages.forEach((message, msgCount) => {
          msgCount++;
          if (msgCount > MAX_MSGS) return;
          messageList.push(message);
        });
        this.setState({
          messages: messageList,
          msgLoading: false
        });
      })
      .catch(e => console.log("error", e));
  }

  // fetch user list
  setUserList() {
    console.log("Fetching slack users...");
    fetch("https://slack.com/api/users.list?token=" + TOKEN)
      .then(response => {
        if (!response.ok) {
          console.log("Failed to fetch slack users");
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({ slackUsers: data.members, userLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  // fetch custom emoji list
  setEmojiList() {
    console.log("Fetching emojis...");
    fetch("https://slack.com/api/emoji.list?token=" + TOKEN)
      .then(response => {
        if (!response.ok) {
          console.log("Failed to fetch slack emojis");
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({ emojis: data.emoji, emojiLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  // fetch channel list
  setChannels() {
    fetch("https://slack.com/api/channels.list?token=" + TOKEN)
      .then(response => {
        if (!response.ok) {
          console.log("Failed to fetch slack channels");
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({ channels: data.channels, chanLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  getChannelName(id) {
    var channel = this.state.channels.find(chan => {
      return chan.id == id;
    });
    return channel == undefined ? undefined : channel.name;
  }

  // check if anything is still loading
  stillLoading() {
    return (
      this.state.msgLoading ||
      this.state.userLoading ||
      this.state.chanLoading ||
      this.state.emojiLoading
    );
  }

  render() {
    let cardList = [];
    for (var i = 0; i < MAX_MSGS; i++) {
      cardList.push(
        <SlackCard
          index={i}
          slackUsers={this.state.slackUsers}
          messages={this.state.messages}
          emojis={this.state.emojis}
        />
      );
    }

    return this.stillLoading() ? (
      <p style={{ fontSize: "32px" }}>Loading...</p>
    ) : (
      <Card style={styles.CardContainer} raised={true}>
        <span style={styles.cardHeader}>#{this.getChannelName(CHANNEL)}</span>
        <div style={styles.GradientBlock}></div>
        <div style={styles.SlackCardContainer}>{cardList}</div>
      </Card>
    );
  }
}

export default SlackComponent;
