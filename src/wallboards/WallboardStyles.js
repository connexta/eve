import styled from "styled-components";
import { CX_OFF_WHITE, CX_GRAY_BLUE } from "../Constants";

export const RightBox = styled.nav`
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

export const LeftBox = styled.nav`
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

export const ContentHorz = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SolidBackground = styled.div`
  background: ${CX_GRAY_BLUE};
  padding: 0%;
  font-size: 30px;

  position: absolute;
  top: 131px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

export const WallboardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;
