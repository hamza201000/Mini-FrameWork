
let id = 0;
function domToObject(element) {
    const obj = {
        "tag": element.tagName.toLowerCase(),
        "attrs": {},
        "children": [],
        "oPid": id++
    };
    for (const attr of element.attributes) {
        obj.attrs[attr.name] = attr.value;
    }
    for (const child of element.childNodes) {
        if (child.nodeName == "#text") {
            obj.children.push({
                "tag": null,
                "attrs": null,
                "children": null,
                "text": child.textContent,
                "oPid": id++
            });
        } else {
            obj.children.push(domToObject(child));
        }
    }
    return obj;
}

export function createNode(type, props = {}, children = []) {
    if (!Array.isArray(children)) {
        children = [children];
    }
    return {
        type,
        props,
        children,
        oPid: id++
    };
}

export function createElement(vnode) {
    
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
export function changeVdom(oldDom,changedDom=[]) {
    
    if (changedDom.length===0){
        return 
    }   
    console.log(oldDom);
    
    for (const child of changedDom){
        console.log(child);
    }
    
}

export function convertChToVdom(html) {
    const template = document.createElement("template")
    template.innerHTML = html.trim()
    const card = template.content;
    const children = []
    id = 0;
    // console.log(card.children);
    for (const elem of card.children) {
        children.push(domToObject(elem))
    }
    return children
}