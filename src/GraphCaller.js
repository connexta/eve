import { callApi } from "./GraphService";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!./BoardCalendar.css";
import {
  Card,
  Dialog,
  Button,
  List,
  ListItem,
  ListItemText,
  DialogTitle
} from "@material-ui/core";

const styles = {
  card: {
    height: "800px",
    width: "100vh"
  },
  calendar: {
    height: "80%",
    width: "100%"
  }
};

function SimpleDialog(props) {
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
            onClick={() => handleListItemClick(cal, callback)}
            key={i}
          >
            <ListItemText primary={cal.name} />
          </ListItem>
        ))}

        <ListItem button onClick={() => handleListItemClick("addAccount")}>
          <ListItemText primary="add account" />
        </ListItem>
      </List>
    </Dialog>
  );
}

function SimpleDialogDemo(props) {
  const { calendars, callback, ...other } = props;

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(calendars[0]);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
    callback(value);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Select Calendar
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        calendars={calendars}
        callback={callback}
      />
    </div>
  );
}

const localizer = momentLocalizer(moment);

function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

function LogInOut(props) {
  return props.isAuthenticated ? (
    <Button variant="outlined" color="primary" onClick={props.logOut}>
      Log Out
    </Button>
  ) : (
    <Button onClick={props.logIn}>Log In</Button>
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
      chosenCal: null,
      error: null
    };

    if (user) {
      this.getCalendars();
    }
  }

  // Refresh user information/calendar events
  componentDidMount() {
    // setInterval(() => {
    //   if (this.state.isAuthenticated) this.getCalendarEvents();
    // }, 1000 * 20);
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
        console.log(ret.value);
        this.setState({ calendars: ret.value });
      }
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

  //Fetch user information and calendar events
  async getCalendarEvents(cal) {
    console.log(cal);
    try {
      console.log("Getting Calendar Events");
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var call = "/me/calendars/" + cal.id + "/events";
        var ret = await callApi(accessToken, call);

        this.updateEvents(ret.value);
      }
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

  render() {
    // let error = null;
    // if (this.state.error) {
    //   error = (
    //     <ErrorMessage
    //       message={this.state.error.message}
    //       debug={this.state.error.debug}
    //     />
    //   );
    //   }

    let calButton = this.state.isAuthenticated ? (
      <SimpleDialogDemo
        calendars={this.state.calendars}
        callback={this.getCalendarEvents.bind(this)}
      />
    ) : null;

    var calEvents =
      Object.keys(this.state.events).length === 0 ? [] : this.state.events;

    return (
      <Router>
        <Card style={styles.card}>
          <div
            style={{ display: "flex", flexDirection: "row", padding: "12px" }}
          >
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
            defaultDate={new Date()}
            defaultView="month"
            events={calEvents}
          />
        </Card>
      </Router>
    );
  }
}

export default GraphCaller;
