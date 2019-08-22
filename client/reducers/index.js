import { combineReducers } from 'redux'
import currentComponents from './currentComponents'
import editMode from './editMode'

export default combineReducers({
  currentComponents,
  editMode
})