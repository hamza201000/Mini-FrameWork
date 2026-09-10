class AppRouter {
    constructor(options = {}) {
        this.routes = options.routes || {};
        this.currentPath = null;

        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        this.handleRouteChange();
    }

    handleRouteChange() {
        const path = window.location.hash || '#/';
        this.currentPath = path;

        const action = this.routes[path];

        if (typeof action === 'function') {
            action();
        } else {
            console.warn(`No route found for: ${path}`);
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

export default AppRouter;