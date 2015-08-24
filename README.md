# Flambeau
A lightweight flux library with opinions.

Benefits:
- Better structured actions with **namespacing** and **no UPPERCASE_CONSTANTS**.
Just use the exported function’s name to identify the action.
- **Reducers** instead of stores, which allows clearer data flow, immutability.
- Allows reducers to be **reused**, using a custom context to differentiate.
- **No switch statements** to handle actions, just declare a function with the same name as the action’s function.
- **Forwarding of actions** to internal reducers within reducers. Allows reducers to be set up in collections.
- **Async action support built-in**.
- Action **introspection methods to allow encapsulation** of reducers’ internal state.
- Get a **consensus for async actions**, such as whether something needs loading or not, by polling reducers using introspection methods. Reduces coupling between reducers and actions, and allows greater code reuse.

## Using Flambeau

```javascript
// actions/TodoListActions.js

export function addTodo({ text }) {
  return { text };
}
```

```javascript
// reducers/TodoListReducer.js

export function getInitialState() {
  return [];
}

export const TodoListActions = {
  addTodo(state, { text }) {
    return state.concat({ text });
  }
}
```
