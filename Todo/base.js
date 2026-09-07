// import { createNode } from '../src/framework/dom.js';
// import AppRouter from '../src/framework/router.js';
// import {updateVdom } from '../src/framework/state.js';
// // console.log("Base.js is loaded!");
// // document.getElementById('app').innerHTML = "<h1>JavaScript is Working!</h1>";

// const html = createNode("div",{class:"app"},[createNode("p",{},["hi"])])
// const html2=createNode("div",{class:"app"},[createNode("p",{},[])])
// console.log(html);
// console.log(html2);

// console.log(updateVdom([html],[html2]));


// const Home = () => `<h1> Home Page</h1><p>Welcome to TodoMVC!</p>`;
// const Active = () => `<h1>⚡ Active Todos</h1><p>Things to do...</p>`;
// const Completed = () => `<h1>Completed</h1><p>Well done!</p>`;
// const NotFound = () => `<h1 style="color:red">404 - Not Found</h1>`;

// // 2. Initialize the Router
// const myRouter = new AppRouter({
//     defaultRoute: '#/',
//     notFoundRoute: '#/404',
//     routes: {
//         '#/': Home,
//         '#/active': Active,
//         '#/completed': Completed,
//         '#/404': NotFound
//     }
// });

// const appDiv = document.getElementById('app');

// myRouter.subscribe((Component) => {
//     console.log("Navigated to:", myRouter.currentPath);
    
//     if (appDiv) {
//         appDiv.innerHTML = Component();
//     }

//     document.querySelectorAll('nav a').forEach(link => {
//         if (link.getAttribute('href') === myRouter.currentPath) {
//             link.style.fontWeight = 'bold';
//             link.style.color = 'black';
//         } else {
//             link.style.fontWeight = 'normal';
//             link.style.color = 'blue';
//         }
//     });
// });


import { h, patch, createElm } from '../src/framework/dom.js';
import { createStore } from '../src/framework/state.js';

const root = document.getElementById('app');

let oldVNode = null;

const updateUI = () => {
    console.log("leets update the state ")
    const newVNode = App(); 
    
    if (oldVNode === null) {
        root.appendChild(createElm(newVNode));
    } else {
        patch(root, newVNode, oldVNode);
    }
    
    // Save the current tree as the 'old' tree for the next update
    oldVNode = newVNode;
};

//  INITIALIZE THE STATE (Requirement: Reachable at all times)
// We pass updateUI as the callback so the Proxy triggers a re-render automatically.
const state = createStore({ count: 0, text: '' }, updateUI);

// 
// DEFINE THE COMPONENT (Requirement: Abstracting the DOM via h)
function App() {
    return h('div', { class: 'container' }, [
        h('h1', {}, `Count: ${state.count}`),
        h('input', { 
            type: 'text', 
            value: state.text, 
            placeholder: 'Type something...',
            oninput: (e) => state.text = e.target.value 
        }),
        h('p', {}, `You typed: ${state.text}`),
        h('button', { onclick: () => state.count++ }, 'Increment'),
        h('button', { onclick: () => state.count-- }, 'Decrement')
    ]);
}

updateUI();