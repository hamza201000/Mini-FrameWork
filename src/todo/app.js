
// import { convertChToVdom } from "../framework/dom.js";
// // import { getValue,setValue,store } from "../framework/state.js";
// import { cmpVdom } from "../framework/state.js"
import { createNode,createHtml,changeVdom } from "../framework/dom.js";
import { cmpVdom } from "../framework/state.js";
// const btn= document.getElementById("btn")
// const count = document.getElementById("text")
// setValue(0,count);

// btn.addEventListener("click",()=>{
//     setValue(getValue(count)+1,count)
//     count.textContent=store[count];
//     console.log(store[count]);
// })


// const html = `<div class="app">
                
//         </div>`
// const html2 = `<div class="app">
// <p class="a">hi</p>
//         </div>`

// console.log(html);
// console.log(html2);

// // console.log(convertChToVdom(html));
// //  console.log(convertChToVdom(html2));
// console.log(cmpVdom(convertChToVdom(html.trim()), convertChToVdom(html2.trim())));




const html = createNode("div", {
    class: "app"
}, []);


const html2 = createNode("div", {
    class: "app"
}, [
    createNode("p", {
        class: "a"
    }, "hi")
]);

console.log(cmpVdom([html],[html2]));
createHtml(html2,"app")
changeVdom(html,cmpVdom([html],[html2]))

