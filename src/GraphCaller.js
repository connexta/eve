import { callApi } from "./GraphService";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!./BoardCalendar.css";
import { BOX_STYLE, BOX_HEADER } from "./styles.js";
import {
  Card,
  Dialog,
  Button,
  List,
  ListItem,
  ListItemText,
  DialogTitle
} from "@material-ui/core";

////////////////////////////////////////////////////////////////

const styles = {
  card: {
    height: "60%",
    width: "97%"
  },
  calendar: {
    height: "80%",
    width: "90%",
    margin: "0 5% 0 5%",
    fontSize: "16px"
  },
  buttonContainer: {
    marginLeft: "5%",
    marginTop: "16px",
    display: "flex",
    flexDirection: "row"
  },
  button: {
    marginRight: "8px"
  }
};

const localizer = momentLocalizer(moment);

function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

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

function DialogAndButton(props) {
  const { calendars, callback, ...other } = props;

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
      <Button
        style={styles.button}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Select Calendar
      </Button>
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

function LogInOut(props) {
  return props.isAuthenticated ? (
    <Button
      style={styles.button}
      variant="outlined"
      color="primary"
      onClick={props.logOut}
    >
      Log Out
    </Button>
  ) : (
    <Button style={styles.button} onClick={props.logIn}>
      Log In
    </Button>
  );
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

class GraphCaller extends React.Component {
  constructor(props) {
    super(props);

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
      chosenCal: localStorage.getItem("chosenCalendar"),
      error: null
    };

    if (user) {
      this.getCalendars();
    }
  }

  // Refresh user information/calendar events
  componentDidMount() {
    if (this.state.isAuthenticated)
      this.getCalendarEvents(this.state.chosenCal);
    setInterval(() => {
      if (this.state.isAuthenticated)
        this.getCalendarEvents(this.state.chosenCal);
    }, 1000 * 20);
  }

  // clean up event data so it works with calendar library
  updateEvents(eventData) {
    if (eventData != null) {
      eventData = eventData.map(event => ({
        title: event.subject,
        start: event.start,
        end: event.end
      }));

      for (var i = 0; i < eventData.length; i++) {
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

      this.setState({
        isAuthenticated: false,
        events: [],
        error: error
      });
    }
  }

  async logout() {
    this.userAgentApplication.logout();
  }

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
        // Get the user's profile from Graph
        var call = "/me/calendars?select=name";
        var ret = await callApi(accessToken, call);
        this.setState({ calendars: ret.value });
      }
    } catch (err) {
      console.log("Error retrieving list of calendars");
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
  }

  async changeState(cal) {
    this.setState({ chosenCal: cal });
    localStorage.setItem("chosenCalendar", cal);
    this.getCalendarEvents(cal);
  }

  //Fetch user information and calendar events
  async getCalendarEvents(cal) {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        var endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        var call =
          "/me/calendars/" +
          cal +
          "/calendarView?startDateTime=" +
          startDate.toISOString() +
          "&endDateTime=" +
          endDate.toISOString() +
          "&top=200&select=subject,start,end";
        var ret = await callApi(accessToken, call);

        this.updateEvents(ret.value);
      }
    } catch (err) {
      console.log("Error retrieving Calendar Events");

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
  }

  render() {
    //console.log(this.state.events);

    let calButton = this.state.isAuthenticated ? (
      <DialogAndButton
        calendars={this.state.calendars}
        callback={this.changeState.bind(this)}
      />
    ) : null;

    var calEvents =
      Object.keys(this.state.events).length === 0 ? [] : this.state.events;

    const minTime = new Date();
    minTime.setHours(8, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(18, 0, 0);

    return (
      <Router>
        <Card style={{ ...styles.card, ...BOX_STYLE }} raised={true}>
          <p style={BOX_HEADER}>Calendar</p>
          <div style={styles.buttonContainer}>
            <LogInOut
              isAuthenticated={this.state.isAuthenticated}
              logIn={this.login.bind(this)}
              logOut={this.logout.bind(this)}
            />
            {calButton}
          </div>
          <Calendar
            style={styles.calendar}
            localizer={localizer}
            defaultView="work_week"
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
