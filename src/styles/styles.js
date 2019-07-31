import {
  CX_OFF_WHITE,
  CX_GRAY_BLUE,
  BATMAN_GRAY,
  CX_FONT
} from "../utils/Constants";
import styled from "styled-components";
import { Card } from "@material-ui/core";

export const LEFT_BOX_STYLE = {
  margin: "24px 12px 24px 24px"
};

export const RIGHT_BOX_STYLE = {
  margin: "24px 24px 24px 12px"
};

export const BOX_HEADER_SIZE = 44;

export const BoxStyle = styled(Card)`
  margin: 24px;
  font-size: 20px;
  color: ${BATMAN_GRAY};
  background-color: ${CX_OFF_WHITE};
  font-family: ${CX_FONT};
`;

export const BoxHeader = styled.div`
  font-size: 32px;
  color: ${CX_GRAY_BLUE};
  margin: 12px 0 0 12px;
  float: left;
`;

export const CARD_SIDE_MARGINS = 24;
