import { callApi } from "./GraphService";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!../../styles/Calendar.css";
import { BOX_STYLE, BOX_HEADER } from "../../styles/styles";
import { BUILD_STATUS_HEIGHT } from "../BuildStatus";
import {
  Card,
  Dialog,
  List,
  ListItem,
  ListItemText,
  DialogTitle
} from "@material-ui/core";
import { minute, hour } from "../../utils/TimeUtils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const TIME_BEFORE = 1; //num months before to grab events
const TIME_AFTER = 1; //num months after to grab events
const NUM_EVENTS = 200; //limit on number of events to grab
const START_HOUR = 8; // earliest hour to display in week/day view
const END_HOUR = 18; // latest hour to display
const WIP_MESSAGE_SPACE = 32;
const CALL_FREQ = 30 * minute; //how often to refresh calendar events

const styles = {
  card: {
    height:
      "calc(100% - " +
      BUILD_STATUS_HEIGHT +
      "px - 72px - " +
      WIP_MESSAGE_SPACE +
      "px)",
    width: "calc(100% - 24px)"
  },
  calendar: {
    height: "77%",
    width: "90%",
    margin: "0 5% 0 5%",
    fontSize: "16px"
  },
  buttonContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    verticalAlign: "bottom"
  },
  button: {
    display: "inline-block",
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

// Dialog for selecting calendar
function CalendarDialog(props) {
  const { onClose, selectedValue, calendars, callback, ...other } = props;

  function handleClose() {
    onClose(selectedValue);
  }

  function handleListItemClick(value) {
    onClose(value);
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="select-calendar-dialog"
      {...other}
    >
      <DialogTitle id="select-calendar-dialog-title">
        Select Calendar
      </DialogTitle>
      <List>
        {calendars.map((cal, i) => (
          <ListItem
            button
            onClick={() => handleListItemClick(cal.id, callback)}
            key={i}
          >
            <ListItemText primary={cal.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

// Button to open dialog to select calendar
function DialogAndButton(props) {
  const { calendars, callback } = props;

  const [open, setOpen] = React.useState(false);
  const selectedValue = React.useState(calendars[0]);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
    callback(value);
  };

  return (
    <div>
      <button
        style={{ ...styles.rightButton, ...styles.button }}
        type="button"
        onClick={handleClickOpen}
      >
        Select Calendar
      </button>
      <CalendarDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        calendars={calendars}
        callback={callback}
      />
    </div>
  );
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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

class GraphCaller extends React.Component {
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
  }

  // clean up event data so it works with big-react-calendar
  updateEvents(eventData) {
    if (eventData != null) {
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
    }
  }

  // catch and clean error before printing to console
  catchError(err) {
    var error = {};
    if (typeof err === "string") {
      var errParts = err.split("|");
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
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      });

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

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's calendars from Graph
        var call = "/me/calendars?select=name";
        var ret = await callApi(accessToken, call);
        this.setState({ calendars: ret.value });
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
      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - TIME_BEFORE);

        var endDate = new Date();
        endDate.setMonth(endDate.getMonth() + TIME_AFTER);

        var call =
          "/me/calendars/" +
          cal +
          "/calendarView?startDateTime=" +
          startDate.toISOString() +
          "&endDateTime=" +
          endDate.toISOString() +
          "&top=" +
          NUM_EVENTS +
          "&select=subject,start,end";
        var ret = await callApi(accessToken, call);

        this.updateEvents(ret.value);
      }
    } catch (err) {
      console.log("Error retrieving Calendar Events");
      this.catchError(err);
    }
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
        <Card style={{ ...styles.card, ...BOX_STYLE }} raised={true}>
          <p style={BOX_HEADER}>Calendar</p>
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
          <div style={styles.buttonContainer}></div>
          <Calendar
            style={styles.calendar}
            localizer={localizer}
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

export default GraphCaller;
