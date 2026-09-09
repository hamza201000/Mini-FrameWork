// staaate managment recivity system 
let store = {};
const listeners = new Set();


export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const notify = (oldStore) => {
    listeners.forEach(listener => listener({ store, oldStore }));
};


export function createStore(initialState, notifyCallback) {
    return new Proxy(initialState, {
        set(target, key, value) {
            target[key] = value;
            if (typeof notifyCallback === 'function') notifyCallback();
            return true;
        }
    });
}