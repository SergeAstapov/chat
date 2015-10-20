var express = require('express');
var router = express.Router();
var app = require('../app');

var redis = require("redis"),
    redisClient = redis.createClient();

/* GET home page. */
router.get('/', function(req, res, next) {
    redisClient.set("string key", "string val");
    redisClient.hset("hash key", "hashtest 1", "some value", redis.print);

    redisClient.get("string key", (err, reply) => {
        res.render('index', {
            title: 'Express',
            redisFoo: reply
        });
    });
});

redisClient.on("error", function (err) {
    console.log("Redis client error " + err);
});

module.exports = router;
