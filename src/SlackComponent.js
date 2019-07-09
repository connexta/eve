import React from "react";
import styled from "styled-components";
import Parser from "html-react-parser";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_DARK_BLUE, CX_FONT } from "./Constants";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;

const MAX_MSGS = 4;

const CardContainer = styled.div`
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

class SlackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojis: {},
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
    setInterval(() => this.setMessages(), 1000 * 60);
    setInterval(() => this.setUserList(), 1000 * 60 * 60 * 2);
    setInterval(() => this.refreshAll(), 1000 * 30);
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
    return this.stillLoading() ? (
      <CardContainer>Loading...</CardContainer>
    ) : (
      <CardContainer>
        {Parser(
          `<div style="margin-left: 10px;"># ${this.getChannelName(
            CHANNEL
          )}</div>`
        )}
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
      </CardContainer>
    );
  }
}

export default SlackComponent;
