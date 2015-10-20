import config from 'js/config.js';

export default {
    create (pathname) {
        let url = location.protocol + '//' + location.hostname + ':' + location.port;

        if (pathname) {
            url += pathname;
        }

        let socket = io.connect(url);

        //socket.on('connect', function () {
        //    console.log('Socket connected.');
        //    socket.emit('new message', 'some test message');
        //});
        //
        //socket.on('something', function (data) {
        //    console.log('Socket even emitted:', data);
        //});

        socket.on('disconnect', function () {
            console.log('Socket disconnected.');
        });

        window.addEventListener('beforeunload', function () {
            socket.close();
        }, false);

        return socket;
        //let socketURI = location.protocol == 'http:' ? 'ws' : 'wss';
        //let hostname = location.hostname + (location.port != 80 ? ':' + location.port : '');
        //
        //pathname += '?transport=websocket';
        //
        //socketURI += '://' + hostname + config.rootURL + 'socket.io/' + pathname;
        //
        //return new WebSocket(socketURI);
    }
}