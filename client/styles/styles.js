import {
  O_FROST,
  O_ORANGE,
  O_SMOKE,
  O_FONT
} from "../utils/Constants";
import styled from "styled-components";
import { Card, CardContent } from "@material-ui/core";

export const BOX_HEADER_SIZE = 44;

export const BoxStyle = styled(Card)`
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: ${O_SMOKE};
  background-color: ${O_FROST};
  font-family: ${O_FONT};
  padding: 20px;
  box-sizing: border-box;
`;

export const BoxHeader = styled.div`
  font-size: 32px;
  color: ${O_ORANGE};
  margin-bottom: 12px;
  float: left;
  position: relative;
`;

export const CARD_SIDE_MARGINS = 24;

export const FlexRowCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 32px;
  clear: both;
  && {
    padding: 0;
  }
`;

export const FlexRowSubHeading = styled.div`
  background: ${O_FROST};
  font-size: 20px;
  color: ${O_SMOKE};
  font-family: ${O_FONT};
  font-style: italic;
  margin-left: 32px;
`;
