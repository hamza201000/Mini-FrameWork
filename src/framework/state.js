
export let store = {}

export function getValue(name) {
    Object.entries(store).forEach((funcStore, valueStore) => {
        if (funcStore === name) {
            return valueStore
        }
    });
    return null
}

export function setValue(value, name) {
        store[name]=value
}















export function createStore(initialState) {

    const getState = () => {
        return initialState
    }
    const changeSate = () => {



    }


    return {
        getState
    }

}


