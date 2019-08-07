import React from "react";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { CX_GRAY_BLUE, CX_OFF_WHITE } from "../utils/Constants.js";
import { BoxStyle, BoxHeader } from "../styles/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { time } from "../utils/TimeUtils";
import { callApi } from "./Calendar/GraphService";
import config from "./Calendar/GraphConfig";
import { UserAgentApplication } from "msal";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  MobileStepper,
  Button
} from "@material-ui/core";
import makeTrashable from "trashable";

const ROTATE_FREQ = time({ seconds: 5 });
export const MEDIA_EVENT_CARD_HEIGHT = 700;
const TIME_BEFORE = 0; //num months before to grab events
const TIME_AFTER = 1; //num months after to grab events
const NUM_EVENTS = 10; //limit on number of events to grab
const CALL_FREQ = time({ minutes: 30 }); //how often to refresh calendar events

const ButtonContainer = styled.div`
  width: 100%;
  margin-left: calc(5% - 3px); /* 3 px to accomodate rbc-btn-group margins */
  display: flex;
  flex-direction: row;
  vertical-align: bottom;
`;

const StyledButton = styled.button`
  display: inline-block;
  && {
    margin: 8px 0 0;
  }
  height: 30px;
  vertical-align: bottom;
  margin-top: 8px;
`;

const RightButton = styled(StyledButton)`
  && {
    border-radius: "0 4px 4px 0";
  }
`;

export const CarouselContent = styled.div`
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  margin: 20px 0 0 0;
`;

export const MediaCard = styled(BoxStyle)`
  width: calc((100% / 2) - 24px);
  height: ${MEDIA_EVENT_CARD_HEIGHT}px;
  margin: 0 12px 0 24px;
  position: relative;
`;

const Header = styled(BoxHeader)`
  width: 100%;
`;

const StyledMobileStepper = withStyles({
  root: {
    backgroundColor: CX_OFF_WHITE,
    height: "20px",
    width: "calc(100% - 20px)",
    position: "absolute",
    bottom: "12px",
    left: "0px"
  },
  dotActive: {
    backgroundColor: CX_GRAY_BLUE
  }
})(MobileStepper);

function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

// Function to toggle between log in / log out button depending on state
function LogInOut(props) {
  return props.isAuthenticated ? (
    <StyledButton type="button" onClick={props.logOut}>
      Log Out
    </StyledButton>
  ) : (
    <StyledButton type="button" onClick={props.logIn}>
      Log In
    </StyledButton>
  );
}

class DialogAndButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedValue: this.props.calendars[0]
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose(value) {
    this.setState({ open: false });
    this.props.callback(value);
  }

  render() {
    return (
      <div>
        <RightButton type="button" onClick={this.handleClickOpen.bind(this)}>
          Select Calendar
        </RightButton>
        <Dialog
          onClose={this.handleClose.bind(this)}
          aria-labelledby="select-calendar-dialog"
          open={this.state.open}
        >
          <DialogTitle id="select-calendar-dialog-title">
            Select Calendar
          </DialogTitle>
          <List>
            {this.props.calendars.map((cal, i) => (
              <ListItem button onClick={() => this.handleClose(cal.id)} key={i}>
                <ListItemText primary={cal.name} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </div>
    );
  }
}

export default class MediaComponent extends React.Component {
  constructor(props) {
    super(props);

    // grab and store user credentials
    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
        authority: config.authority
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    });

    var user = this.userAgentApplication.getAccount();

    this.state = {
      displayIndex: 0,
      isAuthenticated: user !== null,
      events: [],
      calendars: [],
      chosenCal: localStorage.getItem("chosenCalendar")
    };

    if (user) {
      this.getCalendars();
    }
  }

  // clean up event data so it works with big-react-calendar
  updateEvents(eventData) {
    if (eventData != null && eventData.length > 0) {
      eventData = eventData.map(event => ({
        title: event.subject,
        start: event.start,
        end: event.end
      }));

      for (let i = 0; i < eventData.length; i++) {
        eventData[i].start = localizeTime(
          eventData[i].start.dateTime,
          eventData[i].start.timeZone
        );
        eventData[i].end = localizeTime(
          eventData[i].end.dateTime,
          eventData[i].end.timeZone
        );
      }

      this.setState({
        isAuthenticated: true,
        events: eventData,
        error: null
      });
    } else {
      this.setState({
        events: []
      });
    }
  }

  // catch and clean error before printing to console
  catchError(err) {
    var error = {};
    if (typeof err === "string") {
      let errParts = err.split("|");
      error =
        errParts.length > 1
          ? { message: errParts, debug: errParts }
          : { message: err };
    } else {
      error = {
        message: err.message,
        debug: JSON.stringify(err)
      };
    }

    console.log(error);
  }

  // Pop up to log in user and acquire credentials
  async login() {
    try {
      this.trashableLogIn = makeTrashable(
        this.userAgentApplication.loginPopup({
          scopes: config.scopes,
          prompt: "select_account"
        })
      );

      await this.trashableLogIn;

      await this.getCalendars();

      document.location.reload();
    } catch (err) {
      console.log("Error Logging In");
      this.catchError(err);

      this.setState({
        isAuthenticated: false,
        events: []
      });
    }
  }

  // logs out user, will refresh page
  async logout() {
    this.userAgentApplication.logout();
  }

  // grabs list of calendars from Microsft Graph API
  async getCalendars() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      this.trashableAccessToken = makeTrashable(
        this.userAgentApplication.acquireTokenSilent({
          scopes: config.scopes
        })
      );

      let accessToken = await this.trashableAccessToken;

      if (accessToken) {
        // Get the user's calendars from Graph
        let call = "/me/calendars?select=name";

        this.trashableAPICall = makeTrashable(callApi(accessToken, call));
        await this.trashableAPICall.then(ret =>
          this.setState({ calendars: ret.value })
        );
      }
    } catch (err) {
      console.log("Error retrieving list of calendars");
      this.catchError(err);
    }
  }

  // stores chosenCal in state and in cache before calling getCalendarEvents()
  async changeState(cal) {
    this.setState({ chosenCal: cal });
    localStorage.setItem("chosenCalendar", cal);
    this.getCalendarEvents(cal);
  }

  //Fetch event data for preceding and proceeding month
  async getCalendarEvents(cal) {
    try {
      this.trashableAccessToken = makeTrashable(
        this.userAgentApplication.acquireTokenSilent({
          scopes: config.scopes
        })
      );

      let accessToken = await this.trashableAccessToken;

      if (accessToken) {
        // Get the user's profile from Graph
        let startDate = new Date();
        startDate.setMonth(startDate.getMonth() - TIME_BEFORE);

        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + TIME_AFTER);

        let call =
          "/me/calendars/" +
          cal +
          "/calendarView?startDateTime=" +
          startDate.toISOString() +
          "&endDateTime=" +
          endDate.toISOString() +
          "&top=" +
          NUM_EVENTS +
          "&select=subject,start,end";

        this.trashableAPICall = makeTrashable(callApi(accessToken, call));
        await this.trashableAPICall.then(ret => this.updateEvents(ret.value));
      }
    } catch (err) {
      console.log("Error retrieving Calendar Events");
      this.catchError(err);
    }
  }

  // Refresh user information/calendar events
  componentDidMount() {
    if (this.state.isAuthenticated && this.state.chosenCal)
      this.getCalendarEvents(this.state.chosenCal);
    this.timerIntervalID = setInterval(() => {
      if (this.state.isAuthenticated && this.state.chosenCal)
        this.getCalendarEvents(this.state.chosenCal);
    }, CALL_FREQ);
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    if (this.trashableAccessToken) this.trashableAccessToken.trash();
    if (this.trashableAPICall) this.trashableAPICall.trash();
    if (this.trashableLogIn) this.trashableLogIn.trash();
  }

  rotateCard() {
    this.setState({
      displayIndex:
        this.state.displayIndex == this.state.events.length - 1
          ? 0
          : this.state.displayIndex + 1
    });
  }

  // Manually changes which PR to display, resets timer
  switchCard(i) {
    if (i >= this.state.events.length) i = 0;
    if (i < 0) i = this.state.events.length - 1;
    this.setState({ displayIndex: i });
    clearInterval(this.rotateInterval);
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Gets user data and sets timer for refreshing data and rotating displayed PR
  componentDidMount() {
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.rotateInterval);
  }

  render() {
    let calButton = this.state.isAuthenticated ? (
      <DialogAndButton
        calendars={this.state.calendars}
        callback={this.changeState.bind(this)}
      />
    ) : null;

    let event =
      this.state.events.length == 0
        ? { title: "", start: "", end: "" }
        : this.state.events[this.state.displayIndex];

    let start = "";
    if (event.start != "") {
      start =
        event.start.getDay() +
        " " +
        event.start.getMonth() +
        "/" +
        event.start.getDate();
    }

    return (
      <MediaCard raised={true}>
        <Header>Company Events</Header>
        <ButtonContainer>
          <LogInOut
            isAuthenticated={this.state.isAuthenticated}
            logIn={this.login.bind(this)}
            logOut={this.logout.bind(this)}
          />
          {calButton}
        </ButtonContainer>
        {event.title}
        {start}
        {event.end.toString()}
        <StyledMobileStepper
          activeStep={this.state.displayIndex}
          steps={this.state.events.length}
          variant={"dots"}
          position={"static"}
          nextButton={
            <Button
              size="small"
              onClick={() => this.switchCard(this.state.displayIndex + 1)}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={() => this.switchCard(this.state.displayIndex - 1)}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </MediaCard>
    );
  }
}
