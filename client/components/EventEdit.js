import React from "react";
import {
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import { Add, Delete, Save } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

const SelectCal = withStyles({
  root: {
    display: "inline-block",
    fontSize: "4px"
  }
})(DialogTitle);

const StyleSelect = withStyles({
  select: {
    height: "30px"
  }
})(Select);

export default class EventEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      add: false,
      end: null,
      endTime: null,
      location: null,
      start: null,
      startTime: null,
      title: null
    };
  }

  handleClose() {
    this.props.close();
  }

  getDateObject(date, time) {
    let tempDate = date.split("-");
    let tempTime = time.split(":");

    return new Date(
      tempDate[0],
      tempDate[1] - 1,
      tempDate[2],
      tempTime[0],
      tempTime[1]
    );
  }

  // checks inputs, calls addEvent(), resets state after save button call
  send() {
    if (
      this.state.start == null ||
      this.state.end == null ||
      this.state.startTime == null ||
      this.state.endTime == null ||
      this.state.title == null
    ) {
      alert("Event input invalid");
      return;
    }

    this.props.addEvent({
      end: this.getDateObject(this.state.end, this.state.endTime),
      location: this.state.location,
      start: this.getDateObject(this.state.start, this.state.startTime),
      title: this.state.title
    });

    this.setState({
      add: false,
      end: null,
      endTime: null,
      location: null,
      start: null,
      startTime: null,
      title: null
    });
  }

  handleSelect(event) {
    this.props.callback(event.target.value);
  }

  render() {
    return (
      <Dialog
        onClose={this.handleClose.bind(this)}
        aria-labelledby="edit-event-dialog"
        open={this.props.open}
        maxWidth={false}
      >
        <DialogTitle>Add/Remove Events</DialogTitle>
        {this.props.isAuthenticated ? (
          <div>
            <SelectCal>Select Calendar:</SelectCal>
            <StyleSelect
              value={
                this.props.chosenCal == null ? "None" : this.props.chosenCal
              }
              onChange={this.handleSelect.bind(this)}
              sytle={{ display: "inline-block" }}
            >
              <MenuItem key={-1} value={"None"}>
                <p>None</p>
              </MenuItem>
              {this.props.calendars.map((cal, i) => (
                <MenuItem key={i} value={cal.id}>
                  <p>{cal.name}</p>
                </MenuItem>
              ))}
            </StyleSelect>
          </div>
        ) : null}
        <Table size={"small"} style={{ width: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.events.map((event, i) => (
              <TableRow key={i}>
                <TableCell>
                  {event.local ? (
                    <Delete onClick={() => this.props.removeEvent(i)} />
                  ) : null}
                </TableCell>
                <TableCell component="th" scope="row">
                  {event.title}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.start.toString()}</TableCell>
                <TableCell>{event.end.toString()}</TableCell>
              </TableRow>
            ))}
            {this.state.add ? (
              <TableRow>
                <TableCell>
                  <Save onClick={() => this.send()} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    onChange={e => this.setState({ title: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={e => this.setState({ location: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="date"
                    onChange={e => this.setState({ start: e.target.value })}
                  />
                  <input
                    type="time"
                    onChange={e => this.setState({ startTime: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="date"
                    onChange={e => this.setState({ end: e.target.value })}
                  />
                  <input
                    type="time"
                    onChange={e => this.setState({ endTime: e.target.value })}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>
                  <Add onClick={() => this.setState({ add: true })} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Dialog>
    );
  }
}
