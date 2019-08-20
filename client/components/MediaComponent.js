import React from "react";
import styled from "styled-components";
import { BoxStyle, BoxHeader } from "../styles/styles";
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
import { withStyles } from "@material-ui/styles";

const ROTATE_FREQ = time({ seconds: 5 });
export const MEDIA_EVENT_CARD_HEIGHT = 696;
export const MEDIA_CARD_MARGINS = 20;

export const MediaCard = styled(BoxStyle)`
  width: calc((100% / 2) - 24px);
  margin: 0 0 0 24px;
  height: 100%;
  position: relative;
`;

export const CarouselContent = styled.div`
  text-align: center;
  width: 100%;
  height: calc(100% - 132px);
  margin: 52px 0 0 0;
  position: absolute;
  bottom: 60px;
  left: 0;
`;

const CarouselContentLink = styled(CarouselContent)`
  cursor: pointer;
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

    this.formRef = React.createRef();
    this.inputRef = React.createRef();

    this.state = {
      open: false,
      add: false,
      title: null,
      body: null,
      media: null,
      link: null,
      file: null
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose(value) {
    this.setState({ open: false });
  }

  async send() {
    if (this.inputRef.current.value.length > 0) {
      this.formRef.current.submit();
    }

    this.props.addMedia({
      body: this.state.body,
      title: this.state.title,
      media: this.state.media,
      link: this.state.link
    });

    this.setState({
      add: false,
      body: null,
      title: null,
      media: null,
      link: null
    });
  }

  render() {
    return (
      <div style={{ display: "inline-block", position: "absolute", right: 20 }}>
        <Edit onClick={this.handleClickOpen.bind(this)} />
        <Dialog
          onClose={this.handleClose.bind(this)}
          aria-labelledby="edit-media-dialog"
          open={this.state.open}
          maxWidth={false}
        >
          <DialogTitle>Add/Remove Media</DialogTitle>
          <Table size={"small"} style={{ width: 800 }}>
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
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={e => this.setState({ body: e.target.value })}
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <form
                      target="_blank"
                      id="frmUploader"
                      action="/upload"
                      method="post"
                      ref={this.formRef}
                      encType="multipart/form-data"
                    >
                      <input
                        ref={this.inputRef}
                        type="file"
                        name="imgUploader"
                        onChange={e =>
                          this.setState({
                            media: e.target.value.substr(
                              12,
                              e.target.value.length - 1
                            )
                          })
                        }
                      />
                    </form>
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={e => this.setState({ link: e.target.value })}
                    ></TextField>
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
      </div>
    );
  }
}

///////////////////////////////////
///////////////////////////////////

export default class MediaComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carousel: [],
      displayIndex: 0,
      numCards: 0
    };
  }

  async getCarousel() {
    await fetch("/carousel", {
      method: "GET"
    })
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch carousel data");
          return;
        } else {
          console.log("Carousel data received");
          return res.json();
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          carousel: res.cards,
          numCards: res.cards.length
        });
      });
  }

  // Sets timer for rotating displayed media
  componentDidMount() {
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
    this.getCarousel();
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.rotateInterval);
  }

  // switches which card is displayed
  rotateCard() {
    this.setState({
      displayIndex:
        this.state.displayIndex == this.state.numCards - 1 ||
        this.state.numCards == 0
          ? 0
          : this.state.displayIndex + 1
    });
  }

  // Manually changes which media to display, resets timer
  switchCard(index) {
    if (index >= this.state.numCards) index = 0;
    if (index < 0) index = this.state.numCards - 1;
    this.setState({ displayIndex: index });
    clearInterval(this.rotateInterval);
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // removes media from carousel, updates backend and state
  removeMedia(num) {
    let media = this.state.carousel[num].media;
    if (media != null) {
      fetch("/remove", {
        method: "POST",
        body: JSON.stringify({ media: media }),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.text())
        .then(res => console.log(res));
    }

    let temp = this.state.carousel.filter((card, i) => i != num);
    let numCards = this.state.numCards <= 0 ? 0 : this.state.numCards - 1;
    this.setState({
      carousel: temp
    });
    this.send(temp);

    if (numCards == 0) {
      this.setState({ displayIndex: 0 });
    } else if (numCards == this.state.displayIndex) {
      this.setState({ displayIndex: this.state.displayIndex - 1 });
    }
    this.setState({ numCards: numCards });
  }

  // sends carousel data to backend
  send(data) {
    console.log("Sending: ", data);

    fetch("/carousel", {
      method: "POST",
      body: JSON.stringify({ cards: data }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.text())
      .then(res => console.log(res));
  }

  // Adds media to carousel, updates backend and state
  addMedia(media) {
    if (media.body == null && media.title == null && media.media == null)
      return;

    let temp = this.state.carousel;
    temp.push(media);

    this.send(temp);

    this.setState({
      carousel: temp,
      numCards: this.state.numCards + 1
    });
  }

  render() {
    if (this.state.numCards <= 0) {
      return (
        <MediaCard raised={true}>
          <BoxHeader>
            Company Media
            <MediaEdit
              media={this.state.carousel}
              remove={this.removeMedia.bind(this)}
              addMedia={this.addMedia.bind(this)}
            />
          </BoxHeader>
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
              addMedia={this.addMedia.bind(this)}
            />
          </BoxHeader>
          {card.link == null ? (
            <CarouselContent>
              {this.state.carousel[this.state.displayIndex].media ==
              null ? null : (
                <CarouselMedia
                  src={"/" + this.state.carousel[this.state.displayIndex].media}
                ></CarouselMedia>
              )}
              <p>{card.title}</p>
              <CarouselBody>{card.body}</CarouselBody>
            </CarouselContent>
          ) : (
            <CarouselContentLink
              onClick={() => {
                window.open(card.link);
              }}
            >
              {this.state.carousel[this.state.displayIndex].media ==
              null ? null : (
                <CarouselMedia
                  src={"/" + this.state.carousel[this.state.displayIndex].media}
                ></CarouselMedia>
              )}
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
