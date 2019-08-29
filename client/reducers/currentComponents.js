const currentComponents = (state = [], action) => {
  switch (action.type) {
    case "ADD_COMP":
      return state.concat(action.component).concat("Cancel");
    case "DEL_COMP":
      return state.filter(value => !action.component.includes(value));
    default:
      return state;
  }
};

export default currentComponents;
