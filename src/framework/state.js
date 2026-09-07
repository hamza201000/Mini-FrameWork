export let store = {};

const listeners = new Set();

export function getValue(name) {
    return store[name];
}

export function setValue(value, name) {
    const oldValue = store[name];

    if (isEqual(oldValue, value)) {
        return;
    }

    store[name] = value;

    for (const listener of listeners) {
        listener({
            name,
            value,
            oldValue,
            store
        });
    }
}

export function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function updateVdom(oldDom = [], newDom = []) {
    oldDom.length = newDom.length;

    for (let i = 0; i < newDom.length; i++) {
        const oldElm = oldDom[i];
        const newElm = newDom[i];

        if (oldElm === undefined) {
            oldDom[i] = structuredClone(newElm);
            continue;
        }

        if (oldElm?.tag !== newElm?.tag) {
            oldDom[i] = structuredClone(newElm);
            continue;
        }

        for (const key of Object.keys(oldElm)) {
            if (!(key in newElm)) {
                delete oldElm[key];
            }
        }

        for (const [key, newValue] of Object.entries(newElm)) {
            const oldValue = oldElm[key];

            if (Array.isArray(newValue)) {
                if (!Array.isArray(oldValue)) {
                    oldElm[key] = structuredClone(newValue);
                } else {
                    updateVdom(oldValue, newValue);
                }

                continue;
            }

            if (!isEqual(oldValue, newValue)) {
                oldElm[key] = structuredClone(newValue);
            }
        }
    }

    return oldDom;
}

export function isEqual(oldValue, newValue) {
    if (oldValue === newValue) {
        return true;
    }

    if (oldValue == null || newValue == null) {
        return false;
    }

    if (typeof oldValue !== typeof newValue) {
        return false;
    }

    if (Array.isArray(oldValue) || Array.isArray(newValue)) {
        if (!Array.isArray(oldValue) || !Array.isArray(newValue)) {
            return false;
        }

        if (oldValue.length !== newValue.length) {
            return false;
        }

        for (let i = 0; i < oldValue.length; i++) {
            if (!isEqual(oldValue[i], newValue[i])) {
                return false;
            }
        }

        return true;
    }

    if (
        typeof oldValue === "object" &&
        typeof newValue === "object"
    ) {
        const oldKeys = Object.keys(oldValue);
        const newKeys = Object.keys(newValue);

        if (oldKeys.length !== newKeys.length) {
            return false;
        }

        for (const key of newKeys) {
            if (!Object.prototype.hasOwnProperty.call(oldValue, key)) {
                return false;
            }

            if (!isEqual(oldValue[key], newValue[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}