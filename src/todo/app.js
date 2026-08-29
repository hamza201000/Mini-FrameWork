
import { getValue,setValue,store } from "../framework/state.js";

const btn= document.getElementById("btn")
const count = document.getElementById("text")
setValue(0,count);
console.log("store",store[count]);

btn.addEventListener("click",()=>{
    
    setValue(getValue(count)+1,count)
    count.textContent=store[count];
    console.log(store[count]);
})