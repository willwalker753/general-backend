class ValTester {
    /*
    Safely get a value, return a default value if it throws an error.
    This can be used as a try catch for anything though

    Example Usage:
        data = { value: "asdf" }
        safeGet(data => data.value, null) // --> "asdf"
        safeGet(data => data.somekey, null) // --> null
    */
    safeGet = (getFunc, defaultValue="") => {
        try {
            const result = getFunc();

            if (typeof result === "undefined") return defaultValue;

            return result;

        } catch (error) {
            return defaultValue;
        }
    }
}

module.exports = ValTester;