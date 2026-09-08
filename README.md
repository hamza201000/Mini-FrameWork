
---

# Mini-Framework: A Reactive VDOM Engine

Welcome to our custom **Mini-Framework**, a lightweight JavaScript framework built from scratch. This project demonstrates the core principles of modern web frameworks: **Inversion of Control**, **Virtual DOM Abstraction**, **Reactive State Management**, and **Event Delegation**.

##  Getting Started

To run the framework and the included TodoMVC application:

1.  **Folder Structure:** Ensure you maintain the following structure:
    ```text
    .
    ├── docs/               # Detailed feature documentation
    ├── src/
    │   └── framework/      # Core framework logic (DOM, State, Events, Router)
    └── Todo/               # TodoMVC Implementation using the framework
        ├── index.html
        ├── base.js
        └── app.css
    ```
2.  **Run:** Open the root directory using a **Live Server** (e.g., VS Code Live Server extension).
3.  **Navigation:** Open `/Todo/index.html` in your browser.

---

## 🛠Features

### 1. Abstracting the DOM
Our framework sees the DOM as a large JavaScript object. Instead of manual manipulation, we use a **Virtual DOM**.
- **The `h()` function:** Allows developers to define UI structures as nested objects.
- **Diffing Engine:** The `patch()` function compares the current UI state with the new state and updates only the necessary elements.

### 2. State Management
State is the "Single Source of Truth."
- **Reactivity:** Using JavaScript **Proxies**, the framework automatically detects data changes.
- **Inversion of Control:** When state changes, the framework "calls you" by triggering a re-render of the components automatically.
- **Persistence:** Integrated with `localStorage` to keep data across sessions.

### 3. Routing System
A built-in **Hash-Router** synchronizes the application state with the URL.
- Supports "All", "Active", and "Completed" filters.
- Integrates with the browser's Back/Forward buttons without page refreshes.

### 4. Custom Event Handling
We avoid `addEventListener` in component logic. 
- **Event Delegation:** One single listener at the root manages all events, improving performance.
- **Custom API:** Developers register events declaratively within the `h()` function attributes.

---

## Framework Documentation

### How to Create an Element
Elements are created using the `h(type, props, children)` function.

```javascript
// Creating a simple div with a class and text
const myElement = h('div', { class: 'container' }, 'Hello World');
```

### How to Add Attributes
Attributes (and CSS classes) are passed as the second argument (the `props` object).

```javascript
h('input', { 
    type: 'text', 
    placeholder: 'Insert Name', 
    class: 'name-input',
    value: state.name 
});
```

### How to Nest Elements
Nesting is achieved by passing an array of `h()` calls as the third argument.

```javascript
h('div', { class: 'parent' }, [
    h('h1', {}, 'Title'),
    h('p', {}, 'This is a nested paragraph.')
]);
```

### How to Create an Event
Our framework uses a custom Event API. Events are defined in the `props` object using the `on` prefix.

```javascript
h('button', { 
    onclick: (e) => console.log('Clicked!'),
    onmouseenter: (e) => handleHover(e)
}, 'Click Me');
```
*Note: These are handled internally by the `EventManager` via delegation on the `#root` element.*

---

##  Why things work the way they work

### The Virtual DOM Approach
Directly touching the DOM is slow. By using a **Virtual DOM**, we create a "Middle Man." When you add a Todo, we create a new JS Object, compare it to the old one, and find that only one `<li>` needs to be added. This keeps the application fast and prevents the user from losing focus on input fields.

### Inversion of Control
In a library, you call the code. In this **Framework**, the framework is in charge. You provide the **State** and the **Component Blueprint**, and the framework decides *when* to render and *how* to efficiently update the browser.

### Event Delegation
In a "Massive Project" like TodoMVC, there are many interactive elements. Instead of consuming memory by attaching 100 listeners to 100 buttons, our `EventManager` attaches **one** listener to the root. It uses the "Bubbling" principle to identify which element was clicked and executes the stored framework handler.

---

## 🔗 Detailed Documentation
For deep dives into specific systems, please see:
- [Event Handling](./docs/Event_Handling.md)
- [Routing System](./docs/Routing.md)
- [State Management](./docs/state_management.md)
- [Virtual DOM Engine](./docs/VirtualDom.md)

---
