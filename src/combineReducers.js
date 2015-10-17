import { GET_INITIAL_STATE } from './types';

export default function combineReducers(reducers, { idToProps = {}, alsoAdd } = {}) {
  let combinedReducer = {};
	let alsoResponder;

  function getInitialState() {
    return Object.keys(reducers).reduce((state, reducerID) => {
      const reducer = reducers[reducerID];
      if (reducer[GET_INITIAL_STATE]) {
        state[reducerID] = reducer[GET_INITIAL_STATE](idToProps[reducerID]);
      }
      return state;
    }, {});
  }

  const actionSetHandlers = Object.keys(reducers).reduce((actionSetHandlers, reducerID) => {
  const reducer = reducers[reducerID];
  Object.keys(reducer).reduce((actionSetHandlers, property) => {
    if (property === GET_INITIAL_STATE || !!actionSetHandlers[property]) {
      return actionSetHandlers;
    }

    actionSetHandlers[property] = (initialState, { actionID, forwardTo }) => {
      let newState = Object.keys(reducers).reduce((state, reducerID) => {
        state[reducerID] = forwardTo({
          responder: reducers[reducerID],
          initialState: initialState[reducerID],
          props: idToProps[reducerID]
        });
        return state;
      }, {});

      if (alsoResponder) {
				newState = forwardTo({
					responder: alsoResponder,
					initialState: newState,
					props: {
						idToProps,
						combinedReducer
					}
				});
			}

      return newState;
    }

    return actionSetHandlers;
  }, actionSetHandlers);

  return actionSetHandlers;
  }, {});

  Object.assign(combinedReducer, { [GET_INITIAL_STATE]: getInitialState }, actionSetHandlers);

  if (alsoAdd) {
		alsoResponder = alsoAdd(combinedReducer);
	}

  return combinedReducer;
}
