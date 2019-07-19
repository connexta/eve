import React from "react";
import BuildStatus from "../BuildStatus";
import SlackComponent from "../SlackComponent";
import Github from "../githubCaller";
import GraphCaller from "../GraphCaller";
import { RightBox, LeftBox, ContentHorz } from "./WallboardStyles";

export default class TVWallboard extends React.Component {
  render() {
    return (
      <ContentHorz>
        <LeftBox>
          {/* Left box content */}
          <BuildStatus />
          <GraphCaller />
        </LeftBox>
        <RightBox>
          {/* Right box content */}
          <SlackComponent />
          <Github />
        </RightBox>
      </ContentHorz>
    );
  }
}
