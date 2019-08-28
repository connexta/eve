const currentWallboard = (state = "HOME", action) => {
    switch (action.type) {
        case "UP_WALL":
            return action.wallboard;
        default:
            return state;
    }
}

export default currentWallboard;