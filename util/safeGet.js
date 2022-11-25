/*
    Safely get a value, return a default value if it throws an error.
    This can be used as a try catch for anything though

    Example Usage:
        data = { value: "asdf" }
        safeGet(data => data.value, null) // --> "asdf"
        safeGet(data => data.somekey, null) // --> null
*/

const safeGet = (getFunc, defaultValue="") => {
    try {
        const result = getFunc();
        return result;
    } catch (error) {
        return defaultValue;
    }
}

module.exports = safeGet;