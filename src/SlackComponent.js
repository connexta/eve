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

    this.messageIntervalID = setInterval(() => this.setMessages(), 1000 * 60);
    this.userListIntervalID = setInterval(
      () => this.setUserList(),
      1000 * 60 * 60 * 2
    );
    this.checkRefreshIntervalID = setInterval(
      () => this.checkRefresh(),
      1000 * 60
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
    fetch(
      "https://slack.com/api/channels.history?token=" +
        TOKEN +
        "&channel=" +
        CHANNEL
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("setMessages response not ok");
        }
      })
      .then(data => {
        let messageList = [];
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
  async setUserList() {
    console.log("Fetching slack users...");
    fetch("https://slack.com/api/users.list?token=" + TOKEN)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("setUserList response not ok");
        }
      })
      .then(data => {
        this.setState({ slackUsers: data.members, userLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  // fetch custom emoji list
  async setEmojiList() {
    console.log("Fetching emojis...");
    fetch("https://slack.com/api/emoji.list?token=" + TOKEN)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("setEmoji response not ok");
        }
      })
      .then(data => {
        this.setState({ emojis: data.emoji, emojiLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  async setChannels() {
    console.log("Fetching slack channels...");
    fetch("https://slack.com/api/channels.list?token=" + TOKEN)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("setChannels response not ok");
        }
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
    return this.anyStillLoading() ? (
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
