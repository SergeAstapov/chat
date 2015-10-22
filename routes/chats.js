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

            var promises = messagesIds.map(messageId => {
                return redisClient.hgetallAsync("message:" + messageId);
            });

            return Promise.all(promises);
        })
        .then(messages => {
            messages = messages.filter(message => !message['moderated']);

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

router.put('/:chat_id/moderate', function (req, res, next) {
    var chatId = req.params.chat_id;
    var messageId = req.body.messageId;

    app.io.sockets.in(chatId).emit('moderate message', {chatId, messageId});

    redisClient.hset("message:" + messageId, 'moderated', 1);

    res.json({
        status: 'ok'
    });
});

app.io.on('connection', function (socket) {
    socket.on('disconnect', function() {
        // socket.rooms is internal implemented by socket.io
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
        socket.emit('new chat', {
            chatId: data.chatId
        });
    });
});

module.exports = router;
