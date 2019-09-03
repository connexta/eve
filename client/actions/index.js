//Action Creators
export const enterEdit = () => ({
  type: "EDIT"
});

export const leaveEdit = () => ({
  type: "READ"
});

export const toggleEdit = () => ({
  type: "TOGGLE"
});

export const updateCurrentWallboard = wallboard => ({
  type: "UPDATE_WALLBOARD",
  wallboard
});
