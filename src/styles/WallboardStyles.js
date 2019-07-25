import styled from "styled-components";
import { BANNER_HEIGHT } from "../index";
import { Grid } from "@material-ui/core/Grid";

export const LeftBox = styled(Grid)`
  height: 100%;
  width: 66%;
`;

export const RightBox = styled(Grid)`
  height: 100%;
  width: 34%;
`;

export const I2OleftBox = {
  height: "100%",
  width: "30%"
};

export const WallBoardButtons = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap"
};

export const Homebase = styled(Grid)`
  font-size: 30px;
  position: absolute;
  top: ${BANNER_HEIGHT}px;
  bottom: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;
