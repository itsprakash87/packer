_PACKER_REQUIRE = (function(modules, entryPoint) {
    const moduleMap = {};
    const requireCache = {};
    const _PREV_PACKER_REQUIRE = typeof _PACKER_REQUIRE === 'undefined' ? null : _PACKER_REQUIRE;

    modules.map(function(m) {
        moduleMap[m.name] = m;
    });

    function _packer_rq(parentModuleDeps, requiredMod) {
        var requiredModuleName = parentModuleDeps[requiredMod];

        if (!requireCache[requiredModuleName]){ 
            var module = { exports: {}};

            if (moduleMap[requiredModuleName]) {
                var modRq = new requireClass(moduleMap[requiredModuleName].deps)

                moduleMap[requiredModuleName].module(modRq.rq, module, module.exports)

                requireCache[requiredModuleName] = module.exports;
            }
            else if (_PREV_PACKER_REQUIRE){
                requireCache[requiredModuleName] = _PREV_PACKER_REQUIRE(parentModuleDeps, requiredMod)
            }
        }
        return requireCache[requiredModuleName];
    }

    function requireClass(parentModuleDeps) {
        var self = this;
        this.rq = function(requiredModuleName) {
            return _packer_rq(parentModuleDeps, requiredModuleName)
        }

        this.deps = parentModuleDeps;

        this.rq.resolve = function(moduleName) {
            return self.deps[moduleName];
        }

        this.rq.requireByName = function(requiredModuleName) {
            return _packer_rq({[requiredModuleName]: requiredModuleName}, requiredModuleName)
        }
    }

    var module = { exports: {}};
    var entryRq = new requireClass(moduleMap[entryPoint].deps)
    moduleMap[entryPoint].module(entryRq.rq, module, module.exports)

    requireCache[entryPoint] = module.exports;

    return _packer_rq;
}(
    [