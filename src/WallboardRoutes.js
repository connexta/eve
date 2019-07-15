import GSRWallboard from "./wallboards/GSRWallboard";
import TVWallboard from "./wallboards/TVWallboard";
import AirforceWallboard from "./wallboards/AirforceWallboard";
import Home from "./wallboards/Home";

export const wallboards = [
  { path: "/", component: Home, key: "Home" },
  { path: "/tv/", component: TVWallboard, key: "TV" },
  { path: "/airforce/", component: AirforceWallboard, key: "Airforce" },
  { path: "/gsr/", component: GSRWallboard, key: "GSR" }
];
