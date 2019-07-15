import React from "react";
import Parser from "html-react-parser";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_DARK_BLUE, CX_FONT } from "./Constants";
import styled from "styled-components";
import Card from "@material-ui/core/Card";

import MESSAGES from "./sampleslackmessages.json";
import EMOJIS from "./sampleslackmessages.json";
import USERS from "./sampleslackmessages.json";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;

export const MAX_MSGS = 9;

const styles = {
  CardContainer: {
    margin: "8px 8px 8px 8px",
    fontSize: "50px",
    color: "black",
    height: "50%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: CX_OFF_WHITE
  },
  cardHeader: {
    fontFamily: CX_FONT,
    margin: "12px 0 12px 16px",
    height: "40px"
  },
  fadeElement: {
    //content: "",
    //position: "absolute",
    top: "80%",
    right: 0,
    height: "20%",
    width: "100%",
    background: "linear-gradient(transparent," + CX_OFF_WHITE + ")",
    zIndex: 1
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
    const SlackCardContainer = styled.div`
      position: relative;
      height: 100%;
      background: transparent;
      ::before {
        content: "";
        position: absolute;
        top: 70%;
        right: 0;
        height: 30%;
        width: 100%;
        background: linear-gradient(rgba(0, 0, 0, 0), rgba(242, 242, 242, 1));
        z-index: 1;
      }
    `;

    return this.stillLoading() ? (
      <p>Loading...</p>
    ) : (
      <Card style={styles.CardContainer} raised={true}>
        <span style={styles.cardHeader}>#{this.getChannelName(CHANNEL)}</span>
        <SlackCardContainer>
          <SlackCard
            index={0}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={1}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={2}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={3}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={4}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={5}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={6}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={7}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
          <SlackCard
            index={8}
            slackUsers={this.state.slackUsers}
            messages={this.state.messages}
            emojis={this.state.emojis}
          />
        </SlackCardContainer>
      </Card>
    );
  }
}

export default SlackComponent;
