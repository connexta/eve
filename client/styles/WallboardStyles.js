import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

export const LeftBox = styled(Grid)`
  height: 100%;
  width: 66%;
`;

export const RightBox = styled(Grid)`
  height: 100%;
  width: 34%;
`;

export const WallBoardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Homebase = styled.div`
  font-size: 30px;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;
