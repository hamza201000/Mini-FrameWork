
export let store = {}
export function getValue(name) {
        return store[name];
}
export function setValue(value, name) {
        store[name] = value;
}
export function cmpVdom(oldDom, newDom) {
        //  console.log(newDom);
        //  console.log(oldDom);
        let newObj = {}
        let newArr = []
        let newElm = null;
        let oldElm = null;
        let buff = null;
        for (let i = 0; i < newDom.length; i++) {
                newElm = newDom[i]
                oldElm = oldDom[i]
                if ((newElm["tag"] != oldElm["tag"]) || (!oldElm["tag"])) {
                        newObj = {
                                "tag": newElm["tag"]
                        }
                        if (Object.keys(newObj).length > 0) {
                                newArr.push(newObj)
                        }
                        continue
                }
                for (const [key, value] of Object.entries(newElm)) {

                        if ((key === "oPid")|| !oneHasData(oldElm[key],value)) {
                                console.log("here",value);
                                continue
                        }
                        if ((Array.isArray(value) && value.length > 0 && oldElm[key].length > 0)) {
                                if (oldElm[key].length == 0) {
                                        newArr.push(value)
                                } else if (value.length > 0) {
                                        console.log(value);

                                        buff = cmpVdom(oldElm[key], value)
                                        if (buff.length > 0) {
                                                newArr.push(buff)
                                        }
                                }
                        } else if (typeof (value) === 'object' && (!Array.isArray(value))) {
                                if (cmpObj(oldElm[key], value)) {
                                        newObj = {
                                                "oPid": oldElm["oPid"],
                                                [key]: newElm[key]
                                        }
                                        newArr.push(newObj)

                                }
                        } else if ((value != oldElm[key]) || (!oldElm[key])) {
                                newObj = {
                                        "oPid": oldElm["oPid"],
                                        [key]: newElm[key]
                                }
                                if (Object.keys(newObj).length > 0) {
                                        newArr.push(newObj)
                                }
                        }
                }
        }
        return newArr
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




