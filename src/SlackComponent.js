import React from "react";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_FONT } from "./Constants";
import Card from "@material-ui/core/Card";
import { BOX_STYLE, BOX_HEADER } from "./styles";
import { minute, time } from "./utilities/TimeUtils";
import { GITHUB_HEIGHT } from "./githubCaller";
import makeTrashable from "trashable";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;
const MAX_MSGS = 10;

const styles = {
  CardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
    height: "calc(100% - " + GITHUB_HEIGHT + "px - 72px)" // Height of Slack Card is size of window beneath banner minus size of github card and margins
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
    this.trashableRequestList = [];
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
    //clearing out left out promise during unmount.
    if (this.trashableRequestList)
      this.trashableRequestList.forEach(promise => promise.trash());
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
    this.trashableRequestList[0] = makeTrashable(
      fetch(
        "https://slack.com/api/channels.history?token=" +
          TOKEN +
          "&channel=" +
          CHANNEL
      ).catch(e => console.log("error", e))
    );

    const response = await this.trashableRequestList[0];

    if (response.ok) {
      let messageList = [];
      this.trashableRequestList[1] = makeTrashable(response.json());
      let data = await this.trashableRequestList[1];
      data.messages.forEach((message, msgCount) => {
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
    this.trashableRequestList[2] = makeTrashable(
      fetch("https://slack.com/api/users.list?token=" + TOKEN).catch(e =>
        console.log("error", e)
      )
    );

    const response = await this.trashableRequestList[2];

    if (response.ok) {
      this.trashableRequestList[3] = makeTrashable(response.json());
      let data = await this.trashableRequestList[3];
      this.setState({
        slackUsers: data.members,
        userLoading: false
      });
    } else {
      console.log("Failed to fetch slack users");
    }
  }

  // fetch custom emoji list
  async setEmojiList() {
    console.log("Fetching emojis...");
    this.trashableRequestList[4] = makeTrashable(
      fetch("https://slack.com/api/emoji.list?token=" + TOKEN).catch(e =>
        console.log("error", e)
      )
    );

    const response = await this.trashableRequestList[4];

    if (response.ok) {
      this.trashableRequestList[5] = makeTrashable(response.json());
      let data = await this.trashableRequestList[5];
      this.setState({ emojis: data.emoji, emojiLoading: false });
    } else {
      console.log("Failed to fetch slack emojis");
    }
  }

  async setChannels() {
    console.log("Fetching slack channels...");
    this.trashableRequestList[6] = makeTrashable(
      fetch("https://slack.com/api/channels.list?token=" + TOKEN).catch(e =>
        console.log("error", e)
      )
    );

    const response = await this.trashableRequestList[6];

    if (response.ok) {
      this.trashableRequestList[7] = makeTrashable(response.json());
      let data = await this.trashableRequestList[7];
      this.setState({ channels: data.channels, chanLoading: false });
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
          <p style={BOX_HEADER}>Loading Slack...</p>
        </Card>
      );
    } else {
      let cardList = [];
      for (var i = 0; i < MAX_MSGS; i++) {
        cardList.push(<SlackCard key={i} index={i} {...this.state} />);
      }

      return (
        <Card style={{ ...styles.CardContainer, ...BOX_STYLE }} raised={true}>
          <span style={BOX_HEADER}>#{this.getChannelName(CHANNEL)}</span>
          <div style={styles.GradientBlock}></div>
          <div style={styles.WhiteBlock}></div>
          <div style={styles.SlackCardContainer}>{cardList}</div>
        </Card>
      );
    }
  }
}

export default SlackComponent;
