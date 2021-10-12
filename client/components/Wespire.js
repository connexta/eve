import React, { useState, useEffect } from "react";

import componentHOC from "./Settings/componentHOC";
import { BoxHeader } from "../styles/styles";
import { O_FROST, O_ORANGE } from "../utils/Constants";
import { time } from "../utils/TimeUtils";

import Button from "@material-ui/core/Button";
import MobileStepper from "@material-ui/core/MobileStepper";

import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
//import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

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

const fallbackBlogItems = [
  {
    style:
      "background-image: url('https://res.cloudinary.com/hyetmyubn/image/upload/a_exif,f_auto,q_auto/v1633567430/fxlxfez3n0k0xpbfndr3.jpg')",
    date: "2021-10-07T00:44:12+00:00",
    link: "/blogs/5442",
    text:
      "Please join us: Volunteer Info Session for the Upcoming Octo's Virtual STEAM Expo!",
  },
  {
    style:
      "background-image: url('https://res.cloudinary.com/hyetmyubn/image/upload/a_exif,f_auto,q_auto/v1633124048/ahcbjimezblfuaval69n.jpg')",
    date: "2021-10-01T23:26:22+00:00",
    link: "/blogs/5403",
    text:
      "Announcing Virtual Octo-fest 2021: Featuring Contests (prize opportunities) and a Live Event on 10/27",
  },
  {
    style:
      "background-image: url('https://res.cloudinary.com/hyetmyubn/image/upload/a_exif,f_auto,q_auto/v1632935256/wxj3jfqn5wgfkrddpwpr.jpg')",
    date: "2021-09-29T17:10:37+00:00",
    link: "/blogs/5397",
    text:
      "WELLNESS WEDNESDAY: Promoting an Octo-only Health Webinar on Making Healthy a Habit",
  },
  {
    style:
      "background-image: url('https://res.cloudinary.com/hyetmyubn/image/upload/a_exif,f_auto,q_auto/v1632877956/hcgiuzgbkbczx0lg6jor.jpg')",
    date: "2021-09-29T01:20:56+00:00",
    link: "/blogs/5395",
    text: "Voting is now open for Octo's Got Talent! (through October 5)",
  },
  {
    style:
      "background-image: url('https://res.cloudinary.com/hyetmyubn/image/upload/a_exif,f_auto,q_auto/v1632349467/fji4w5ka9vamhw5bnmfu.jpg')",
    date: "2021-09-22T22:35:54+00:00",
    link: "/blogs/5387",
    text:
      "Sign-up by September 30 for Octo's next connected wellness challenge!",
  },
];

const Wespire = (props) => {
  const [blogItems, setBlogItems] = useState([]);
  const [blogIndex, setBlogIndex] = useState(0);

  const getBlogs = async () => {
    try {
      const res = await fetch("/wespireblog");

      if (!res.ok) {
        console.log("Error fetching /wespireblog");
        return;
      }

      const blogs = await res.json();
      setBlogItems(blogs);
    } catch (e) {
      console.log("Error fetching /wespire. Caught an exception", e);
      setBlogItems(fallbackBlogItems);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      let newIndex = blogIndex + 1;
      if (newIndex === blogItems.length) {
        newIndex = 0;
      }
      setBlogIndex(newIndex);
    }, SLIDE_INTERVAL);

    return () => {
      clearInterval(slideInterval);
    };
  }, [blogIndex]);

  const previousItem = () => {
    let newIndex = blogIndex - 1;
    if (newIndex < 0) {
      newIndex = blogItems.length - 1;
    }

    setBlogIndex(newIndex);
  };

  const nextItem = () => {
    let newIndex = blogIndex + 1;
    if (newIndex === blogItems.length) {
      newIndex = 0;
    }
    setBlogIndex(newIndex);
  };

  const currentBlog = blogItems[blogIndex];
  if (currentBlog == null) {
    return (
      <>
      <BoxHeader style={{ width: "100%", display: "block", flex: 1 }}>
        Octo Impact Hub
      </BoxHeader>
    <div>LOADING ...</div>
      </>
    )
  }

  const { text, style } = currentBlog;
  const url = style ? style.substr(style.indexOf("url")) : null;

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
      <div
        style={{
          background: `${url} no-repeat center center/cover`,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "4px",
          flex: 8,
          marginBottom: "20px",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          alignSelf: "flex-end",
          flex: 4,
          marginTop: "20px",
          alignItems: "flex-end",
        }}
      >
        {text}
      </div>
      <StyledMobileStepper
        activeStep={blogIndex}
        steps={blogItems.length}
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

const WrappedComponent = componentHOC(Wespire);
export default WrappedComponent;
