import React, { useState, useEffect } from "react";

import moment from "moment";

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
const SLIDE_INTERVAL = time({ seconds: 15 });

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

const fallbackPages = [
  {
    title: "A New HRIS is Coming!!",
    createdBy: "Ethan Meurlin",
    date: "2021-08-26T19:34:06Z",
    link: "SitePages/A-New-HRIS-is-Coming!!.aspx",
  },
  {
    title: "August New Hire Bios",
    createdBy: "Mary Catherine McAllister",
    date: "2021-09-09T15:35:56Z",
    link: "SitePages/August-New-Hire-Bios.aspx",
  },
  {
    title: "Employee Engagement & CSR Updates 9.22",
    createdBy: "Vanessa Davis",
    date: "2021-09-22T23:44:15Z",
    link: "SitePages/Employee-Engagement-&-CSR-Updates-9.22.aspx",
  },
  {
    title: "Hackathon 2021 is Coming! Enter to Win $10,000!",
    createdBy: "Ethan Meurlin",
    date: "2021-08-16T18:19:51Z",
    link: "SitePages/Hackathon-2021-is-Coming!-Get-your-details-here!.aspx",
  },
  {
    title: "OC 1",
    createdBy: "Hanh Duong",
    date: "2021-03-13T00:11:50Z",
    link: "SitePages/Home-1.aspx",
  },
];

const Sharepoint = (props) => {
  const [pageItems, setPageItems] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const getPages = async () => {
    try {
      const res = await fetch("/sharepointlist");

      if (!res.ok) {
        console.log("Error fetching /sharepointlist");
        return;
      }

      const pages = await res.json();
      setPageItems(pages);
    } catch (e) {
      console.log("Error fetching /pages. Caught an exception", e);
      setPageItems(fallbackPages);
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
          OctoConnect
        </BoxHeader>
        <div>LOADING ...</div>
      </>
    );
  }

  const { title, createdBy, date, link } = currentPage;
  const url = `https://octoconsulting.sharepoint.com/${link}`;

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
        Octo Impact Hub
      </BoxHeader>
      <Typography variant="h4" align="center" style={{ flex: 2 }}>
        {title}
      </Typography>

      <Typography variant="h5" align="center" style={{ flex: 2 }}>
        created by: {createdBy} {moment(date).format("MMM DD YYYY")}
      </Typography>

      <Typography gutterBottom variant="h5" align="center" style={{ flex: 2 }}>
        <Link target="_blank" href={url} color={O_ORANGE} underline="always">
          {link}
        </Link>
      </Typography>

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

const WrappedComponent = componentHOC(Sharepoint);
export default WrappedComponent;
