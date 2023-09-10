const initializeConfigStorage = async (appOC) => {
    const configStorage = appOC.get("ConfigStorage");
    const envVarProcurer = appOC.get("EnvVarProcurer");

    const platform = await envVarProcurer.procure("PLATFORM");
    const tmdbApiBaseUrl = await envVarProcurer.procure("TMDB_API_URL_BASE");

    configStorage.set("PLATFORM", platform);
    configStorage.set("TMDB_API_URL_BASE", tmdbApiBaseUrl);
}

module.exports = initializeConfigStorage;