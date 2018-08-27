module.exports = function _dynamic_loader(rq) {
    return function(requiredModule) {
        return new Promise(function(res, rej) {
            var modNameHash = rq.resolve(requiredModule);
            var mod = _PACKER_REQUIRE({[modNameHash]: modNameHash}, modNameHash);

            if (mod) {
                res(mod)
            }
            else {
                var modName = modNameHash + "_url";
                var lazyBundleUrl = _PACKER_REQUIRE({[modName]: modName}, modName);

                lazyLoadBundle(lazyBundleUrl).then(function() {
                    if (typeof _PACKER_REQUIRE.registerLoadedModule === "function") {
                        // Register/cache the loaded asset so that when required next time, it should be loaded from cache.
                        _PACKER_REQUIRE.registerLoadedModule(modNameHash, emptyFunction);
                    }
                   var exp =  _PACKER_REQUIRE({[modNameHash]: modNameHash}, modNameHash);
                   res(exp);
                }).catch(function(err) {
                    rej(err);
                })
            }
        })
    }
}

function lazyLoadBundle(url = "") {
    if (url && url.endsWith(".js")) {
        return lazyLoadJS(url);
    }
    else if (url && url.endsWith(".css")) {
        return lazyLoadCSS(url);
    }
}

function lazyLoadJS(url) {
    return new Promise(function(res, rej){
        var script = document.createElement('script');

        script.setAttribute('src', url)
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('async', true);

        script.onerror = function (e) {
            script.onerror = script.onload = null;
            rej(e);
        };

        script.onload = function () {
            script.onerror = script.onload = null;
            res();
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    })
}

function lazyLoadCSS(url) {
    return new Promise(function (res, rej) {
        var style = document.createElement('link');

        style.setAttribute('rel', 'stylesheet')
        style.setAttribute('href', url)

        style.onerror = function (e) {
            style.onerror = style.onload = null;
            rej(e);
        };

        style.onload = function () {
            style.onerror = style.onload = null;
            res();
        };

        document.getElementsByTagName('head')[0].appendChild(style);
    });
};

function emptyFunction() {

}