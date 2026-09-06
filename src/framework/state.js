
export let store = {}
export function getValue(name) {
        return store[name];
}
export function setValue(value, name) {
        store[name] = value;
}

let lastID=null;
export function cmpVdom(oldDom = [], newDom = []) {
    const changes = [];
    
    const maxLength = Math.max(oldDom.length, newDom.length);
    // console.log(key ,":",newValue);
    
    console.log(oldDom.length);
    for (let i = 0; i < maxLength; i++) {
        const oldElm = oldDom[i];
        const newElm = newDom[i];
        if (oldElm){
            lastID=oldElm.oPid;
        }
        if (oldElm === undefined && newElm !== undefined) {
            // console.log(newElm);
            changes.push({newElm,lastID});
            continue;
        }
        if (newElm === undefined) {
            changes.push({
                oPid: oldElm?.oPid,
                remove: true
            });
            continue;
        }
        if (
            oldElm?.tag !== newElm?.tag
        ) {
            changes.push(newElm);
            continue;
        }
        const elementChanges = {
            oPid: newElm.oPid
        };
        let changed = false;
        for (const [key, newValue] of Object.entries(newElm)) {
            if (key === "oPid") {
                continue;
            }
            const oldValue = oldElm[key];
            if (!isEqual(oldValue, newValue)) {
                if (Array.isArray(newValue) && Array.isArray(oldValue)) {
                    const childChanges = cmpVdom(oldValue, newValue);
                    
                    if (childChanges.length > 0) {
                        elementChanges[key] = childChanges;
                        changed = true;
                    }
                } else {
                    elementChanges[key] = newValue;
                    changed = true;
                }
            }
        }
        if (changed) {
            changes.push(elementChanges);
        }
    }
    return changes;
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

export function cmpObj(oldObj, newObj) {
        for (const [key, value] of Object.entries(newObj)) {
                if (value != oldObj[key]) {
                        return true
                }
        }
        return false
}
function hasData(value) {
        if (value === null || value === undefined) {
                return false;
        }
        if (typeof value === "string") {
                return value.trim().length > 0;
        }
        if (Array.isArray(value)) {
                return value.length > 0;
        }
        if (typeof value === "object") {
                return Object.keys(value).length > 0;
        }
        return true;
}

function oneHasData(value1, value2) {
        return hasData(value1) || hasData(value2);
}




