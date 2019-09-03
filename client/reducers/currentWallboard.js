const currentWallboard = (state = "HOME", action) => {
  switch (action.type) {
    case "UPDATE_WALLBOARD":
      return action.wallboard;
    default:
      return state;
  }
};

export default currentWallboard;
