
let id=0;
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

export function convertChToVdom(html) {
    const template = document.createElement("template")
    template.innerHTML = html.trim()
    const card = template.content;
    const children = []
    // console.log(card.children);
    for (const elem of card.children) {
        children.push(domToObject(elem))
    }
    return children
}