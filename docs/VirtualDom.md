
---

# State Management System

Our framework provides a centralized, reactive state management system. It ensures that application data is **reachable at all times** and that any change to the data is automatically reflected in the UI.

## Features
- **Centralized Store:** A single source of truth for the entire application.
- **Proxy-Based Reactivity:** Automatically detects property assignments to trigger re-renders.
- **Deep Equality Checks:** Uses an `isEqual` utility to prevent unnecessary Virtual DOM calculations if the data hasn't actually changed.
- **Observer Pattern:** Allows external modules (like the Router or Rendering Engine) to subscribe to state updates.
- **Ref System:** Provides a safe way to store references to real DOM elements for imperative tasks (like focusing an input).

---

## How to use

### 1. Creating a Reactive Store
The `createStore` function wraps your initial data in a JavaScript Proxy. Whenever you change a property on this object, the `notifyCallback` is executed.

```javascript
import { createStore } from './src/framework/state.js';

const state = createStore({
    todos: [],
    filter: '#/'
}, () => {
    console.log("State changed! Updating UI...");
    render(); // Your render function
});

// To update state:
state.filter = '#/active'; // Triggers render automatically
```

### 2. Manual State Updates (`setState`)
For more traditional state management, you can use the functional API.

```javascript
import { setState, getState } from './src/framework/state.js';

// Update state
setState({ user: 'John' });

// Retrieve state
const currentUser = getState().user;
```

### 3. Using Refs
Refs are used to "reach out" and touch real DOM elements safely. This is essential for the TodoMVC requirement of focusing the input field when editing starts.

```javascript
import { createRef } from './src/framework/state.js';

const myInputRef = createRef();

// In your h() function
h('input', { ref: myInputRef });

// Later, in an action
myInputRef.current.focus();
```

---

## Why it works this way

### Reachability
The subject requires that "multiple pages may need to interact with the same state." By defining the state in a central module and exporting it, any component or page in the application can import the same instance. This ensures that a Todo added on the "All" page persists when the user navigates to the "Active" page.

### Inversion of Control
The developer never manually updates the DOM when data changes. They simply update a JavaScript object. The framework "traps" this update using a **Proxy setter**, compares the new data with the old data using **Deep Equality**, and then "calls back" the UI rendering engine. 

### Optimization (Performance)
Updating the DOM is expensive. Our state manager includes an `isEqual` helper that recursively compares objects and arrays. If a developer calls `setState` with data that is identical to the current store, the framework stops the process immediately, saving CPU cycles and battery life.

---

## Code Example: Immutable Patterns
While the Proxy handles direct assignments, our framework encourages **Immutable Patterns** to ensure the most reliable change detection:

```javascript
// Add a todo using the spread operator
const actions = {
    addTodo: (text) => {
        state.todos = [...state.todos, { id: Date.now(), text }];
    }
};
```
By creating a *new* array instead of pushing to an old one, you guarantee the framework detects the change and refreshes the view.