
export function createNode(type, props = {}, children = []) {
    if (!Array.isArray(children)) {
        children = [children];
    }
        const obj = {
        type,
        props,
        children
    }
    return obj
}


export function createElm(vnode) {
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }

    const element = document.createElement(vnode.type);


    for (const [key, value] of Object.entries(vnode.props)) {

        if (key === "on") {
            for (const [event, handler] of Object.entries(value)) {
                element.addEventListener(event, handler);
            }
        }
        else {
            element.setAttribute(key, value);
        }
    }
    for (const child of vnode.children) {
        element.appendChild(createElement(child));
    }

    return element;
}

export function createHtml(node, idApp) {
    const app = document.getElementById(idApp) ||
        document.querySelector("." + idApp) ||
        document.querySelector(idApp);
    const elem = createElement(node);
    app.appendChild(elem)
}


