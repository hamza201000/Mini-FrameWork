// dom abstruction
import { EventManager } from "./event.js";
let eventManager=new EventManager()
export function h(type, props = {}, ...children) {
    return {
        type,
        props: props || {},
        children: children.flat(2).filter(c => c !== null && c !== undefined && c !== false)
    };
}
// dooom creation 
export function createElm(vnode) {
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    if (!vnode || !vnode.type) return document.createTextNode("");

    const element = document.createElement(vnode.type);
    element._handlers = {}; 

    for (const [key, value] of Object.entries(vnode.props || {})) {
        updateSingleProp(element, key, value);
    }

    vnode.children.forEach(child => element.appendChild(createElm(child)));
    return element;
}

function updateSingleProp(el, key, value) {

    if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();

        if (value === undefined || value === null) {
            if (eventManager) {
                eventManager.off(el, eventType);
            }
        } else {
            if (eventManager) {
                eventManager.on(el, eventType, value);
            }
        }

        return;
    }

    if (key === 'value' || key === 'checked') {
        el[key] = value;
        return;
    }

    if (key === 'class' || key === 'className') {
        el.setAttribute('class', value || '');
        return;
    }

    if (value === undefined || value === null) {
        el.removeAttribute(key);
    } else {
        el.setAttribute(key, value);
    }
}


// reconcilition
export function patch(parent, newVNode, oldVNode, index = 0) {
    const el = parent.childNodes[index];

    if (newVNode === undefined) {
        if (el) parent.removeChild(el);
        return true;
    }

    if (oldVNode === undefined || !el) {
        parent.appendChild(createElm(newVNode));
        return false;
    }

    if (
        typeof newVNode !== typeof oldVNode ||
        newVNode.type !== oldVNode.type
    ) {
        parent.replaceChild(createElm(newVNode), el);
        return false;
    }

    if (typeof newVNode === 'string' || typeof newVNode === 'number') {
        if (newVNode !== oldVNode) {
            el.nodeValue = String(newVNode);
        }
        return false;
    }

    if (newVNode.type) {
        const allProps = new Set([
            ...Object.keys(newVNode.props || {}),
            ...Object.keys(oldVNode.props || {})
        ]);

        allProps.forEach(key => {
            if (newVNode.props[key] !== oldVNode.props[key]) {
                updateSingleProp(el, key, newVNode.props[key]);
            }
        });

        const newCh = newVNode.children || [];
        const oldCh = oldVNode.children || [];

        // If children structure changed, rebuild them
        if (newCh.length !== oldCh.length) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

            newCh.forEach(child => {
                el.appendChild(createElm(child));
            });

            return false;
        }

        // Same structure → normal reconciliation
        for (let i = 0; i < newCh.length; i++) {
            patch(el, newCh[i], oldCh[i], i);
        }
    }

    return false;
}