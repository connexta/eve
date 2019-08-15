import React from "react";
import styled from "styled-components";
import { BoxStyle, BoxHeader } from "../styles/styles";
import {
  time,
  localizeTime,
  getDayofWeek,
  getTimeString,
  catchError
} from "../utils/TimeUtils";
import { callApi } from "./Calendar/GraphService";
import config from "./Calendar/GraphConfig";
import { UserAgentApplication } from "msal";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Button,
  Divider
} from "@material-ui/core";
import makeTrashable from "trashable";

const DAYS_AFTER = 7; // how many days in the future to grab events
const NUM_EVENTS_GRAB = 50; //limit on number of events to grab from API
const CALL_FREQ = time({ minutes: 30 }); //how often to refresh calendar events

const ButtonContainer = styled.div`
  width: 300px;
  margin-left: calc(5% - 3px); /* 3 px to accomodate rbc-btn-group margins */
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 0;
`;

const EventContainer = styled.div`
  margin-top: 72px;
`;

const EventBlock = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const EventTime = styled.div`
  display: inline-block;
  width: 120px;
`;

const EventDescription = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 20px;
`;

const StyledButton = styled(Button)`
  height: 32px;
  vertical-align: top;
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
  height: 100%;
  margin: 0 0 0 24px;
  position: relative;
`;

const Header = styled(BoxHeader)`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

// Function to toggle between log in / log out button depending on state
export function LogInOut(props) {
  return props.isAuthenticated ? (
    <StyledButton variant={"outlined"} onClick={props.logOut}>
      Log Out
    </StyledButton>
  ) : (
    <StyledButton variant={"outlined"} onClick={props.logIn}>
      Log In
    </StyledButton>
  );
}

export class DialogAndButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
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
        <StyledButton
          type="button"
          variant={"outlined"}
          onClick={this.handleClickOpen.bind(this)}
        >
          Select Calendar
        </StyledButton>
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

    let user = this.userAgentApplication.getAccount();
    let cal = localStorage.getItem("chosenCalendar");

    this.state = {
      displayIndex: 0,
      isAuthenticated: user !== null,
      events: [],
      calendars: [],
      chosenCal: cal
    };

    if (user) {
      this.getCalendars();
    }

    if (cal) this.getCalendarEvents(cal);
  }

  // clean up event data so it works with big-react-calendar
  updateEvents(eventData) {
    if (eventData != null && eventData.length > 0) {
      eventData = eventData.map(event => ({
        title: event.subject,
        start: event.start,
        end: event.end,
        bodyPreview: event.bodyPreview,
        location: event.location.displayName
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

      eventData.sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      });

      let numEvents = Math.floor((window.innerHeight - 480) / 110);
      console.log(numEvents);
      eventData = eventData.slice(0, numEvents);

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
      catchError(err);

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
      catchError(err);
    }
  }

  // stores chosenCal in state and in cache before calling getCalendarEvents()
  async changeState(cal) {
    this.setState({ chosenCal: cal });
    localStorage.setItem("chosenCalendar", cal);
    this.getCalendarEvents(cal);
  }

  //Fetch event data for next DAYS_AFTER days
  async getCalendarEvents(cal) {
    try {
      this.trashableAccessToken = makeTrashable(
        this.userAgentApplication.acquireTokenSilent({
          scopes: config.scopes
        })
      );

      let accessToken = await this.trashableAccessToken;

      if (accessToken) {
        let startDate = new Date();

        let endDate = new Date();
        let newDate = endDate.getDate() + DAYS_AFTER;

        endDate.setDate(newDate > 32 ? newDate - 30 : newDate);

        let call =
          "/me/calendars/" +
          cal +
          "/calendarView?startDateTime=" +
          startDate.toISOString() +
          "&endDateTime=" +
          endDate.toISOString() +
          "&top=" +
          NUM_EVENTS_GRAB +
          "&select=subject,start,end,bodyPreview,location";

        this.trashableAPICall = makeTrashable(callApi(accessToken, call));
        await this.trashableAPICall.then(ret => this.updateEvents(ret.value));
      }
    } catch (err) {
      console.log("Error retrieving Calendar Events");
      catchError(err);
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

  // Clear unmet promises
  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    if (this.trashableAccessToken) this.trashableAccessToken.trash();
    if (this.trashableAPICall) this.trashableAPICall.trash();
    if (this.trashableLogIn) this.trashableLogIn.trash();
  }

  noEventMessage() {
    if (!this.state.isAuthenticated) {
      return <div>Please sign in</div>;
    } else if (!this.state.chosenCal) {
      return <div>Select calendar to display events</div>;
    } else if (this.state.events.length <= 0) {
      return <div>No events to display</div>;
    } else {
      return <div>Trouble displaying events</div>;
    }
  }

  render() {
    let calButton = this.state.isAuthenticated ? (
      <DialogAndButton
        calendars={this.state.calendars}
        callback={this.changeState.bind(this)}
      />
    ) : null;

    return (
      <MediaCard raised={true}>
        <Header>
          Company Events
          <ButtonContainer>
            <LogInOut
              isAuthenticated={this.state.isAuthenticated}
              logIn={this.login.bind(this)}
              logOut={this.logout.bind(this)}
            />
            {calButton}
          </ButtonContainer>
        </Header>
        {this.state.events.length <= 0 ? (
          this.noEventMessage()
        ) : (
          <EventContainer>
            <Divider />
            {this.state.events.map((event, i) => {
              let day = getDayofWeek(event.start.getDay());
              let date = event.start.getMonth() + "/" + event.start.getDate();

              let startTime = getTimeString(event.start);
              let endTime = getTimeString(event.end);

              return (
                <div key={i}>
                  <Divider />
                  <EventBlock>
                    <EventTime>
                      <div>{day + " " + date}</div>
                      <div>{startTime + " -"}</div>
                      <div>{endTime}</div>
                    </EventTime>
                    <EventDescription>
                      <div>{event.title}</div>
                      <div>{event.location}</div>
                    </EventDescription>
                  </EventBlock>
                  <Divider />
                </div>
              );
            })}
            <Divider />
          </EventContainer>
        )}
      </MediaCard>
    );
  }
}
