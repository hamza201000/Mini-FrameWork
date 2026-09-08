// staaate managment recivity system 
let store = {};
const listeners = new Set();
const refs = new Map();

export function isEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }
    return true;
}

export const getState = () => ({ ...store });

export const setState = (newState) => {
    const oldStore = { ...store };
    const mergedStore = { ...store, ...newState };

    // Optimization: Don't notify if the values are the same
    if (isEqual(oldStore, mergedStore)) return;

    store = mergedStore;
    notify(oldStore);
};

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const notify = (oldStore) => {
    listeners.forEach(listener => listener({ store, oldStore }));
};

export const createRef = () => ({ current: null });

export const setRef = (key, element) => {
    refs.set(key, element);
};

export const getRef = (key) => {
    return refs.get(key);
};

export const removeRef = (key) => {
    refs.delete(key);
};


export const syncVdom = (newDom) => {
    return JSON.parse(JSON.stringify(newDom));
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