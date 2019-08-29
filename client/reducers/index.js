import { combineReducers } from "redux";
import currentWallboard from "./currentWallboard";
import currentComponents from "./currentComponents";
import edit from "./edit";

export default combineReducers({
  currentComponents,
  currentWallboard,
  edit
});
