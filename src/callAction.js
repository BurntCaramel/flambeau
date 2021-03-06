import isFunction from './isFunction';
import { ACTION_TYPE, INTROSPECTION_TYPE, INTROSPECTION_PROPERTY } from './types';


export default function callAction({ responder, type, initialState, actionSetID, actionID, payload, notFoundValue, props, sourceResponder }) {
  const responderFunction = findActionResponder({ responder, type, actionSetID, actionID, notFoundValue });
  if (responderFunction !== notFoundValue) {
    return responderFunction(initialState, payload, { props, sourceResponder });
  }
  else {
    return notFoundValue;
  }
}


function findActionResponder({ responder, type, actionSetID, actionID, notFoundValue }) {
  if (responder[actionSetID]) {
    // Has forwarding function for entire type
    if (isFunction(responder[actionSetID])) {
      return (initialState, payload, { props }) => {
        function forwardTo({ responder, initialState, props = {}, sourceResponder }) {
          let responseNotFoundValue;
          if (type === ACTION_TYPE) {
            responseNotFoundValue = initialState;
          }

          return callAction({
            notFoundValue: responseNotFoundValue,
            responder, type, initialState, actionSetID, actionID, payload,
            props, sourceResponder
          });
        }

        const result = responder[actionSetID](initialState, {
          isAction: (type === ACTION_TYPE),
          isIntrospection: (type === INTROSPECTION_TYPE),
          type, actionID, payload, props, forwardTo
        });
        if (typeof result === 'undefined') {
          return notFoundValue;
        }
        else {
          return result;
        }
      };
    }
    else {
      let typeResponder;
      // Actions are direct children
      if (type === ACTION_TYPE) {
        typeResponder = responder[actionSetID];
      }
      // Others are grouped, such as introspection
      else if (type === INTROSPECTION_TYPE) {
        typeResponder = responder[actionSetID][INTROSPECTION_PROPERTY];
      }
      else {
        return notFoundValue;
      }

      if (typeResponder[actionID]) {
        return typeResponder[actionID];
      }
    }
  }

  return notFoundValue;
}
