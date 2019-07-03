import { getCalendarEvents } from "./GraphService";
import config from "./GraphConfig";
import { UserAgentApplication } from "msal";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "!style-loader!css-loader!./BoardCalendar.css";

const localizer = momentLocalizer(moment);

function localizeTime(time, timezone) {
  return new Date(time.split("T") + " " + timezone);
}

function LogInOut(props) {
  return props.isAuthenticated ? (
    <button onClick={props.logOut}>Log Out</button>
  ) : (
    <button onClick={props.logIn}>Log In</button>
  );
}

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
      events: {},
      error: null
    };

    if (user) this.getUserInfo();
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = (
        <ErrorMessage
          message={this.state.error.message}
          debug={this.state.error.debug}
        />
      );
    }

    var calEvents =
      Object.keys(this.state.events).length === 0 ? [] : this.state.events;

    return (
      <Router>
        <div>
          {error}
          <LogInOut
            isAuthenticated={this.state.isAuthenticated}
            logIn={this.login.bind(this)}
            logOut={this.logout.bind(this)}
          />
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={calEvents}
            style={{ height: "55vh" }}
          />
        </div>
      </Router>
    );
  }

  updateEvents(eventData) {
    if (eventData != null) {
      console.log(eventData);

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

  // Refresh user information/calendar events
  componentDidMount() {
    setInterval(() => {
      if (this.state.isAuthenticated) this.getUserInfo();
    }, 1000 * 20);
  }

  // Pop up to log in user and acquire credentials
  async login() {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      });
      await this.getUserInfo();
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
        events: {},
        error: error
      });
    }
  }

  async logout() {
    this.userAgentApplication.logout();
  }

  //Fetch user information and calendar events
  async getUserInfo() {
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
        var calEvents = await getCalendarEvents(accessToken);
        this.updateEvents(calEvents.value);
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
        events: {},
        error: error
      });
    }
  }
}

export default GraphCaller;
