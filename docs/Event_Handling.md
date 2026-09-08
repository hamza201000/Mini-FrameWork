

---

# Event Handling System

Our framework implements a high-performance **Event Delegation System**. Instead of attaching individual listeners to every button or input, the framework manages events through a centralized `EventManager`.

## Features
- **Event Delegation:** A single native listener is attached to the root element for each event type, reducing memory consumption.
- **Custom API:** Developers interact with events through a custom interface (`on`, `off`, `emit`) rather than the native `addEventListener`.
- **Dynamic Elements:** Since events are delegated, elements added to the DOM after the initial load automatically have their events handled without re-binding.
- **Capture Phase Support:** Correctly handles non-bubbling events like `blur` and `focus` by utilizing the capture phase.

---

## How to use

### 1. Initializing the System
Before the framework can handle events, you must initialize the `EventManager` on a root element (usually the one containing your app).

```javascript
import { EventManager } from './src/framework/event.js';

const root = document.getElementById('root');
const events = new EventManager(root);

// Start listening for specific event types
events.init(['click', 'input', 'keydown', 'blur']);
```

### 2. Registering an Event (`on`)
The framework's `createElm` and `patch` functions handle this automatically when you use the `on[EventType]` syntax in your `h()` function. However, you can also use it manually:

```javascript
// Internal framework usage
events.on(buttonElement, 'click', () => {
    console.log('Button was clicked!');
});
```

### 3. Triggering an Event Manually (`emit`)
You can programmatically trigger any handler attached to an element.

```javascript
events.emit(buttonElement, 'click', { someData: true });
```

### 4. Removing an Event (`off`)
To stop listening for an event on a specific element:

```javascript
events.off(buttonElement, 'click');
```

---

## Why it works this way

### Inversion of Control
The subject requires that "the framework calls you." By using our custom event API, the developer defines *what* should happen in the `h()` function properties (e.g., `{ onclick: myAction }`). The framework then takes responsibility for storing that function and executing it when the browser detects a click.

### Performance (Delegation Pattern)
In a "massive project" like TodoMVC, there might be hundreds of items in a list. Attaching a `click` listener to every "Delete" button is slow. 
Our `EventManager` attaches **one** listener to the root. When a click occurs, it:
1.  Identifies the `event.target`.
2.  Traverses up the DOM tree (Bubbling).
3.  Checks if any element has a private `_handlers` property defined by our framework.
4.  Executes the corresponding function.

### Handling Non-Bubbling Events
Events like `blur` and `focus` do not bubble up the DOM tree, which usually makes delegation impossible. Our framework solves this by detecting these specific events during the `init` phase and attaching them using the **Capture Phase** (`useCapture = true`), ensuring the framework remains robust and reliable.

---

## Code Example: Declarative Events
The developer simply writes the event in the Virtual DOM definition:

```javascript
h('button', { 
    class: 'destroy', 
    onclick: (e) => actions.removeTodo(todo.id) 
}, 'Delete')
```

The framework's `createElm` function will see the `onclick` property and automatically call `EventManager.on(element, 'click', handler)`.