import React from "react";
import styled from "styled-components";
import SlackCard from "./SlackCard";
import { CX_OFF_WHITE, CX_FONT } from "../utils/Constants";
import { BoxStyle, BoxHeader } from "../styles/styles";
import { minute, time } from "../utils/TimeUtils";
import { GITHUB_HEIGHT } from "./Github";
import makeTrashable from "trashable";
import Collapse from "@material-ui/core/Collapse";

const TOKEN = process.env.SLACK_TOKEN;
const CHANNEL = process.env.SLACK_CHANNEL;
const MAX_MSGS = 10;
const ROTATE_INTERVAL = time({ seconds: 30 });

const CardContainer = styled(BoxStyle)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;

  /*Height of Slack Card is size of window beneath banner minus size of github card and margins*/
  height: calc(100% - ${GITHUB_HEIGHT}px - 72px - 32px);
`;

const CardHeader = styled(BoxHeader)`
  font-family: ${CX_FONT};
  height: 40px;
`;

const SlackCardContainer = styled.div`
  height: 100%;
`;

const GradientBlock = styled.div`
  height: 15%;
  width: 100%;
  bottom: 10px;
  background: linear-gradient(transparent, ${CX_OFF_WHITE});
  position: absolute;
  z-index: 2;
`;

const WhiteBlock = styled.div`
  position: absolute;
  height: 12px;
  width: 100%;
  bottom: 0px;
  background: ${CX_OFF_WHITE};
  z-index: 3;
`;

class SlackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojis: [],
      messages: [],
      slackUsers: [],
      channels: [],
      //messages array with each element attached with a SlackCard Component
      slackMsg: [],
      //create a sequentially incrementing number array: i.e. [0,1,2...].
      displayIndex: Array.apply(null, { length: MAX_MSGS }).map(
        Function.call,
        Number
      ),
      userLoading: true,
      emojiLoading: true,
      msgLoading: true,
      chanLoading: true,
      displayFirst: true
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
    this.rotateTimerIntervalID = setInterval(
      () => this.rotateTimer(),
      ROTATE_INTERVAL
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
    clearInterval(this.rotateTimerIntervalID);
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

      let msgCount = 0;
      data.messages.forEach(message => {
        // ignore threaded msgs and non-bot subtype msgs (such as join/leave notifications)
        if (!message.parent_user_id && (!message.subtype || message.bot_id)) {
          msgCount++;
          if (msgCount > MAX_MSGS) return;
          messageList.push(message);
        }
      });
      this.setState({ messages: messageList, msgLoading: false });
      this.setSlackMsg();
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

  //create state with a arraylist consisting of SlackCard component with unique keys/index up to MAX_MSGS.
  setSlackMsg() {
    let cardList = [];
    for (let i = 0; i < MAX_MSGS; i++) {
      cardList.push(
        <SlackCard
          key={i}
          index={i}
          slackUsers={this.state.slackUsers}
          messages={this.state.messages}
          emojis={this.state.emojis}
          variant={this.props.variant}
        />
      );
    }

    this.setState({
      slackMsg: cardList
    });
  }

  //function runs in a setInterval to rotate/shift messages to give a dynamic aspect to the slack component.
  rotateTimer() {
    if (!this.anyStillLoading()) {
      this.rotateMessages();
      this.setState({ displayFirst: true });
    }
  }

  //rotate the index so that it's not necessary to rotate the whole array of this.state.slackMsg.
  rotateMessages() {
    let array = this.state.displayIndex;
    this.rotateToRight(array);
    this.setState({ displayFirst: false });
    this.setState({ displayIndex: array });
  }

  //shift array element to right as in rotating
  rotateToRight(array) {
    let temp = array[array.length - 1];
    for (let i = array.length - 1; i >= 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = temp;
  }

  //display the rest of the slack messages excluding the message shown by displayFirstMessage()
  //in a specific order following what displayfirstMessage() has shown
  //i.e. if displayFirstMessage() displayed message of 3rd index, then displayRestOfMessages will return/display messages 4 to last + 0 to 2 index.
  displayRestOfMessages() {
    let msgToShow = [
      ...this.state.slackMsg.slice(this.state.displayIndex[1]),
      ...this.state.slackMsg.slice(0, this.state.displayIndex[1])
    ];
    return msgToShow;
  }

  //@param:
  //  item: displayIndex array element which contains the rotating order of the slack messages to be shown
  //  index: displayIndex array index
  //only return components if the index === 0
  //@return:
  //  components that display only the first message of the slackMsg determined by the displayIndex with a Zoom effect.
  displayFirstMessage() {
    return (
      <div>
        <Collapse in={this.state.displayFirst} exit={false}>
          {this.state.slackMsg[this.state.displayIndex[0]]}
        </Collapse>
      </div>
    );
  }

  render() {
    if (this.anyStillLoading()) {
      return (
        <CardContainer raised={true}>
          <CardHeader>Loading Slack...</CardHeader>
        </CardContainer>
      );
    } else {
      return (
        <CardContainer raised={true}>
          <span>
            <CardHeader>#{this.getChannelName(CHANNEL)}</CardHeader>
          </span>
          <GradientBlock />
          <WhiteBlock />
          {this.displayFirstMessage()}
          <SlackCardContainer>
            {this.displayRestOfMessages()}
          </SlackCardContainer>
        </CardContainer>
      );
    }
  }
}

export default SlackComponent;
