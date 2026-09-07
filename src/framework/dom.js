// STATE MANAGEMENT (Requirement: Reachable at all times)
// We use a Proxy to detect changes and trigger the framework to re-render.
export function createStore(initialState, notifyCallback) {
    return new Proxy(initialState, {
        set(target, key, value) {
            target[key] = value;
            notifyCallback(); // The framework "calls" the update logic
            return true;
        }
    });
}

//  DOM ABSTRACTION (Requirement: h() function)
export function h(type, props = {}, ...children) {
    return {
        type,
        props: props || {},
        // Flatten children to handle arrays (like todo lists)
        children: children.flat().filter(c => c !== null && c !== false)
    };
}

//  EVENT HANDLING & DOM CREATION (Requirement: Custom Event API)
export function createElm(vnode) {
    // Handle text nodes
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    const element = document.createElement(vnode.type);

    // Custom Event Handling Logic
    for (const [key, value] of Object.entries(vnode.props)) {
        if (key.startsWith('on')) {
            // Converts "onclick" -> "click"
            const eventType = key.slice(2).toLowerCase();
            element.addEventListener(eventType, value);
        } else {
            element.setAttribute(key, value);
        }
    }

    // Recursively build children
    for (const child of vnode.children) {
        element.appendChild(createElm(child));
    }

    return element;
}
// Helper to update attributes/props without replacing the whole element
// Function to update attributes safely
function updateAttrs(el, newProps = {}, oldProps = {}) {
    // Safeguard: If for some reason the element is missing, stop.
    if (!el || !el.setAttribute) return;

    // 1. Remove old properties/events that are no longer there
    Object.keys(oldProps).forEach(key => {
        if (!(key in newProps)) {
            if (key.startsWith('on')) {
                const eventType = key.slice(2).toLowerCase();
                el.removeEventListener(eventType, oldProps[key]);
            } else {
                el.removeAttribute(key);
            }
        }
    });

    // 2. Add or Update new properties/events
    Object.entries(newProps).forEach(([key, value]) => {
        if (newProps[key] !== oldProps[key]) {
            if (key.startsWith('on')) {
                const eventType = key.slice(2).toLowerCase();
                // Clean up old listener to avoid duplicates
                if (oldProps[key]) el.removeEventListener(eventType, oldProps[key]);
                el.addEventListener(eventType, value);
            } else if (key === 'value' || key === 'checked') {
                // Must set properties directly for form inputs
                el[key] = value;
            } else {
                el.setAttribute(key, value);
            }
        }
    });
}

export function patch(parent, newVNode, oldVNode, index = 0) {
    // Locate the current real DOM element
    const el = parent ? parent.childNodes[index] : null;

    //  DELETE: If no new node, remove the real element
    if (newVNode === undefined) {
        if (el) parent.removeChild(el);
    } 
    
    //  CREATE: If no old node (or real DOM is missing), create it
    else if (oldVNode === undefined || !el) {
        parent.appendChild(createElm(newVNode));
    } 
    
    //  REPLACE: If the type changed (e.g., div -> span), replace the whole element
    else if (
        typeof newVNode !== typeof oldVNode ||
        (typeof newVNode === 'string' && newVNode !== oldVNode) ||
        newVNode.type !== oldVNode.type
    ) {
        parent.replaceChild(createElm(newVNode), el);
    } 
    
    // UPDATE: If it's the same tag type, just update attributes and children
    else if (newVNode.type) {
        updateAttrs(el, newVNode.props, oldVNode.props);

        const newChildren = newVNode.children || [];
        const oldChildren = oldVNode.children || [];
        const max = Math.max(newChildren.length, oldChildren.length);
        
        for (let i = 0; i < max; i++) {
            // We use 'el' as the parent for the next generation
            patch(el, newChildren[i], oldChildren[i], i);
        }
    }
}