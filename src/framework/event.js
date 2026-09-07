export class EventManager {
    constructor(rootElement = document.body) {
        this.root = rootElement;
    }

    // Sets up a single delegated native listener per event type on the root
    init(eventTypes = ['click', 'input', 'change', 'submit']) {
        for (const type of eventTypes) {
            this.root.addEventListener(type, (event) => {
                let current = event.target;

                while (current && current !== this.root) {
                    if (current._handlers && current._handlers[event.type]) {
                        current._handlers[event.type](event);
                        break;
                    }
                    current = current.parentElement;
                }
            });
        }
    }

    // Attach a handler to a real DOM element (no new native listener added)
    on(element, eventType, handler) {
        if (!element._handlers) element._handlers = {};
        element._handlers[eventType] = handler;
    }

    // Remove a handler from a real DOM element
    off(element, eventType) {
        if (element._handlers) {
            delete element._handlers[eventType];
        }
    }

    // Programmatically trigger a handler (e.g. in tests or simulating events)
    emit(element, eventType, data) {
        if (element._handlers && element._handlers[eventType]) {
            element._handlers[eventType](data);
        }
    }
}