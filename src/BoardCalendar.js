import React from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment, { calendarFormat } from "moment";

import '!style-loader!css-loader!./BoardCalendar.css';

const localizer = momentLocalizer(moment);

const CalendarStyle = styled.div`
display: flex;
`;

function localizeTime(time, timezone){
  return new Date(time.split("T") + " " + timezone);
}

//date: inclusive:exclusive. month needs to be -1
class BoardCalendar extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      events: []
    };

    this.updateEvents(this.props.events);
  }

  updateEvents(eventData){

    if(eventData != null) {
      //eventData = eventData.map(event => ({"title": event.subject, "start": event.start, "end": event.end}));
      for (var i = 0; i < eventData.length; i++){
        eventData[i].start = localizeTime(eventData[i].start.dateTime, eventData[i].start.timeZone);
        eventData[i].end = localizeTime(eventData[i].end.dateTime, eventData[i].end.timeZone);
      }
  
      this.setState({
        events: eventData
      })
    }
    
  }

  render() {
    //this.updateEvents(this.state.events);
    console.log("Passed into BoardCalendar");
    console.log(this.state.events);

    return (
      <div>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "55vh" }}
        />
      </div>
    );
  }
}

export default BoardCalendar;
