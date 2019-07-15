import React from "react";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_GRAY_BLUE } from "../Constants";
import BuildStatus from "../BuildStatus";
import SlackComponent from "../SlackComponent";
import Github from "../githubCaller";

const RightBox = styled.nav`
  background: ${CX_OFF_WHITE};
  padding: 0%;
  font-size: 30px;
  border-left: solid black 3px;

  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 131px;
  bottom: 0;
  left: 66vw;
  right: 0;
  overflow: hidden;
`;

const LeftBox = styled.nav`
  background: ${CX_GRAY_BLUE};
  padding: 3%;
  font-size: 30px;
  border-right: solid black 3px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  position: absolute;
  top: 131px;
  bottom: 0;
  left: 0;
  right: 33vw;
`;

const ContentHorz = styled.div`
  display: flex;
  flex-direction: row;
`;

class DefaultWallboard extends React.Component {
  render() {
    return (
      <div>
        <ContentHorz>
          <LeftBox>
            {/* Left box content */}
            <BuildStatus />
          </LeftBox>
          <RightBox>
            {/* Right box content */}
            <SlackComponent />
            <Github />
          </RightBox>
        </ContentHorz>
      </div>
    );
  }
}

export default DefaultWallboard;
