import React from "react";
import styled from "styled-components";
import { withStyles } from "@material-ui/styles";
import { BoxStyle, BoxHeader } from "../styles/styles";
import { Divider } from "@material-ui/core";
import {
  time,
  localizeTime,
  getDayofWeek,
  getTimeString,
  catchError
} from "../utils/TimeUtils";
import { callApi } from "./GraphApi/GraphService";
import { userAgentApplication, config, user } from "./GraphApi/GraphConfig";
import makeTrashable from "trashable";
import EventEdit from "./EventEdit";
import componentHOC from "./Settings/componentHOC";

const MONTHS_AFTER = 2; // how many months in the future to grab events
const NUM_EVENTS_GRAB = 50; //limit on number of events to grab from API
const CALL_FREQ = time({ minutes: 30 }); //how often to refresh calendar events
const EVENT_HEIGHT = 110; //height of one event in pixels

const EventContainer = styled.div`
  position: absolute;
  top: 72px;
  width: 100%;
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

export const CarouselContent = styled.div`
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  margin: 20px 0 0 0;
`;

export const EventCard = styled(BoxStyle)`
  position: relative;
`;

const Header = styled(BoxHeader)`
  width: 100%;
`;

const StyleDivider = withStyles({
  root: {
    width: "calc(100% - 40px)"
  }
})(Divider);

class EventComponent extends React.Component {
  constructor(props) {
    super(props);

    this.divRef = React.createRef();

    let cal = localStorage.getItem("chosenCalendar" + this.props.wallboard);

    this.state = {
      displayIndex: 0,
      isAuthenticated: user !== null,
      events: [],
      calendars: [],
      chosenCal: cal,
      numEvents: 0,
      open: false
    };
  }

  getNumEvents(height) {
    return Math.floor(height / EVENT_HEIGHT);
  }

  async getDefaultEvents() {
    let eventData = await fetch("/event?route=" + this.props.wallboard, {
      method: "GET"
    })
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch event data from backend");
          return;
        } else {
          return res.json();
        }
      })
      .then(res => res.events);

    eventData = eventData.map(evt => {
      return {
        end: new Date(evt.end),
        location: evt.location,
        start: new Date(evt.start),
        title: evt.title,
        local: true
      };
    });

    let sorted = eventData.sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });

    return sorted;
  }

  // clean up event data so it works with big-react-calendar
  async updateEvents(eventData) {
    if (eventData != null && eventData.length > 0) {
      eventData = eventData.map(event => ({
        title: event.subject,
        start: event.start,
        end: event.end,
        bodyPreview: event.bodyPreview,
        location: event.location.displayName,
        local: false
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

      let temp = eventData.concat(this.state.events);

      temp.sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      });

      this.setState({
        isAuthenticated: true,
        events: temp,
        error: null
      });
    } else {
      this.setState({
        isAuthenticated: true,
        error: null
      });
    }
  }

  // grabs list of calendars from Microsft Graph API
  async getCalendars() {
    try {
      this.trashableAccessToken = makeTrashable(
        userAgentApplication.acquireTokenSilent({
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
    localStorage.setItem("chosenCalendar" + this.props.wallboard, cal);
    this.setEvents();
  }

  //Fetch event data for next DAYS_AFTER days
  async getCalendarEvents(cal) {
    try {
      this.trashableAccessToken = makeTrashable(
        userAgentApplication.acquireTokenSilent({
          scopes: config.scopes
        })
      );

      let accessToken = await this.trashableAccessToken;

      if (accessToken) {
        let startDate = new Date();

        let endDate = new Date();
        let newMonth = endDate.getMonth() + MONTHS_AFTER;

        if (newMonth > 11) {
          endDate.setMonth(newDate - 12);
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else endDate.setMonth(newMonth);

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
      await this.updateEvents([]);
    }
  }

  // Adjusts number of events to display based on size of container
  handleResize() {
    if (this.divRef.current && this.divRef.current != null) {
      this.setState({
        numEvents: this.getNumEvents(this.divRef.current.clientHeight)
      });
    }
  }

  // Grabs default and (if applicable) calendar events
  async setEvents() {
    this.setState({ events: await this.getDefaultEvents() });

    if (
      this.state.isAuthenticated &&
      this.state.chosenCal &&
      this.state.chosenCal != "None" &&
      this.state.chosenCal != null
    ) {
      this.getCalendarEvents(this.state.chosenCal);
    }
  }

  // Refresh user information/calendar events
  async componentDidMount() {
    if (this.divRef.current && this.divRef.current != null) {
      this.setState({
        numEvents: this.getNumEvents(this.divRef.current.clientHeight)
      });
    }

    if (this.state.isAuthenticated) {
      this.getCalendars();
    }

    await this.setEvents();

    this.timerIntervalID = setInterval(() => {
      if (this.state.isAuthenticated && this.state.chosenCal)
        this.getCalendarEvents(this.state.chosenCal);
    }, CALL_FREQ);

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  // Clear unmet promises
  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    if (this.trashableAccessToken) this.trashableAccessToken.trash();
    if (this.trashableAPICall) this.trashableAPICall.trash();
    if (this.trashableLogIn) this.trashableLogIn.trash();

    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  // Text to display if there are no events loaded
  noEventMessage() {
    if (!this.state.isAuthenticated) {
      return <div>Please sign in or add events in settings mode</div>;
    } else if (!this.state.chosenCal) {
      return (
        <div>
          Select calendar to display events or add events in settings mode
        </div>
      );
    } else if (this.state.events.length <= 0) {
      return <div>No events to display, please add some in settings mode</div>;
    } else {
      return <div>Trouble displaying events</div>;
    }
  }

  // adds manual event to state and to back end list
  addEvent(event) {
    let temp = this.state.events;
    temp.push(event);
    temp.sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });

    this.setState({
      events: temp
    });

    fetch("/event", {
      method: "POST",
      body: JSON.stringify({ route: this.props.wallboard, event: event }),
      headers: { "Content-Type": "application/json" }
    });
  }

  // removes event from state and from back end
  removeEvent(num) {
    let event = this.state.events[num];

    fetch("/removeEvent", {
      method: "POST",
      body: JSON.stringify({ route: this.props.wallboard, event: event }),
      headers: { "Content-Type": "application/json" }
    });

    let temp = this.state.events.filter((evt, i) => i != num);

    this.setState({ events: temp });
  }

  setOpen() {
    this.props.edit ? this.setState({ open: true }) : null;
  }

  setClose() {
    this.setState({ open: false });
  }

  render() {
    let eventData = this.state.events.slice(0, this.state.numEvents);
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div
          onClick={() =>
            this.props.edit ? this.setState({ open: true }) : null
          }
          style={{ zIndex: 5, height: "100%", width: "100%" }}
        >
          <Header>Company Events</Header>
          <div
            style={{ height: "calc(100% - 90px)", width: "100%" }}
            ref={this.divRef}
          >
            {this.state.events.length <= 0 ? (
              this.noEventMessage()
            ) : (
              <EventContainer>
                <StyleDivider />
                {eventData.map((evt, i) => {
                  let day = getDayofWeek(evt.start.getDay());
                  let date =
                    evt.start.getMonth() + 1 + "/" + evt.start.getDate();

                  let startTime = getTimeString(evt.start);
                  let endTime = getTimeString(evt.end);

                  return (
                    <div key={i}>
                      <StyleDivider />
                      <EventBlock>
                        <EventTime>
                          <div>{day + " " + date}</div>
                          <div>{startTime + " -"}</div>
                          <div>{endTime}</div>
                        </EventTime>
                        <EventDescription>
                          <div>{evt.title}</div>
                          <div>{evt.location}</div>
                        </EventDescription>
                      </EventBlock>
                      <StyleDivider />
                    </div>
                  );
                })}
                <StyleDivider />
              </EventContainer>
            )}
          </div>
        </div>
        <EventEdit
          isAuthenticated={this.state.isAuthenticated}
          chosenCal={this.state.chosenCal}
          calendars={this.state.calendars}
          callback={this.changeState.bind(this)}
          events={this.state.events}
          addEvent={this.addEvent.bind(this)}
          removeEvent={this.removeEvent.bind(this)}
          open={this.state.open}
          close={() => this.setState({ open: false })}
        />
      </div>
    );
  }
}

const WrappedComponent = componentHOC(EventComponent);
export default WrappedComponent;
