// 1. Private Variables (Encapsulation)
let store = {};
const listeners = new Set();
const refs = new Map();

// --- HELPER: Deep Equality Check ---
// Essential for optimization (Requirement: Virtual DOM / Diffing)
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

// --- STATE MANAGEMENT (Requirement: Reachable at all times) ---
export const getState = () => ({ ...store });

export const setState = (newState) => {
    const oldStore = { ...store };
    const mergedStore = { ...store, ...newState };

    // Optimization: Don't notify if the values are the same
    if (isEqual(oldStore, mergedStore)) return;

    store = mergedStore;
    notify(oldStore);
};

// --- SUBSCRIPTION (Requirement: Inversion of Control) ---
export const subscribe = (listener) => {
    listeners.add(listener);
    // Return unsubscribe function
    return () => listeners.delete(listener);
};

const notify = (oldStore) => {
    listeners.forEach(listener => listener({ store, oldStore }));
};

// --- REF MANAGEMENT (Requirement: Event Handling) ---
// Allows the developer to access real DOM elements safely
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

// --- VDOM HELPER (Requirement: Abstracting the DOM) ---
// This handles the cloning of the tree to prevent direct mutation
export const syncVdom = (newDom) => {
    return JSON.parse(JSON.stringify(newDom));
};

// --- STORE FACTORY (Requirement: Reachable at all times) ---
// Creates a reactive store using a Proxy.
// Any direct property assignment (e.g. state.count++) automatically
// triggers the provided notifyCallback so the UI re-renders.
export function createStore(initialState, notifyCallback) {
    return new Proxy(initialState, {
        set(target, key, value) {
            target[key] = value;
            if (typeof notifyCallback === 'function') notifyCallback();
            return true;
        }
    });
}