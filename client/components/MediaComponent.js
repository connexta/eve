import React from "react";
import styled from "styled-components";
import { BoxStyle, BoxHeader, BOX_HEADER_SIZE } from "../styles/styles";
import Carousel from "../../resources/carousel.json";
import { time } from "../utils/TimeUtils";
import {
  MobileStepper,
  Button,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import { CX_GRAY_BLUE, CX_OFF_WHITE } from "../utils/Constants.js";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Edit,
  Add,
  Delete,
  Save
} from "@material-ui/icons";
import Carousel from "../../resources/carousel.json";
import { time } from "../utils/TimeUtils";

const ROTATE_FREQ = time({ seconds: 15 });
export const MEDIA_EVENT_CARD_HEIGHT = 696;
export const MEDIA_CARD_MARGINS = 20;

export const CarouselContent = styled.div`
  text-align: center;
  width: 100%;
  height: calc(100% - 132px);
  margin: 52px 0 0 0;
  position: absolute;
  bottom: 60px;
  left: 0;
`;

const CarouselMedia = styled.img`
  max-width: calc(100% - 48px);
  max-height: calc(100% - 120px);
  border-radius: 4px;
`;

const CarouselBody = styled.p`
  text-align: left;
  margin: 0 24px 0 24px;
  height: 48px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledMobileStepper = withStyles({
  root: {
    backgroundColor: CX_OFF_WHITE,
    height: "20px",
    width: "calc(100% - " + MEDIA_CARD_MARGINS + "px)",
    position: "absolute",
    bottom: "12px",
    left: "0px"
  },
  dotActive: {
    backgroundColor: CX_GRAY_BLUE
  }
})(MobileStepper);

class MediaEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      edit: false,
      add: false,
      title: null,
      body: null,
      media: null,
      link: null
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose(value) {
    this.setState({ open: false });
    this.props.remove(value);
  }

  save() {
    let myReader = new FileReader();
    myReader.onloadend = function(e) {
      this.save(myReader.result);
    };
    myReader.readAsDataURL(file);
  }

  send(stream) {
    this.setState({ media: stream });

    fetch("http://localhost:8080/carousel", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.text())
      .then(res => console.log(res.body));
  }

  render() {
    return (
      <div style={{ display: "inline-block", position: "absolute", right: 20 }}>
        <Edit onClick={this.handleClickOpen.bind(this)} />
        <Dialog
          onClose={this.handleClose.bind(this)}
          aria-labelledby="select-calendar-dialog"
          open={this.state.open}
        >
          <DialogTitle id="select-calendar-dialog-title">
            Add/Remove Media
          </DialogTitle>
          <Table size={"small"}>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Media</TableCell>
                <TableCell>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.media.map((media, i) => (
                <TableRow key={media.title}>
                  <TableCell>
                    <Delete onClick={() => this.props.remove(i)} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {media.title}
                  </TableCell>
                  <TableCell>{media.body}</TableCell>
                  <TableCell>{media.media}</TableCell>
                  <TableCell>{media.link}</TableCell>
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
                      id="title"
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={e => this.setState({ body: e.target.value })}
                      id="body"
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <input
                      onChange={e => this.setState({ media: e.target.value })}
                      type="file"
                      name="file"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={e => this.setState({ link: e.target.value })}
                      id="link"
                    ></TextField>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
          <Add onClick={() => this.setState({ add: true })} />
        </Dialog>
      </div>
    );
  }
}

export default class MediaComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      carousel: Carousel.cards,
      displayIndex: 0,
      numCards: Carousel.cards ? Carousel.cards.length : 0,
      media: []
    };
  }

  rotateCard() {
    this.setState({
      displayIndex:
        this.state.displayIndex == this.state.numCards - 1
          ? 0
          : this.state.displayIndex + 1
    });
  }

  // Manually changes which PR to display, resets timer
  switchCard(index) {
    if (index >= this.state.numCards) index = 0;
    if (index < 0) index = this.state.numCards - 1;
    this.setState({ displayIndex: index });
    clearInterval(this.rotateInterval);
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Fetches all images to be displayed
  getMedia() {
    let media = this.state.carousel.map((card, i) => {
      return require("../../resources/carouselMedia/" + card.media);
    });

    this.setState({ media: media });
  }

  // Sets timer for rotating displayed media
  componentDidMount() {
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
    this.getMedia();
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.rotateInterval);
  }

  removeMedia(num) {
    if (num >= 0 && num < this.state.numCards) {
      let temp = this.state.carousel.filter((card, i) => i != num);
      this.setState({
        carousel: temp
      });
      if (this.state.numCards - 1 == this.state.displayIndex)
        this.setState({ displayIndex: this.state.displayIndex - 1 });
      this.setState({ numCards: this.state.numCards - 1 });
    }
  }

  addMedia(media) {
    console.log(media);
  }

  render() {
    if (this.state.numCards <= 0) {
      return (
        <MediaCard raised={true}>
          <Header>
            Company Media
            <MediaEdit
              media={this.state.carousel}
              remove={this.removeMedia.bind(this)}
              add={this.addMedia.bind(this)}
            />
          </Header>
        </MediaCard>
      );
    } else {
      let card = this.state.carousel[this.state.displayIndex];

      return (
        <MediaCard raised={true}>
          <BoxHeader>
            Company Media
            <MediaEdit
              media={this.state.carousel}
              remove={this.removeMedia.bind(this)}
              add={this.addMedia.bind(this)}
            />
          </BoxHeader>
          {card.link == "" ? (
            <CarouselContent>
              <CarouselMedia
                src={this.state.media[this.state.displayIndex]}
              ></CarouselMedia>
              <p>{card.title}</p>
              <CarouselBody>{card.body}</CarouselBody>
            </CarouselContent>
          ) : (
            <CarouselContentLink
              onClick={() => {
                window.open(card.link);
              }}
            >
              <CarouselMedia
                src={this.state.media[this.state.displayIndex]}
              ></CarouselMedia>
              <p>{card.title}</p>
              <CarouselBody>{card.body}</CarouselBody>
            </CarouselContentLink>
          )}
          <StyledMobileStepper
            activeStep={this.state.displayIndex}
            steps={this.state.numCards}
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
}
