
import { convertChToVdom } from "../framework/dom.js";
import { getValue,setValue,store } from "../framework/state.js";

const btn= document.getElementById("btn")
const count = document.getElementById("text")
setValue(0,count);
const html=`<div class="app">
            hi
            <button id="btn">
                click me!!
            </button>
            <p id ="text">hi2</p>
        </div>`
convertChToVdom(html);
btn.addEventListener("click",()=>{
    setValue(getValue(count)+1,count)
    count.textContent=store[count];
    console.log(store[count]);
})