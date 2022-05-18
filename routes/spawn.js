var express = require('express');
var router = express.Router();
router.use(express.static("public"));

/* GET cars data. */
router.get('/car', function(req, res, next) {
    //res.type('json');
    var startPos = randomStart();
    res.json({color: randomColor(), v:2*startPos['dir'], posX: startPos['posX'], posY: startPos['posY'], orient: startPos['orient']});
});

function randomColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Assume Canvas is always 1200x700 for now
function randomStart(){
    var side = Math.floor(Math.random()*3 + 1);
    switch(side){
        case 1: // Top
            return {posX:600,posY:700,axis:'y',dir:-1};
        case 2: // Right
            return {posX:1200,posY:350,axis:'x',dir:-1};
        case 3: // Bottom
            return {posX:600,posY:0,axis:'y',dir:1};
        case 4: // Left
            return {posX:0,posY:350,axis:'x',dir:1};
    }
}

module.exports = router;
