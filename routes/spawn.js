var express = require('express');
var router = express.Router();
router.use(express.static("public"));

/* GET cars data. */
router.get('/car', function(req, res, next) {
    //res.type('json');
    res.json({color: randomColor(),v:2,posX:-70});
});

function randomColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

module.exports = router;
