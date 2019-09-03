const edit = (state = false, action) => {
  switch (action.type) {
    case "EDIT":
      return true;
    case "READ":
      return false;
    case "TOGGLE":
      return !state;
    default:
      return state;
  }
};

export default edit;
