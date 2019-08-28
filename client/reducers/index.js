import { combineReducers } from 'redux'
import currentWallboard from "./currentWallboard"
import currentComponents from './currentComponents'
import editMode from './editMode'

export default combineReducers({
  currentComponents,
  currentWallboard,
  editMode
})