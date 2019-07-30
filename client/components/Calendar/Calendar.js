<<<<<<< HEAD:client/components/Calendar/Calendar.js
import { callApi } from "./GraphService";
import styled from "styled-components";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!../../styles/Calendar.css";
import { BoxStyle, BoxHeader, CARD_SIDE_MARGINS } from "../../styles/styles";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  DialogTitle
} from "@material-ui/core";
import { time, hour } from "../../utils/TimeUtils";
import makeTrashable from "trashable";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const TIME_BEFORE = 1; //num months before to grab events
const TIME_AFTER = 1; //num months after to grab events
const NUM_EVENTS = 200; //limit on number of events to grab
const START_HOUR = 8; // earliest hour to display in week/day view
const END_HOUR = 18; // latest hour to display
const WIP_MESSAGE_SPACE = 68; //height of the message buffer so that it doesn't overlap with working progress message.
const CALL_FREQ = time({ minutes: 30 }); //how often to refresh calendar events
const CARD_HEIGHT_MARGINS = 36;

const StyledHeader = styled(BoxHeader)`
  margin-bottom: 16px;
`;

//157px: to align calendar to buildstatus
const StyledCard = styled(BoxStyle)`
  height: calc(
    100% - ${CARD_HEIGHT_MARGINS}px - ${WIP_MESSAGE_SPACE}px - 157px
  );
  width: calc(100% - ${CARD_SIDE_MARGINS}px);
`;

const StyledCalendar = styled(Calendar)`
  && {
    height: 75%;
    width: 90%;
    margin: 0 5% 0 5%;
    font-size: 16px;
  }
`;

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

// Localizes time for big-react-calendar
const localizer = momentLocalizer(moment);

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

// "Select Calendar" button and dialog
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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

class CalendarCaller extends React.Component {
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

  render() {
    let calButton = this.state.isAuthenticated ? (
      <DialogAndButton
        calendars={this.state.calendars}
        callback={this.changeState.bind(this)}
      />
    ) : null;

    var calEvents =
      Object.keys(this.state.events).length === 0 ? [] : this.state.events;

    const minTime = new Date();
    minTime.setHours(START_HOUR, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(END_HOUR, 0, 0);

    return (
      <StyledCard raised={true}>
        <StyledHeader>Calendar</StyledHeader>
        <ButtonContainer>
          <div className="rbc-toolbar">
            <ButtonContainer>
              <LogInOut
                isAuthenticated={this.state.isAuthenticated}
                logIn={this.login.bind(this)}
                logOut={this.logout.bind(this)}
              />
              {calButton}
            </ButtonContainer>
          </div>
        </ButtonContainer>
        <StyledCalendar
          localizer={momentLocalizer(moment)}
          defaultView="work_week"
          getNow={() => new Date(new Date().valueOf() + hour)}
          events={calEvents}
          min={minTime}
          max={maxTime}
          step={60}
          timeslots={1}
          views={["day", "work_week", "month", "agenda"]}
        />
      </StyledCard>
    );
  }
}

export default CalendarCaller;
=======
import { callApi } from "./GraphService";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!../../styles/Calendar.css";
import { BoxStyle, BoxHeader, CARD_SIDE_MARGINS } from "../../styles/styles";
import { BUILD_STATUS_HEIGHT } from "../BuildStatus";
import {
  Card,
  Dialog,
  List,
  ListItem,
  ListItemText,
  DialogTitle
} from "@material-ui/core";
import { time, hour } from "../../utils/TimeUtils";
import makeTrashable from "trashable";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const TIME_BEFORE = 1; //num months before to grab events
const TIME_AFTER = 1; //num months after to grab events
const NUM_EVENTS = 200; //limit on number of events to grab
const START_HOUR = 8; // earliest hour to display in week/day view
const END_HOUR = 18; // latest hour to display
const WIP_MESSAGE_SPACE = 68;
const CALL_FREQ = time({ minutes: 30 }); //how often to refresh calendar events
const CARD_HEIGHT_MARGINS = 36;
const BUILD_STATUS_HEIGHT = 160;

const styles = {
  card: {
    height:
      "calc(100% - " +
      BUILD_STATUS_HEIGHT +
      "px - " +
      CARD_HEIGHT_MARGINS +
      "px - " +
      WIP_MESSAGE_SPACE +
      "px)"
  },
  calendar: {
    height: "77%",
    width: "90%",
    margin: "0 5% 0 5%",
    fontSize: "16px"
  },
  buttonContainer: {
    width: "100%",
    marginLeft: "calc(5% - 3px)", // 3 px to accomodate rbc-btn-group margins
    display: "flex",
    flexDirection: "row",
    verticalAlign: "bottom"
  },
  button: {
    display: "inline-block",
    margin: 0,
    height: "30px",
    verticalAlign: "bottom",
    marginTop: "8px"
  },
  rightButton: {
    borderRadius: "0 4px 4px 0"
  },
  leftButton: {
    borderRadius: "4px 0 0 4px"
  }
};

// Localizes time for big-react-calendar
const localizer = momentLocalizer(moment);

function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

// Function to toggle between log in / log out button depending on state
function LogInOut(props) {
  return props.isAuthenticated ? (
    <button style={styles.button} type="button" onClick={props.logOut}>
      Log Out
    </button>
  ) : (
    <button style={styles.button} type="button" onClick={props.logIn}>
      Log In
    </button>
  );
}

// "Select Calendar" button and dialog
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
        <button
          style={{ ...styles.button, ...styles.rightButton }}
          type="button"
          onClick={this.handleClickOpen.bind(this)}
        >
          Select Calendar
        </button>
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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

class CalendarCaller extends React.Component {
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

  render() {
    let calButton = this.state.isAuthenticated ? (
      <DialogAndButton
        calendars={this.state.calendars}
        callback={this.changeState.bind(this)}
      />
    ) : null;

    var calEvents =
      Object.keys(this.state.events).length === 0 ? [] : this.state.events;

    const minTime = new Date();
    minTime.setHours(START_HOUR, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(END_HOUR, 0, 0);

    return (
      <Router>
        <Card style={{ ...BoxStyle, ...styles.card }} raised={true}>
          <p style={BoxHeader}>Calendar</p>
          <div style={styles.buttonContainer}>
            <div className="rbc-toolbar">
              <span className="rbc-btn-group" style={styles.buttonContainer}>
                <LogInOut
                  isAuthenticated={this.state.isAuthenticated}
                  logIn={this.login.bind(this)}
                  logOut={this.logout.bind(this)}
                />
                {calButton}
              </span>
            </div>
          </div>
          <Calendar
            style={styles.calendar}
            localizer={momentLocalizer(moment)}
            defaultView="work_week"
            getNow={() => new Date(new Date().valueOf() + hour)}
            events={calEvents}
            min={minTime}
            max={maxTime}
            step={60}
            timeslots={1}
            views={["day", "work_week", "month", "agenda"]}
          />
        </Card>
      </Router>
    );
  }
}

export default CalendarCaller;
>>>>>>> Switching to styled in progress:src/components/Calendar/Calendar.js
