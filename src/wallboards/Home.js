import React from "react";
import { BrowserRouter as Link } from "react-router-dom";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../Constants";
import { HOMEBASE, WallBoardButtons } from "./WallboardStyles";
import Button from "@material-ui/core/Button";

// Wallboard Variants
import GSRWallboard from "./GSRWallboard";
import TVWallboard from "./TVWallboard";
import AirforceWallboard from "./AirforceWallboard";

const proxy = props => <Home {...props} />;

// Add new wallboard variants here
export const wallboards = [
  { path: "/", component: proxy, key: "Home" },
  { path: "/tv/", component: TVWallboard, key: "TV" },
  { path: "/airforce/", component: AirforceWallboard, key: "Airforce" },
  { path: "/gsr/", component: GSRWallboard, key: "GSR" }
];

const styles = {
  button: {
    background: CX_OFF_WHITE,
    height: "15vh",
    width: "20vw",
    margin: "20px",
    fontSize: "35px",
    fontFamily: CX_FONT,
    color: BATMAN_GRAY,
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
  },
  title: {
    textAlign: "center",
    color: CX_OFF_WHITE,
    fontFamily: CX_FONT
  }
};

export default class Home extends React.Component {
  render() {
    return (
      <div style={HOMEBASE}>
        <h1 style={styles.title}>Choose Wallboard Variant</h1>
        <div style={WallBoardButtons}>
          {/* generate links and paths through wallboards object */}
          {wallboards.map(wallboard => {
            if (wallboard.path == "/") return; // ignore Home link
            return (
              <Link
                to={wallboard.path}
                style={{ textDecoration: "none" }}
                key={wallboard.key}
              >
                <Button style={styles.button}>{wallboard.key}</Button>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
