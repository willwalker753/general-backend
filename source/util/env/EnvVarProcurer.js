class EnvVarProcurer {
    constructor(logger) {
        this.logger = logger;
    }

    procure = (key, timeout=10000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = 100;

            function checkVariable() {
                console.log("key", key, "currentValue", process.env[key], "complete env", process.env)
                if (process.env[key]) {
                    resolve(process.env[key]);
                    return;
                }
                if (Date.now() - startTime >= timeout) {
                    this.logger.error(`Timeout waiting for ${key} to be set`);
                    reject(new Error(`Timeout waiting for ${key} to be set`));
                    return;
                }
                setTimeout(checkVariable, checkInterval);
            }

            checkVariable();
        });
    }
}

module.exports = EnvVarProcurer;