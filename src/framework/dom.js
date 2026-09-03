

function domToObject(element,id){
  const obj = {
    "tag": element.tagName.toLowerCase(),
    "attrs": {},
     "text":element.innerText.trim(),
    "children": [],
    "oPid":id++
  };
  
  
  console.log(element.childNodes);
  
  for (const attr of element.attributes) {
    obj.attrs[attr.name] = attr.value;
  }
  for (const child of element.children) {
    // console.log(child);
    
    obj.children.push(domToObject(child,id));
  }
  return obj;
}

export function convertChToVdom(html){
    const template=document.createElement("template")
    template.innerHTML=html.trim()
    const card = template.content;
    const children=[]
    let id=0;
    console.log(card.children);
    
    for (const elem of card.children){
        
        children.push(domToObject(elem,id))
    }
    return children
}