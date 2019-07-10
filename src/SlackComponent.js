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

  height: 60%;
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
      isLoading: true
    };
  }

  // refresh messages every 60 sec and user-list every 2 hours
  async componentDidMount() {
    await this.setUserList();
    await this.setEmojiList();
    await this.setMessages();
    await this.setChannels();
    this.setState({ isLoading: false });

    this.messageIntervalID = setInterval(() => this.setMessages(), 1000 * 60);
    this.userListIntervalID = setInterval(
      () => this.setUserList(),
      1000 * 60 * 60 * 2
    );
  }

  // clean up intervals
  componentWillUnmount() {
    clearInterval(this.messageIntervalID);
    clearInterval(this.userListIntervalID);
  }

  // fetch latest slack messages
  async setMessages() {
    console.log("Fetching latest slack messages...");
    const response = await fetch(
      "https://slack.com/api/channels.history?token=" +
        TOKEN +
        "&channel" +
        CHANNEL
    );

    if (!response.ok) {
      console.log("Failed to fetch slack messages");
    } else {
      let messageList = [];
      response.json().messages.forEach((message, msgCount) => {
        msgCount++;
        if (msgCount > MAX_MSGS) return;
        messageList.push(message);
      });
      this.setState({ messages: messageList });
    }
  }

  // fetch user list
  async setUserList() {
    console.log("Fetching slack users...");
    const response = await fetch(
      "https://slack.com/api/users.list?token=" + TOKEN
    );

    if (!response.ok) {
      console.log("Failed to fetch slack users");
    } else {
      this.setState({ slackUsers: response.json().members });
    }
  }

  // fetch custom emoji list
  async setEmojiList() {
    console.log("Fetching emojis...");
    const response = await fetch(
      "https://slack.com/api/emoji.list?token=" + TOKEN
    );

    if (!response.ok) {
      console.log("Failed to fetch slack emojis");
    } else {
      this.setState({ emojis: response.json().emoji });
    }
  }

  async setChannels() {
    const response = await fetch(
      "https://slack.com/api/channels.list?token=" + TOKEN
    );

    if (!response.ok) {
      console.log("Failed to fetch slack channels");
    } else {
      this.setState({ channels: response.json().channels });
    }
  }

  getChannelName(id) {
    var channel = this.state.channels.find(chan => {
      return chan.id == id;
    });
    return channel == undefined ? undefined : channel.name;
  }

  render() {
    return this.state.isLoading ? (
      <CardContainer>Loading Slack...</CardContainer>
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
