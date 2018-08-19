(function(modules, entryPoint) {
    const moduleMap = {};
    const requireCache = {};

    modules.map(function(m) {
        moduleMap[m.name] = m;
    });

    function loadModule(requiredModuleName) {
        if (!requireCache[requiredModuleName]){ 
            var module = { exports: {}};
            modules[requiredModuleName].module(rq.bind(null, requiredModuleName), module, module.exports)

            requireCache[requiredModuleName] = module.exports;
        }
    }

    function rq(parentModuleName, requiredModuleName) {
        requiredModuleName = moduleMap[parentModuleName].deps[requiredModuleName];

        if (!requireCache[requiredModuleName]){ 
            var module = { exports: {}};
            moduleMap[requiredModuleName].module(rq.bind(null, requiredModuleName), module, module.exports)

            requireCache[requiredModuleName] = module.exports;
        }
        return requireCache[requiredModuleName];
    }

    var module = { exports: {}};
    moduleMap[entryPoint].module(rq.bind(null, entryPoint), module, module.exports)
}(
    [
