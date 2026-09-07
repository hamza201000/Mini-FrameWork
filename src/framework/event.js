export class EventManager {
    constructor(rootElement = document.body) {
        this.root = rootElement;
    }

    init(eventTypes = ['click', 'input', 'change', 'submit']) {
     for (const type of eventTypes) {
    // Blur and Focus don't bubble, so we MUST use capture true
    const useCapture = (type === 'blur' || type === 'focus');
    
    this.root.addEventListener(type, (event) => {
        let current = event.target;
        while (current && current !== this.root.parentElement) { 
            if (current._handlers && current._handlers[event.type]) {
                current._handlers[event.type](event);
                break;
            }
            current = current.parentElement;
        }
    }, useCapture); // Add this parameter
}
    }

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