import { createMuiTheme } from "@material-ui/core/styles";

// banner
export const BANNER_HEIGHT = 124;

// fonts
export const CX_FONT = '"Open Sans", "Arial"';
export const O_FONT = '"Roboto", "Aaux Next"';

// colors
export const CX_LIGHT_BLUE = "#00CCFF";
export const CX_DARK_BLUE = "#00ADD2";
export const CX_GRAY_BLUE = "#658398";
export const CX_OFF_WHITE = "#F2F2F2";
//export const LIGHT_BLUE = "#4BC8EE";
//export const DARK_BLUE = "#00ABD4";
//export const GRAY_BLUE = "#506F85";
//export const LIGHT_GRAY = "#477081";
//export const O_SMOKE = "#272727";

// octo colors
export const O_ORANGE = "#F7931E";
export const O_ROYAL_BLUE = "#2A296B";
export const O_GRAPEFRUIT = "#F15A24";
export const O_GOLDENROD = "#FBB03B";
export const O_GUNMETAL = "#4B657E";
export const O_SKY_BLUE = "#589DD5";
export const O_MIDNIGHT_BLUE = "#0D1926";
export const O_SMOKE = "#B7C1CB";
export const O_FROST = "#EDF0F3";
export const O_MAROON = "#6B1B20";
export const O_CHARCOAL = "#231F20";

export const settingTheme = createMuiTheme({
  palette: {
    primary: { main: O_GUNMETAL },
    secondary: { main: O_GOLDENROD },
    default: { main: O_ROYAL_BLUE }
  }
});
