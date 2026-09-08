// dom abstruction
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

// attribute mangment 
function updateSingleProp(el, key, value) {
    if (key.startsWith('on')) {
        el._handlers[key.slice(2).toLowerCase()] = value;
    } else if (key === 'value' || key === 'checked') {
        el[key] = value;
    } else if (key === 'class' || key === 'className') {
        el.setAttribute('class', value || '');
    } else {
        if (value === undefined) el.removeAttribute(key);
        else el.setAttribute(key, value);
    }
}
// reconcilition
export function patch(parent, newVNode, oldVNode, index = 0) {
    const el = parent.childNodes[index];

    // 1. DELETE: If new node is missing, remove the real element
    if (newVNode === undefined) {
        if (el) parent.removeChild(el);
        return true; // Signal that an element was removed
    } 

    // 2. CREATE: If no old node exists, add it
    if (oldVNode === undefined || !el) {
        parent.appendChild(createElm(newVNode));
        return false;
    } 

    // 3. REPLACE: If type changed (e.g., String to Tag, or Div to Span)
    if (typeof newVNode !== typeof oldVNode || (newVNode.type !== oldVNode.type)) {
        parent.replaceChild(createElm(newVNode), el);
        return false;
    }

    // 4. UPDATE TEXT: If both are strings
    if (typeof newVNode === 'string' || typeof newVNode === 'number') {
        if (newVNode !== oldVNode) {
            el.nodeValue = String(newVNode);
        }
        return false;
    }

    // 5. UPDATE ELEMENT: Same tag, update props and children
    if (newVNode.type) {
        // Update Props
        const allProps = new Set([...Object.keys(newVNode.props || {}), ...Object.keys(oldVNode.props || {})]);
        allProps.forEach(key => {
            if (newVNode.props[key] !== oldVNode.props[key]) {
                updateSingleProp(el, key, newVNode.props[key]);
            }
        });

        // Update Children
        const newCh = newVNode.children || [];
        const oldCh = oldVNode.children || [];
        const max = Math.max(newCh.length, oldCh.length);
        
        // Loop backwards when deleting to avoid index drift
        for (let i = max - 1; i >= 0; i--) {
            patch(el, newCh[i], oldCh[i], i);
        }
    }
    return false;
}