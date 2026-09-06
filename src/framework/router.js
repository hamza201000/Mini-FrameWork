class AppRouter {
  constructor(options = {}) {
    this.routes = options.routes || {}; 
    this.defaultRoute = options.defaultRoute || '#/';
    this.notFoundRoute = options.notFoundRoute || '#/404';
    this.currentPath = null;
    this.subscribers = []; 
    this._onHashChange = this.handleRouteChange.bind(this);
    this.start();
  }
     start() {
    window.addEventListener('hashchange', this._onHashChange);
    if (!window.location.hash) {
      window.location.hash = this.defaultRoute;
    } else {
      this.resolvechaaange();
    }
  }
  resolvechaaange() {
    const path = window.location.hash || this.defaultRoute;
    this.currentPath = path;
    const component = this.routes[path] || this.routes[this.notFoundRoute];
    if (component) this.listeeeen(component);
  }
  subscribe(callback) {
    this.subscribers.push(callback);
    this.resolvechaaange();
    return () => this.subscribers = this.subscribers.filter(s => s !== callback);
  }
  listeeeen(component) {
    this.subscribers.forEach(callback => callback(component));
  }
}
// // moccccck daaata and commmepnent
// const Home = () => "<h1>Home Page Loaded!</h1>";
// const Active = () => "<h1>Active Todos Page!</h1>";

// const myRouter = new Router({
//     routes: {
//         '#/': Home,
//         '#/active': Active
//     }
// });

// const appDiv = document.getElementById('app');
// myRouter.subscribe((Component) => {
//     console.log("Router updated to:", myRouter.currentPath);
//     appDiv.innerHTML = Component();
// });
export default AppRouter