import React from "react";
import styled from "styled-components";
import { MobileStepper, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CX_GRAY_BLUE, CX_OFF_WHITE } from "../utils/Constants.js";
import { BoxStyle, BoxHeader, BOX_HEADER_SIZE } from "../styles/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Carousel from "../../resources/carousel.json";
import { time } from "../utils/TimeUtils";

const ROTATE_FREQ = time({ seconds: 5 });
export const MEDIA_EVENT_CARD_HEIGHT = 700;

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
  height: ${MEDIA_EVENT_CARD_HEIGHT}px;
  margin: 0 0 0 24px;
  position: relative;
`;

const Header = styled(BoxHeader)`
  width: 100%;
`;

const CarouselMedia = styled.img`
  max-width: calc(100% - 48px);
  max-height: calc(${MEDIA_EVENT_CARD_HEIGHT}px - ${BOX_HEADER_SIZE}px - 212px);
  border-radius: 4px;
`;

const CarouselText = styled.div`
  position: absolute;
  bottom: 60px;
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
    width: "calc(100% - 20px)",
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
      carousel: Carousel,
      displayIndex: 0,
      numCards: Carousel.cards.length
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
  switchCard(i) {
    if (i >= this.state.numCards) i = 0;
    if (i < 0) i = this.state.numCards - 1;
    this.setState({ displayIndex: i });
    clearInterval(this.rotateInterval);
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Gets user data and sets timer for refreshing data and rotating displayed PR
  componentDidMount() {
    this.rotateInterval = setInterval(() => this.rotateCard(), ROTATE_FREQ);
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.rotateInterval);
  }

  render() {
    let card = this.state.carousel.cards[this.state.displayIndex];
    let src = require("../../resources/carouselMedia/" + card.media);

    return (
      <MediaCard raised={true}>
        <Header>Company Media</Header>

        <CarouselContent
          onClick={() => {
            if (card.link != "") window.open(card.link);
          }}
        >
          <CarouselMedia src={src}></CarouselMedia>
          <p>{card.title}</p>
          <CarouselBody>{card.body}</CarouselBody>
        </CarouselContent>
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
