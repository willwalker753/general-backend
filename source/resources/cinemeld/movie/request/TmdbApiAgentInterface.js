class TmdbApiAgentInterface {
    get = async (path, headers={}) => {
        throw new Error("get method not implemented");
    }

    post = async (path, data, headers={}) => {
        throw new Error("get method not implemented");        
    }
}

module.exports = TmdbApiAgentInterface;