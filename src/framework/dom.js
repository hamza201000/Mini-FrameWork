
// DOM ABSTRACTION
export function h(type, props = {}, ...children) {
    return {
        type,
        props: props || {},
        children: children.flat().filter(c => c !== null && c !== false)
    };
}

// DOM CREATION
export function createElm(vnode) {
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    const element = document.createElement(vnode.type);
    element._handlers = {}; // Object sghir khssiss l-events

    for (const [key, value] of Object.entries(vnode.props)) {
        if (key.startsWith('on')) {
            const eventType = key.slice(2).toLowerCase();
            element._handlers[eventType] = value; // Khzen l-function بلا addEventListener
        } else if (key === 'value' || key === 'checked') {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of vnode.children) {
        element.appendChild(createElm(child));
    }

    return element;
}

// UPDATE ATTRIBUTES
function updateAttrs(el, newProps = {}, oldProps = {}) {
    if (!el || !el.setAttribute) return;

    if (!el._handlers) el._handlers = {};

    // 1. Remove old props
    Object.keys(oldProps).forEach(key => {
        if (!(key in newProps)) {
            if (key.startsWith('on')) {
                const eventType = key.slice(2).toLowerCase();
                delete el._handlers[eventType];
            } else {
                el.removeAttribute(key);
            }
        }
    });

    // 2. Update new props
    Object.entries(newProps).forEach(([key, value]) => {
        if (newProps[key] !== oldProps[key]) {
            if (key.startsWith('on')) {
                const eventType = key.slice(2).toLowerCase();
                el._handlers[eventType] = value; // Update function f memory direct
            } else if (key === 'value' || key === 'checked') {
                el[key] = value;
            } else {
                el.setAttribute(key, value);
            }
        }
    });
}

// RECONCILIATION (PATCH)
export function patch(parent, newVNode, oldVNode, index = 0) {
    const el = parent ? parent.childNodes[index] : null;

    if (newVNode === undefined) {
        if (el) parent.removeChild(el);
    } 
    else if (oldVNode === undefined || !el) {
        parent.appendChild(createElm(newVNode));
    } 
    else if (
        typeof newVNode !== typeof oldVNode ||
        (typeof newVNode === 'string' && newVNode !== oldVNode) ||
        newVNode.type !== oldVNode.type
    ) {
        parent.replaceChild(createElm(newVNode), el);
    } 
    else if (newVNode.type) {
        updateAttrs(el, newVNode.props, oldVNode.props);

        const newChildren = newVNode.children || [];
        const oldChildren = oldVNode.children || [];
        const max = Math.max(newChildren.length, oldChildren.length);
        
        for (let i = 0; i < max; i++) {
            patch(el, newChildren[i], oldChildren[i], i);
        }
    }
}