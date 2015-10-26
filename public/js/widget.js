(function () {
    var styleTag = document.createElement('link');
    styleTag.setAttribute('rel', 'stylesheet');
    styleTag.setAttribute('href', '/stylesheets/style.css');
    document.head.appendChild(styleTag);

    var chatScripts = [
        '/js/vendors/browser.js',
        '/js/vendors/browser-polyfill.js',
        '/js/vendors/es6-module-loader-dev.js',
        '/js/vendors/socket.io.js',
        function () {
            System.transpiler = 'babel';
            System.import('js/app.js').then(function (module) {
                // Run application
                module.bootstrap();
            }).catch(function (e) {
                console.error(e);
            });
        }
    ];

    var i = 0;
    var loadLibrary = function () {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', chatScripts[i]);
        scriptTag.addEventListener('load', function () {
            i++;
            if (typeof chatScripts[i] == 'function') {
                chatScripts[i]();
            } else {
                loadLibrary()
            }
        });

        document.head.appendChild(scriptTag);
    };

    loadLibrary();
})();