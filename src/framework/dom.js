

function domToObject(element){
  const obj = {
    tag: element.tagName.toLowerCase(),
    attrs: {},
     text:element.textContent.trim(),
    children: []
  };
  console.log();
  
  for (const attr of element.attributes) {
    obj.attrs[attr.name] = attr.value;
  }
    
  
  for (const child of element.children) {
    obj.children.push(domToObject(child));
  }
  return obj;
}

export function convertChToVdom(html){
    const template=document.createElement("template")
    template.innerHTML=html.trim()
    const card = template.content;
    const children=[]
    console.log(card.children);
    for (const elem of card.children){
      
        children.push(domToObject(elem))
    }
    console.log(children);
    return children
}