// single page application (spa)
class AppRouter {
    constructor(options = {}) {
        this.routes = options.routes || {};
        this.defaultRoute = options.defaultRoute || '#/';
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
            this.handleRouteChange();
        }
    }

    handleRouteChange() {
        const path = window.location.hash || this.defaultRoute;
        this.currentPath = path;
        const action = this.routes[path];

        if (action && typeof action === 'function') {
            action();
            this.notify(action);
        } else {
            console.warn(`[Router] No route found for: ${path}`);
        }
    }

    navigate(path) {
        window.location.hash = path;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        this.handleRouteChange(); 
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== callback);
        };
    }

    notify(component) {
        this.subscribers.forEach(cb => cb(component));
    }

    destroy() {
        window.removeEventListener('hashchange', this._onHashChange);
    }
}

export default AppRouter;