import { combineReducers } from "redux";
import currentWallboard from "./currentWallboard";
import edit from "./edit";

export default combineReducers({
  currentWallboard,
  edit
});
