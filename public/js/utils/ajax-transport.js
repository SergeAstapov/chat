import config from 'js/config.js';

const queryParams = function (params) {
    var ret = [];

    for (var param in params) {
        if (params.hasOwnProperty(param)) {
            ret.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
        }
    }

    return ret.join("&");
};

export default {
    GET (pathname, params = null) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            let url = config.rootURL + pathname + (params ? queryParams(params) : '');

            xhr.open('GET', url);

            xhr.addEventListener('load', function () {
                try {
                    var data = JSON.parse(this.response);

                    resolve(data);
                } catch (e) {
                    reject({
                        type: 'ajax',
                        message: 'Response parse from url "' + url + '" failed.'
                    });
                }
            }, false);

            xhr.addEventListener('error', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" failed.'
                });
            }, false);

            xhr.addEventListener('abort', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" aborted.'
                });
            }, false);

            xhr.send();
        });
    },

    POST (pathname, data = {}) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            let url = config.rootURL + pathname;

            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xhr.addEventListener('load', function () {
                try {
                    var data = JSON.parse(this.response);

                    if (data.status == 'error') {
                        data.type = 'businessLogic';
                        reject(data);
                    } else {
                        resolve(data);
                    }
                } catch (e) {
                    reject({
                        type: 'ajax',
                        message: 'Response parse from url "' + url + '" failed.'
                    });
                }
            }, false);

            xhr.addEventListener('error', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" failed.'
                });
            }, false);

            xhr.addEventListener('abort', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" aborted.'
                });
            }, false);

            xhr.send(data ? JSON.stringify(data) : '');
        });
    },

    PUT (pathname, data = {}) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            let url = config.rootURL + pathname;

            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xhr.addEventListener('load', function () {
                try {
                    var data = JSON.parse(this.response);

                    if (data.status == 'error') {
                        data.type = 'businessLogic';
                        reject(data);
                    } else {
                        resolve(data);
                    }
                } catch (e) {
                    reject({
                        type: 'ajax',
                        message: 'Response parse from url "' + url + '" failed.'
                    });
                }
            }, false);

            xhr.addEventListener('error', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" failed.'
                });
            }, false);

            xhr.addEventListener('abort', function () {
                reject({
                    type: 'ajax',
                    message: 'Response to url "' + url + '" aborted.'
                });
            }, false);

            xhr.send(data ? JSON.stringify(data) : '');
        });
    }
}