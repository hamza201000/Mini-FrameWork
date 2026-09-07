import { createNode } from '../src/framework/dom.js';
import AppRouter from '../src/framework/router.js';
import {updateVdom } from '../src/framework/state.js';
// console.log("Base.js is loaded!");
// document.getElementById('app').innerHTML = "<h1>JavaScript is Working!</h1>";

const html = createNode("div",{class:"app"},[createNode("p",{},["hi"])])
const html2=createNode("div",{class:"app"},[createNode("p",{},[])])
console.log(html);
console.log(html2);

console.log(updateVdom([html],[html2]));


const Home = () => `<h1> Home Page</h1><p>Welcome to TodoMVC!</p>`;
const Active = () => `<h1>⚡ Active Todos</h1><p>Things to do...</p>`;
const Completed = () => `<h1>Completed</h1><p>Well done!</p>`;
const NotFound = () => `<h1 style="color:red">404 - Not Found</h1>`;

// 2. Initialize the Router
const myRouter = new AppRouter({
    defaultRoute: '#/',
    notFoundRoute: '#/404',
    routes: {
        '#/': Home,
        '#/active': Active,
        '#/completed': Completed,
        '#/404': NotFound
    }
});

const appDiv = document.getElementById('app');

myRouter.subscribe((Component) => {
    console.log("Navigated to:", myRouter.currentPath);
    
    if (appDiv) {
        appDiv.innerHTML = Component();
    }

    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === myRouter.currentPath) {
            link.style.fontWeight = 'bold';
            link.style.color = 'black';
        } else {
            link.style.fontWeight = 'normal';
            link.style.color = 'blue';
        }
    });
});


