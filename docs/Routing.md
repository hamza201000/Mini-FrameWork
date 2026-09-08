

---

# Routing System

Our framework features a **Hash-Based Router** (`AppRouter`). It allows the application to simulate multi-page navigation within a single HTML file by using the URL hash (`#/`).

## Features
- **Hash-Based Navigation:** Ensures compatibility with all servers and local file systems without extra configuration.
- **State Synchronization:** Automatically triggers state updates when the URL changes.
- **Observer Pattern:** Components can subscribe to route changes to trigger re-renders.
- **Back/Forward Support:** Deeply integrates with the browser's history API via the `hashchange` event.

---

## How to use

### 1. Defining Routes
Routes are defined as a JavaScript object where the **key** is the URL hash and the **value** is a function (action) that updates the application state.

```javascript
const routes = {
    '#/':          () => { state.route = '#/'; },
    '#/active':    () => { state.route = '#/active'; },
    '#/completed': () => { state.route = '#/completed'; }
};
```

### 2. Initializing the Router
Initialize the router by passing your routes object. The router will automatically handle the initial page load and redirect to a default route if no hash is present.

```javascript
import AppRouter from './src/framework/router.js';

const router = new AppRouter({
    routes: routes,
    defaultRoute: '#/' // Optional, defaults to #/
});
```

### 3. Programmatic Navigation
While you can use standard HTML links (`<a href="#/active">`), you can also navigate using the framework's custom API:

```javascript
router.navigate('#/completed');
```

---

## Why it works this way

### Synchronization of State with URL
The project requirements state that routing should refer to the "synchronization of the state of the app with the URL." 

In our framework:
1.  The user clicks a link (e.g., `#/active`).
2.  The browser triggers a `hashchange` event.
3.  The **Router** catches this event and finds the matching function in the routes table.
4.  The function updates the **Reactive State** (`state.route = '#/active'`).
5.  The **Proxy State Manager** detects this change and calls the framework's `render()` function.
6.  The **Virtual DOM** re-calculates the UI and shows only the "Active" todos.

### Inversion of Control
The developer does not manually "swap" components or clear the screen. Instead, they provide a map of "What to do when the URL changes." The framework takes control, monitors the browser's address bar, and executes the developer's logic at the correct time.

### Preventing Page Refreshes
By using the hash (`#`), we prevent the browser from sending a request to the server every time the user navigates. This allows the application to maintain its internal JavaScript state (the list of todos) while still allowing the user to use the "Back" and "Forward" buttons.

---

## Code Example: Integrating with State
The router is typically the last piece of the framework initialized, ensuring the state and render functions are ready to react:

```javascript
// This function in base.js reacts to the router
const App = () => {
    const currentPath = state.route; // State updated by router
    
    if (currentPath === '#/active') {
        return h('div', {}, 'Showing Active Tasks');
    }
    // ...
};
```