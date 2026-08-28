# Mini-FrameWork

A small JavaScript framework built from scratch.

The goal of this project is to create a simple framework that provides:

* DOM abstraction
* Event handling
* State management
* Routing
* TodoMVC application

No external frontend framework such as React, Vue, or Angular is used.

---

## Project Architecture

```text
mini-framework/
│
├── src/
│   │
│   ├── framework/
│   │   ├── dom.js
│   │   ├── events.js
│   │   ├── state.js
│   │   ├── router.js
│   │   └── index.js
│   │
│   └── todo/
│       ├── app.js
│       ├── components.js
│       └── state.js
│
├── index.html
├── style.css
└── README.md
```

### Framework

The `framework/` folder contains the code of the framework itself.

#### `dom.js`

Responsible for creating and updating DOM elements.

Example:

```js
h("div", { class: "container" }, [
    h("h1", {}, ["Hello"])
])
```

#### `events.js`

Responsible for handling user events.

Example:

```js
h("button", {
    on: {
        click: () => console.log("Clicked")
    }
}, ["Click me"])
```

#### `state.js`

Responsible for storing and updating application state.

Example:

```js
const store = createStore({
    count: 0
})
```

#### `router.js`

Responsible for changing and reading the URL.

Example:

```js
router.navigate("/todos")
```

#### `index.js`

The public API of the framework.

It exports the functions that applications can use.

---

## TodoMVC

The `todo/` folder contains the application built using the framework.

```text
todo/
│
├── app.js
├── components.js
└── state.js
```

### `app.js`

Starts the TodoMVC application.

### `components.js`

Contains the TodoMVC UI components.

Examples:

* Todo input
* Todo list
* Todo item
* Footer
* Filters

### `state.js`

Contains the TodoMVC state and actions.

Example state:

```js
{
    todos: [],
    filter: "all"
}
```

---

## How the Framework Works

The framework follows this simple flow:

```text
User Action
    │
    ▼
  Events
    │
    ▼
   State
    │
    ▼
   Render
    │
    ▼
   DOM
```

For example, when the user clicks a button:

```text
Click
  │
  ▼
Event Handler
  │
  ▼
State Changes
  │
  ▼
Framework Renders
  │
  ▼
DOM Updates
```

---

## DOM Abstraction

Instead of manipulating the DOM directly, the framework provides an `h()` function.

```js
h("button", {
    class: "btn"
}, [
    "Click me"
])
```

The framework converts this representation into a real DOM element.

Elements can also be nested:

```js
h("div", { class: "container" }, [
    h("h1", {}, ["My App"]),
    h("p", {}, ["Welcome"]),
    h("button", {}, ["Click"])
])
```

---

## State Management

The framework provides a central store.

```js
const store = createStore({
    count: 0
})
```

The state can be read:

```js
store.getState()
```

and updated:

```js
store.setState({
    count: 1
})
```

When the state changes, the application is rendered again.

---

## Routing

The router connects the application state with the URL.

Example routes:

```text
/
 /todos
 /about
```

Navigation can be done with:

```js
router.navigate("/todos")
```

The page can change without reloading the browser.

---

## Event Handling

Events are defined through the framework instead of directly using `addEventListener()`.

Example:

```js
h("button", {
    on: {
        click: () => {
            console.log("Button clicked")
        }
    }
}, ["Click"])
```

The framework handles the browser event internally.

---

## TodoMVC

TodoMVC demonstrates that the framework can be used to build a real application.

The application supports:

* Adding todos
* Completing todos
* Editing todos
* Deleting todos
* Filtering todos
* Clearing completed todos
* Showing remaining todos

---

## Main Architecture

```text
                 MINI FRAMEWORK
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
      DOM            STATE           ROUTER
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
                    EVENTS
                       │
                       ▼
                    TODO MVC
```

The framework provides the tools, and TodoMVC uses those tools to create the application.
