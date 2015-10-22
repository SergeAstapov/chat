var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/login', function (req, res, next) {
    if (req.body.login == 'admin' && req.body.password == '123') {
        res.json({
            status: 'ok'
        });
    } else {
        res.json({
            status: 'error',
            message: 'Login password are fake!'
        });
    }
});

module.exports = router;
