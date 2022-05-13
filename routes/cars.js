var express = require('express');
var router = express.Router();
router.use(express.static("public"));

/* GET cars data. */
router.get('/cars', function(req, res, next) {
    res.type('js');
    res.send('{"test"}');
});

module.exports = router;
