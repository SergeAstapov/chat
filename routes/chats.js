var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var app = require('../app');
var redisClient = app.redisClient;

var msgKeys = ['id', 'nickname', 'message', 'date', 'chatId'];

router.get('/:chat_id', function (req, res, next) {
    var chatId = req.params.chat_id;

    redisClient
        .llenAsync(chatId)
        .then(chatMsgsLen => {
            if (!chatMsgsLen) {
                return [];
            }

            // Get 100 most recent messages
            return redisClient.lrangeAsync(chatId, Math.max(0, chatMsgsLen - 100), chatMsgsLen);
        })
        .then(messagesIds => {
            if (!messagesIds || !Array.isArray(messagesIds)) {
                return [];
            }

            var promises = messagesIds.map(function (messageId) {
                var message = {};

                var promises = msgKeys.map(function (msgProp) {
                    return redisClient
                        .hgetAsync("message:" + messageId, msgProp)
                        .then(value => message[msgProp] = value)
                    ;
                });

                return Promise.all(promises).then(() => message);
            });

            return Promise.all(promises);
        })
        .then(messages => {
            res.json({
                id: chatId,
                title: 'Test title',
                messages: messages || [],
                users: [
                    'abc',
                    'xyz'
                ]
            });
        })
    ;
});

var rooms = [];

app.io.on('connection', function (socket) {
    socket.on('disconnect', function() {
        socket.rooms.forEach(function (room) {
            socket.leave(room);
        });
    });

    socket.on('join chat', function (data) {
        socket.join(data.chatId);

        var message = {
            type: 'server',
            chatId: data.chatId,
            nickname: 'server',
            message: 'connected to ' + data.chatId
        };
        socket.emit('new message', message);

        message.message = data.nickname + ' connected';
        socket.broadcast.to(data.chatId).emit('new message', message);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('send message', function (message) {
        message.date = (new Date()).toISOString();

        var msgStr = message.message + message.nickname + message.date;
        message.id = crypto.createHash('md5').update(msgStr).digest('hex');

        redisClient.rpush(message.chatId, message.id);

        msgKeys.forEach(function (msgKey) {
            redisClient.hset("message:" + message.id, msgKey, message[msgKey]);
        });

        // we tell the client to execute 'new message'
        app.io.sockets.in(message.chatId).emit('new message', message);
    });

    socket.on('create chat', function (data) {
        rooms.push(data.chatId);
        socket.emit('new chat', {
            chatId: data.chatId
        });
    });
});

//var WebSocketServer = require('ws').Server
//    , wss = new WebSocketServer({server: 3000});
//wss.on('connection', function (ws) {
//    console.log('socket connection');
//
//    ws.on('new message', function (message) {
//        console.log('received: %s', message);
//    });
//
//    ws.send('something', {abc: 'xyz'});
//});

//var io = require('socket.io')();
//app.io = io;
//
//io.on('connection', function (socket) {
//    // when the client emits 'new message', this listens and executes
//    socket.on('send message', function (data) {
//        // we tell the client to execute 'new message'
//        socket.broadcast.emit('new message', {
//            nickname: data.nickname,
//            message: data.message
//        });
//
//        socket.emit('new message', {
//            nickname: data.nickname,
//            message: data.message
//        });
//    });
//    //
//    //// when the client emits 'add user', this listens and executes
//    //socket.on('add user', function (username) {
//    //    // we store the username in the socket session for this client
//    //    socket.username = username;
//    //    // add the client's username to the global list
//    //    usernames[username] = username;
//    //    ++numUsers;
//    //    addedUser = true;
//    //    socket.emit('login', {
//    //        numUsers: numUsers
//    //    });
//    //    // echo globally (all clients) that a person has connected
//    //    socket.broadcast.emit('user joined', {
//    //        username: socket.username,
//    //        numUsers: numUsers
//    //    });
//    //});
//    //
//    //// when the client emits 'typing', we broadcast it to others
//    //socket.on('typing', function () {
//    //    socket.broadcast.emit('typing', {
//    //        username: socket.username
//    //    });
//    //});
//    //
//    //// when the client emits 'stop typing', we broadcast it to others
//    //socket.on('stop typing', function () {
//    //    socket.broadcast.emit('stop typing', {
//    //        username: socket.username
//    //    });
//    //});
//
//    // when the user disconnects.. perform this
//    socket.on('disconnect', function () {
//        console.log('socket disconnect');
//
//        //// remove the username from global usernames list
//        //if (addedUser) {
//        //    delete usernames[socket.username];
//        //    --numUsers;
//        //
//        //    // echo globally that this client has left
//        //    socket.broadcast.emit('user left', {
//        //        username: socket.username,
//        //        numUsers: numUsers
//        //    });
//        //}
//    });
//});

module.exports = router;
