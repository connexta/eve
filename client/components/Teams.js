import React, { useState, useEffect } from "react";

import moment from "moment";
import Parser from "html-react-parser";

import componentHOC from "./Settings/componentHOC";
import { BoxHeader } from "../styles/styles";
import { O_FROST, O_ORANGE } from "../utils/Constants";
import { time } from "../utils/TimeUtils";

import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import MobileStepper from "@material-ui/core/MobileStepper";
import Typography from "@material-ui/core/Typography";

import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import { withStyles } from "@material-ui/styles";

export const MEDIA_CARD_MARGINS = 20;
const SLIDE_INTERVAL = time({ seconds: 10 });

const StyledMobileStepper = withStyles({
  root: {
    backgroundColor: O_FROST,
    height: "20px",
    width: "calc(100% - " + MEDIA_CARD_MARGINS + "px)",
    position: "absolute",
    bottom: "12px",
    left: "0px",
  },
  dotActive: {
    backgroundColor: O_ORANGE,
  },
})(MobileStepper);

const Teams = (props) => {
  const [pageItems, setPageItems] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const getPages = async () => {
    try {
      const res = await fetch("/teamslist");

      if (!res.ok) {
        console.log("Error fetching /teamslist");
        return;
      }

      const pages = await res.json();
      setPageItems(pages);
    } catch (e) {
      console.log("Error fetching /teamslist. Caught an exception", e);
    }
  };

  useEffect(() => {
    getPages();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      let newIndex = pageIndex + 1;
      if (newIndex === pageItems.length) {
        newIndex = 0;
      }
      setPageIndex(newIndex);
    }, SLIDE_INTERVAL);

    return () => {
      clearInterval(slideInterval);
    };
  }, [pageIndex]);

  const previousItem = () => {
    let newIndex = pageIndex - 1;
    if (newIndex < 0) {
      newIndex = pageItems.length - 1;
    }

    setPageIndex(newIndex);
  };

  const nextItem = () => {
    let newIndex = pageIndex + 1;
    if (newIndex === pageItems.length) {
      newIndex = 0;
    }
    setPageIndex(newIndex);
  };

  const currentPage = pageItems[pageIndex];

  if (currentPage == null) {
    return (
      <>
        <BoxHeader style={{ width: "100%", display: "block", flex: 1 }}>
          Teams
        </BoxHeader>
        <div>LOADING ...</div>
      </>
    );
  }

  const { user, content, date, url } = currentPage;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <BoxHeader style={{ width: "100%", display: "block", flex: 1 }}>
        Teams
      </BoxHeader>
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          alignSelf: "flex-end",
          flex: 1,
          alignItems: "flex-end",
          color: `${O_ORANGE}`,
        }}
      >
        posted by: {user} {moment(date).format("MMM DD YYYY")}
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "4px",
          flex: 8,
          marginBottom: "20px",
          overflow: "auto",
        }}
      >
        {Parser(content)}
      </div>
      <StyledMobileStepper
        activeStep={pageIndex}
        steps={pageItems.length}
        variant={"dots"}
        position={"static"}
        nextButton={
          <Button size="small" onClick={() => nextItem()}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={() => previousItem()}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
};

const WrappedComponent = componentHOC(Teams);
export default WrappedComponent;
