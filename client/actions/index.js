//Action Creators
export const addComponents = component => ({
    type: "ADD_COMP",
    component
});

export const deleteComponents = component => ({
    type: "DEL_COMP",
    component
});

export const enterEdit = () => ({
    type: "EDIT"
})

export const leaveEdit = () => ({
    type: "READ"
})

export const toggleEdit = () => ({
    type: "TOGGLE"
})

export const updateCurrentWallboard = wallboard => ({
    type: "UP_WALL",
    wallboard
})