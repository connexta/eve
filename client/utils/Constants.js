import { createMuiTheme } from '@material-ui/core/styles';

// fonts
export const CX_FONT = '"Open Sans", "Arial"';

// colors
export const CX_LIGHT_BLUE = "#00CCFF";
export const CX_DARK_BLUE = "#00ADD2";
export const CX_GRAY_BLUE = "#658398";
export const CX_OFF_WHITE = "#F2F2F2";
export const LIGHT_BLUE = "#4BC8EE";
export const DARK_BLUE = "#00ABD4";
export const GRAY_BLUE = "#506F85";
export const LIGHT_GRAY = "#477081";
export const BATMAN_GRAY = "#272727";

export const settingTheme = createMuiTheme({
    palette: {
        primary: { main: CX_DARK_BLUE },
        secondary: { main: CX_OFF_WHITE },
        default: { main: CX_OFF_WHITE }
    }
});