import React from "react";
import styled from "styled-components";
import { MobileStepper, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CX_GRAY_BLUE, CX_OFF_WHITE } from "../utils/Constants.js";
import { BoxStyle, BoxHeader, BOX_HEADER_SIZE } from "../styles/styles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import Carousel from "../../resources/carousel.json";
import { time } from "../utils/TimeUtils";

const ROTATE_FREQ = time({ seconds: 15 });
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

  // Manually changes which media to display, resets timer
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

  render() {
    if (this.state.numCards <= 0) {
      return (
        <MediaCard raised={true}>
          <BoxHeader>Company Media</BoxHeader>
        </MediaCard>
      );
    } else {
      let card = this.state.carousel[this.state.displayIndex];

      return (
        <MediaCard raised={true}>
          <BoxHeader>Company Media</BoxHeader>
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
