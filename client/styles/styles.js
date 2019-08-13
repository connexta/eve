import {
  CX_OFF_WHITE,
  CX_GRAY_BLUE,
  BATMAN_GRAY,
  CX_FONT
} from "../utils/Constants";
import styled from "styled-components";
import { Card } from "@material-ui/core";

export const BOX_HEADER_SIZE = 44;

export const BoxStyle = styled(Card)`
  margin: 24px;
  font-size: 20px;
  color: ${BATMAN_GRAY};
  background-color: ${CX_OFF_WHITE};
  font-family: ${CX_FONT};
  padding: 20px;
  box-sizing: border-box;
`;

export const BoxHeader = styled.div`
  font-size: 32px;
  color: ${CX_GRAY_BLUE};
  margin-bottom: 12px;
  float: left;
`;

export const CARD_SIDE_MARGINS = 24;
