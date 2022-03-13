export function reducer(state = [], { type, payload }) {
  switch (type) {
    case "add": {
      return state.concat(payload.value);
    }
    case "edit": {
      const { index } = payload;
      const start = state.slice(0, index);
      const end = state.slice(index + 1);
      return [...start, payload.value, ...end];
    }
    case "remove": {
      const { index } = payload;
      if (index < 0) {
        return state;
      }

      const start = state.slice(0, index);
      const end = state.slice(index + 1);
      return [...start, ...end];
    }
    default: {
      throw new Error(`Unexpected action type '${type}'`);
    }
  }
}
export function add(value) {
  return { type: "add", payload: { value } };
}
export function remove(index) {
  return { type: "remove", payload: { index } };
}
export function edit(index, value) {
  return { type: "edit", payload: { index, value } };
}
