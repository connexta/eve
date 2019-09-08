import React from "react";
import styled from "styled-components";
import { BoxHeader } from "../styles/styles";
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
import componentHOC from "./Settings/componentHOC";

const ROTATE_FREQ = time({ seconds: 15 });
export const MEDIA_EVENT_CARD_HEIGHT = 696;
export const MEDIA_CARD_MARGINS = 20;
const SIZE_LIMIT = 20 * Math.pow(10, 6); // max size of images in bytes
const FETCH_FREQ = time({ minutes: 1 });

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
      add: false,
      title: null,
      body: null,
      media: null,
      link: null,
      file: null
    };
  }

  handleClose() {
    this.props.close();
  }

  // checks if image type is valid
  isImage(filename) {
    let parts = filename.split(".");
    let ext = parts[parts.length - 1].toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return true;
    }
    return false;
  }

  // checks if scheme name, characters are valid
  isValidLink(link) {
    let regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    if (regexp.test(link)) return true;
    else return false;
  }

  // checks inputs, calls addMedia(), resets state after save button call
  async send() {
    if (
      this.inputRef.current.value.length > 0 &&
      this.inputRef.current.files[0]
    ) {
      if (!this.isImage(this.inputRef.current.value)) {
        alert("Image type invalid");
        return;
      } else if (this.inputRef.current.files[0].size > SIZE_LIMIT) {
        alert("Image too large to be uploaded");
        return;
      } else await this.formRef.current.submit();
    }

    if (this.state.link != null && !this.isValidLink(this.state.link)) {
      alert("Link invalid");
      return;
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

    location.reload();
  }

  render() {
    return (
      <div style={{ display: "inline-block", position: "absolute", right: 0 }}>
        <Dialog
          onClose={this.handleClose.bind(this)}
          aria-labelledby="edit-media-dialog"
          open={this.props.open}
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
                <TableRow key={i}>
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
                        accept={"image/*"}
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

class MediaComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carousel: [],
      displayIndex: 0,
      numCards: 0,
      open: false
    };
  }

  // get media info from backend
  async getCarousel() {
    await fetch("/carousel?route=" + this.props.wallboard, {
      method: "GET"
    })
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch carousel data");
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        this.setState({
          carousel: res.cards,
          numCards: res.cards.length
        });
      });
  }

  // Sets timer for rotating displayed media
  componentDidMount() {
    this.getCarousel();

    this.carouselInterval = setInterval(() => this.getCarousel(), FETCH_FREQ);
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.rotateInterval);
    clearInterval(this.carouselInterval);
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
    let card = this.state.carousel[num];
    fetch("/remove", {
      method: "POST",
      body: JSON.stringify({ route: this.props.wallboard, card: card }),
      headers: { "Content-Type": "application/json" }
    });

    let temp = this.state.carousel.filter((card, i) => i != num);
    let numCards = this.state.numCards <= 0 ? 0 : this.state.numCards - 1;
    this.setState({
      carousel: temp
    });

    if (numCards == 0) {
      this.setState({ displayIndex: 0 });
    } else if (numCards == this.state.displayIndex) {
      this.setState({ displayIndex: this.state.displayIndex - 1 });
    }
    this.setState({ numCards: numCards });
  }

  // Adds media to carousel, updates backend and state
  addMedia(media) {
    if (media.body == null && media.title == null && media.media == null)
      return;

    let temp = this.state.carousel;
    temp.push(media);

    fetch("/carousel", {
      method: "POST",
      body: JSON.stringify({ route: this.props.wallboard, card: media }),
      headers: { "Content-Type": "application/json" }
    });

    this.setState({
      carousel: temp,
      numCards: this.state.numCards + 1
    });
  }

  handleClickOpen() {
    this.props.edit ? this.setState({ open: true }) : null;
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    if (this.state.numCards <= 0) {
      return (
        <>
          <MediaEdit
            media={this.state.carousel}
            remove={this.removeMedia.bind(this)}
            addMedia={this.addMedia.bind(this)}
            edit={this.props.edit}
            open={this.state.open}
            close={this.handleClose.bind(this)}
          />
          <div
            onClick={this.handleClickOpen.bind(this)}
            style={{ zIndex: 5, height: "100%" }}
          >
            <BoxHeader style={{ width: "100%" }}>Company Media</BoxHeader>
          </div>
        </>
      );
    } else {
      let card = this.state.carousel[this.state.displayIndex];

      return (
        <>
          <MediaEdit
            media={this.state.carousel}
            remove={this.removeMedia.bind(this)}
            addMedia={this.addMedia.bind(this)}
            edit={this.props.edit}
            open={this.state.open}
            close={this.handleClose.bind(this)}
          />
          <div
            onClick={this.handleClickOpen.bind(this)}
            style={{ zIndex: 5, height: "100%" }}
          >
            <BoxHeader style={{ width: "100%" }}>Company Media</BoxHeader>
            {card.link == null ? (
              <CarouselContent>
                {this.state.carousel[this.state.displayIndex].media ==
                null ? null : (
                  <CarouselMedia
                    src={
                      "/" + this.state.carousel[this.state.displayIndex].media
                    }
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
                    src={
                      "/" + this.state.carousel[this.state.displayIndex].media
                    }
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
          </div>
        </>
      );
    }
  }
}

const WrappedComponent = componentHOC(MediaComponent);
export default WrappedComponent;
