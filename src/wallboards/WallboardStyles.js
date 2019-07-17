import styled from "styled-components";
import { CX_OFF_WHITE, CX_GRAY_BLUE } from "../Constants";

const BOTTOM_HEIGHT = window.innerHeight - 134;

export const leftBox = {
  height: "100%",
  width: "66%"
};

export const rightBox = {
  height: "100%",
  width: "34%"
};

export const WallboardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

export const HOMEBASE = {
  fontSize: "30px",
  position: "absolute",
  top: "131px",
  overflow: "hidden",
  height: BOTTOM_HEIGHT,
  width: "100%"
};
